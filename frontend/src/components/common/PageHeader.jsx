import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page title block (design.md §5.2 / §6.1). */
export const PageHeader = ({ title, description, actions, badge, className }) => (
  <div className={cn("flex flex-col gap-4 pb-6 lg:flex-row lg:items-end lg:justify-between", className)}>
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <h1 data-testid="page-title" className="text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
          {title}
        </h1>
        {badge}
      </div>
      {description && <p className="mt-1.5 text-sm fx-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

/** Visible disclosure that the workspace runs on seeded sample data (design.md §14). */
export const SampleDataBadge = () => (
  <span
    data-testid="sample-data-badge"
    title="This workspace uses seeded sample data until the NestJS API is connected"
    className="inline-flex h-6 items-center gap-1 rounded-lg border border-dashed border-[var(--app-border)] px-2 text-[11px] font-medium fx-muted"
  >
    <FlaskConical className="h-3 w-3" /> Sample data
  </span>
);

/** Low-profile summary metric (Clients / Reports pages). */
export const SummaryCard = ({ label, value, hint, icon: Icon, tone, active, onClick, testId }) => {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "fx-card flex flex-col gap-2 p-5 text-left transition-colors duration-200",
        onClick && "hover:border-[var(--app-accent-soft)]",
        active && "border-[var(--app-accent)] bg-[var(--app-accent-wash)]",
      )}
    >
      <span className="flex items-center gap-2 text-[13px] fx-muted">
        {Icon && <Icon className="h-4 w-4" style={{ color: tone }} />}
        {label}
      </span>
      <span className="fx-num text-[28px] font-semibold leading-none">{value}</span>
      {hint && <span className="text-xs fx-subtle">{hint}</span>}
    </Comp>
  );
};
