import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/common/DataViz";
import { formatNumber } from "@/lib/format";

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

/** Summary metric card (reference "Active shoppers" style): label, big count-up number, hint. */
export const SummaryCard = ({ label, value, hint, icon: Icon, tone, active, onClick, testId, delay = 0 }) => {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-testid={testId}
      style={{ "--fx-delay": `${delay}ms` }}
      className={cn(
        "fx-card fx-rise group flex flex-col gap-5 p-6 text-left",
        onClick && "fx-lift",
        active && "!border-[var(--app-accent)] ring-4 ring-[var(--app-accent-wash)]",
      )}
    >
      <span className="flex items-center justify-between gap-2 text-[14px] fx-muted">
        {label}
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110" style={{ color: tone, background: "#F5F4F0" }}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </span>
      {typeof value === "number" ? <AnimatedNumber value={value} format={formatNumber} className="text-[44px]" /> : <span className="fx-display text-[44px]">{value}</span>}
      {hint && <span className="-mt-3 text-xs fx-subtle">{hint}</span>}
    </Comp>
  );
};
