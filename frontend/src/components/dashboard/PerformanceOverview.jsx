import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, PlugZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/common/WidgetCard";
import { EmptyState } from "@/components/common/States";
import { MetricTabs } from "@/components/dashboard/MetricTabs";
import { PerformanceChart, PerformanceTable } from "@/components/dashboard/PerformanceChart";
import { ExploreAssistant } from "@/components/dashboard/ExploreAssistant";
import { CHART_COLORS } from "@/lib/tones";
import { formatDateRange, formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Dominant analytics card — KPI strip, chart, legend and explore bar (design.md §5.4). */
export const PerformanceOverview = ({ data, filters, onRefresh }) => {
  const [metric, setMetric] = useState("spend");
  const [series, setSeries] = useState({ current: true, previous: true });
  const [asTable, setAsTable] = useState(false);
  const showPrevious = filters.compare && series.previous;

  const menu = [
    { label: asTable ? "Show chart" : "View as table", onSelect: () => setAsTable((v) => !v) },
    { label: "Refresh data", onSelect: onRefresh },
  ];

  return (
    <WidgetCard testId="performance-overview" title="Performance Overview" menu={menu}
      subtitle={`${formatDateRange(data.range.start, data.range.end)} · ${data.accountCount} connected accounts · synced ${formatRelative(data.lastSyncAt)}`}>
      {data.accountCount === 0 ? (
        <EmptyState icon={PlugZap} title="No performance data for this scope" testId="performance-empty"
          description="None of the selected clients have a healthy connection for this platform. Connect or reconnect an account to see results."
          action={<Button asChild size="sm"><Link to="/settings?section=connections">Open connections</Link></Button>} />
      ) : (
        <div className="space-y-4">
          <MetricTabs totals={data.totals} prevTotals={data.prevTotals} selected={metric} onSelect={setMetric} compare={filters.compare} />
          {data.missing.length > 0 && <MissingDataNote missing={data.missing} />}
          {asTable ? <PerformanceTable data={data.series} metric={metric} /> : <PerformanceChart data={data.series} metric={metric} showCurrent={series.current} showPrevious={showPrevious} />}
          <Legend metric={metric} series={series} onToggle={(k) => setSeries((s) => ({ ...s, [k]: !s[k] }))} compare={filters.compare} />
          <ExploreAssistant filters={filters} />
        </div>
      )}
    </WidgetCard>
  );
};

/** Partial data annotation — names exactly which channel is missing (design.md §5.8). */
const MissingDataNote = ({ missing }) => (
  <div className="flex items-start gap-2 rounded-xl bg-[var(--app-warning-wash)] px-3 py-2 text-[13px] text-[var(--app-warning)]" data-testid="performance-missing-note">
    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
    <span>
      Incomplete data: {missing.map((m) => `${m.clientName} (${m.provider})`).join(", ")} {missing.length > 1 ? "are" : "is"} disconnected and excluded.{" "}
      <Link to="/settings?section=connections" className="font-medium underline underline-offset-2">Reconnect</Link>
    </span>
  </div>
);

const Legend = ({ metric, series, onToggle, compare }) => (
  <div className="flex flex-wrap items-center gap-2 text-xs" aria-label="Chart series">
    <LegendItem active={series.current} onClick={() => onToggle("current")} testId="legend-current">
      <span className="h-2.5 w-4 rounded-sm fx-stripes" style={{ color: CHART_COLORS[metric] }} /> Current period
    </LegendItem>
    {compare && (
      <LegendItem active={series.previous} onClick={() => onToggle("previous")} testId="legend-previous">
        <span className="w-4 border-t-2 border-dashed" style={{ borderColor: CHART_COLORS.previous }} /> Previous period
      </LegendItem>
    )}
  </div>
);

const LegendItem = ({ active, onClick, children, testId }) => (
  <button type="button" onClick={onClick} aria-pressed={active} data-testid={testId}
    className={cn("flex h-7 items-center gap-2 rounded-lg border border-[var(--app-border)] px-2.5 font-medium transition-opacity", !active && "opacity-45")}>
    {children}
  </button>
);
