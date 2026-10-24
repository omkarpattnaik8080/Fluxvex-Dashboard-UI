import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, FileText, Search, Upload, UserPlus, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PageHeader, SampleDataBadge, SummaryCard } from "@/components/common/PageHeader";
import { ClientTable } from "@/components/clients/ClientTable";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { CsvImportDrawer } from "@/components/clients/CsvImportDrawer";
import { useClientSummary, useClients } from "@/hooks/queries/useWorkspaceData";
import { COUNTRIES } from "@/constants/domain";

const STATUS_OPTIONS = [
  { id: "all", label: "All statuses" },
  { id: "healthy", label: "Healthy" },
  { id: "setup_incomplete", label: "Setup incomplete" },
  { id: "reconnect_required", label: "Reconnect required" },
];

/** Clients page — summary, URL-driven toolbar & table (design.md §6). */
export default function ClientsPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const country = params.get("country") ?? "all";
  const [dialog, setDialog] = useState(null);
  const summary = useClientSummary().data;
  const query = useClients({ search, status, country });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const cards = [
    { id: "total", label: "Total clients", value: summary?.total, icon: Users, tone: "var(--app-accent)", filter: "all" },
    { id: "healthy", label: "Healthy clients", value: summary?.healthy, icon: CheckCircle2, tone: "var(--app-success)", filter: "healthy" },
    { id: "setup", label: "Setup incomplete", value: summary?.setupIncomplete, icon: Wrench, tone: "var(--app-warning)", filter: "setup_incomplete" },
    { id: "issues", label: "Connection issues", value: summary?.connectionIssues, icon: AlertTriangle, tone: "var(--app-danger)", filter: "reconnect_required" },
    { id: "reports", label: "Total reports", value: summary?.totalReports, icon: FileText, tone: "var(--app-muted)" },
  ];

  return (
    <div data-testid="clients-page">
      <PageHeader title="Clients" badge={<SampleDataBadge />} description="Manage and monitor all your clients in one place."
        actions={<>
          <Button variant="outline" className="h-10 rounded-[10px] bg-white" onClick={() => setDialog("import")} data-testid="import-csv-button"><Upload className="mr-2 h-4 w-4" />Import CSV</Button>
          <Button className="h-10 rounded-[10px]" onClick={() => setDialog("add")} data-testid="add-client-button"><UserPlus className="mr-2 h-4 w-4" />Add client</Button>
        </>} />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c, i) => (
          <SummaryCard key={c.id} delay={i * 60} testId={`client-summary-${c.id}`} label={c.label} value={c.value ?? "—"} icon={c.icon} tone={c.tone}
            active={c.filter && c.filter !== "all" && status === c.filter} onClick={c.filter ? () => setParam("status", c.filter) : undefined} />
        ))}
      </div>

      <section className="fx-card fx-rise overflow-hidden" style={{ "--fx-delay": "300ms" }}>
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--app-border)] p-4">
          <div className="relative min-w-[220px] flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fx-subtle" />
            <Input value={search} onChange={(e) => setParam("q", e.target.value)} placeholder="Search name, email or website" aria-label="Search clients" className="h-10 rounded-[10px] pl-9" data-testid="clients-search-input" />
          </div>
          <Select value={status} onValueChange={(v) => setParam("status", v)}>
            <SelectTrigger className="h-10 w-[200px] rounded-[10px]" data-testid="clients-status-filter" aria-label="Health status"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-xl">{STATUS_OPTIONS.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline" className="h-10 rounded-[10px]" data-testid="clients-more-filters">Filters{country !== "all" && " · 1"}</Button></PopoverTrigger>
            <PopoverContent align="start" className="w-64 space-y-2 rounded-xl">
              <p className="text-xs font-medium fx-muted">Country</p>
              <Select value={country} onValueChange={(v) => setParam("country", v)}>
                <SelectTrigger className="h-9 rounded-[10px]" data-testid="clients-country-filter"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl"><SelectItem value="all">All countries</SelectItem>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
          {(search || status !== "all" || country !== "all") && (
            <Button variant="ghost" className="h-10 rounded-[10px]" onClick={() => setParams({}, { replace: true })} data-testid="clients-clear-filters">Clear all</Button>
          )}
          <span className="ml-auto text-xs fx-subtle" data-testid="clients-result-count">{query.data?.length ?? 0} clients</span>
        </div>
        <ClientTable query={query} filtered={!!(search || status !== "all" || country !== "all")} onAddClient={() => setDialog("add")} />
      </section>

      <ClientFormDialog open={dialog === "add"} onOpenChange={(o) => !o && setDialog(null)} />
      <CsvImportDrawer open={dialog === "import"} onOpenChange={(o) => !o && setDialog(null)} />
    </div>
  );
}
