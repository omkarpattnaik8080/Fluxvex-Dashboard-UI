import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Calm empty state with one clear next action (design.md §5.8). */
export const EmptyState = ({ icon: Icon, title, description, action, className, testId = "empty-state" }) => (
  <div data-testid={testId} className={cn("flex flex-col items-center justify-center gap-3 px-6 py-10 text-center", className)}>
    {Icon && (
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--app-inset)] text-[var(--app-muted)]">
        <Icon className="h-5 w-5" />
      </span>
    )}
    <div className="space-y-1">
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="mx-auto max-w-sm text-[13px] fx-muted">{description}</p>}
    </div>
    {action}
  </div>
);

/** Inline widget-level error with retry (never fails the whole page). */
export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div data-testid="error-state" className="flex flex-col items-center gap-3 px-6 py-10 text-center">
    <AlertTriangle className="h-5 w-5 text-[var(--app-danger)]" />
    <p className="text-[13px] fx-muted">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry} data-testid="error-retry-button">
        <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Retry
      </Button>
    )}
  </div>
);

/** Skeleton that matches the card it replaces. */
export const SkeletonCard = ({ className, lines = 3 }) => (
  <div className={cn("fx-card space-y-4 p-6", className)} data-testid="skeleton-card">
    <Skeleton className="h-5 w-40 bg-[var(--app-inset)]" />
    <Skeleton className="h-9 w-32 bg-[var(--app-inset)]" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full bg-[var(--app-inset)]" />
    ))}
  </div>
);
