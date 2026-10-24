import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { ConfirmDialog } from "@/components/common/FormControls";
import { SkeletonCard } from "@/components/common/States";
import { SettingsPanel } from "@/components/settings/SettingsLayout";
import { useConnections } from "@/hooks/queries/useSystemData";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { settingsService } from "@/services/workspace.service";
import { formatRelative } from "@/lib/format";

const GROUPS = [
  { id: "google", label: "Google", providers: ["google_ads", "ga4"], letter: "G", color: "var(--app-info)" },
  { id: "meta", label: "Meta", providers: ["meta_ads"], letter: "M", color: "var(--app-accent-soft)" },
];
const INVALIDATE = ["connections", "clients", "dashboard", "reports"];

/** Connections grouped by provider with Sync / Reconnect / Disconnect (design.md §9.7). */
export const ConnectionsSection = () => {
  const { data, isLoading } = useConnections();
  const [disconnecting, setDisconnecting] = useState(null);
  const [busy, setBusy] = useState(null);
  const done = () => setBusy(null);
  const sync = useWorkspaceMutation(settingsService.sync, { invalidate: INVALIDATE, success: "Sync complete", onSuccess: done });
  const reconnect = useWorkspaceMutation(settingsService.reconnect, { invalidate: INVALIDATE, success: "Account reconnected", onSuccess: done });
  const disconnect = useWorkspaceMutation(settingsService.disconnect, { invalidate: INVALIDATE, success: "Account disconnected" });
  const run = (mut, id) => { setBusy(id); mut.mutate(id, { onError: done }); };

  if (isLoading) return <SkeletonCard lines={6} />;
  const linked = data.filter((c) => c.status !== "not_connected");

  return (
    <div className="space-y-5" data-testid="settings-connections">
      {GROUPS.map((g) => {
        const rows = linked.filter((c) => g.providers.includes(c.provider));
        const broken = rows.filter((c) => c.status !== "connected").length;
        return (
          <SettingsPanel key={g.id} title={<span className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: g.color }}>{g.letter}</span>{g.label}</span>}
            description={`${rows.length} accounts · ${broken ? `${broken} need attention` : "all healthy"}`}>
            <ul className="divide-y divide-[var(--app-border)]">
              {rows.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 py-3" data-testid={`connection-row-${c.id}`}>
                  <ProviderBadge provider={c.provider} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.accountName} <span className="font-normal fx-subtle">· {c.clientName}</span></p>
                    <p className="text-xs fx-subtle">Last successful sync {formatRelative(c.lastSuccessfulSyncAt)} · last attempt {formatRelative(c.lastAttemptedSyncAt)}</p>
                  </div>
                  <StatusBadge status={c.status} testId={`connection-status-${c.id}`} />
                  <div className="flex gap-1">
                    {c.status === "connected" ? (
                      <Button size="sm" variant="outline" className="h-8 rounded-lg" disabled={busy === c.id} onClick={() => run(sync, c.id)} data-testid={`connection-sync-${c.id}`}>
                        {busy === c.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}Sync
                      </Button>
                    ) : (
                      <Button size="sm" className="h-8 rounded-lg" disabled={busy === c.id} onClick={() => run(reconnect, c.id)} data-testid={`connection-reconnect-${c.id}`}>
                        {busy === c.id && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Reconnect
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[var(--app-danger)] hover:text-[var(--app-danger)]" onClick={() => setDisconnecting(c)} data-testid={`connection-disconnect-${c.id}`}>Disconnect</Button>
                  </div>
                </li>
              ))}
              {rows.length === 0 && <li className="py-3 text-[13px] fx-muted">No {g.label} accounts connected.</li>}
            </ul>
          </SettingsPanel>
        );
      })}
      <ConfirmDialog open={!!disconnecting} onOpenChange={(o) => !o && setDisconnecting(null)} destructive confirmLabel="Disconnect"
        title={`Disconnect ${disconnecting?.accountName}?`}
        description={`Data refreshes stop for ${disconnecting?.clientName}, and scheduled reports using this account will be generated without it.`}
        onConfirm={() => disconnect.mutate(disconnecting.id)} />
    </div>
  );
};
