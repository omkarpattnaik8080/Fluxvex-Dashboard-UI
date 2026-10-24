import { useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METRICS } from "@/constants/domain";
import { CHART_COLORS } from "@/lib/tones";
import { formatDate, formatMetric, percentChange } from "@/lib/format";

const prevKey = (metric) => `prev${metric[0].toUpperCase()}${metric.slice(1)}`;

/**
 * Soft pill bars (reference "Monthly sales" card): the latest / hovered bar is solid,
 * the rest a light tint. A dashed line shows the previous period.
 */
export const PerformanceChart = ({ data, metric, showCurrent, showPrevious }) => {
  const meta = METRICS.find((m) => m.id === metric);
  const color = CHART_COLORS[metric];
  const [hover, setHover] = useState(null);
  const highlight = hover ?? data.length - 1;
  const rows = data.map((d) => ({ ...d, label: formatDate(d.date, data.length > 31 ? "MMM dd" : "EEE dd") }));

  return (
    <div className="h-[280px] w-full" data-testid="performance-chart" role="img" aria-label={`${meta.label} over time`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 16, right: 4, left: 0, bottom: 0 }} barCategoryGap={data.length > 31 ? "14%" : "26%"}
          onMouseMove={(s) => setHover(s?.activeTooltipIndex ?? null)} onMouseLeave={() => setHover(null)}>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="2 6" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: CHART_COLORS.axis, fontSize: 12 }} minTickGap={18} dy={8} />
          <YAxis tickLine={false} axisLine={false} width={48} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} tickFormatter={(v) => formatMetric(v, meta.format, { compact: true })} />
          <Tooltip cursor={false} content={<ChartTooltip meta={meta} showPrevious={showPrevious} />} />
          {showCurrent && (
            <Bar dataKey={metric} radius={[14, 14, 14, 14]} maxBarSize={58} isAnimationActive animationDuration={900} animationEasing="ease-out">
              {rows.map((d, i) => <Cell key={d.date} fill={i === highlight ? color : `${color}26`} style={{ transition: "fill 250ms ease" }} />)}
            </Bar>
          )}
          {showPrevious && (
            <Line dataKey={prevKey(metric)} type="monotone" stroke={CHART_COLORS.previous} strokeDasharray="4 5" strokeWidth={1.75} dot={false} isAnimationActive animationDuration={900} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChartTooltip = ({ active, payload, meta, showPrevious }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const cur = d[meta.id];
  const prev = d[prevKey(meta.id)];
  const change = percentChange(cur, prev);
  return (
    <div className="rounded-[14px] border border-[var(--app-border)] bg-white px-3.5 py-3 text-xs fx-pop" data-testid="performance-chart-tooltip">
      <p className="mb-1.5 flex items-center gap-1.5 font-medium"><span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[meta.id] }} />{formatDate(d.date, "EEE, dd MMM yyyy")}</p>
      <p className="fx-num text-[15px] font-semibold">{formatMetric(cur, meta.format)}</p>
      {showPrevious && (
        <p className="fx-num mt-0.5 fx-muted">
          Prev. {formatMetric(prev, meta.format)}
          {change !== null && <span style={{ color: change >= 0 ? "var(--app-success)" : "var(--app-danger)" }}> ({change >= 0 ? "+" : ""}{change.toFixed(1)}%)</span>}
        </p>
      )}
    </div>
  );
};

/** Accessible table equivalent of the chart data (design.md §5.4). */
export const PerformanceTable = ({ data, metric }) => {
  const meta = METRICS.find((m) => m.id === metric);
  return (
    <div className="max-h-[280px] overflow-auto rounded-[16px] border border-[var(--app-border)]" data-testid="performance-table">
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 bg-[var(--app-inset)] text-xs fx-muted">
          <tr><th className="px-3 py-2 text-left font-medium">Date</th><th className="px-3 py-2 text-right font-medium">{meta.label}</th><th className="px-3 py-2 text-right font-medium">Previous</th></tr>
        </thead>
        <tbody className="fx-num">
          {data.map((d) => (
            <tr key={d.date} className="border-t border-[var(--app-border)]">
              <td className="px-3 py-2">{formatDate(d.date, "EEE, dd MMM")}</td>
              <td className="px-3 py-2 text-right font-medium">{formatMetric(d[metric], meta.format)}</td>
              <td className="px-3 py-2 text-right fx-muted">{formatMetric(d[prevKey(metric)], meta.format)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
