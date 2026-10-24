import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Standard dashboard card (24px radius, soft shadow, hover lift, staggered entrance).
 * @param {{ label: string, onSelect: () => void }[]} menu
 * @param {number} delay entrance delay in ms (for staggered reveals)
 */
export const WidgetCard = ({ title, subtitle, actions, menu, children, className, bodyClassName, testId, delay = 0 }) => (
  <section data-testid={testId} className={cn("fx-card fx-rise fx-lift flex h-full flex-col", className)} style={{ "--fx-delay": `${delay}ms` }} aria-label={title}>
    <header className="flex items-start justify-between gap-3 px-7 pt-6">
      <div className="min-w-0">
        <h2 className="text-[17px] font-medium leading-6 tracking-[-0.01em]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[14px] fx-subtle">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        {menu?.length > 0 && <OverflowMenu items={menu} label={`${title} options`} testId={testId ? `${testId}-menu` : undefined} />}
      </div>
    </header>
    <div className={cn("flex-1 px-7 pb-7 pt-4", bodyClassName)}>{children}</div>
  </section>
);

/** "•••" overflow menu used on cards and table rows. */
export const OverflowMenu = ({ items, label = "More options", testId, align = "end" }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label={label}
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-[var(--app-inset)] hover:text-[var(--app-ink)]"
    >
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align={align} className="fx-menu min-w-[190px] rounded-[18px] bg-white p-1.5" onClick={(e) => e.stopPropagation()}>
      {items.map((item) => (
        <DropdownMenuItem
          key={item.label}
          disabled={item.disabled}
          onSelect={item.onSelect}
          className={cn("h-10 cursor-pointer rounded-[12px] px-3 text-[13px]", item.destructive && "text-[var(--app-danger)] focus:text-[var(--app-danger)]")}
          data-testid={`menu-item-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
