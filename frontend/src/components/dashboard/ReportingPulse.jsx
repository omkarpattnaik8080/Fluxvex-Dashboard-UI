import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { DeltaChip } from "@/components/dashboard/DeltaChip";
import { TONES } from "@/lib/tones";

/**
 * Reporting Pulse — mirrors the "Gross Volume" card: big headline value,
 * then clickable rows with hatched progress bars (design.md §5.5).
 */
export const ReportingPulse = ({ data, rangeLabel }) => (
  <WidgetCard testId="reporting-pulse" title="Reporting Pulse" subtitle={`Report delivery · ${rangeLabel}`}>
    <div className="flex items-end gap-3">
      <span className="fx-num text-[44px] font-semibold leading-none tracking-[-0.02em]" data-testid="pulse-sent-value">{data.sent}</span>
      <span className="mb-1 text-[13px] fx-muted">reports sent</span>
      <DeltaChip value={data.sentDelta} className="mb-1" testId="pulse-sent-delta" />
    </div>

    <ul className="mt-6 space-y-1">
      {data.rows.map((row) => (
        <li key={row.id}>
          <Link to={row.href} data-testid={`pulse-row-${row.id}`} className="group block rounded-xl px-2 py-2.5 -mx-2 transition-colors hover:bg-[var(--app-inset)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-medium">{row.label}</span>
              <span className="flex items-center gap-1">
                <span className="fx-num text-[15px] font-semibold">{row.value}</span>
                <ChevronRight className="h-4 w-4 text-[var(--app-subtle)] transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--app-inset)]">
              <div className="h-full rounded-full fx-stripes transition-[width] duration-300" style={{ width: `${Math.max(row.share * 100, row.value ? 6 : 0)}%`, color: TONES[row.tone].hex }} />
            </div>
            <p className="mt-1.5 text-xs fx-subtle">{row.context}</p>
          </Link>
        </li>
      ))}
    </ul>
  </WidgetCard>
);
