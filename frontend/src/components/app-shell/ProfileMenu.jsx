import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CURRENT_USER } from "@/mocks/seed";
import { ROUTES } from "@/constants/routes";

/** Account dropdown (design.md §4.4). Unavailable items are disabled and labelled "Upcoming". */
export const ProfileMenu = () => {
  const navigate = useNavigate();
  const user = CURRENT_USER;

  const items = [
    { label: "Profile", onSelect: () => navigate(ROUTES.settingsSection("security")) },
    { label: "Subscription", onSelect: () => navigate(ROUTES.settingsSection("usage")) },
    { label: "Settings", onSelect: () => navigate(ROUTES.settings) },
    { label: "Help center", upcoming: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account menu" data-testid="profile-menu-trigger" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-semibold text-white ring-offset-2 transition-shadow hover:ring-2 hover:ring-[var(--app-focus)]">
        {user.initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl fx-pop" data-testid="profile-menu">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs fx-muted">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.label} disabled={item.upcoming} onSelect={item.onSelect} className="cursor-pointer justify-between rounded-lg text-[13px]" data-testid={`profile-menu-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
            {item.label}
            {item.upcoming && <span className="rounded-md bg-[var(--app-inset)] px-1.5 text-[10px] font-medium">Upcoming</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => toast.info("Sign out will end your session once authentication is connected to the NestJS API.")}
          className="cursor-pointer rounded-lg text-[13px] text-[var(--app-danger)] focus:text-[var(--app-danger)]"
          data-testid="profile-menu-sign-out"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
