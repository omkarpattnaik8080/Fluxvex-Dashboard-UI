import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotifications } from "@/hooks/queries/useSystemData";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { notificationsService } from "@/services/workspace.service";
import { formatRelative } from "@/lib/format";
import { TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";

const ICONS = { danger: AlertCircle, warning: AlertTriangle, info: Info, success: CheckCircle2 };

/** Notifications dropdown with unread count (design.md §4.3). */
export const NotificationMenu = () => {
  const navigate = useNavigate();
  const { data = [] } = useNotifications();
  const unread = data.filter((n) => !n.read).length;
  const markAll = useWorkspaceMutation(notificationsService.markAllRead, { invalidate: ["notifications"], success: "All notifications marked as read" });
  const markOne = useWorkspaceMutation(notificationsService.markRead, { invalidate: ["notifications"] });

  const open = (n) => {
    if (!n.read) markOne.mutate(n.id);
    navigate(n.href);
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        data-testid="notifications-trigger"
        className="relative flex h-10 w-10 items-center justify-center rounded-[10px] text-[var(--app-muted)] transition-colors hover:bg-[var(--app-inset)] hover:text-[var(--app-ink)]"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span data-testid="notifications-unread-count" className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--app-danger)] px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[400px] max-w-[calc(100vw-24px)] rounded-2xl p-0 fx-pop" data-testid="notifications-panel">
        <div className="flex items-center justify-between border-b border-[var(--app-border)] px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button type="button" disabled={!unread || markAll.isPending} onClick={() => markAll.mutate()} data-testid="notifications-mark-all-read" className="text-[13px] font-medium text-[var(--app-accent)] disabled:text-[var(--app-subtle)]">
            Mark all read
          </button>
        </div>
        <ul className="max-h-[360px] overflow-y-auto py-1">
          {data.map((n) => (
            <NotificationItem key={n.id} n={n} onOpen={() => open(n)} />
          ))}
        </ul>
        <button type="button" onClick={() => navigate("/reports")} className="w-full border-t border-[var(--app-border)] py-3 text-[13px] font-medium text-[var(--app-accent)] hover:bg-[var(--app-inset)]" data-testid="notifications-view-all">
          View all activity
        </button>
      </PopoverContent>
    </Popover>
  );
};

const NotificationItem = ({ n, onOpen }) => {
  const Icon = ICONS[n.kind];
  const tone = TONES[n.kind];
  return (
    <li>
      <button type="button" onClick={onOpen} data-testid={`notification-item-${n.id}`} className={cn("flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--app-inset)]", !n.read && "bg-[var(--app-accent-wash)]/40")}>
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: tone.bg, color: tone.fg }}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{n.title}</span>
            <span className="shrink-0 text-xs fx-subtle">{formatRelative(n.createdAt)}</span>
          </span>
          <span className="mt-0.5 block text-[13px] fx-muted">{n.detail}</span>
        </span>
        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--app-accent)]" aria-label="Unread" />}
      </button>
    </li>
  );
};
