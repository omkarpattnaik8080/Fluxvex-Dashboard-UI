import { WidgetCard } from "@/components/common/WidgetCard";
import { AnimatedNumber, Rings } from "@/components/common/DataViz";
import { PLATFORMS } from "@/constants/domain";
import { formatCurrency, formatNumber } from "@/lib/format";

/** Concentric ring breakdown of conversions by channel (reference "Stock sold" card). */
export const ChannelBreakdown = ({ channels, delay }) => {
  const total = channels.reduce((s, c) => s + c.conversions, 0) || 1;
  const rows = channels.map((c) => ({ ...c, color: PLATFORMS.find((p) => p.id === c.id)?.color, share: c.conversions / total }));
  const top = [...rows].sort((a, b) => b.share - a.share).slice(0, 2);

  return (
    <WidgetCard testId="channel-breakdown" title="Channel Breakdown" subtitle="Share of conversions" delay={delay}>
      <div className="flex gap-8">
        {top.map((c) => (
          <div key={c.id}>
            <AnimatedNumber value={c.share * 100} format={(v) => `${Math.round(v)}%`} className="block text-[36px]" />
            <p className="mt-1 text-[13px] fx-subtle">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-6">
        <Rings rings={rows.map((c) => ({ id: c.id, value: c.connected ? c.share : 0, color: c.color }))} size={168} stroke={13} gap={7}>
          <span className="fx-display text-[22px]">{formatNumber(total)}</span>
          <span className="text-[11px] fx-subtle">conversions</span>
        </Rings>
        <ul className="min-w-0 flex-1 space-y-3">
          {rows.map((c) => (
            <li key={c.id} data-testid={`channel-row-${c.id}`} className="rounded-[14px] border border-[var(--app-border)] px-3 py-2 transition-colors hover:bg-[#F7F6F3]">
              <p className="flex items-center gap-2 text-[13px] font-medium"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.label}</p>
              <p className="fx-num mt-0.5 truncate text-xs fx-subtle">
                {!c.connected ? "Not connected" : c.spend ? `${formatCurrency(c.spend)} · ${c.roas.toFixed(2)}x ROAS` : `${formatNumber(c.clicks)} sessions`}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </WidgetCard>
  );
};
