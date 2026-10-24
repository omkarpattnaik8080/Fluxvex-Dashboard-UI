import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Standard dashboard card: title, optional subtitle, optional right slot and overflow menu.
 * @param {{ label: string, onSelect: () => void }[]} menu
 */
export const WidgetCard = ({ title, subtitle, actions, menu, children, className, bodyClassName, testId }) => (
  <section data-testid={testId} className={cn("fx-card fx-rise flex h-full flex-col", className)} aria-label={title}>
    <header className="flex items-start justify-between gap-3 px-6 pt-5">
      <div className="min-w-0">
        <h2 className="text-[17px] font-semibold leading-6">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] fx-subtle">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {menu?.length > 0 && <OverflowMenu items={menu} label={`${title} options`} testId={testId ? `${testId}-menu` : undefined} />}
      </div>
    </header>
    <div className={cn("flex-1 px-6 pb-6 pt-4", bodyClassName)}>{children}</div>
  </section>
);

/** "•••" overflow menu used on cards and table rows. */
export const OverflowMenu = ({ items, label = "More options", testId, align = "end" }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label={label}
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--app-muted)] transition-colors hover:bg-[var(--app-inset)] hover:text-[var(--app-ink)]"
    >
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align={align} className="min-w-[180px] rounded-xl fx-pop" onClick={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <DropdownMenuItem
          key={item.label}
          disabled={item.disabled}
          onSelect={item.onSelect}
          className={cn("cursor-pointer rounded-lg text-[13px]", item.destructive && "text-[var(--app-danger)] focus:text-[var(--app-danger)]")}
          data-testid={`menu-item-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
