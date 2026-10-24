import { useEffect, useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, inputCls } from "@/components/common/FormControls";
import { SettingsPanel } from "@/components/settings/SettingsLayout";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { settingsService } from "@/services/workspace.service";
import { TIMEZONES } from "@/constants/domain";

const OPTIONS = {
  dateFormat: ["DD MMM YYYY", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
  currency: ["USD", "GBP", "EUR", "AED", "INR", "AUD"],
  language: ["English", "German", "French", "Spanish"],
};

/** WCAG contrast ratio of a hex colour against white. */
const contrastWithWhite = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05);
};

/** Agency Profile (design.md §9.1) — explicit save with unsaved-changes indicator. */
export const AgencyProfileSection = ({ settings }) => {
  const [form, setForm] = useState(settings.agency);
  const [logoError, setLogoError] = useState("");
  const fileRef = useRef(null);
  useEffect(() => setForm(settings.agency), [settings.agency]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings.agency);
  const save = useWorkspaceMutation((data) => settingsService.update("agency", data), { invalidate: ["settings"], success: "Agency profile saved" });
  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v?.target ? v.target.value : v }));
  const contrast = contrastWithWhite(form.brandColor);

  const onLogo = (file) => {
    setLogoError("");
    if (!file) return;
    if (!/image\/(png|jpe?g)/.test(file.type)) return setLogoError("Use a PNG or JPG file.");
    if (file.size > 1024 * 1024) return setLogoError("Logo must be 1 MB or smaller.");
    setForm((f) => ({ ...f, logoName: file.name }));
  };

  return (
    <SettingsPanel testId="settings-agency" title="Agency Profile" description="These defaults apply to future reports. Historical reports keep their original currency and dates."
      footer={<>
        {dirty && <span className="mr-auto text-xs text-[var(--app-warning)]" data-testid="agency-unsaved">Unsaved changes</span>}
        <Button variant="ghost" className="rounded-[10px]" disabled={!dirty} onClick={() => setForm(settings.agency)} data-testid="agency-discard">Discard</Button>
        <Button className="rounded-[10px]" disabled={!dirty || save.isPending} onClick={() => save.mutate(form)} data-testid="agency-save">{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes</Button>
      </>}>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="agency-name" label="Agency name" required hint={`${form.name.length}/60 characters`}>
          <Input id="agency-name" value={form.name} maxLength={60} onChange={set("name")} className={inputCls} data-testid="agency-name-input" />
        </FormField>
        <FormField id="agency-website" label="Website">
          <Input id="agency-website" value={form.website} onChange={set("website")} className={inputCls} data-testid="agency-website-input" />
        </FormField>
        <Picker id="agency-timezone" label="Timezone" value={form.timezone} onChange={set("timezone")} options={TIMEZONES} />
        <Picker id="agency-date-format" label="Date format" value={form.dateFormat} onChange={set("dateFormat")} options={OPTIONS.dateFormat} />
        <Picker id="agency-currency" label="Currency" value={form.currency} onChange={set("currency")} options={OPTIONS.currency} hint="Applies to reports generated after saving." />
        <Picker id="agency-language" label="Language" value={form.language} onChange={set("language")} options={OPTIONS.language} />
        <FormField id="agency-logo" label="Logo" hint="PNG or JPG, up to 1 MB." error={logoError}>
          <button type="button" onClick={() => fileRef.current?.click()} className="flex h-10 w-full items-center gap-2 rounded-[10px] border border-dashed border-[var(--app-border)] px-3 text-[13px] fx-muted hover:border-[var(--app-accent-soft)]" data-testid="agency-logo-upload">
            <ImageUp className="h-4 w-4" />{form.logoName ?? "Upload logo"}
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => onLogo(e.target.files[0])} />
        </FormField>
        <FormField id="agency-brand" label="Brand color" hint={contrast < 4.5 ? undefined : `Contrast ${contrast.toFixed(1)}:1 on white — passes AA`} error={contrast < 4.5 ? `Contrast ${contrast.toFixed(1)}:1 — too light for report headings (needs 4.5:1)` : undefined}>
          <div className="flex items-center gap-2">
            <input type="color" value={form.brandColor} onChange={set("brandColor")} aria-label="Brand color picker" className="h-10 w-12 cursor-pointer rounded-[10px] border border-[var(--app-border)] bg-white p-1" data-testid="agency-brand-color" />
            <Input id="agency-brand" value={form.brandColor} onChange={set("brandColor")} className={inputCls} />
          </div>
          <p className="mt-2 rounded-lg px-3 py-2 text-[13px] font-semibold" style={{ color: form.brandColor, background: "var(--app-inset)" }}>Report title preview</p>
        </FormField>
      </div>
    </SettingsPanel>
  );
};

const Picker = ({ id, label, value, onChange, options, hint }) => (
  <FormField id={id} label={label} hint={hint}>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className={inputCls} data-testid={`${id}-select`}><SelectValue /></SelectTrigger>
      <SelectContent className="rounded-xl">{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  </FormField>
);
