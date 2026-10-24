import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ClientAvatar } from "@/components/common/ClientAvatar";
import { EmptyState } from "@/components/common/States";
import { formatRelative } from "@/lib/format";

const VISIBLE = 4;

/** Prioritised issues list with a direct action per row (design.md §5.6). */
export const NeedsAttention = ({ items }) => {
  const navigate = useNavigate();
  return (
    <WidgetCard testId="needs-attention" title="Needs Your Attention" subtitle={`${items.length} open items`}
      menu={[{ label: "View all reports", onSelect: () => navigate("/reports") }, { label: "Open connections", onSelect: () => navigate("/settings?section=connections") }]}>
      {items.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Everything is running smoothly" description="All connections are syncing and no reports need review." />
      ) : (
        <>
          <ul className="-mx-2 divide-y divide-[var(--app-border)]">
            {items.slice(0, VISIBLE).map((item) => (
              <li key={item.id}>
                <Link to={item.href} data-testid={`attention-item-${item.id}`} className="group flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-[var(--app-inset)]">
                  <ClientAvatar name={item.clientName} size={34} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{item.clientName}</span>
                      <StatusBadge label={item.label} tone={item.tone} status={`attention-${item.label.toLowerCase()}`} />
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] fx-muted">{item.issue}</span>
                    <span className="block text-xs fx-subtle">{item.timestampLabel} {formatRelative(item.timestamp)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[var(--app-accent)]">
                    {item.action} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {items.length > VISIBLE && (
            <Link to="/reports" className="mt-3 inline-block text-[13px] font-medium text-[var(--app-accent)]" data-testid="attention-view-all">
              View all {items.length} items
            </Link>
          )}
        </>
      )}
    </WidgetCard>
  );
};
