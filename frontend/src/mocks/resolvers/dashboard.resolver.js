import { db } from "@/mocks/db";
import { dailyMetrics, dayAt } from "@/mocks/metrics";
import { DATE_RANGES, PLATFORMS, platformLabel } from "@/constants/domain";
import { deriveHealth } from "@/mocks/resolvers/clients.resolver";
import { formatCurrency, formatNumber, percentChange } from "@/lib/format";

/** Mock implementation of DashboardController. */

const BROKEN = ["expired", "permission_error"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const zero = () => ({ spend: 0, clicks: 0, conversions: 0, revenue: 0 });
const add = (acc, m) => {
  acc.spend += m.spend;
  acc.clicks += m.clicks;
  acc.conversions += m.conversions;
  acc.revenue += m.revenue;
  return acc;
};
const withRoas = (t) => ({ ...t, roas: t.spend ? t.revenue / t.spend : 0 });
const rangeDays = (range) => DATE_RANGES.find((r) => r.id === range)?.days ?? 7;
const scopeClients = (clientId) => (clientId === "all" ? db.clients : db.clients.filter((c) => c.id === clientId));

/** Connected accounts inside the filter scope + the ones that are missing data. */
function resolveAccounts({ clientId, platform }) {
  const accounts = [];
  const missing = [];
  scopeClients(clientId).forEach((client) =>
    client.connections
      .filter((cn) => platform === "all" || cn.provider === platform)
      .forEach((cn) => {
        if (cn.status === "connected") accounts.push({ client, provider: cn.provider, lastSync: cn.lastSuccessfulSyncAt });
        else if (BROKEN.includes(cn.status)) missing.push({ clientName: client.name, provider: platformLabel(cn.provider), status: cn.status });
      }),
  );
  return { accounts, missing };
}

const sumDay = (accounts, offset, predicate = () => true) =>
  accounts.filter(predicate).reduce((acc, a) => add(acc, dailyMetrics(a.client.id, a.client.scale, a.provider, dayAt(offset))), zero());

const sumPeriod = (accounts, fromOffset, days, predicate) => {
  const total = zero();
  for (let i = fromOffset; i < fromOffset + days; i += 1) add(total, sumDay(accounts, i, predicate));
  return withRoas(total);
};

export function getOverview({ clientId = "all", platform = "all", range = "7d" } = {}) {
  const days = rangeDays(range);
  const { accounts, missing } = resolveAccounts({ clientId, platform });

  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const cur = withRoas(sumDay(accounts, i));
    const prev = withRoas(sumDay(accounts, i + days));
    series.push({
      date: dayAt(i).toISOString(), spend: cur.spend, clicks: cur.clicks, conversions: cur.conversions, roas: cur.roas,
      prevSpend: prev.spend, prevClicks: prev.clicks, prevConversions: prev.conversions, prevRoas: prev.roas,
    });
  }

  const totals = sumPeriod(accounts, 0, days);
  const prevTotals = sumPeriod(accounts, days, days);

  const channels = PLATFORMS.map((p) => {
    const cur = sumPeriod(accounts, 0, days, (a) => a.provider === p.id);
    const prev = sumPeriod(accounts, days, days, (a) => a.provider === p.id);
    return { id: p.id, label: p.label, ...cur, conversionsDelta: percentChange(cur.conversions, prev.conversions), connected: accounts.some((a) => a.provider === p.id) };
  }).filter((c) => platform === "all" || c.id === platform);

  // Weekday distribution (Mon → Sun) for the dot-matrix widgets
  const weekday = WEEKDAYS.map((label) => ({ label, clicks: 0, conversions: 0 }));
  for (let i = 0; i < days; i += 1) {
    const idx = (dayAt(i).getDay() + 6) % 7;
    const m = sumDay(accounts, i);
    weekday[idx].clicks += m.clicks;
    weekday[idx].conversions += m.conversions;
  }

  const byClient = scopeClients(clientId).map((c) => {
    const pred = (a) => a.client.id === c.id;
    return { id: c.id, name: c.name, conversions: sumPeriod(accounts, 0, days, pred).conversions, prevConversions: sumPeriod(accounts, days, days, pred).conversions };
  });

  return {
    range: { start: dayAt(days - 1).toISOString(), end: dayAt(0).toISOString(), prevStart: dayAt(2 * days - 1).toISOString(), prevEnd: dayAt(days).toISOString() },
    series, totals, prevTotals, channels, weekday, missing,
    insight: buildInsight(totals, prevTotals, byClient, channels),
    accountCount: accounts.length,
    lastSyncAt: accounts.map((a) => a.lastSync).sort().pop() ?? null,
  };
}

