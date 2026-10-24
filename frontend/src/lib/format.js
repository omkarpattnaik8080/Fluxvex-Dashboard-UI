import { differenceInMinutes, format, parseISO } from "date-fns";
import { DEMO_NOW } from "@/mocks/clock";

/** Formatting helpers — always tabular & locale-aware (design.md §14). */

const toDate = (value) => (typeof value === "string" ? parseISO(value) : value);

export const formatCurrency = (value, currency = "USD", digits = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value ?? 0);

export const formatNumber = (value) => new Intl.NumberFormat("en-US").format(Math.round(value ?? 0));

export const formatCompact = (value) =>
  Math.abs(value ?? 0) < 1000
    ? formatNumber(value)
    : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const formatPercent = (value, digits = 1) => `${(value ?? 0).toFixed(digits)}%`;

export const formatRatio = (value) => `${(value ?? 0).toFixed(2)}x`;

/** Formats a metric according to its METRICS `format` key. */
export const formatMetric = (value, kind, { compact = false } = {}) => {
  if (kind === "currency") return compact ? `$${formatCompact(value)}` : formatCurrency(value);
  if (kind === "ratio") return formatRatio(value);
  return compact ? formatCompact(value) : formatNumber(value);
};

export const formatDate = (value, pattern = "dd MMM yyyy") => (value ? format(toDate(value), pattern) : "—");

export const formatDateRange = (start, end) => `${formatDate(start, "MMM dd")} – ${formatDate(end, "MMM dd")}`;

/** "5m ago", "3h ago", "2d ago" relative to the demo workspace clock. */
export const formatRelative = (value) => {
  if (!value) return "Never";
  const minutes = differenceInMinutes(DEMO_NOW, toDate(value));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / (60 * 24))}d ago`;
};

/** Percentage change helper; returns null when the previous value is 0. */
export const percentChange = (current, previous) => (previous ? ((current - previous) / previous) * 100 : null);
