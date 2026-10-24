import { useState } from "react";
import { Loader2, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PersonAvatar } from "@/components/common/DataViz";
import { ConfirmDialog, inputCls } from "@/components/common/FormControls";
import { EmptyState } from "@/components/common/States";
import { SettingsPanel } from "@/components/settings/SettingsLayout";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { settingsService } from "@/services/workspace.service";
import { formatRelative } from "@/lib/format";

const ROLES = [
  { id: "Admin", description: "Manages settings, users and billing" },
  { id: "Editor", description: "Creates and edits reports" },
  { id: "Viewer", description: "Can view reports but not edit" },
];

/** Account & Security (design.md §9.2). */
export const SecuritySection = ({ settings }) => {
  const s = settings.security;
  return (
    <SettingsPanel testId="settings-security" title="Account & Security" description="Your sign-in identity and active sessions.">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--app-border)] p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--app-info-wash)] text-sm font-bold text-[var(--app-info)]">G</span>
        <div className="flex-1"><p className="text-sm font-medium">Signed in with {s.identityProvider}</p><p className="text-[13px] fx-muted">{s.email} · last sign-in {formatRelative(s.lastSignInAt)}</p></div>
        <StatusBadge status="connected" testId="security-status" />
      </div>
      <p className="mt-4 flex gap-2 text-[13px] fx-muted"><ShieldCheck className="h-4 w-4 shrink-0 text-[var(--app-success)]" />Your password and two-step verification are managed by Google. Change them in your Google Account security settings.</p>
      <p className="mt-2 text-[13px] fx-muted">{s.sessions} active sessions. Session management becomes available once authentication is served by the NestJS API.</p>
    </SettingsPanel>
  );
};

/** Users & Roles (design.md §9.3). Prevents removing the last admin. */
export const UsersSection = ({ settings }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [removing, setRemoving] = useState(null);
  const invite = useWorkspaceMutation(settingsService.invite, { invalidate: ["settings"], success: (_, v) => `Invitation sent to ${v.email}`, onSuccess: () => setEmail("") });
  const remove = useWorkspaceMutation(settingsService.removeMember, { invalidate: ["settings"], success: "Team member removed" });

  return (
    <SettingsPanel testId="settings-users" title="Users & Roles" description="Invite teammates and control what they can do.">
      <form onSubmit={(e) => { e.preventDefault(); invite.mutate({ email: email.trim(), role }); }} className="flex flex-col gap-2 sm:flex-row">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="teammate@agency.com" aria-label="Invite email" className={`${inputCls} flex-1`} data-testid="invite-email-input" />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className={`${inputCls} sm:w-36`} aria-label="Role" data-testid="invite-role-select"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl">{ROLES.map((r) => <SelectItem key={r.id} value={r.id}>{r.id}</SelectItem>)}</SelectContent>
        </Select>
        <Button type="submit" className="h-10 rounded-[10px]" disabled={!email || invite.isPending} data-testid="invite-submit">
          {invite.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}Invite
        </Button>
      </form>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {ROLES.map((r) => <div key={r.id} className="rounded-xl bg-[var(--app-inset)] px-3 py-2.5"><p className="text-[13px] font-medium">{r.id}</p><p className="text-xs fx-muted">{r.description}</p></div>)}
      </div>

      <h3 className="mb-2 mt-6 text-sm font-semibold">Team members</h3>
      {settings.users.length === 0 ? <EmptyState title="No team members yet" description="Invite a teammate to collaborate on reports." /> : (
        <ul className="divide-y divide-[var(--app-border)]">
          {settings.users.map((u) => (
            <li key={u.id} className="flex flex-wrap items-center gap-3 py-3" data-testid={`member-row-${u.id}`}>
              <PersonAvatar person={{ name: u.name || u.email, avatarUrl: u.avatarUrl }} size={36} />
              <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{u.name || u.email}</p><p className="truncate text-xs fx-subtle">{u.email}</p></div>
              <span className="text-[13px] fx-muted">{u.role}</span>
              <StatusBadge status={u.state} />
              <button type="button" aria-label={`Remove ${u.email}`} onClick={() => setRemoving(u)} className="rounded-lg p-2 text-[var(--app-muted)] hover:bg-[var(--app-danger-wash)] hover:text-[var(--app-danger)]" data-testid={`member-remove-${u.id}`}><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)} destructive confirmLabel="Remove" title={`Remove ${removing?.email}?`}
        description="They will lose access to this workspace immediately." onConfirm={() => remove.mutate(removing.id)} />
    </SettingsPanel>
  );
};
