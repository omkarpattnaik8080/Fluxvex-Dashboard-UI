import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METRICS } from "@/constants/domain";
import { CHART_COLORS } from "@/lib/tones";
import { formatDate, formatMetric, percentChange } from "@/lib/format";

const prevKey = (metric) => `prev${metric[0].toUpperCase()}${metric.slice(1)}`;

/**
 * Hatched bar chart (reference screenshot) with a dashed previous-period line.
 * The hovered bar turns solid accent; tooltip shows exact & comparison values.
 */
export const PerformanceChart = ({ data, metric, showCurrent, showPrevious }) => {
  const meta = METRICS.find((m) => m.id === metric);
  const color = CHART_COLORS[metric];
  const rows = data.map((d) => ({ ...d, label: formatDate(d.date, data.length > 31 ? "MMM dd" : "EEE dd") }));

  return (
    <div className="h-[280px] w-full" data-testid="performance-chart" role="img" aria-label={`${meta.label} over time`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 16, right: 4, left: 0, bottom: 0 }} barCategoryGap={data.length > 31 ? "12%" : "18%"}>
          <defs>
            <pattern id={`hatch-${metric}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill={`${color}14`} />
              <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2.4" />
            </pattern>
          </defs>
          <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 5" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }} minTickGap={18} dy={6} />
          <YAxis tickLine={false} axisLine={false} width={48} tick={{ fill: CHART_COLORS.axis, fontSize: 11 }}
            tickFormatter={(v) => formatMetric(v, meta.format, { compact: true })} />
          <Tooltip cursor={{ fill: "rgba(61,67,232,0.05)" }} content={<ChartTooltip meta={meta} showPrevious={showPrevious} />} />
          {showCurrent && (
            <Bar dataKey={metric} fill={`url(#hatch-${metric})`} stroke={color} strokeOpacity={0.35} radius={[8, 8, 2, 2]}
              activeBar={{ fill: color, stroke: color }} maxBarSize={64} isAnimationActive animationDuration={260} />
          )}
          {showPrevious && (
            <Line dataKey={prevKey(metric)} type="monotone" stroke={CHART_COLORS.previous} strokeDasharray="4 4" strokeWidth={1.75} dot={false} isAnimationActive animationDuration={260} />
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
    <div className="rounded-xl border border-[var(--app-border)] bg-white px-3 py-2.5 text-xs fx-pop" data-testid="performance-chart-tooltip">
      <p className="mb-1 font-medium">{formatDate(d.date, "EEE, dd MMM yyyy")}</p>
      <p className="fx-num">
        <span className="fx-muted">{meta.label}: </span>
        <span className="font-semibold">{formatMetric(cur, meta.format === "currency" ? "currency" : meta.format)}</span>
      </p>
      {showPrevious && (
        <p className="fx-num fx-muted">
          Previous: {formatMetric(prev, meta.format)}
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
    <div className="max-h-[280px] overflow-auto rounded-xl border border-[var(--app-border)]" data-testid="performance-table">
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
