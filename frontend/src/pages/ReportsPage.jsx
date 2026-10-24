import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, FileText, Plus, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, SampleDataBadge, SummaryCard } from "@/components/common/PageHeader";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportReviewDialog } from "@/components/reports/ReportReviewDialog";
import { ReportCreateWizard } from "@/components/reports/ReportCreateWizard";
import { useClients, useReportSummary, useReports } from "@/hooks/queries/useWorkspaceData";
import { REPORT_TABS } from "@/constants/domain";
import { cn } from "@/lib/utils";

/** Reports page — summary, status tabs, toolbar and table (design.md §7). URL holds filter state. */
export default function ReportsPage() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "all";
  const search = params.get("q") ?? "";
  const clientId = params.get("client") ?? "all";
  const type = params.get("type") ?? "all";
  const [openReport, setOpenReport] = useState(null);
  const [creating, setCreating] = useState(false);
  const summary = useReportSummary().data;
  const { data: clients = [] } = useClients();
  const query = useReports({ status, search, clientId, type });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const cards = [
    { id: "needs_review", label: "Needs review", icon: Eye, tone: "var(--app-warning)" },
    { id: "approved", label: "Approved", icon: CheckCircle2, tone: "var(--app-info)" },
    { id: "sent", label: "Sent", icon: Send, tone: "var(--app-success)" },
    { id: "failed", label: "Failed", icon: AlertCircle, tone: "var(--app-danger)" },
    { id: "all", label: "Total reports", icon: FileText, tone: "var(--app-muted)", valueKey: "total" },
  ];
  const filtered = status !== "all" || search || clientId !== "all" || type !== "all";

  return (
    <div data-testid="reports-page">
      <PageHeader title="Reports" badge={<SampleDataBadge />} description="Review, approve and send reports to your clients."
        actions={<Button className="h-10 rounded-[10px]" onClick={() => setCreating(true)} data-testid="create-report-button"><Plus className="mr-2 h-4 w-4" />Create report</Button>} />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c, i) => (
          <SummaryCard key={c.id} delay={i * 60} testId={`report-summary-${c.id}`} label={c.label} icon={c.icon} tone={c.tone}
            value={summary ? summary[c.valueKey ?? c.id] : "—"} hint={c.id === "all" && summary ? `${summary.scheduled} scheduled` : undefined}
            active={status === c.id && c.id !== "all"} onClick={() => setParam("status", c.id)} />
        ))}
      </div>

      <section className="fx-card fx-rise overflow-hidden" style={{ "--fx-delay": "300ms" }}>
        <div role="tablist" aria-label="Report status" className="flex gap-1 overflow-x-auto border-b border-[var(--app-border)] px-4 pt-3">
          {REPORT_TABS.map((t) => {
            const count = summary ? (t.id === "all" ? summary.total : summary[t.id]) : null;
            const active = status === t.id;
            return (
              <button key={t.id} role="tab" aria-selected={active} onClick={() => setParam("status", t.id)} data-testid={`reports-tab-${t.id}`}
                className={cn("-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 pt-1 text-[13px] font-medium transition-colors",
                  active ? "border-[var(--app-accent)] text-[var(--app-accent)]" : "border-transparent fx-muted hover:text-[var(--app-ink)]")}>
                {t.label}
                {count !== null && <span className={cn("fx-num rounded-md px-1.5 text-[11px]", active ? "bg-[var(--app-accent-wash)]" : "bg-[var(--app-inset)]")}>{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--app-border)] p-4">
          <div className="relative min-w-[220px] flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fx-subtle" />
            <Input value={search} onChange={(e) => setParam("q", e.target.value)} placeholder="Search report, client or ID" aria-label="Search reports" className="h-10 rounded-[10px] pl-9" data-testid="reports-search-input" />
          </div>
          <Select value={clientId} onValueChange={(v) => setParam("client", v)}>
            <SelectTrigger className="h-10 w-[190px] rounded-[10px]" aria-label="Client" data-testid="reports-client-filter"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-xl"><SelectItem value="all">All clients</SelectItem>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={type} onValueChange={(v) => setParam("type", v)}>
            <SelectTrigger className="h-10 w-[150px] rounded-[10px]" aria-label="Report type" data-testid="reports-type-filter"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-xl"><SelectItem value="all">All types</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent>
          </Select>
          {filtered && <Button variant="ghost" className="h-10 rounded-[10px]" onClick={() => setParams({}, { replace: true })} data-testid="reports-clear-filters">Clear all</Button>}
          <span className="ml-auto text-xs fx-subtle" data-testid="reports-result-count">{query.data?.length ?? 0} reports</span>
        </div>

        <ReportTable query={query} filtered={filtered} onOpen={setOpenReport} onCreate={() => setCreating(true)} />
      </section>

      <ReportReviewDialog report={openReport} onOpenChange={(o) => !o && setOpenReport(null)} />
      <ReportCreateWizard open={creating} onOpenChange={setCreating} />
    </div>
  );
}
