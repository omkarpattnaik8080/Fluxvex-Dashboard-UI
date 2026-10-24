/** Centralised react-query keys — invalidate by prefix after mutations. */
export const QK = {
  overview: (filters) => ["dashboard", "overview", filters],
  pulse: (filters) => ["dashboard", "pulse", filters],
  attention: ["dashboard", "attention"],
  clients: (params) => ["clients", "list", params],
  clientSummary: ["clients", "summary"],
  client: (id) => ["clients", "detail", id],
  reports: (params) => ["reports", "list", params],
  reportSummary: ["reports", "summary"],
  templates: (params) => ["templates", "list", params],
  template: (id) => ["templates", "detail", id],
  notifications: ["notifications"],
  settings: ["settings"],
  connections: ["connections"],
  search: (q) => ["search", q],
};
