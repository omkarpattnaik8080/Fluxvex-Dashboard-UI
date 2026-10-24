/** Domain enums & display metadata shared by every feature. */

export const PLATFORMS = [
  { id: "google_ads", label: "Google Ads", short: "G Ads", color: "#2F6FEB" },
  { id: "meta_ads", label: "Meta Ads", short: "Meta", color: "#7B7FFF" },
  { id: "ga4", label: "GA4", short: "GA4", color: "#C77812" },
];

export const platformLabel = (id) => PLATFORMS.find((p) => p.id === id)?.label ?? id;

export const DATE_RANGES = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "14d", label: "Last 14 days", days: 14 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
];

/** Chart palette (design.md §5.4) — never hard-code series colours elsewhere. */
export const METRICS = [
  { id: "spend", label: "Spend", format: "currency", color: "var(--app-accent)" },
  { id: "clicks", label: "Clicks", format: "number", color: "var(--app-danger)" },
  { id: "conversions", label: "Conversions", format: "number", color: "var(--app-accent-soft)" },
  { id: "roas", label: "ROAS", format: "ratio", color: "var(--app-success)" },
];

/** Status vocabulary (design.md §10 — Status badges). */
export const STATUS = {
  healthy: { label: "Healthy", tone: "success" },
  connected: { label: "Connected", tone: "success" },
  setup_incomplete: { label: "Setup incomplete", tone: "warning" },
  reconnect_required: { label: "Reconnect required", tone: "danger" },
  expired: { label: "Connection expired", tone: "danger" },
  permission_error: { label: "Permission error", tone: "danger" },
  not_connected: { label: "Not connected", tone: "neutral" },
  needs_review: { label: "Needs review", tone: "warning" },
  approved: { label: "Approved", tone: "info" },
  scheduled: { label: "Scheduled", tone: "accent" },
  sent: { label: "Sent", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  generating: { label: "Generating", tone: "neutral" },
  not_verified: { label: "Not verified", tone: "danger" },
  verifying: { label: "Verifying", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  pending: { label: "Invite pending", tone: "warning" },
  active: { label: "Active", tone: "success" },
};

export const REPORT_TABS = [
  { id: "all", label: "All Reports" },
  { id: "needs_review", label: "Needs Review" },
  { id: "approved", label: "Approved" },
  { id: "scheduled", label: "Scheduled" },
  { id: "sent", label: "Sent" },
  { id: "failed", label: "Failed" },
];

export const TIMEZONES = ["Europe/London", "America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Australia/Sydney"];
export const COUNTRIES = ["United Kingdom", "United States", "Germany", "United Arab Emirates", "India", "Australia", "Canada"];
