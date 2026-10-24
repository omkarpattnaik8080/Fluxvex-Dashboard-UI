import { request } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";
import * as mock from "@/mocks/resolvers/reports.resolver";

/** Reports data access — mirrors NestJS `ReportsController`. */
export const reportsService = {
  list: (params) => request(() => mock.listReports(params), { url: ENDPOINTS.reports.list, params }),
  summary: () => request(() => mock.reportSummary(), { url: `${ENDPOINTS.reports.list}/summary` }),
  get: (id) => request(() => mock.getReport(id), { url: ENDPOINTS.reports.detail(id) }),
  create: (data) => request(() => mock.createReports(data), { method: "post", url: ENDPOINTS.reports.list, data }),
  approve: (id) => request(() => mock.approveReport(id), { method: "post", url: ENDPOINTS.reports.approve(id) }),
  send: (id) => request(() => mock.sendReport(id), { method: "post", url: ENDPOINTS.reports.send(id) }),
  retry: (id) => request(() => mock.retryReport(id), { method: "post", url: ENDPOINTS.reports.retry(id) }),
};
