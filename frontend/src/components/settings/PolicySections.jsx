import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog, FormField, inputCls } from "@/components/common/FormControls";
import { SettingsPanel, ToggleRow } from "@/components/settings/SettingsLayout";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { settingsService } from "@/services/workspace.service";
import { formatDate } from "@/lib/format";

/** Saves one settings section; toggles re-render from the server response, so rejected changes snap back. */
const useSectionSave = (section, success = "Settings saved") =>
  useWorkspaceMutation((patch) => settingsService.update(section, patch), { invalidate: ["settings"], success });

const DESTINATIONS = [
  { id: "email", title: "Email", description: "Send a secure PDF link to client recipients." },
  { id: "googleDrive", title: "Google Drive", description: "Upload a copy to a shared Drive folder." },
  { id: "downloadOnly", title: "Download only", description: "Generate and download without sending." },
];

/** Export Destinations (design.md §9.4). */
export const DestinationsSection = ({ settings }) => {
  const d = settings.destinations;
  const save = useSectionSave("destinations");
  return (
    <SettingsPanel testId="settings-destinations" title="Export Destinations" description="Choose where approved reports are delivered.">
      <div className="divide-y divide-[var(--app-border)]">
        {DESTINATIONS.map((x) => (
          <ToggleRow key={x.id} id={`dest-${x.id}`} title={x.title} description={x.description} checked={d[x.id]} disabled={save.isPending}
            onChange={(v) => save.mutate({ [x.id]: v })} note={x.id === "googleDrive" && !d.googleDriveConnected ? "Google Drive isn't connected yet — connect it under Connections first." : undefined} />
        ))}
      </div>
      <FormField id="dest-default" label="Default destination" hint="Only enabled destinations can be the default." className="mt-4 max-w-xs">
        <Select value={d.defaultDestination} onValueChange={(v) => save.mutate({ defaultDestination: v })}>
          <SelectTrigger id="dest-default" className={inputCls} data-testid="dest-default-select"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl">{DESTINATIONS.map((x) => <SelectItem key={x.id} value={x.id} disabled={!d[x.id]}>{x.title}{!d[x.id] && " (disabled)"}</SelectItem>)}</SelectContent>
        </Select>
      </FormField>
    </SettingsPanel>
  );
};

/** Governance & Policies (design.md §9.5) with explicit precedence. */
export const GovernanceSection = ({ settings }) => {
  const g = settings.governance;
  const save = useSectionSave("governance", "Policy updated");
  const [confirmArchiveOff, setConfirmArchiveOff] = useState(false);
  return (
    <SettingsPanel testId="settings-governance" title="Governance & Policies" description="Control approval and retention across the workspace.">
      <div className="divide-y divide-[var(--app-border)]">
        <ToggleRow id="gov-approval" title="Require approval before sending" description="Reports stay in “Needs review” until an Admin approves them." checked={g.requireApproval} disabled={save.isPending} onChange={(v) => save.mutate({ requireApproval: v })} />
        <ToggleRow id="gov-editors" title="Allow Editors to send reports" description="Editors can deliver approved reports to clients." checked={g.allowEditorsToSend} disabled={save.isPending} onChange={(v) => save.mutate({ allowEditorsToSend: v })}
          note={g.requireApproval && g.allowEditorsToSend ? "Approval is still required first — Editors can't bypass it." : undefined} />
        <ToggleRow id="gov-archive" title="Auto-archive reports after 12 months" description="Older reports move to the archive and are removed from client links." checked={g.autoArchive} disabled={save.isPending}
          onChange={(v) => (v ? save.mutate({ autoArchive: true }) : setConfirmArchiveOff(true))} />
      </div>
      <ConfirmDialog open={confirmArchiveOff} onOpenChange={setConfirmArchiveOff} confirmLabel="Turn off" title="Turn off auto-archiving?"
        description="Reports will be kept indefinitely and remain accessible from client links. You can re-enable this at any time." onConfirm={() => save.mutate({ autoArchive: false })} />
    </SettingsPanel>
  );
};

const ALERTS = [
  { id: "connectionExpired", title: "Connection expired", description: "When a client account needs to be reconnected." },
  { id: "reportFailed", title: "Report failed", description: "When a report can't be generated or delivered." },
  { id: "reportSent", title: "Report sent", description: "Each time a report is delivered to a client." },
  { id: "weeklyDigest", title: "Weekly digest", description: "A Monday summary of workspace activity." },
];

/** Usage & Alerts (design.md §9.6) — always shows used / limit. */
export const UsageSection = ({ settings }) => {
  const u = settings.usage;
  const save = useSectionSave("alerts", "Alert preference saved");
  return (
    <SettingsPanel testId="settings-usage" title="Usage & Alerts" description={`Your plan usage resets on ${formatDate(u.resetsAt)}.`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {[["Clients", u.clients], ["Reports this month", u.reports]].map(([label, m]) => {
          const pct = (m.used / m.limit) * 100;
          return (
            <div key={label} className="rounded-xl border border-[var(--app-border)] p-4" data-testid={`usage-${label.split(" ")[0].toLowerCase()}`}>
              <div className="flex justify-between text-[13px]"><span className="font-medium">{label}</span><span className="fx-num">{m.used} / {m.limit}</span></div>
              <div className="mt-2 h-2 rounded-full bg-[var(--app-inset)]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 85 ? "var(--app-warning)" : "var(--app-accent)" }} /></div>
              <p className="mt-1.5 text-xs fx-subtle">{pct > 85 ? "Nearing your limit — new items will pause at the limit." : `${(100 - pct).toFixed(0)}% remaining`}</p>
            </div>
          );
        })}
      </div>
      <h3 className="mt-6 text-sm font-semibold">Alert preferences</h3>
      <div className="divide-y divide-[var(--app-border)]">
        {ALERTS.map((a) => <ToggleRow key={a.id} id={`alert-${a.id}`} title={a.title} description={a.description} checked={settings.alerts[a.id]} disabled={save.isPending} onChange={(v) => save.mutate({ [a.id]: v })} />)}
      </div>
    </SettingsPanel>
  );
};