function buildInsight(totals, prevTotals, byClient, channels) {
  const delta = percentChange(totals.conversions, prevTotals.conversions) ?? 0;
  const growth = byClient.map((c) => ({ ...c, diff: c.conversions - c.prevConversions })).sort((a, b) => b.diff - a.diff);
  const lead = growth[0];
  const bestChannel = [...channels].filter((c) => c.spend > 0).sort((a, b) => b.roas - a.roas)[0];
  const share = totals.conversions ? (lead?.conversions ?? 0) / totals.conversions : 0;
  return {
    value: Math.abs(delta),
    direction: delta >= 0 ? "up" : "down",
    title: `Conversions ${delta >= 0 ? "increased" : "decreased"} by ${Math.abs(delta).toFixed(Math.abs(delta) < 10 ? 1 : 0)}% compared to the previous period`,
    detail: lead
      ? `${lead.name} drove the biggest change (${lead.diff >= 0 ? "+" : ""}${formatNumber(lead.diff)} conversions)${bestChannel ? `, and ${bestChannel.label} returned the best ROAS at ${bestChannel.roas.toFixed(2)}x` : ""}.`
      : "Connect an account to start generating insights.",
    share,
  };
}

export function getPulse({ clientId = "all", range = "7d" } = {}) {
  const days = rangeDays(range);
  const start = dayAt(days - 1).toISOString();
  const prevStart = dayAt(2 * days - 1).toISOString();
  const clients = scopeClients(clientId);
  const ids = new Set(clients.map((c) => c.id));
  const reports = db.reports.filter((r) => ids.has(r.clientId));

  const sent = reports.filter((r) => r.status === "sent" && r.sentAt >= start).length;
  const prevSent = reports.filter((r) => r.status === "sent" && r.sentAt >= prevStart && r.sentAt < start).length;
  const awaiting = reports.filter((r) => r.status === "needs_review").length;
  const failed = reports.filter((r) => r.status === "failed").length;
  const scheduled = reports.filter((r) => r.status === "scheduled").length;
  const issues = clients.flatMap((c) => c.connections).filter((cn) => BROKEN.includes(cn.status)).length;
  const base = Math.max(reports.length, 1);

  return {
    sent,
    sentDelta: percentChange(sent, prevSent),
    rows: [
      { id: "review", label: "Awaiting review", value: awaiting, context: `${awaiting} drafts ready to approve`, tone: "warning", share: awaiting / base, href: "/reports?status=needs_review" },
      { id: "sent", label: "Reports sent", value: sent, context: failed ? `${failed} failed to deliver` : "All delivered", tone: "success", share: sent / base, href: "/reports?status=sent" },
      { id: "issues", label: "Connector issues", value: issues, context: issues ? "Reconnect to resume syncing" : "All accounts healthy", tone: issues ? "danger" : "success", share: issues / Math.max(clients.flatMap((c) => c.connections).length, 1), href: "/settings?section=connections" },
      { id: "scheduled", label: "Scheduled reports", value: scheduled, context: "Upcoming automations", tone: "accent", share: scheduled / base, href: "/reports?status=scheduled" },
    ],
  };
}

