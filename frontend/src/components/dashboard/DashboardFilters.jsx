import { Settings2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DATE_RANGES, PLATFORMS } from "@/constants/domain";
import { useClients } from "@/hooks/queries/useWorkspaceData";
import { formatDateRange } from "@/lib/format";

export const DASHBOARD_WIDGETS = [
  { id: "attention", label: "Needs your attention" },
  { id: "trends", label: "Conversion & click trends" },
  { id: "insight", label: "Key insight" },
  { id: "channels", label: "Channel breakdown" },
  { id: "recent", label: "Recent reports" },
  { id: "quickActions", label: "Quick actions" },
];

const triggerCls = "h-10 w-auto min-w-[150px] gap-2 rounded-[10px] border-[var(--app-border)] bg-white text-[13px] font-medium";

/** Overview filter bar: client · platform · date range · compare · customise (design.md §5.2). */
export const DashboardFilters = ({ filters, onChange, range, widgets, onWidgetsChange }) => {
  const { data: clients = [] } = useClients();
  const set = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="dashboard-filters">
      <FilterSelect value={filters.clientId} onChange={set("clientId")} testId="filter-client" label="Client"
        options={[{ id: "all", label: "All clients" }, ...clients.map((c) => ({ id: c.id, label: c.name }))]} />
      <FilterSelect value={filters.platform} onChange={set("platform")} testId="filter-platform" label="Platform"
        options={[{ id: "all", label: "All platforms" }, ...PLATFORMS]} />
      <FilterSelect value={filters.range} onChange={set("range")} testId="filter-range" label="Date range" options={DATE_RANGES} />

      <label className="flex h-10 items-center gap-2 rounded-[10px] border border-[var(--app-border)] bg-white px-3 text-[13px]">
        <Switch checked={filters.compare} onCheckedChange={set("compare")} data-testid="filter-compare-toggle" aria-label="Compare to previous period" className="data-[state=checked]:bg-[var(--app-accent)]" />
        <span className="fx-muted">Compared to</span>
        <span className="fx-num font-medium">{range && filters.compare ? formatDateRange(range.prevStart, range.prevEnd) : "Off"}</span>
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger data-testid="customize-widgets-trigger" className="flex h-10 items-center gap-2 rounded-[10px] border border-[var(--app-border)] bg-white px-3 text-[13px] font-medium transition-colors hover:bg-[var(--app-inset)]">
          <Settings2 className="h-4 w-4" /> Customize
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 rounded-xl fx-pop">
          <DropdownMenuLabel className="text-xs fx-muted">Visible widgets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {DASHBOARD_WIDGETS.map((w) => (
            <DropdownMenuCheckboxItem key={w.id} checked={widgets[w.id]} onSelect={(e) => e.preventDefault()}
              onCheckedChange={(v) => onWidgetsChange({ ...widgets, [w.id]: v })} className="rounded-lg text-[13px]" data-testid={`widget-toggle-${w.id}`}>
              {w.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const FilterSelect = ({ value, onChange, options, testId, label }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={triggerCls} data-testid={testId} aria-label={label}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="rounded-xl">
      {options.map((o) => (
        <SelectItem key={o.id} value={o.id} className="rounded-lg text-[13px]" data-testid={`${testId}-option-${o.id}`}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
