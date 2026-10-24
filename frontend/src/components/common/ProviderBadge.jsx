import { PLATFORMS } from "@/constants/domain";

/** Compact provider chip (Google Ads, Meta Ads, GA4). */
export const ProviderBadge = ({ provider, compact = false }) => {
  const p = PLATFORMS.find((x) => x.id === provider);
  if (!p) return null;
  return (
    <span
      data-testid={`provider-badge-${provider}`}
      title={p.label}
      className="inline-flex h-6 items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-white px-2 text-xs font-medium text-[var(--app-ink)]"
    >
      <span className="h-2 w-2 rounded-[3px]" style={{ background: p.color }} aria-hidden />
      {compact ? p.short : p.label}
    </span>
  );
};
