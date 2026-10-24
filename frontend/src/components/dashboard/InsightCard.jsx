import { Lightbulb } from "lucide-react";

/**
 * Key insight card — the screenshot's "75%" hero, rendered as a solid indigo
 * surface (design.md: no gradients) with a faint Fluxvex arrow mark.
 */
export const InsightCard = ({ insight }) => (
  <section data-testid="insight-card" aria-label="Key insight"
    className="fx-rise relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl bg-[var(--app-accent)] p-6 text-white">
    <svg aria-hidden viewBox="0 0 120 120" className="absolute -right-6 -top-6 h-48 w-48 opacity-[0.14]">
      <path d="M30 18h64a8 8 0 0 1 8 8v64a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V52C80 74 62 92 34 94a6 6 0 0 1-6-6v-6a6 6 0 0 1 5-6c18-3 30-14 38-34H30a6 6 0 0 1-6-6v-2a6 6 0 0 1 6-6Z" fill="none" stroke="white" strokeWidth="3" />
    </svg>
    <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-xs font-medium">
      <Lightbulb className="h-3.5 w-3.5" /> Insight
    </span>
    <p className="fx-num mt-auto pt-8 text-[64px] font-semibold leading-none tracking-[-0.03em]" data-testid="insight-value">
      {insight.direction === "down" ? "−" : "+"}
      {insight.value.toFixed(insight.value < 10 ? 1 : 0)}%
    </p>
    <p className="mt-3 text-[17px] font-semibold leading-snug" data-testid="insight-title">{insight.title}</p>
    <p className="mt-2 text-[13px] leading-relaxed text-white/75">{insight.detail}</p>
    <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/20" aria-label={`Top client share ${(insight.share * 100).toFixed(0)}%`}>
      <div className="h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${Math.min(insight.share * 100, 100)}%` }} />
    </div>
  </section>
);
