import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/States";
import { useReports } from "@/hooks/queries/useWorkspaceData";
import { formatDate } from "@/lib/format";

/** Latest generated reports with status and a link to review/view. */
export const RecentReports = ({ clientId }) => {
  const { data = [] } = useReports({ clientId });
  const recent = data.filter((r) => r.generatedAt).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt)).slice(0, 5);

  return (
    <WidgetCard testId="recent-reports" title="Recent Reports" subtitle="Latest generated" actions={<Link to="/reports" className="text-[13px] font-medium text-[var(--app-accent)]" data-testid="recent-reports-view-all">View all</Link>}>
      {recent.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" description="Generated reports will appear here." />
      ) : (
        <ul className="-mx-2">
          {recent.map((r) => (
            <li key={r.id}>
              <Link to={`/reports?q=${r.id}`} data-testid={`recent-report-${r.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--app-inset)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--app-inset)]"><FileText className="h-4 w-4 fx-muted" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{r.title}</span>
                  <span className="block text-xs fx-subtle">{r.id} · {formatDate(r.generatedAt)}</span>
                </span>
                <StatusBadge status={r.status} testId={`recent-report-status-${r.id}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
};
