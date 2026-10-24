import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/** Fluxvex mark + wordmark (design.md §4.1 — 36–40px mark). */
export const BrandLogo = () => (
  <Link to={ROUTES.dashboard} className="flex items-center gap-2.5" data-testid="brand-logo-link" aria-label="Fluxvex home">
    <img src="/brand/fluxvex-icon.png" alt="" className="h-9 w-9 rounded-[10px]" />
    <span className="text-[19px] font-semibold tracking-[-0.03em]">fluxvex</span>
  </Link>
);
