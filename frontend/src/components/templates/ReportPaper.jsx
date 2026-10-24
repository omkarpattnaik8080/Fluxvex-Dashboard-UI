import { forwardRef } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { CHART_COLORS } from "@/lib/tones";

/** Static sample content for the template preview — clearly labelled as sample data. */
const TREND = ["W1", "W2", "W3", "W4", "W5", "W6"].map((w, i) => ({ w, v: [42, 55, 48, 66, 61, 74][i] }));
const KPIS = [["Spend", "$12,480"], ["Clicks", "18.2k"], ["Conversions", "642"], ["ROAS", "3.4x"]];
const CAMPAIGNS = [["Brand — Search", "$3,210", "214"], ["Prospecting — Meta", "$2,880", "131"], ["Retargeting — Meta", "$1,940", "118"], ["Generic — Search", "$1,620", "76"]];

export const TEMPLATE_SECTIONS = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "overview-metrics", label: "Overview Metrics" },
  { id: "performance-trends", label: "Performance Trends" },
  { id: "channel-breakdown", label: "Channel Breakdown" },
  { id: "top-campaigns", label: "Top Campaigns" },
  { id: "key-insights", label: "Key Insights & Recommendations" },
  { id: "appendix", label: "Appendix" },
];

const Section = forwardRef(({ id, title, children }, ref) => (
  <section ref={ref} id={`preview-${id}`} data-section={id} className="scroll-mt-6 border-t border-[var(--app-border)] pt-6 first:border-0 first:pt-0">
    <h3 className="mb-3 text-[15px] font-semibold">{title}</h3>
    {children}
  </section>
));
Section.displayName = "Section";

/** Paper-like report preview (centre panel). */
export const ReportPaper = ({ sectionRefs }) => {
  const body = {
    "executive-summary": <p className="text-[13px] leading-relaxed fx-muted">Performance improved steadily across the period. Paid search remained the most efficient channel while Meta prospecting expanded reach at a lower cost per click.</p>,
    "overview-metrics": <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{KPIS.map(([k, v]) => <div key={k} className="rounded-lg bg-[var(--paper)] p-3"><p className="text-xs fx-muted">{k}</p><p className="fx-num mt-1 text-lg font-semibold">{v}</p></div>)}</div>,
    "performance-trends": (
      <div className="h-40 rounded-lg bg-[var(--paper)] p-2">
        <ResponsiveContainer><BarChart data={TREND}><XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: CHART_COLORS.axis }} /><Bar dataKey="v" fill={CHART_COLORS.spend} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
      </div>
    ),
    "channel-breakdown": <div className="space-y-2">{[["Google Ads", 54, "#2F6FEB"], ["Meta Ads", 31, "#7B7FFF"], ["GA4 (organic)", 15, "#C77812"]].map(([l, v, c]) => <div key={l} className="text-[13px]"><div className="flex justify-between"><span>{l}</span><span className="fx-num">{v}%</span></div><div className="mt-1 h-2 rounded-full bg-[var(--paper)]"><div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} /></div></div>)}</div>,
    "top-campaigns": <table className="w-full text-[13px]"><thead><tr className="text-left text-xs fx-muted"><th className="pb-2 font-medium">Campaign</th><th className="pb-2 text-right font-medium">Spend</th><th className="pb-2 text-right font-medium">Conv.</th></tr></thead><tbody className="fx-num">{CAMPAIGNS.map(([n, s, c]) => <tr key={n} className="border-t border-[var(--app-border)]"><td className="py-2">{n}</td><td className="py-2 text-right">{s}</td><td className="py-2 text-right">{c}</td></tr>)}</tbody></table>,
    "key-insights": <ul className="list-disc space-y-1.5 pl-5 text-[13px] fx-muted"><li>Shift 10% of generic search budget to brand terms with 2× ROAS.</li><li>Refresh Meta creatives older than 21 days to reduce fatigue.</li><li>Add call tracking to capture offline conversions.</li></ul>,
    appendix: <p className="text-xs fx-subtle">Data sources: Google Ads, Meta Ads, GA4. Currency USD. Attribution: data-driven (30-day click).</p>,
  };

  return (
    <article className="mx-auto max-w-[760px] space-y-6 rounded-xl bg-white p-8 shadow-[0_12px_36px_rgba(16,16,20,0.06)]" data-testid="template-paper">
      <header className="flex items-start justify-between gap-4 border-b-2 border-[var(--app-accent)] pb-4">
        <div><p className="text-xs fx-subtle">Northwind Digital · prepared for</p><p className="text-xl font-semibold">Sample Client Co.</p></div>
        <p className="fx-num text-right text-xs fx-muted">01 May – 31 May<br />Monthly report</p>
      </header>
      {TEMPLATE_SECTIONS.map((s) => (
        <Section key={s.id} id={s.id} title={s.label} ref={(el) => (sectionRefs.current[s.id] = el)}>{body[s.id]}</Section>
      ))}
    </article>
  );
};
