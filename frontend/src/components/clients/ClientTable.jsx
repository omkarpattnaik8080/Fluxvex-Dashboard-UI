import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientAvatar } from "@/components/common/ClientAvatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { OverflowMenu } from "@/components/common/WidgetCard";
import { EmptyState, ErrorState } from "@/components/common/States";
import { ConfirmDialog } from "@/components/common/FormControls";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { clientsService } from "@/services/clients.service";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";

const COLUMNS = ["Client", "Website", "Recipients", "Connected accounts", "Health status", "Next report", "Last report", ""];

/** Client list. Row click opens detail; the action menu never triggers navigation (design.md §6.3). */
export const ClientTable = ({ query, filtered, onAddClient }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const remove = useWorkspaceMutation(clientsService.remove, { invalidate: ["clients", "dashboard", "reports"], success: "Client deleted" });

  if (query.isLoading) return <TableSkeleton />;
  if (query.isError) return <ErrorState message="Clients couldn't load." onRetry={query.refetch} />;
  const rows = query.data;
  if (!rows.length) {
    return filtered
      ? <EmptyState icon={SearchX} title="No clients match your filters" description="Try a different search term or clear the status filter." testId="clients-filtered-empty" />
      : <EmptyState icon={Users} title="Add your first client" description="Clients hold recipients, connected ad accounts and report schedules." action={<Button onClick={onAddClient}>Add client</Button>} testId="clients-empty" />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-sm" data-testid="clients-table">
          <thead>
            <tr className="border-b border-[var(--app-border)] text-left text-xs font-medium fx-muted">
              {COLUMNS.map((c) => <th key={c} className="px-4 py-3 font-medium first:pl-6">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} tabIndex={0} onClick={() => navigate(ROUTES.clientDetail(c.id))} onKeyDown={(e) => e.key === "Enter" && navigate(ROUTES.clientDetail(c.id))}
                data-testid={`client-row-${c.id}`} className="h-[68px] cursor-pointer border-b border-[var(--app-border)] transition-colors last:border-0 hover:bg-[var(--app-canvas)]">
                <td className="px-4 pl-6">
                  <div className="flex items-center gap-3">
                    <ClientAvatar name={c.name} />
                    <div className="min-w-0 max-w-[220px]">
                      <p className="truncate font-medium" title={c.name}>{c.name}</p>
                      <p className="truncate text-xs fx-subtle" title={c.email}>{c.email || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4">
                  {c.website ? (
                    <a href={`https://${c.website}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex max-w-[180px] items-center gap-1 text-[13px] fx-muted hover:text-[var(--app-accent)]">
                      <span className="truncate">{c.website}</span><ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : "—"}
                </td>
                <td className="fx-num px-4">{c.recipients.length}</td>
                <td className="px-4">
                  <div className="flex flex-wrap gap-1">{c.connections.length ? c.connections.map((cn) => <ProviderBadge key={cn.id} provider={cn.provider} compact />) : <span className="text-xs fx-subtle">None</span>}</div>
                </td>
                <td className="px-4">
                  <StatusBadge status={c.healthStatus} testId={`client-health-${c.id}`} />
                  <p className="mt-1 text-xs fx-subtle">{c.healthReason}</p>
                </td>
                <td className="fx-num px-4 text-[13px]">{formatDate(c.nextReportAt)}</td>
                <td className="px-4 text-[13px]">
                  {c.lastReport ? <><span className="fx-num">{formatDate(c.lastReport.generatedAt)}</span><StatusBadge status={c.lastReport.status} className="ml-2" testId={`client-last-report-${c.id}`} /></> : "—"}
                </td>
                <td className="px-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <OverflowMenu testId={`client-actions-${c.id}`} label={`Actions for ${c.name}`} items={[
                    { label: "View details", onSelect: () => navigate(ROUTES.clientDetail(c.id)) },
                    { label: "Edit client", onSelect: () => setEditing(c) },
                    { label: "Delete client", destructive: true, onSelect: () => setDeleting(c) },
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClientFormDialog open={!!editing} client={editing} onOpenChange={(o) => !o && setEditing(null)} />
      <ConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} destructive confirmLabel="Delete client"
        title={`Delete ${deleting?.name}?`} description="This removes the client, their schedules and all generated reports. This can't be undone."
        onConfirm={() => remove.mutate(deleting.id)} />
    </>
  );
};

const TableSkeleton = () => (
  <div className="space-y-3 p-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full bg-[var(--app-inset)]" />)}</div>
);
