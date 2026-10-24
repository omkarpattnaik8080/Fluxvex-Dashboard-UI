import { useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SampleDataBadge } from "@/components/common/PageHeader";
import { SkeletonCard, ErrorState } from "@/components/common/States";
import { DashboardFilters, DASHBOARD_WIDGETS } from "@/components/dashboard/DashboardFilters";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { ReportingPulse } from "@/components/dashboard/ReportingPulse";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { TrendDotsCard } from "@/components/dashboard/TrendDotsCard";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { ChannelBreakdown } from "@/components/dashboard/ChannelBreakdown";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAttention, useOverview, usePulse } from "@/hooks/queries/useWorkspaceData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DATE_RANGES } from "@/constants/domain";
import { CHART_COLORS } from "@/lib/tones";

const DEFAULT_FILTERS = { clientId: "all", platform: "all", range: "7d", compare: true };
const ALL_WIDGETS = Object.fromEntries(DASHBOARD_WIDGETS.map((w) => [w.id, true]));

/** Overview dashboard — 12-col modular grid (design.md §5.3). */
export default function DashboardPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [widgets, setWidgets] = useLocalStorage("fx.dashboard.widgets", ALL_WIDGETS);
  const overview = useOverview(filters);
  const pulse = usePulse({ clientId: filters.clientId, range: filters.range });
  const attention = useAttention();
  const rangeLabel = DATE_RANGES.find((r) => r.id === filters.range).label;

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Dashboard link copied");
  };

  return (
    <div data-testid="dashboard-page">
      <PageHeader
        title="Overview"
        description="Monitor campaign performance and reporting health across your clients."
        badge={
          <div className="flex items-center gap-2">
            <button type="button" onClick={copyLink} aria-label="Copy dashboard link" data-testid="copy-dashboard-link" className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--app-border)] bg-white transition-colors hover:bg-[var(--app-inset)]">
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <SampleDataBadge />
          </div>
        }
        actions={<DashboardFilters filters={filters} onChange={setFilters} range={overview.data?.range} widgets={widgets} onWidgetsChange={setWidgets} />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Row 1 — primary analytics 8/4 */}
        <div className="lg:col-span-8">
          {overview.isLoading ? <SkeletonCard className="h-[520px]" lines={8} /> : overview.isError ? <div className="fx-card"><ErrorState message="Performance data couldn't load." onRetry={overview.refetch} /></div> : (
            <PerformanceOverview data={overview.data} filters={filters} onRefresh={overview.refetch} />
          )}
        </div>
        <div className="lg:col-span-4">
          {pulse.isLoading ? <SkeletonCard className="h-full" lines={6} /> : pulse.isError ? <div className="fx-card"><ErrorState onRetry={pulse.refetch} /></div> : <ReportingPulse data={pulse.data} rangeLabel={rangeLabel} />}
        </div>

        {/* Row 2 — operational widgets */}
        {widgets.attention && (
          <div className="lg:col-span-4">{attention.isLoading ? <SkeletonCard lines={5} /> : <NeedsAttention items={attention.data ?? []} />}</div>
        )}
        {widgets.trends && overview.data && (
          <div className="flex flex-col gap-5 lg:col-span-4">
            <TrendDotsCard testId="trend-conversions" title="Conversions" value={overview.data.totals.conversions} previous={overview.data.prevTotals.conversions} data={overview.data.weekday} valueKey="conversions" color={CHART_COLORS.roas} className="flex-1" />
            <TrendDotsCard testId="trend-clicks" title="Clicks" value={overview.data.totals.clicks} previous={overview.data.prevTotals.clicks} data={overview.data.weekday} valueKey="clicks" color={CHART_COLORS.spend} className="flex-1" />
          </div>
        )}
        {widgets.insight && overview.data && <div className="lg:col-span-4"><InsightCard insight={overview.data.insight} /></div>}

        {/* Row 3 — supporting detail */}
        {widgets.channels && overview.data && <div className="lg:col-span-4"><ChannelBreakdown channels={overview.data.channels} /></div>}
        {widgets.recent && <div className="lg:col-span-5"><RecentReports clientId={filters.clientId} /></div>}
        {widgets.quickActions && <div className="lg:col-span-3"><QuickActions /></div>}
      </div>
    </div>
  );
}
