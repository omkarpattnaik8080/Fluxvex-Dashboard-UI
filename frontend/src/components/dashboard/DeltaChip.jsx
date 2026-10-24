import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** "▲ 15%" style change chip used next to KPI values. */
export const DeltaChip = ({ value, className, testId }) => {
  if (value === null || value === undefined || Number.isNaN(value)) return <span className="text-xs fx-subtle">—</span>;
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      data-testid={testId}
      className={cn("fx-num inline-flex h-6 items-center gap-0.5 rounded-lg border border-[var(--app-border)] bg-white px-1.5 text-xs font-medium", className)}
      style={{ color: up ? "var(--app-success)" : "var(--app-danger)" }}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};