/** Prioritised action list (design.md §5.6). */
export function getAttention() {
  const items = [];
  db.clients.forEach((client) =>
    client.connections.filter((cn) => BROKEN.includes(cn.status)).forEach((cn) =>
      items.push({
        id: `conn-${cn.id}`, priority: 0, clientId: client.id, clientName: client.name, label: "Urgent", tone: "danger",
        issue: `${platformLabel(cn.provider)} ${cn.status === "expired" ? "connection expired" : "permission revoked"}`,
        timestampLabel: "Last synced", timestamp: cn.lastSuccessfulSyncAt, action: "Reconnect", href: "/settings?section=connections",
      }),
    ),
  );
  db.reports.filter((r) => r.status === "failed").forEach((r) => {
    const client = db.clients.find((c) => c.id === r.clientId);
    items.push({ id: `rpt-${r.id}`, priority: 1, clientId: client?.id, clientName: client?.name, label: "Failed", tone: "danger", issue: r.failureReason ?? "Report run failed", timestampLabel: "Generated", timestamp: r.generatedAt, action: "Retry", href: "/reports?status=failed" });
  });
  db.reports.filter((r) => r.status === "needs_review").forEach((r) => {
    const client = db.clients.find((c) => c.id === r.clientId);
    items.push({ id: `rev-${r.id}`, priority: 2, clientId: client?.id, clientName: client?.name, label: "Review", tone: "warning", issue: `${r.type} report awaiting approval`, timestampLabel: "Generated", timestamp: r.generatedAt, action: "Review", href: "/reports?status=needs_review" });
  });
  db.clients.filter((c) => deriveHealth(c).status === "setup_incomplete").forEach((c) =>
    items.push({ id: `setup-${c.id}`, priority: 3, clientId: c.id, clientName: c.name, label: "Setup", tone: "neutral", issue: `${c.setupTasksPending} onboarding tasks pending`, timestampLabel: "Added", timestamp: c.createdAt, action: "Finish setup", href: `/clients/${c.id}` }),
  );
  return items.sort((a, b) => a.priority - b.priority);
}

/** Canned "explore" assistant — answers are computed from the real filtered data. */
export function explore({ question = "", filters }) {
  const o = getOverview(filters);
  const q = question.toLowerCase();
  if (!o.accountCount) return { answer: "There's no connected data in this scope yet. Connect an account under Settings → Connections to explore performance." };

  if (/(drop|declin|down|fell|lower)/.test(q)) {
    let worst = null;
    o.series.forEach((d, i) => {
      if (i === 0) return;
      const diff = d.conversions - o.series[i - 1].conversions;
      if (!worst || diff < worst.diff) worst = { diff, date: d.date, spend: d.spend, prevSpend: o.series[i - 1].spend };
    });
    const day = new Date(worst.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    return { answer: `The sharpest drop happened on ${day}: conversions fell by ${formatNumber(Math.abs(worst.diff))} day-over-day while spend moved from ${formatCurrency(worst.prevSpend)} to ${formatCurrency(worst.spend)}. This pattern follows the weekend traffic dip rather than a delivery issue.${o.missing.length ? ` Note: ${o.missing.length} account(s) are disconnected, so part of the decline may be missing data.` : ""}` };
  }
  if (/(spend|cost|budget)/.test(q)) {
    const top = [...o.channels].sort((a, b) => b.spend - a.spend)[0];
    return { answer: `Total spend is ${formatCurrency(o.totals.spend)} (${(percentChange(o.totals.spend, o.prevTotals.spend) ?? 0).toFixed(1)}% vs previous period). ${top.label} accounts for ${((top.spend / (o.totals.spend || 1)) * 100).toFixed(0)}% of it.` };
  }
  if (/(roas|return|revenue)/.test(q)) {
    const best = [...o.channels].filter((c) => c.spend).sort((a, b) => b.roas - a.roas)[0];
    return { answer: `Blended ROAS is ${o.totals.roas.toFixed(2)}x on ${formatCurrency(o.totals.revenue)} revenue. ${best ? `${best.label} leads at ${best.roas.toFixed(2)}x.` : ""}` };
  }
  return { answer: `In this period your clients generated ${formatNumber(o.totals.conversions)} conversions from ${formatNumber(o.totals.clicks)} clicks on ${formatCurrency(o.totals.spend)} spend. ${o.insight.detail}` };
}
