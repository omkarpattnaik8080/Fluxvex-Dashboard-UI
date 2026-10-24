import { WidgetCard } from "@/components/common/WidgetCard";
import { formatCompact, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const ROWS = 7;

/**
 * Dot-matrix weekday distribution (reference "Transactions" / "Customers" cards).
 * Each column is a weekday; the peak column is highlighted and labelled.
 */
const DotMatrix = ({ data, valueKey, color }) => {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  const peak = data.reduce((best, d, i) => (d[valueKey] > data[best][valueKey] ? i : best), 0);
  return (
    <div className="flex items-end gap-1.5" role="img" aria-label={`Peak day ${data[peak].label}`}>
      {data.map((d, i) => {
        const filled = d[valueKey] ? Math.max(1, Math.round((d[valueKey] / max) * ROWS)) : 0;
        return (
          <div key={d.label} className="relative flex flex-col-reverse items-center gap-1" title={`${d.label}: ${formatNumber(d[valueKey])}`}>
            {i === peak && (
              <span className="absolute -top-7 whitespace-nowrap rounded-md border border-[var(--app-border)] bg-white px-1.5 py-0.5 text-[10px] font-medium fx-pop">
                Peak: <b className="font-semibold">{d.label}</b>
              </span>
            )}
            {Array.from({ length: ROWS }).map((_, r) => (
              <span key={r} className="h-[7px] w-[7px] rounded-[2px]"
                style={{ background: r < filled ? color : "var(--app-inset)", opacity: r < filled ? (i === peak ? 1 : 0.42) : 1 }} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Compact KPI card: value · weekday dots · vs last period. */
export const TrendDotsCard = ({ title, value, previous, data, valueKey, color, testId, className }) => {
  const diff = value - previous;
  return (
    <WidgetCard testId={testId} title={title} subtitle="By weekday" className={className} bodyClassName="pt-2">
      <div className="flex items-end justify-between gap-3 pt-5">
        <span className="fx-num text-[36px] font-semibold leading-none tracking-[-0.02em]" data-testid={`${testId}-value`}>{formatCompact(value)}</span>
        <DotMatrix data={data} valueKey={valueKey} color={color} />
        <span className="text-right">
          <span className="block text-[11px] fx-subtle">vs last period</span>
          <span className={cn("fx-num text-[15px] font-semibold")} style={{ color: diff >= 0 ? "var(--app-success)" : "var(--app-danger)" }}>
            {diff >= 0 ? "+" : "−"}
            {formatNumber(Math.abs(diff))}
          </span>
        </span>
      </div>
    </WidgetCard>
  );
};
