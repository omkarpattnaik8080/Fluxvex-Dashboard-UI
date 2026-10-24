/** Semantic tone → token mapping used by badges, pulse rows and icons. */
export const TONES = {
  success: { fg: "var(--app-success)", bg: "var(--app-success-wash)", hex: "#159A60" },
  warning: { fg: "var(--app-warning)", bg: "var(--app-warning-wash)", hex: "#C77812" },
  danger: { fg: "var(--app-danger)", bg: "var(--app-danger-wash)", hex: "#D94355" },
  info: { fg: "var(--app-info)", bg: "var(--app-info-wash)", hex: "#2F6FEB" },
  accent: { fg: "var(--app-accent)", bg: "var(--app-accent-wash)", hex: "#3D43E8" },
  neutral: { fg: "var(--app-muted)", bg: "var(--app-inset)", hex: "#9299A8" },
};

/** Hex chart palette (SVG attributes don't reliably resolve CSS variables). */
export const CHART_COLORS = {
  spend: "#3D43E8",
  clicks: "#D94355",
  conversions: "#7B7FFF",
  roas: "#159A60",
  previous: "#9299A8",
  grid: "#E7E5DE",
  axis: "#9299A8",
};
