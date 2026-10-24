import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { ClientAvatar } from "@/components/common/ClientAvatar";
import { SkeletonCard, ErrorState } from "@/components/common/States";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { useClient } from "@/hooks/queries/useWorkspaceData";
import { formatDate, formatDateRange, formatRelative } from "@/lib/format";

/** Client detail — profile, setup checklist, connections and reports. */
export default function ClientDetailPage() {
  const { clientId } = useParams();
  const { data: client, isLoading, isError, refetch } = useClient(clientId);
  const [editing, setEditing] = useState(false);

  if (isLoading) return <SkeletonCard lines={8} />;
  if (isError) return <div className="fx-card"><ErrorState message="This client couldn't be found." onRetry={refetch} /></div>;

  return (
    <div data-testid="client-detail-page">
      <Link to="/clients" className="mb-4 inline-flex items-center gap-1.5 text-[13px] fx-muted hover:text-[var(--app-ink)]" data-testid="client-detail-back"><ArrowLeft className="h-4 w-4" />All clients</Link>
      <PageHeader title={client.name} badge={<StatusBadge status={client.healthStatus} testId="client-detail-health" />} description={client.healthReason}
        actions={<Button variant="outline" className="h-10 rounded-[10px] bg-white" onClick={() => setEditing(true)} data-testid="client-detail-edit"><Pencil className="mr-2 h-4 w-4" />Edit client</Button>} />

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="fx-card space-y-4 p-6 lg:col-span-4">
          <div className="flex items-center gap-3"><ClientAvatar name={client.name} size={44} /><div><p className="font-semibold">{client.name}</p><p className="text-[13px] fx-muted">{client.email || "No primary email"}</p></div></div>
          <Detail label="Website">{client.website ? <a className="inline-flex items-center gap-1 text-[var(--app-accent)]" href={`https://${client.website}`} target="_blank" rel="noreferrer">{client.website}<ExternalLink className="h-3 w-3" /></a> : "—"}</Detail>
          <Detail label="Timezone">{client.timezone}</Detail>
          <Detail label="Country">{client.country || "—"}</Detail>
          <Detail label="Recipients">{client.recipients.length ? client.recipients.join(", ") : "None — add recipients before sending"}</Detail>
          <Detail label="Next report">{formatDate(client.nextReportAt)}</Detail>
          {client.notes && <Detail label="Notes">{client.notes}</Detail>}
        </section>

        <div className="space-y-5 lg:col-span-8">
          <section className="fx-card p-6">
            <h2 className="mb-4 text-[17px] font-semibold">Connected accounts</h2>
            {client.connections.length === 0 ? <p className="text-[13px] fx-muted">No accounts connected yet. <Link className="font-medium text-[var(--app-accent)]" to="/settings?section=connections">Connect an account</Link></p> : (
              <ul className="divide-y divide-[var(--app-border)]">
                {client.connections.map((cn) => (
                  <li key={cn.id} className="flex flex-wrap items-center gap-3 py-3" data-testid={`client-connection-${cn.id}`}>
                    <ProviderBadge provider={cn.provider} />
                    <span className="flex-1 text-[13px]">{cn.accountName}</span>
                    <span className="text-xs fx-subtle">Last successful sync {formatRelative(cn.lastSuccessfulSyncAt)}</span>
                    <StatusBadge status={cn.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="fx-card p-6">
            <h2 className="mb-4 text-[17px] font-semibold">Reports</h2>
            {client.reports.length === 0 ? <p className="text-[13px] fx-muted">No reports generated yet.</p> : (
              <ul className="divide-y divide-[var(--app-border)]">
                {client.reports.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 py-3">
                    <Link to={`/reports?q=${r.id}`} className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{r.title}</p><p className="text-xs fx-subtle">{r.id} · {formatDateRange(r.periodStart, r.periodEnd)}</p></Link>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      <ClientFormDialog open={editing} client={client} onOpenChange={setEditing} />
    </div>
  );
}

const Detail = ({ label, children }) => (
  <div><p className="text-xs fx-subtle">{label}</p><p className="mt-0.5 break-words text-[13px]">{children}</p></div>
);
