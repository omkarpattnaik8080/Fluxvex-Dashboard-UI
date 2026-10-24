import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientAvatar } from "@/components/common/ClientAvatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { FormField, inputCls } from "@/components/common/FormControls";
import { DATE_RANGES, PLATFORMS } from "@/constants/domain";
import { cn } from "@/lib/utils";

const optionCls = (active, disabled) =>
  cn("flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
    active ? "border-[var(--app-accent)] bg-[var(--app-accent-wash)]" : "border-[var(--app-border)] hover:bg-[var(--app-canvas)]",
    disabled && "cursor-not-allowed opacity-55 hover:bg-transparent");

const toggle = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

/* Step 1 — clients & period */
export const ClientsStep = ({ draft, update, clients }) => (
  <div className="space-y-4">
    <FormField id="wizard-range" label="Reporting period">
      <Select value={draft.rangeId} onValueChange={(v) => update({ rangeId: v })}>
        <SelectTrigger id="wizard-range" className={inputCls} data-testid="wizard-range-select"><SelectValue /></SelectTrigger>
        <SelectContent className="rounded-xl">{DATE_RANGES.map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}</SelectContent>
      </Select>
    </FormField>
    <p className="text-[13px] font-medium">Clients</p>
    <div className="grid gap-2 sm:grid-cols-2">
      {clients.map((c) => {
        const active = draft.clientIds.includes(c.id);
        return (
          <button key={c.id} type="button" onClick={() => update({ clientIds: toggle(draft.clientIds, c.id), providers: [] })} className={optionCls(active)} data-testid={`wizard-client-${c.id}`} aria-pressed={active}>
            <Checkbox checked={active} tabIndex={-1} aria-hidden />
            <ClientAvatar name={c.name} size={30} />
            <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium">{c.name}</span><span className="block text-xs fx-subtle">{c.connections.length} accounts</span></span>
          </button>
        );
      })}
    </div>
  </div>
);

/* Step 2 — data sources; unavailable providers are disabled with a reason */
export const SourcesStep = ({ draft, update, selected }) => (
  <div className="space-y-3">
    <p className="text-[13px] fx-muted">Choose which sources to include. Only healthy connections can be used.</p>
    {PLATFORMS.map((p) => {
      const conns = selected.flatMap((c) => c.connections.filter((cn) => cn.provider === p.id).map((cn) => ({ ...cn, clientName: c.name })));
      const healthy = conns.filter((cn) => cn.status === "connected");
      const disabled = healthy.length === 0;
      const active = draft.providers.includes(p.id);
      return (
        <div key={p.id} className="space-y-2">
          <button type="button" disabled={disabled} onClick={() => update({ providers: toggle(draft.providers, p.id) })} className={optionCls(active, disabled)} data-testid={`wizard-source-${p.id}`} aria-pressed={active}>
            <Checkbox checked={active} tabIndex={-1} aria-hidden disabled={disabled} />
            <ProviderBadge provider={p.id} />
            <span className="flex-1 text-xs fx-muted">{disabled ? (conns.length ? "Connection needs attention — reconnect first" : "Not connected for selected clients") : `${healthy.length} of ${conns.length} accounts healthy`}</span>
          </button>
          {conns.filter((cn) => cn.status !== "connected" && cn.status !== "not_connected").map((cn) => (
            <p key={cn.id} className="flex items-center gap-2 pl-4 text-xs fx-muted"><StatusBadge status={cn.status} /> {cn.clientName} will be excluded</p>
          ))}
        </div>
      );
    })}
  </div>
);

/* Step 3 — template */
export const TemplateStep = ({ draft, update, templates }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    {templates.map((t) => (
      <button key={t.id} type="button" onClick={() => update({ templateId: t.id })} className={cn(optionCls(draft.templateId === t.id), "flex-col items-start gap-1")} data-testid={`wizard-template-${t.id}`} aria-pressed={draft.templateId === t.id}>
        <span className="text-[13px] font-medium">{t.name}</span>
        <span className="text-xs fx-muted">{t.description}</span>
        <span className="text-xs fx-subtle">{t.sections} sections · ~{t.pages} pages</span>
      </button>
    ))}
  </div>
);

/* Step 4 — delivery */
export const DeliveryStep = ({ draft, update, settings }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-2">
      {[["now", "Generate now", "Creates a draft right away"], ["schedule", "Schedule", "Runs automatically on a date"]].map(([id, label, hint]) => (
        <button key={id} type="button" onClick={() => update({ mode: id })} className={cn(optionCls(draft.mode === id), "flex-col items-start gap-0.5")} data-testid={`wizard-mode-${id}`} aria-pressed={draft.mode === id}>
          <span className="text-[13px] font-medium">{label}</span><span className="text-xs fx-subtle">{hint}</span>
        </button>
      ))}
    </div>
    {draft.mode === "schedule" && (
      <FormField id="wizard-schedule" label="Run on" required>
        <Input id="wizard-schedule" type="date" value={draft.scheduleAt} onChange={(e) => update({ scheduleAt: e.target.value })} className={inputCls} data-testid="wizard-schedule-input" />
      </FormField>
    )}
    <FormField id="wizard-recipients" label="Recipients" required hint="Comma-separated. Pre-filled from the selected clients.">
      <Input id="wizard-recipients" value={draft.recipients} onChange={(e) => update({ recipients: e.target.value })} className={inputCls} data-testid="wizard-recipients-input" />
    </FormField>
    <p className="rounded-xl bg-[var(--app-inset)] px-3 py-2.5 text-xs fx-muted">
      Destination: <b className="font-medium text-[var(--app-ink)]">{{ email: "Email", googleDrive: "Google Drive", downloadOnly: "Download only" }[settings?.destinations.defaultDestination]}</b>
      {settings?.governance.requireApproval && " · Reports will wait for approval before sending."}
    </p>
  </div>
);

/* Step 5 — summary */
export const SummaryStep = ({ draft, selected, templates, settings }) => {
  const rows = [
    ["Clients", selected.map((c) => c.name).join(", ")],
    ["Period", DATE_RANGES.find((r) => r.id === draft.rangeId).label],
    ["Sources", draft.providers.map((p) => PLATFORMS.find((x) => x.id === p).label).join(", ")],
    ["Template", templates.find((t) => t.id === draft.templateId)?.name],
    ["Delivery", draft.mode === "schedule" ? `Scheduled · ${draft.scheduleAt}` : "Generate now"],
    ["Recipients", draft.recipients],
    ["After generation", draft.mode === "schedule" ? "Scheduled" : settings?.governance.requireApproval ? "Needs review" : "Approved — ready to send"],
  ];
  return (
    <dl className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)]" data-testid="wizard-summary">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-[13px]"><dt className="fx-muted">{k}</dt><dd className="break-words font-medium">{v}</dd></div>
      ))}
    </dl>
  );
};
