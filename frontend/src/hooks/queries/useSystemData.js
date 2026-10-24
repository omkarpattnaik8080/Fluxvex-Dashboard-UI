import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";
import { templatesService, notificationsService, settingsService, searchService } from "@/services/workspace.service";

/* Templates, notifications, settings & search queries. */
export const useTemplates = (params = {}) =>
  useQuery({ queryKey: QK.templates(params), queryFn: () => templatesService.list(params), placeholderData: keepPreviousData });
export const useTemplate = (id) => useQuery({ queryKey: QK.template(id), queryFn: () => templatesService.get(id), enabled: !!id });
export const useNotifications = () => useQuery({ queryKey: QK.notifications, queryFn: notificationsService.list });
export const useSettings = () => useQuery({ queryKey: QK.settings, queryFn: settingsService.get });
export const useConnections = () => useQuery({ queryKey: QK.connections, queryFn: settingsService.connections });
export const useGlobalSearch = (q) =>
  useQuery({ queryKey: QK.search(q), queryFn: () => searchService.query(q), enabled: q.trim().length > 0, placeholderData: keepPreviousData });
