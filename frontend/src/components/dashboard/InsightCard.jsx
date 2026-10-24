import { Lightbulb } from "lucide-react";
import { AnimatedNumber } from "@/components/common/DataViz";

/**
 * Key insight card — the screenshot's "75%" hero, rendered as a solid indigo
 * surface (design.md: no gradients) with a slowly floating Fluxvex arrow mark.
 */
export const InsightCard = ({ insight, delay = 0 }) => (
  <section data-testid="insight-card" aria-label="Key insight" style={{ "--fx-delay": `${delay}ms` }}
    className="fx-rise fx-lift relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[24px] bg-[var(--app-accent)] p-7 text-white shadow-[0_24px_48px_-20px_rgba(61,67,232,0.55)]">
    <svg aria-hidden viewBox="0 0 120 120" className="fx-float absolute -right-8 -top-8 h-56 w-56 opacity-[0.16]">
      <path d="M30 18h64a8 8 0 0 1 8 8v64a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V52C80 74 62 92 34 94a6 6 0 0 1-6-6v-6a6 6 0 0 1 5-6c18-3 30-14 38-34H30a6 6 0 0 1-6-6v-2a6 6 0 0 1 6-6Z" fill="none" stroke="white" strokeWidth="2.5" />
    </svg>
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
      <Lightbulb className="h-3.5 w-3.5" /> Insight
    </span>
    <AnimatedNumber value={insight.value} testId="insight-value" className="mt-auto block pt-8 text-[76px]"
      format={(v) => `${insight.direction === "down" ? "−" : "+"}${v.toFixed(insight.value < 10 ? 1 : 0)}%`} />
    <p className="mt-4 text-[17px] font-medium leading-snug" data-testid="insight-title">{insight.title}</p>
    <p className="mt-2 text-[13px] leading-relaxed text-white/75">{insight.detail}</p>
    <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/20" aria-label={`Top client share ${(insight.share * 100).toFixed(0)}%`}>
      <div className="fx-grow-x h-full rounded-full bg-white" style={{ width: `${Math.min(insight.share * 100, 100)}%`, "--fx-delay": `${delay + 300}ms` }} />
    </div>
  </section>
);
