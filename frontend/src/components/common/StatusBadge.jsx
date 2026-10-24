import { STATUS } from "@/constants/domain";
import { TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";

/** Low-height semantic pill. Always shows text so status never relies on colour alone. */
export const StatusBadge = ({ status, label, tone, className, testId }) => {
  const meta = STATUS[status] ?? { label: label ?? status, tone: tone ?? "neutral" };
  const t = TONES[tone ?? meta.tone];
  return (
    <span
      data-testid={testId ?? `status-badge-${status}`}
      className={cn("inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-xs font-medium", className)}
      style={{ color: t.fg, background: t.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.fg }} aria-hidden />
      {label ?? meta.label}
    </span>
  );
};
