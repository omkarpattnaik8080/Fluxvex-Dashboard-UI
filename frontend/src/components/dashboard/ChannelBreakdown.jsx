import { WidgetCard } from "@/components/common/WidgetCard";
import { PLATFORMS } from "@/constants/domain";
import { formatCurrency, formatNumber } from "@/lib/format";

/** Google Ads / Meta Ads / GA4 split for the selected period (design.md §5.3). */
export const ChannelBreakdown = ({ channels }) => {
  const total = channels.reduce((s, c) => s + c.conversions, 0) || 1;
  return (
    <WidgetCard testId="channel-breakdown" title="Channel Breakdown" subtitle="Share of conversions">
      <ul className="space-y-5">
        {channels.map((c) => {
          const color = PLATFORMS.find((p) => p.id === c.id)?.color;
          const share = (c.conversions / total) * 100;
          return (
            <li key={c.id} data-testid={`channel-row-${c.id}`}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />
                  {c.label}
                </span>
                <span className="fx-num font-semibold">{c.connected ? `${formatNumber(c.conversions)} conv.` : "—"}</span>
              </div>
              {c.connected ? (
                <>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--app-inset)]">
                    <div className="h-full rounded-full fx-stripes transition-[width] duration-300" style={{ width: `${share}%`, color }} />
                  </div>
                  <p className="fx-num mt-1.5 text-xs fx-subtle">
                    {share.toFixed(0)}% · {c.spend ? `${formatCurrency(c.spend)} spend · ${c.roas.toFixed(2)}x ROAS` : `${formatNumber(c.clicks)} sessions`}
                  </p>
                </>
              ) : (
                <p className="mt-1.5 text-xs fx-subtle">No healthy connection in this scope</p>
              )}
            </li>
          );
        })}
      </ul>
    </WidgetCard>
  );
};
