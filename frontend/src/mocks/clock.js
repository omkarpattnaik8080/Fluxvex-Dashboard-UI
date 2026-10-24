/**
 * Fixed "now" for the sample workspace so every seeded date stays coherent
 * (design.md §14 — one coherent seed dataset). Remove once data comes from NestJS.
 */
export const DEMO_NOW = new Date();
DEMO_NOW.setMinutes(0, 0, 0);

/** ISO string offset from DEMO_NOW by days (+ optional hours). */
export const daysFromNow = (days, hours = 0) => {
  const d = new Date(DEMO_NOW);
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};
