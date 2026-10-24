/**
 * REST contract expected from the NestJS backend.
 * Each group maps 1:1 to a Nest module/controller (e.g. ClientsModule -> ClientsController).
 */
export const ENDPOINTS = {
  dashboard: {
    overview: "/dashboard/overview", // GET  ?clientId&platform&range&compare
    pulse: "/dashboard/pulse", // GET  ?clientId&range
    attention: "/dashboard/attention", // GET
    explore: "/dashboard/explore", // POST { question, filters }
  },
  clients: {
    list: "/clients", // GET, POST
    detail: (id) => `/clients/${id}`, // GET, PATCH, DELETE
    import: "/clients/import", // POST { rows[] }
  },
  reports: {
    list: "/reports", // GET, POST
    detail: (id) => `/reports/${id}`, // GET
    approve: (id) => `/reports/${id}/approve`, // POST
    send: (id) => `/reports/${id}/send`, // POST
    retry: (id) => `/reports/${id}/retry`, // POST
  },
  templates: {
    list: "/templates", // GET
    detail: (id) => `/templates/${id}`, // GET, PATCH
  },
  notifications: {
    list: "/notifications", // GET
    readAll: "/notifications/read-all", // POST
  },
  settings: {
    all: "/settings", // GET
    section: (section) => `/settings/${section}`, // PATCH
    invite: "/settings/users/invite", // POST
    member: (id) => `/settings/users/${id}`, // DELETE
    sync: (id) => `/connections/${id}/sync`, // POST
    reconnect: (id) => `/connections/${id}/reconnect`, // POST
    disconnect: (id) => `/connections/${id}`, // DELETE
    verifyDomain: "/settings/email/verify", // POST
  },
  search: "/search", // GET ?q
  me: "/auth/me", // GET
};
