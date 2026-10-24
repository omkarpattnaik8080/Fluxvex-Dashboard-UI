import { METRICS } from "@/constants/domain";
import { formatMetric, percentChange } from "@/lib/format";
import { CHART_COLORS } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * KPI strip at the top of Performance Overview. Selecting a metric drives the chart.
 * Unselected values are softened (reference screenshot) but stay readable.
 */
export const MetricTabs = ({ totals, prevTotals, selected, onSelect, compare }) => (
  <div role="tablist" aria-label="Metric" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
    {METRICS.map((m) => {
      const active = selected === m.id;
      const delta = percentChange(totals[m.id], prevTotals[m.id]);
      return (
        <button
          key={m.id}
          role="tab"
          aria-selected={active}
          onClick={() => onSelect(m.id)}
          data-testid={`metric-tab-${m.id}`}
          className={cn(
            "group rounded-xl px-3 py-2.5 text-left transition-colors duration-200",
            active ? "bg-[var(--app-accent-wash)]" : "hover:bg-[var(--app-inset)]",
          )}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium fx-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[m.id] }} aria-hidden />
            {m.label}
          </span>
          <span className={cn("fx-num mt-1 block text-[24px] font-semibold leading-tight", !active && "text-[#9AA0AE] group-hover:text-[var(--app-ink)]")} data-testid={`metric-value-${m.id}`}>
            {formatMetric(totals[m.id], m.format, { compact: m.format !== "ratio" })}
          </span>
          {compare && delta !== null && (
            <span className="fx-num text-xs font-medium" style={{ color: delta >= 0 ? "var(--app-success)" : "var(--app-danger)" }}>
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}% <span className="font-normal fx-subtle">vs prev.</span>
            </span>
          )}
        </button>
      );
    })}
  </div>
);
