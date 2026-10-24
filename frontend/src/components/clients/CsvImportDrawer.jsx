import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { useClients } from "@/hooks/queries/useWorkspaceData";
import { clientsService } from "@/services/clients.service";
import { UploadStep, MapStep, PreviewStep, ConfirmStep, IMPORT_FIELDS, autoMap, validateRows } from "@/components/clients/CsvImportSteps";
import { cn } from "@/lib/utils";

const STEPS = ["Upload CSV", "Map columns", "Preview & validate", "Confirm import"];

/** Four-step CSV import drawer (design.md §6.5). Going back keeps file and mappings. */
export const CsvImportDrawer = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null); // { name, headers, rows }
  const [mapping, setMapping] = useState({});
  const [result, setResult] = useState(null);
  const { data: existing = [] } = useClients();

  const validated = useMemo(() => (file ? validateRows(file.rows, file.headers, mapping, existing) : []), [file, mapping, existing]);
  const valid = validated.filter((r) => r.state === "valid");

  const importMut = useWorkspaceMutation(clientsService.import, {
    invalidate: ["clients", "dashboard"],
    success: (r) => `${r.imported} clients imported`,
    onSuccess: setResult,
  });

  const reset = () => { setStep(0); setFile(null); setMapping({}); setResult(null); };
  const close = (o) => { onOpenChange(o); if (!o) setTimeout(reset, 250); };
  const onFile = (parsed) => { setFile(parsed); setMapping(autoMap(parsed.headers)); };
  const requiredMapped = IMPORT_FIELDS.filter((f) => f.required).every((f) => mapping[f.id]);

  const canContinue = [!!file, requiredMapped, valid.length > 0, true][step];

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[600px]" data-testid="csv-import-drawer">
        <SheetHeader className="border-b border-[var(--app-border)] px-6 py-5 text-left">
          <SheetTitle>Import clients from CSV</SheetTitle>
          <SheetDescription>Existing clients are never overwritten — duplicates are skipped.</SheetDescription>
          <ol className="flex gap-2 pt-3" aria-label="Import progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
                <span className={cn("h-1 rounded-full", i <= step ? "bg-[var(--app-accent)]" : "bg-[var(--app-inset)]")} />
                <span className={cn("hidden text-[11px] font-medium sm:block", i === step ? "text-[var(--app-ink)]" : "fx-subtle")}>{i < step ? <Check className="mr-1 inline h-3 w-3" /> : null}{s}</span>
              </li>
            ))}
          </ol>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
          {step === 0 && <UploadStep file={file} onFile={onFile} onClear={() => setFile(null)} />}
          {step === 1 && <MapStep headers={file.headers} mapping={mapping} onChange={setMapping} />}
          {step === 2 && <PreviewStep rows={validated} />}
          {step === 3 && <ConfirmStep rows={validated} result={result} />}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-[var(--app-border)] px-6 py-4">
          <Button variant="ghost" className="rounded-[10px]" onClick={() => close(false)} data-testid="csv-cancel">{result ? "Close" : "Cancel"}</Button>
          <div className="flex gap-2">
            {step > 0 && !result && <Button variant="outline" className="rounded-[10px]" onClick={() => setStep(step - 1)} data-testid="csv-back">Back</Button>}
            {step < 3 && <Button className="rounded-[10px]" disabled={!canContinue} onClick={() => setStep(step + 1)} data-testid="csv-continue">Continue</Button>}
            {step === 3 && !result && (
              <Button className="rounded-[10px]" disabled={importMut.isPending || !valid.length} onClick={() => importMut.mutate(valid.map((r) => r.data))} data-testid="csv-confirm-import">
                {importMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Import {valid.length} clients
              </Button>
            )}
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
};
