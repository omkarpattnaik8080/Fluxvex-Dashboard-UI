import { request } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";
import * as mock from "@/mocks/resolvers/dashboard.resolver";

/** Dashboard data access — mirrors NestJS `DashboardController`. */
export const dashboardService = {
  getOverview: (filters) => request(() => mock.getOverview(filters), { url: ENDPOINTS.dashboard.overview, params: filters }),
  getPulse: (filters) => request(() => mock.getPulse(filters), { url: ENDPOINTS.dashboard.pulse, params: filters }),
  getAttention: () => request(() => mock.getAttention(), { url: ENDPOINTS.dashboard.attention }),
  explore: (question, filters) =>
    request(() => mock.explore({ question, filters }), { method: "post", url: ENDPOINTS.dashboard.explore, data: { question, filters } }),
};
