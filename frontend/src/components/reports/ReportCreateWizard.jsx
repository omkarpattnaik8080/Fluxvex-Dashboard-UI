import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClients, useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { useSettings, useTemplates } from "@/hooks/queries/useSystemData";
import { reportsService } from "@/services/reports.service";
import { ClientsStep, SourcesStep, TemplateStep, DeliveryStep, SummaryStep } from "@/components/reports/WizardSteps";
import { cn } from "@/lib/utils";

const STEPS = ["Clients & period", "Data sources", "Template", "Delivery", "Summary"];
const INITIAL = { clientIds: [], rangeId: "30d", providers: [], templateId: "tpl_1", mode: "now", scheduleAt: "", recipients: "" };

/** Linear 5-step create-report flow (design.md §7.4). */
export const ReportCreateWizard = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(INITIAL);
  const { data: clients = [] } = useClients();
  const { data: templates = [] } = useTemplates();
  const { data: settings } = useSettings();

  useEffect(() => { if (open) { setStep(0); setDraft(INITIAL); } }, [open]);

  const selected = useMemo(() => clients.filter((c) => draft.clientIds.includes(c.id)), [clients, draft.clientIds]);
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  // Pre-fill recipients from selected clients when entering the delivery step
  const goTo = (next) => {
    if (next === 3 && !draft.recipients) update({ recipients: [...new Set(selected.flatMap((c) => c.recipients))].join(", ") });
    setStep(next);
  };

  const create = useWorkspaceMutation(reportsService.create, {
    invalidate: ["reports", "dashboard", "clients"],
    success: (r) => (draft.mode === "schedule" ? `${r.length} report(s) scheduled` : `${r.length} report(s) generated`),
    onSuccess: (r) => { onOpenChange(false); navigate(r.length === 1 ? `/reports?q=${r[0].id}` : `/reports?status=${r[0].status}`); },
  });

  const recipients = draft.recipients.split(/[,;\s]+/).filter(Boolean);
  const valid = [
    draft.clientIds.length > 0,
    draft.providers.length > 0,
    !!draft.templateId,
    recipients.length > 0 && (draft.mode === "now" || !!draft.scheduleAt),
    true,
  ];

  const props = { draft, update, clients, selected, templates, settings };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl p-0 sm:max-w-[680px]" data-testid="report-create-wizard">
        <DialogHeader className="border-b border-[var(--app-border)] px-6 py-5 text-left">
          <DialogTitle>Create report</DialogTitle>
          <DialogDescription>Step {step + 1} of {STEPS.length} · {STEPS[step]}</DialogDescription>
          <div className="flex gap-1.5 pt-2">{STEPS.map((s, i) => <span key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-[var(--app-accent)]" : "bg-[var(--app-inset)]")} />)}</div>
        </DialogHeader>

        <div className="max-h-[58vh] overflow-y-auto px-6 py-5">
          {step === 0 && <ClientsStep {...props} />}
          {step === 1 && <SourcesStep {...props} />}
          {step === 2 && <TemplateStep {...props} />}
          {step === 3 && <DeliveryStep {...props} />}
          {step === 4 && <SummaryStep {...props} />}
        </div>

        <footer className="flex justify-between gap-2 border-t border-[var(--app-border)] px-6 py-4">
          <Button variant="ghost" className="rounded-[10px]" onClick={() => onOpenChange(false)} data-testid="wizard-cancel">Cancel</Button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" className="rounded-[10px]" onClick={() => setStep(step - 1)} data-testid="wizard-back">Back</Button>}
            {step < 4 ? (
              <Button className="rounded-[10px]" disabled={!valid[step]} onClick={() => goTo(step + 1)} data-testid="wizard-continue">Continue</Button>
            ) : (
              <Button className="rounded-[10px]" disabled={create.isPending} data-testid="wizard-submit"
                onClick={() => create.mutate({ ...draft, recipients })}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{draft.mode === "schedule" ? "Schedule report" : "Generate report"}
              </Button>
            )}
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
