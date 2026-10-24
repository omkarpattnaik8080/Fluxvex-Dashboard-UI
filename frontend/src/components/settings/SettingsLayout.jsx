import { Building2, ShieldCheck, Users, Send, Scale, Gauge, Plug, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const SETTINGS_SECTIONS = [
  { id: "agency", label: "Agency Profile", description: "Branding and regional defaults", icon: Building2 },
  { id: "security", label: "Account & Security", description: "Sign-in and sessions", icon: ShieldCheck },
  { id: "users", label: "Users & Roles", description: "Team access", icon: Users },
  { id: "destinations", label: "Export Destinations", description: "Where reports go", icon: Send },
  { id: "governance", label: "Governance & Policies", description: "Approval and retention", icon: Scale },
  { id: "usage", label: "Usage & Alerts", description: "Limits and notifications", icon: Gauge },
  { id: "connections", label: "Connections", description: "Ad & analytics accounts", icon: Plug },
  { id: "email", label: "Email", description: "White-label sending", icon: Mail },
];

/** Left settings navigation; becomes a select on mobile (design.md §9). */
export const SettingsNav = ({ active, onChange }) => (
  <>
    <div className="lg:hidden">
      <Select value={active} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-[10px] bg-white" data-testid="settings-mobile-select" aria-label="Settings category"><SelectValue /></SelectTrigger>
        <SelectContent className="rounded-xl">{SETTINGS_SECTIONS.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    <nav aria-label="Settings" className="fx-card hidden h-fit p-2 lg:sticky lg:top-24 lg:block">
      {SETTINGS_SECTIONS.map(({ id, label, description, icon: Icon }) => (
        <button key={id} type="button" onClick={() => onChange(id)} aria-current={active === id ? "page" : undefined} data-testid={`settings-nav-${id}`}
          className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", active === id ? "bg-[var(--app-accent-wash)] text-[var(--app-accent)]" : "hover:bg-[var(--app-inset)]")}>
          <Icon className={cn("h-4 w-4 shrink-0", active !== id && "text-[var(--app-muted)]")} />
          <span className="min-w-0"><span className="block text-[13px] font-medium">{label}</span><span className={cn("block truncate text-xs", active === id ? "text-[var(--app-accent)]/70" : "fx-subtle")}>{description}</span></span>
        </button>
      ))}
    </nav>
  </>
);

/** Title + explanation + accessible switch. `checked` always reflects saved server state. */
export const ToggleRow = ({ id, title, description, checked, onChange, disabled, note, testId }) => (
  <div className="flex items-start justify-between gap-6 py-4">
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-medium">{title}</label>
      <p className="mt-0.5 text-[13px] fx-muted">{description}</p>
      {note && <p className="mt-1 text-xs text-[var(--app-warning)]">{note}</p>}
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} data-testid={testId ?? `toggle-${id}`} className="mt-0.5 data-[state=checked]:bg-[var(--app-accent)]" />
  </div>
);

/** Section shell inside the settings content panel. */
export const SettingsPanel = ({ title, description, children, footer, testId }) => (
  <section className="fx-card fx-rise" data-testid={testId}>
    <header className="border-b border-[var(--app-border)] px-6 py-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] fx-muted">{description}</p>}
    </header>
    <div className="px-6 py-5">{children}</div>
    {footer && <footer className="flex items-center justify-end gap-2 border-t border-[var(--app-border)] px-6 py-4">{footer}</footer>}
  </section>
);
