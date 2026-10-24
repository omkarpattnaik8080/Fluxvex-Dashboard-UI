import { METRICS } from "@/constants/domain";
import { AnimatedNumber } from "@/components/common/DataViz";
import { formatMetric, percentChange } from "@/lib/format";
import { CHART_COLORS } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * KPI strip at the top of Performance Overview. Selecting a metric drives the chart.
 * Unselected values are softened (reference screenshot) but stay readable.
 */
export const MetricTabs = ({ totals, prevTotals, selected, onSelect, compare }) => (
  <div role="tablist" aria-label="Metric" className="grid grid-cols-2 gap-2 rounded-[20px] bg-[#F7F6F3] p-1.5 sm:grid-cols-4">
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
            "group rounded-[16px] px-4 py-3 text-left transition-all duration-300",
            active ? "bg-white shadow-[0_1px_2px_rgba(16,16,20,0.05),0_8px_20px_-8px_rgba(16,16,20,0.12)]" : "hover:bg-white/60",
          )}
        >
          <span className="flex items-center gap-1.5 text-[13px] fx-muted">
            <span className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: CHART_COLORS[m.id] }} aria-hidden />
            {m.label}
          </span>
          <AnimatedNumber value={totals[m.id]} format={(v) => formatMetric(v, m.format, { compact: m.format !== "ratio" })}
            className={cn("mt-2 block text-[30px] transition-colors duration-300", !active && "text-[#A3A8B4] group-hover:text-[var(--app-ink)]")} testId={`metric-value-${m.id}`} />
          {compare && delta !== null && (
            <span className="fx-num mt-1.5 block text-xs font-medium" style={{ color: delta >= 0 ? "var(--app-success)" : "var(--app-danger)" }}>
              {delta >= 0 ? "↗ +" : "↘ "}
              {delta.toFixed(1)}% <span className="font-normal fx-subtle">vs prev.</span>
            </span>
          )}
        </button>
      );
    })}
  </div>
);
