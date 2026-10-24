import { request } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";
import * as mock from "@/mocks/resolvers/clients.resolver";

/** Clients data access — mirrors NestJS `ClientsController`. */
export const clientsService = {
  list: (params) => request(() => mock.listClients(params), { url: ENDPOINTS.clients.list, params }),
  summary: () => request(() => mock.clientSummary(), { url: `${ENDPOINTS.clients.list}/summary` }),
  get: (id) => request(() => mock.getClient(id), { url: ENDPOINTS.clients.detail(id) }),
  create: (data) => request(() => mock.createClient(data), { method: "post", url: ENDPOINTS.clients.list, data }),
  update: (id, data) => request(() => mock.updateClient(id, data), { method: "patch", url: ENDPOINTS.clients.detail(id), data }),
  remove: (id) => request(() => mock.deleteClient(id), { method: "delete", url: ENDPOINTS.clients.detail(id) }),
  import: (rows) => request(() => mock.importClients(rows), { method: "post", url: ENDPOINTS.clients.import, data: { rows } }),
};
