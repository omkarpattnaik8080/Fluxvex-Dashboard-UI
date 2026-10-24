import { DEMO_NOW } from "@/mocks/clock";

/**
 * Deterministic daily metric generator for the sample workspace.
 * The same (client, provider, day) always produces the same numbers so
 * totals reconcile across widgets and filter changes.
 */

const PROVIDER_BASE = {
  google_ads: { spend: 210, cpc: 1.7, cvr: 0.048, aov: 96 },
  meta_ads: { spend: 160, cpc: 0.85, cvr: 0.028, aov: 74 },
  ga4: { sessions: 820, cvr: 0.022 },
};

// Sunday → Saturday traffic shape
const WEEKDAY_FACTOR = [0.72, 1.0, 1.08, 1.18, 1.1, 0.94, 0.78];

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Pseudo-random number in [0, 1) derived from a string seed. */
const rand = (seed) => (hash(seed) % 10000) / 10000;

/** Returns a Date `offset` days before yesterday (offset 0 = yesterday, the last complete day). */
export const dayAt = (offset) => {
  const d = new Date(DEMO_NOW);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 1 - offset);
  return d;
};

/** Metrics for one connected account on one day. */
export function dailyMetrics(clientId, scale, provider, date) {
  const key = `${clientId}:${provider}:${date.toISOString().slice(0, 10)}`;
  const noise = 0.78 + rand(key) * 0.44;
  const weekday = WEEKDAY_FACTOR[date.getDay()];
  const base = PROVIDER_BASE[provider];

  if (provider === "ga4") {
    const clicks = base.sessions * scale * weekday * noise;
    return { spend: 0, clicks, conversions: clicks * base.cvr * (0.85 + rand(`${key}c`) * 0.3), revenue: 0 };
  }

  const spend = base.spend * scale * weekday * noise;
  const clicks = (spend / base.cpc) * (0.9 + rand(`${key}k`) * 0.2);
  const conversions = clicks * base.cvr * (0.8 + rand(`${key}v`) * 0.4);
  return { spend, clicks, conversions, revenue: conversions * base.aov * (0.9 + rand(`${key}r`) * 0.2) };
}
