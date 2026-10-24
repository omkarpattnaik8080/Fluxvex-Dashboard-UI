import { WidgetCard } from "@/components/common/WidgetCard";
import { AnimatedNumber, TrendPill } from "@/components/common/DataViz";
import { formatCompact, formatNumber, percentChange } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Weekday distribution as soft pill bars (reference "Monthly sales" card).
 * The peak weekday is solid & labelled; bars grow in with a stagger.
 */
const WeekdayBars = ({ data, valueKey, color }) => {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  const peak = data.reduce((best, d, i) => (d[valueKey] > data[best][valueKey] ? i : best), 0);
  return (
    <div className="flex h-[120px] items-end gap-2.5" role="img" aria-label={`Peak day ${data[peak].label}`}>
      {data.map((d, i) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${d.label}: ${formatNumber(d[valueKey])}`}>
          <div className="relative flex w-full flex-1 items-end">
            <div className="fx-grow-y w-full rounded-[10px] transition-[filter] duration-200 group-hover:brightness-95"
              style={{ height: `${Math.max((d[valueKey] / max) * 100, 6)}%`, background: i === peak ? color : `${color}2E`, "--fx-delay": `${150 + i * 70}ms` }} />
          </div>
          <span className={cn("text-[11px]", i === peak ? "font-medium text-[var(--app-ink)]" : "text-[#B4B8C2]")}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/** KPI card: big value · trend pill · weekday pill bars. */
export const TrendBarsCard = ({ title, value, previous, data, valueKey, color, testId, className, delay }) => (
  <WidgetCard testId={testId} title={title} subtitle="By weekday" className={className} delay={delay}>
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-3">
        <AnimatedNumber value={value} format={formatCompact} className="text-[44px]" testId={`${testId}-value`} />
        <TrendPill value={percentChange(value, previous)} size="sm" testId={`${testId}-delta`} />
      </div>
      <WeekdayBars data={data} valueKey={valueKey} color={color} />
    </div>
  </WidgetCard>
);
