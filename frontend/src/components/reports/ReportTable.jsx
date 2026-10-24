import { useNavigate } from "react-router-dom";
import { FileText, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { OverflowMenu } from "@/components/common/WidgetCard";
import { EmptyState, ErrorState } from "@/components/common/States";
import { ROUTES } from "@/constants/routes";
import { formatDate, formatDateRange } from "@/lib/format";

/** Primary row action per status (design.md §7.3). */
const PRIMARY_ACTION = { needs_review: "Review", failed: "Retry", approved: "View", sent: "View", scheduled: "View" };
const COLUMNS = ["Report", "Client", "Type", "Date range", "Status", "Generated", ""];

export const ReportTable = ({ query, filtered, onOpen, onCreate }) => {
  const navigate = useNavigate();
  if (query.isLoading) return <div className="space-y-3 p-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 bg-[var(--app-inset)]" />)}</div>;
  if (query.isError) return <ErrorState message="Reports couldn't load." onRetry={query.refetch} />;
  if (!query.data.length) {
    return filtered
      ? <EmptyState icon={SearchX} title="No reports match these filters" description="Try another tab or clear your search." testId="reports-filtered-empty" />
      : <EmptyState icon={FileText} title="No reports yet" description="Create your first report to start reviewing and sending." action={<Button onClick={onCreate}>Create report</Button>} testId="reports-empty" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-sm" data-testid="reports-table">
        <thead>
          <tr className="border-b border-[var(--app-border)] text-left text-xs fx-muted">
            {COLUMNS.map((c) => <th key={c} className="px-4 py-3 font-medium first:pl-6">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {query.data.map((r) => (
            <tr key={r.id} className="h-[68px] border-b border-[var(--app-border)] transition-colors last:border-0 hover:bg-[var(--app-canvas)]" data-testid={`report-row-${r.id}`}>
              <td className="px-4 pl-6">
                <p className="max-w-[300px] truncate font-medium" title={r.title}>{r.title}</p>
                <p className="fx-num text-xs fx-subtle">{r.id}</p>
              </td>
              <td className="px-4 text-[13px]">{r.clientName}</td>
              <td className="px-4 text-[13px] fx-muted">{r.type}</td>
              <td className="fx-num px-4 text-[13px]">{formatDateRange(r.periodStart, r.periodEnd)}</td>
              <td className="px-4"><StatusBadge status={r.status} testId={`report-status-${r.id}`} /></td>
              <td className="fx-num px-4 text-[13px] fx-muted">{r.generatedAt ? formatDate(r.generatedAt) : `Runs ${formatDate(r.scheduledFor)}`}</td>
              <td className="px-4 pr-6">
                <div className="flex items-center justify-end gap-1">
                  <Button size="sm" variant={r.status === "needs_review" || r.status === "failed" ? "default" : "outline"} className="h-8 rounded-lg" onClick={() => onOpen(r)} data-testid={`report-action-${r.id}`}>
                    {PRIMARY_ACTION[r.status]}
                  </Button>
                  <OverflowMenu testId={`report-menu-${r.id}`} label={`More actions for ${r.id}`} items={[
                    { label: "View details", onSelect: () => onOpen(r) },
                    { label: "Open client", onSelect: () => navigate(ROUTES.clientDetail(r.clientId)) },
                  ]} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
