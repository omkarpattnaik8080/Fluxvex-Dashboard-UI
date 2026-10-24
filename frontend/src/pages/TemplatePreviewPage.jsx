import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Info, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { ConfirmDialog } from "@/components/common/FormControls";
import { ErrorState, SkeletonCard } from "@/components/common/States";
import { ReportPaper, TEMPLATE_SECTIONS } from "@/components/templates/ReportPaper";
import { useTemplate } from "@/hooks/queries/useSystemData";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { templatesService } from "@/services/workspace.service";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Three-panel template preview workspace (design.md §8.2). */
export default function TemplatePreviewPage() {
  const { templateId } = useParams();
  const { data: t, isLoading, isError, refetch } = useTemplate(templateId);
  const [active, setActive] = useState(TEMPLATE_SECTIONS[0].id);
  const [confirmSave, setConfirmSave] = useState(false);
  const sectionRefs = useRef({});

  const save = useWorkspaceMutation(({ draft }) => templatesService.save(templateId, { draft }), {
    invalidate: ["templates"],
    success: (_, { draft }) => (draft ? "Draft saved — published template unchanged" : "Template saved"),
  });

  const jump = (id) => {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) return <SkeletonCard lines={10} />;
  if (isError) return <div className="fx-card"><ErrorState message="Template not found." onRetry={refetch} /></div>;

  return (
    <div data-testid="template-preview-page">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/templates" className="mb-2 inline-flex items-center gap-1.5 text-[13px] fx-muted hover:text-[var(--app-ink)]" data-testid="template-back"><ArrowLeft className="h-4 w-4" />Templates</Link>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em]" data-testid="page-title">{t.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" className="h-10 rounded-[10px]" onClick={() => toast.info("The section editor is coming soon. You can preview and save this template today.")} data-testid="template-edit-button"><Pencil className="mr-2 h-4 w-4" />Edit Template</Button>
          <Button variant="outline" className="h-10 rounded-[10px] bg-white" disabled={save.isPending} onClick={() => save.mutate({ draft: true })} data-testid="template-save-draft">Save as Draft</Button>
          <Button className="h-10 rounded-[10px]" disabled={save.isPending} onClick={() => setConfirmSave(true)} data-testid="template-save">{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Template</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr_300px]">
        <nav aria-label="Report sections" className="fx-card h-fit p-3 lg:sticky lg:top-24">
          <p className="px-3 pb-2 pt-1 text-xs font-medium fx-subtle">Report Sections</p>
          {TEMPLATE_SECTIONS.map((s, i) => (
            <button key={s.id} type="button" onClick={() => jump(s.id)} data-testid={`template-section-${s.id}`} aria-current={active === s.id}
              className={cn("flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors", active === s.id ? "bg-[var(--app-accent-wash)] font-medium text-[var(--app-accent)]" : "fx-muted hover:bg-[var(--app-inset)]")}>
              <span className="fx-num w-4 text-xs">{i + 1}</span>{s.label}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl bg-[var(--paper)] p-4 sm:p-8"><ReportPaper sectionRefs={sectionRefs} /></div>

        <aside className="space-y-4 lg:col-span-2 xl:col-span-1">
          <div className="flex gap-3 rounded-2xl border border-[var(--app-info)]/20 bg-[var(--app-info-wash)] p-4 text-[13px] text-[var(--app-info)]" data-testid="template-sample-notice">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>This preview uses <b>sample data</b>. Real reports use each client's connected accounts and selected date range.</p>
          </div>
          <div className="fx-card space-y-3 p-5 text-[13px]">
            <p className="text-[15px] font-semibold">Template details</p>
            <p className="fx-muted">{t.description}</p>
            <dl className="space-y-2">
              {[["Category", t.category], ["Sections", t.sections], ["Approx. pages", t.pages], ["Last saved", formatDate(t.updatedAt)], ["Draft", t.draftSavedAt ? `Saved ${formatDate(t.draftSavedAt)}` : "None"]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt className="fx-muted">{k}</dt><dd className="fx-num font-medium" data-testid={`template-detail-${k.toLowerCase().replace(/\W+/g, "-")}`}>{v}</dd></div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-1 pt-1">{t.providers.map((p) => <ProviderBadge key={p} provider={p} />)}</div>
          </div>
          <div className="fx-card p-5 text-[13px] fx-muted"><p className="mb-1 font-semibold text-[var(--app-ink)]">Tip</p>Sections without source data show a friendly “data unavailable” block instead of empty charts.</div>
        </aside>
      </div>

      <ConfirmDialog open={confirmSave} onOpenChange={setConfirmSave} confirmLabel="Save template" title="Save changes to this template?"
        description="Future reports that use this template will pick up the saved version. Reports already generated stay unchanged."
        onConfirm={() => save.mutate({ draft: false })} />
    </div>
  );
}
