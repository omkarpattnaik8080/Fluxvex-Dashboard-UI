import { request } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";
import * as mock from "@/mocks/resolvers/workspace.resolver";

/** Templates — mirrors NestJS `TemplatesController`. */
export const templatesService = {
  list: (params) => request(() => mock.listTemplates(params), { url: ENDPOINTS.templates.list, params }),
  get: (id) => request(() => mock.getTemplate(id), { url: ENDPOINTS.templates.detail(id) }),
  save: (id, data) => request(() => mock.saveTemplate(id, data), { method: "patch", url: ENDPOINTS.templates.detail(id), data }),
};

/** Notifications — mirrors NestJS `NotificationsController`. */
export const notificationsService = {
  list: () => request(() => mock.listNotifications(), { url: ENDPOINTS.notifications.list }),
  markAllRead: () => request(() => mock.markAllNotificationsRead(), { method: "post", url: ENDPOINTS.notifications.readAll }),
  markRead: (id) => request(() => mock.markNotificationRead(id), { method: "post", url: `${ENDPOINTS.notifications.list}/${id}/read` }),
  archive: (id) => request(() => mock.archiveNotification(id), { method: "post", url: `${ENDPOINTS.notifications.list}/${id}/archive` }),
  act: ({ id, actionId }) => request(() => mock.runNotificationAction(id, actionId), { method: "post", url: `${ENDPOINTS.notifications.list}/${id}/actions/${actionId}` }),
};

/** Settings & connections — mirrors NestJS `SettingsController` / `ConnectionsController`. */
export const settingsService = {
  get: () => request(() => mock.getSettings(), { url: ENDPOINTS.settings.all }),
  update: (section, data) => request(() => mock.updateSettingsSection(section, data), { method: "patch", url: ENDPOINTS.settings.section(section), data }),
  invite: (data) => request(() => mock.inviteMember(data), { method: "post", url: ENDPOINTS.settings.invite, data }),
  removeMember: (id) => request(() => mock.removeMember(id), { method: "delete", url: ENDPOINTS.settings.member(id) }),
  verifyDomain: () => request(() => mock.verifyDomain(), { method: "post", url: ENDPOINTS.settings.verifyDomain }),
  connections: () => request(() => mock.listConnections(), { url: "/connections" }),
  sync: (id) => request(() => mock.syncConnection(id), { method: "post", url: ENDPOINTS.settings.sync(id) }),
  reconnect: (id) => request(() => mock.reconnectConnection(id), { method: "post", url: ENDPOINTS.settings.reconnect(id) }),
  disconnect: (id) => request(() => mock.disconnectConnection(id), { method: "delete", url: ENDPOINTS.settings.disconnect(id) }),
};

/** Global search — mirrors NestJS `SearchController`. */
export const searchService = {
  query: (q) => request(() => mock.globalSearch(q), { url: ENDPOINTS.search, params: { q } }),
};
