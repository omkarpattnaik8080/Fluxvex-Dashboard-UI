import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { QK } from "@/hooks/queries/queryKeys";
import { dashboardService } from "@/services/dashboard.service";
import { clientsService } from "@/services/clients.service";
import { reportsService } from "@/services/reports.service";

/* ---------------- Dashboard ---------------- */
export const useOverview = (filters) =>
  useQuery({ queryKey: QK.overview(filters), queryFn: () => dashboardService.getOverview(filters), placeholderData: keepPreviousData });
export const usePulse = (filters) =>
  useQuery({ queryKey: QK.pulse(filters), queryFn: () => dashboardService.getPulse(filters), placeholderData: keepPreviousData });
export const useAttention = () => useQuery({ queryKey: QK.attention, queryFn: dashboardService.getAttention });
export const useExplore = () => useMutation({ mutationFn: ({ question, filters }) => dashboardService.explore(question, filters) });

/* ---------------- Clients ---------------- */
export const useClients = (params = {}) =>
  useQuery({ queryKey: QK.clients(params), queryFn: () => clientsService.list(params), placeholderData: keepPreviousData });
export const useClientSummary = () => useQuery({ queryKey: QK.clientSummary, queryFn: clientsService.summary });
export const useClient = (id) => useQuery({ queryKey: QK.client(id), queryFn: () => clientsService.get(id), enabled: !!id });

/* ---------------- Reports ---------------- */
export const useReports = (params = {}) =>
  useQuery({ queryKey: QK.reports(params), queryFn: () => reportsService.list(params), placeholderData: keepPreviousData });
export const useReportSummary = () => useQuery({ queryKey: QK.reportSummary, queryFn: reportsService.summary });

/**
 * Generic mutation wrapper: shows success/error toasts and invalidates
 * the given query prefixes so every dependent widget refreshes.
 */
export function useWorkspaceMutation(mutationFn, { success, invalidate = [], onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data, vars) => {
      invalidate.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
      if (success) toast.success(typeof success === "function" ? success(data, vars) : success);
      onSuccess?.(data, vars);
    },
    onError: (error) => toast.error(error.message),
  });
}
