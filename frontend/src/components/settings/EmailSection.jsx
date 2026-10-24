import { useEffect, useState } from "react";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FormField, inputCls } from "@/components/common/FormControls";
import { SettingsPanel, ToggleRow } from "@/components/settings/SettingsLayout";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { settingsService } from "@/services/workspace.service";

/** White-label email (design.md §9.8). White-label stays locked until the domain verifies. */
export const EmailSection = ({ settings }) => {
  const e = settings.email;
  const [form, setForm] = useState({ domain: e.domain, senderAddress: e.senderAddress, fromName: e.fromName });
  useEffect(() => setForm({ domain: e.domain, senderAddress: e.senderAddress, fromName: e.fromName }), [e.domain, e.senderAddress, e.fromName]);

  const save = useWorkspaceMutation((patch) => settingsService.update("email", patch), { invalidate: ["settings"], success: "Email settings saved" });
  const verify = useWorkspaceMutation(settingsService.verifyDomain, { invalidate: ["settings"], success: "Domain verified — white-label sending is now available" });
  const verified = e.verification === "verified";
  const dirty = form.domain !== e.domain || form.senderAddress !== e.senderAddress || form.fromName !== e.fromName;
  const set = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));

  return (
    <SettingsPanel testId="settings-email" title="Email" description="Send reports from your own domain."
      footer={<Button className="rounded-[10px]" disabled={!dirty || save.isPending} onClick={() => save.mutate(form)} data-testid="email-save">{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button>}>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField id="email-domain" label="Domain"><Input id="email-domain" value={form.domain} onChange={set("domain")} className={inputCls} data-testid="email-domain-input" /></FormField>
        <FormField id="email-sender" label="Sender address"><Input id="email-sender" value={form.senderAddress} onChange={set("senderAddress")} className={inputCls} data-testid="email-sender-input" /></FormField>
        <FormField id="email-from" label="From name"><Input id="email-from" value={form.fromName} onChange={set("fromName")} className={inputCls} data-testid="email-from-input" /></FormField>
      </div>

      <ToggleRow id="email-white-label" title="White-label sending" checked={e.whiteLabel} disabled={!verified || save.isPending} onChange={(v) => save.mutate({ whiteLabel: v })}
        description="Changes the visible sender identity only — report data and delivery guarantees stay the same."
        note={!verified ? "Verify your domain below to enable white-label sending." : undefined} />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">DNS verification <StatusBadge status={verify.isPending ? "verifying" : e.verification} testId="email-verification-status" /></h3>
        <Button variant="outline" className="h-9 rounded-[10px]" disabled={verified || verify.isPending} onClick={() => verify.mutate()} data-testid="email-verify-button">
          {verify.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}{verified ? "Verified" : "Verify domain"}
        </Button>
      </div>
      <p className="mt-1 text-xs fx-subtle">Add these records at your DNS provider. Changes can take up to 24 hours to propagate.</p>
      <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--app-border)]">
        <table className="w-full min-w-[640px] text-[13px]" data-testid="dns-table">
          <thead className="bg-[var(--app-inset)] text-left text-xs fx-muted"><tr>{["Type", "Host", "Value", "Status"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {e.dnsRecords.map((r) => (
              <tr key={r.host} className="border-t border-[var(--app-border)]">
                <td className="px-4 py-3 font-medium">{r.type}</td>
                <td className="px-4 py-3"><CopyValue value={r.host} /></td>
                <td className="px-4 py-3"><CopyValue value={r.value} /></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsPanel>
  );
};

const CopyValue = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span className="flex items-center gap-2">
      <code className="max-w-[260px] truncate rounded-md bg-[var(--app-inset)] px-1.5 py-0.5 text-xs" title={value}>{value}</code>
      <button type="button" onClick={copy} aria-label={`Copy ${value}`} className="rounded-md p-1 text-[var(--app-muted)] hover:bg-[var(--app-inset)]" data-testid="dns-copy-button">
        {copied ? <Check className="h-3.5 w-3.5 text-[var(--app-success)]" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
};
