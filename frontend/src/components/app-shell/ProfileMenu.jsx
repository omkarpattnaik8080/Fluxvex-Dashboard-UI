import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BadgeCheck, CreditCard, Info, LogOut, Plus, ToggleLeft, UsersRound, Zap } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PersonAvatar } from "@/components/common/DataViz";
import { CURRENT_USER } from "@/mocks/seed";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const itemCls = "group h-12 cursor-pointer gap-3.5 rounded-[14px] px-3 text-[15px] font-normal text-[var(--app-ink)] outline-none transition-colors duration-200 focus:bg-[#F2F1EE] data-[highlighted]:bg-[#F2F1EE]";
const iconCls = "h-5 w-5 shrink-0 text-[var(--app-ink)] transition-transform duration-200 group-hover:scale-110";

/** Account dropdown — identity card header + grouped actions (reference design). */
export const ProfileMenu = () => {
  const navigate = useNavigate();
  const user = CURRENT_USER;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu" data-testid="profile-menu-trigger" className="rounded-full outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]">
        <PersonAvatar person={user} size={42} ring />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="fx-menu w-[300px] bg-white p-2" data-testid="profile-menu">
        {/* Identity card */}
        <div className="mb-1.5 flex items-center justify-between gap-3 rounded-[18px] border border-[var(--app-border)] px-4 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold tracking-[-0.01em]" data-testid="profile-menu-name">{user.name}</p>
            <p className="truncate text-[14px] fx-subtle">{user.email}</p>
          </div>
          <PersonAvatar person={user} size={50} ring />
        </div>

        <DropdownMenuItem className={itemCls} onSelect={() => navigate(ROUTES.settingsSection("security"))} data-testid="profile-menu-profile">
          <BadgeCheck className={iconCls} fill="currentColor" stroke="white" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onSelect={() => navigate(ROUTES.settingsSection("users"))} data-testid="profile-menu-team">
          <UsersRound className={iconCls} /> Team
          <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[var(--app-border)] bg-[#F7F6F3] text-[var(--app-muted)] transition-colors group-hover:bg-white" aria-label="Invite teammate">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onSelect={() => navigate(ROUTES.settingsSection("usage"))} data-testid="profile-menu-subscription">
          <CreditCard className={iconCls} /> Subscription
          <span className="ml-auto inline-flex h-7 items-center gap-1 rounded-lg border border-[#9BE3A8] bg-[#C9F5CF] px-2 text-[12px] font-bold tracking-wide text-[#0E6B2E]" data-testid="profile-plan-badge">
            <Zap className="h-3 w-3" fill="currentColor" /> {user.plan.toUpperCase()}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onSelect={() => navigate(ROUTES.settings)} data-testid="profile-menu-settings">
          <ToggleLeft className={iconCls} /> Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-1 my-1.5 bg-[var(--app-border)]/70" />

        <DropdownMenuItem className={cn(itemCls)} onSelect={() => toast.info("The Help center is coming soon.")} data-testid="profile-menu-help-center">
          <Info className={iconCls} /> Help center
          <span className="ml-auto rounded-md bg-[var(--app-inset)] px-1.5 py-0.5 text-[10px] font-medium fx-muted">Soon</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onSelect={() => toast.info("Sign out will end your session once authentication is connected to the NestJS API.")} data-testid="profile-menu-sign-out">
          <LogOut className={iconCls} /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
