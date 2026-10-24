import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, AlertTriangle, Archive, Bell, CheckCircle2, Info, Inbox, Loader2, Paperclip, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PersonAvatar } from "@/components/common/DataViz";
import { useNotifications } from "@/hooks/queries/useSystemData";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { notificationsService } from "@/services/workspace.service";
import { formatRelative } from "@/lib/format";
import { TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";

const SYSTEM_ICONS = { danger: AlertCircle, warning: AlertTriangle, info: Info, success: CheckCircle2 };
const TABS = [
  { id: "inbox", label: "Inbox", filter: (n) => n.category === "inbox" && !n.archived },
  { id: "general", label: "General", filter: (n) => n.category === "general" && !n.archived },
  { id: "archived", label: "Archived", filter: (n) => n.archived },
];
const ACTION_SUCCESS = { accept: "Access granted", decline: "Request declined", reconnect: "Account reconnected", dismiss: "Notification dismissed" };

/** Notifications popover — tabs, actor avatars, inline actions & attachments (reference design). */
export const NotificationMenu = () => {
  const [tab, setTab] = useState("inbox");
  const { data = [] } = useNotifications();
  const inboxUnread = data.filter((n) => TABS[0].filter(n) && !n.read).length;
  const unreadTotal = data.filter((n) => !n.read && !n.archived).length;
  const markAll = useWorkspaceMutation(notificationsService.markAllRead, { invalidate: ["notifications"], success: "All notifications marked as read" });
  const list = data.filter(TABS.find((t) => t.id === tab).filter);

  return (
    <Popover>
      <PopoverTrigger aria-label={`Notifications${unreadTotal ? `, ${unreadTotal} unread` : ""}`} data-testid="notifications-trigger"
        className="relative flex h-10 w-10 items-center justify-center rounded-[12px] text-[var(--app-muted)] transition-colors hover:bg-[var(--app-inset)] hover:text-[var(--app-ink)] data-[state=open]:bg-[#ECEBE7] data-[state=open]:text-[var(--app-ink)]">
        <Bell className="h-[19px] w-[19px]" />
        {unreadTotal > 0 && <span data-testid="notifications-unread-count" className="fx-ping absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--app-accent)]"><span className="sr-only">{unreadTotal}</span></span>}
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={10} className="fx-menu w-[440px] max-w-[calc(100vw-24px)] overflow-hidden bg-white p-0" data-testid="notifications-panel">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <p className="text-[16px] font-semibold tracking-[-0.01em]">Notifications</p>
          <button type="button" disabled={!unreadTotal || markAll.isPending} onClick={() => markAll.mutate()} data-testid="notifications-mark-all-read"
            className="text-[14px] text-[var(--app-muted)] transition-colors hover:text-[var(--app-ink)] disabled:opacity-50">Mark all as read</button>
        </div>

        <div role="tablist" className="flex items-center gap-5 border-b border-[var(--app-border)] px-5">
          {TABS.map((t, i) => {
            const count = t.id === "inbox" ? inboxUnread : t.id === "general" ? data.filter(t.filter).length : null;
            const active = tab === t.id;
            return (
              <div key={t.id} className="flex items-center gap-5">
                {i === 2 && <span className="h-4 w-px bg-[var(--app-border)]" aria-hidden />}
                <button role="tab" aria-selected={active} onClick={() => setTab(t.id)} data-testid={`notifications-tab-${t.id}`}
                  className={cn("-mb-px flex items-center gap-1.5 border-b-2 py-2.5 text-[14px] transition-colors", active ? "border-[var(--app-ink)] font-medium text-[var(--app-ink)]" : "border-transparent text-[var(--app-muted)] hover:text-[var(--app-ink)]")}>
                  {t.label}
                  {count > 0 && (
                    <span className={cn("fx-num flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold", t.id === "inbox" ? "bg-[var(--app-ink)] text-white" : "border border-[var(--app-border)] text-[var(--app-muted)]")}>{count}</span>
                  )}
                </button>
              </div>
            );
          })}
          <Link to="/settings?section=usage" aria-label="Notification settings" className="ml-auto rounded-lg p-1.5 text-[var(--app-muted)] transition-transform duration-300 hover:rotate-45 hover:text-[var(--app-ink)]" data-testid="notifications-settings-link">
            <Settings className="h-[18px] w-[18px]" />
          </Link>
        </div>

        <ul className="max-h-[440px] divide-y divide-[var(--app-border)] overflow-y-auto" data-testid={`notifications-list-${tab}`}>
          {list.map((n, i) => <NotificationItem key={n.id} n={n} index={i} />)}
          {list.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--app-inset)]"><Inbox className="h-5 w-5 fx-muted" /></span>
              <p className="text-sm font-medium">You're all caught up</p>
              <p className="text-[13px] fx-subtle">Nothing in {TABS.find((t) => t.id === tab).label.toLowerCase()} right now.</p>
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

const NotificationItem = ({ n, index }) => {
  const navigate = useNavigate();
  const markOne = useWorkspaceMutation(notificationsService.markRead, { invalidate: ["notifications"] });
  const archive = useWorkspaceMutation(notificationsService.archive, { invalidate: ["notifications"], success: "Moved to archive" });
  const act = useWorkspaceMutation(notificationsService.act, { invalidate: ["notifications", "settings", "connections", "clients", "dashboard"], success: (_, v) => ACTION_SUCCESS[v.actionId] });

  const open = () => {
    if (!n.read) markOne.mutate(n.id);
    navigate(n.href);
  };

  return (
    <li className={cn("group relative fx-rise", !n.read && "bg-[#F6F5FF]")} style={{ "--fx-delay": `${index * 40}ms` }} data-testid={`notification-item-${n.id}`}>
      <div role="button" tabIndex={0} onClick={open} onKeyDown={(e) => e.key === "Enter" && open()} className="flex cursor-pointer gap-3.5 px-5 py-3.5 transition-colors hover:bg-[#F4F3EF]">
        <NotificationAvatar n={n} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug text-[var(--app-muted)]">
            {n.actor && <span className="font-medium text-[var(--app-ink)]">{n.actor.name} </span>}
            {n.verb} <span className="font-medium text-[var(--app-ink)]">{n.target}</span>{n.suffix && ` ${n.suffix}`}
          </p>
          <p className="mt-0.5 text-[13px] fx-subtle">{formatRelative(n.createdAt)} • {n.context}</p>
          {n.attachment && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] fx-muted"><Paperclip className="h-3.5 w-3.5" />{n.attachment}</span>
          )}
          {n.actions?.length > 0 && (
            <div className="mt-2.5 flex gap-2" onClick={(e) => e.stopPropagation()}>
              {n.actions.map((a) => (
                <button key={a.id} type="button" disabled={act.isPending} onClick={() => act.mutate({ id: n.id, actionId: a.id })} data-testid={`notification-action-${n.id}-${a.id}`}
                  className={cn("inline-flex h-8 items-center gap-1.5 rounded-[10px] px-3 text-[13px] font-medium transition-all duration-200 active:scale-95 disabled:opacity-60",
                    a.primary ? "bg-[var(--app-accent)] text-white hover:brightness-110" : "border border-[var(--app-border)] bg-white text-[var(--app-ink)] hover:bg-[var(--app-inset)]")}>
                  {act.isPending && act.variables?.actionId === a.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{a.label}
                </button>
              ))}
            </div>
          )}
          {n.resolution && <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--app-success)]"><CheckCircle2 className="h-3.5 w-3.5" />{n.resolution}</p>}
        </div>
        <div className="flex w-6 shrink-0 flex-col items-center justify-center">
          {!n.read && <span className="h-2 w-2 rounded-full bg-[var(--app-accent)] group-hover:hidden" aria-label="Unread" />}
          {!n.archived && (
            <button type="button" aria-label="Archive" onClick={(e) => { e.stopPropagation(); archive.mutate(n.id); }} data-testid={`notification-archive-${n.id}`}
              className="hidden rounded-md p-1 text-[var(--app-muted)] hover:bg-white hover:text-[var(--app-ink)] group-hover:block">
              <Archive className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

const NotificationAvatar = ({ n }) => {
  if (n.actor) return <PersonAvatar person={n.actor} size={44} />;
  const Icon = SYSTEM_ICONS[n.system];
  const tone = TONES[n.system];
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: tone.bg, color: tone.fg }}>
      <Icon className="h-5 w-5" />
    </span>
  );
};
