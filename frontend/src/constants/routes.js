import { LayoutGrid, Users, FileText, LayoutTemplate, Settings } from "lucide-react";

/** Application routes (kept in one place so links never drift). */
export const ROUTES = {
  dashboard: "/",
  clients: "/clients",
  clientDetail: (id) => `/clients/${id}`,
  reports: "/reports",
  templates: "/templates",
  templatePreview: (id) => `/templates/${id}`,
  settings: "/settings",
  settingsSection: (section) => `/settings?section=${section}`,
};

/** Primary header navigation (design.md §4.1). */
export const PRIMARY_NAV = [
  { label: "Dashboard", to: ROUTES.dashboard, icon: LayoutGrid, end: true },
  { label: "Clients", to: ROUTES.clients, icon: Users },
  { label: "Reports", to: ROUTES.reports, icon: FileText },
  { label: "Templates", to: ROUTES.templates, icon: LayoutTemplate },
  { label: "Settings", to: ROUTES.settings, icon: Settings },
];
