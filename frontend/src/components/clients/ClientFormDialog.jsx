import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, inputCls } from "@/components/common/FormControls";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { clientsService } from "@/services/clients.service";
import { COUNTRIES, TIMEZONES } from "@/constants/domain";
import { parseRecipients } from "@/lib/validation";

const EMPTY = { name: "", website: "", timezone: "Europe/London", country: "", recipients: "", notes: "" };
const toForm = (c) => (c ? { ...EMPTY, ...c, recipients: c.recipients.join(", ") } : EMPTY);

/** Add / edit client modal (design.md §6.4). Values are preserved when the API rejects them. */
export const ClientFormDialog = ({ open, onOpenChange, client, onSaved }) => {
  const [form, setForm] = useState(toForm(client));
  const [errors, setErrors] = useState({});
  const isEdit = !!client;

  useEffect(() => {
    if (open) { setForm(toForm(client)); setErrors({}); }
  }, [open, client]);

  const save = useWorkspaceMutation((data) => (isEdit ? clientsService.update(client.id, data) : clientsService.create(data)), {
    invalidate: ["clients", "dashboard", "search"],
    success: isEdit ? "Client updated" : "Client added",
    onSuccess: (saved) => { onOpenChange(false); onSaved?.(saved); },
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Client name is required";
    const { valid, invalid } = parseRecipients(form.recipients);
    if (invalid.length) next.recipients = `Invalid email: ${invalid.join(", ")}`;
    setErrors(next);
    if (Object.keys(next).length) return;
    save.mutate({ ...form, recipients: valid });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-[560px]" data-testid="client-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit client" : "Add client"}</DialogTitle>
          <DialogDescription>Client details are used for report headers, scheduling and delivery.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <FormField id="client-name" label="Name" required error={errors.name} className="sm:col-span-2">
            <Input id="client-name" value={form.name} onChange={set("name")} placeholder="e.g. Acme Outdoor" className={inputCls} aria-invalid={!!errors.name} data-testid="client-name-input" />
          </FormField>
          <FormField id="client-website" label="Website" hint="We'll normalise the URL for you." className="sm:col-span-2">
            <Input id="client-website" value={form.website} onChange={set("website")} placeholder="acmeoutdoor.com" className={inputCls} data-testid="client-website-input" />
          </FormField>
          <FormField id="client-timezone" label="Timezone" hint="Defaults to your agency timezone.">
            <OptionSelect id="client-timezone" value={form.timezone} onChange={set("timezone")} options={TIMEZONES} testId="client-timezone-select" />
          </FormField>
          <FormField id="client-country" label="Country">
            <OptionSelect id="client-country" value={form.country} onChange={set("country")} options={COUNTRIES} placeholder="Select country" testId="client-country-select" />
          </FormField>
          <FormField id="client-recipients" label="Recipients" hint="Comma-separated email addresses." error={errors.recipients} className="sm:col-span-2">
            <Input id="client-recipients" value={form.recipients} onChange={set("recipients")} placeholder="ceo@acme.com, marketing@acme.com" className={inputCls} data-testid="client-recipients-input" />
          </FormField>
          <FormField id="client-notes" label="Notes" className="sm:col-span-2">
            <Textarea id="client-notes" value={form.notes} onChange={set("notes")} rows={3} className="rounded-[10px] border-[var(--app-border)]" data-testid="client-notes-input" />
          </FormField>
          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" className="h-10 rounded-[10px]" onClick={() => onOpenChange(false)} data-testid="client-form-cancel">Cancel</Button>
            <Button type="submit" className="h-10 rounded-[10px]" disabled={save.isPending} data-testid="client-form-submit">
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const OptionSelect = ({ id, value, onChange, options, placeholder, testId }) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger id={id} className={inputCls} data-testid={testId}><SelectValue placeholder={placeholder} /></SelectTrigger>
    <SelectContent className="rounded-xl">
      {options.map((o) => <SelectItem key={o} value={o} className="rounded-lg">{o}</SelectItem>)}
    </SelectContent>
  </Select>
);
