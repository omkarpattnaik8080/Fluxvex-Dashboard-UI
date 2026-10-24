import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProviderBadge } from "@/components/common/ProviderBadge";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";

/** Template gallery card (design.md §8.1). */
export const TemplateCard = ({ template }) => {
  const navigate = useNavigate();
  return (
    <article className="fx-card fx-rise flex flex-col gap-4 p-4 transition-colors hover:border-[var(--app-accent-soft)]" data-testid={`template-card-${template.id}`}>
      <TemplateThumbnail layout={template.layout} />
      <div className="flex-1 space-y-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[15px] font-semibold">{template.name}</h3>
          <span className="rounded-md bg-[var(--app-inset)] px-1.5 py-0.5 text-[11px] font-medium fx-muted">{template.category}</span>
        </div>
        <p className="text-[13px] fx-muted">{template.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">{template.providers.map((p) => <ProviderBadge key={p} provider={p} compact />)}</div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--app-border)] px-1 pt-3">
        <span className="fx-num text-xs fx-subtle">{template.sections} sections · ~{template.pages} pages · Updated {formatDate(template.updatedAt, "dd MMM")}</span>
        <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => navigate(ROUTES.templatePreview(template.id))} data-testid={`template-preview-${template.id}`}>Preview</Button>
      </div>
    </article>
  );
};
