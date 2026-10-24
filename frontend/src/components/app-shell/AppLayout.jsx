import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/app-shell/BrandLogo";
import { PrimaryNav } from "@/components/app-shell/PrimaryNav";
import { GlobalSearch } from "@/components/app-shell/GlobalSearch";
import { NotificationMenu } from "@/components/app-shell/NotificationMenu";
import { ProfileMenu } from "@/components/app-shell/ProfileMenu";

/** Sticky 72px header: logo · nav · search · notifications · profile (design.md §4.1). */
const AppHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-white/95 backdrop-blur" data-testid="app-header">
      <div className="mx-auto flex h-[72px] max-w-[1680px] items-center gap-6 px-4 md:px-5 xl:px-7">
        {/* Mobile / tablet menu trigger */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger aria-label="Open menu" data-testid="mobile-menu-trigger" className="flex h-10 w-10 items-center justify-center rounded-[10px] hover:bg-[var(--app-inset)] lg:hidden">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-5">
            <SheetTitle className="mb-6"><BrandLogo /></SheetTitle>
            <PrimaryNav vertical onNavigate={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <BrandLogo />
        <PrimaryNav className="hidden lg:flex" />
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <GlobalSearch />
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

/** Authenticated application shell. */
export const AppLayout = () => (
  <div className="min-h-screen bg-[var(--app-canvas)]">
    <AppHeader />
    <main className="mx-auto max-w-[1680px] px-4 pb-16 pt-8 md:px-5 xl:px-7">
      <Outlet />
    </main>
  </div>
);
