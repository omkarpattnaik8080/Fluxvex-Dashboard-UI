import { NavLink } from "react-router-dom";
import { PRIMARY_NAV } from "@/constants/routes";
import { cn } from "@/lib/utils";

/** Desktop horizontal navigation. Active = indigo wash + indigo text (single consistent style). */
export const PrimaryNav = ({ className, onNavigate, vertical = false }) => (
  <nav aria-label="Primary" className={cn("flex gap-1", vertical && "flex-col", className)}>
    {PRIMARY_NAV.map(({ label, to, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onNavigate}
        data-testid={`nav-link-${label.toLowerCase()}`}
        className={({ isActive }) =>
          cn(
            "flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-sm font-medium transition-colors duration-200",
            isActive
              ? "bg-[var(--app-accent-wash)] text-[var(--app-accent)]"
              : "text-[var(--app-muted)] hover:bg-[var(--app-inset)] hover:text-[var(--app-ink)]",
          )
        }
      >
        <Icon className="h-4 w-4" />
        {label}
      </NavLink>
    ))}
  </nav>
);
