import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { AnimatedNumber, TrendPill } from "@/components/common/DataViz";
import { formatNumber } from "@/lib/format";
import { TONES } from "@/lib/tones";

/**
 * Reporting Pulse — big headline value with trend pill, then clickable rows
 * with animated rounded progress bars (reference "SS24 progress" card).
 */
export const ReportingPulse = ({ data, rangeLabel, delay }) => (
  <WidgetCard testId="reporting-pulse" title="Reporting Pulse" subtitle={`Report delivery · ${rangeLabel}`} delay={delay} bodyClassName="flex flex-col">
    <div className="pt-2">
      <AnimatedNumber value={data.sent} format={formatNumber} className="block text-[72px]" testId="pulse-sent-value" />
      <div className="mt-3 flex items-center gap-3">
        <TrendPill value={data.sentDelta} label=" vs previous" testId="pulse-sent-delta" />
      </div>
      <p className="mt-1 text-[13px] fx-subtle">reports delivered to clients</p>
    </div>

    <ul className="mt-auto space-y-1 pt-6">
      {data.rows.map((row, i) => {
        const pct = Math.round(row.share * 100);
        const color = TONES[row.tone].hex;
        return (
          <li key={row.id}>
            <Link to={row.href} data-testid={`pulse-row-${row.id}`} className="group -mx-3 block rounded-[16px] px-3 py-2.5 transition-colors duration-200 hover:bg-[#F7F6F3]">
              <div className="flex items-center justify-between gap-2 text-[14px]">
                <span className="flex items-center gap-1">{row.label}<ChevronRight className="h-3.5 w-3.5 text-[var(--app-subtle)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" /></span>
                <span className="fx-num"><b className="font-semibold">{row.value}</b> <span style={{ color }}>· {pct}%</span></span>
              </div>
              <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-[#EFEEEA]">
                <div className="fx-grow-x h-full rounded-full" style={{ width: `${Math.max(pct, row.value ? 5 : 0)}%`, background: color, "--fx-delay": `${200 + i * 120}ms` }} />
              </div>
              <p className="mt-1.5 text-xs fx-subtle">{row.context}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  </WidgetCard>
);
