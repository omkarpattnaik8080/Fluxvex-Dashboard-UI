import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Confirmation for destructive / high-impact actions (design.md §10). */
export const ConfirmDialog = ({ open, onOpenChange, title, description, confirmLabel = "Confirm", destructive, onConfirm }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="rounded-2xl" data-testid="confirm-dialog">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="rounded-[10px]" data-testid="confirm-dialog-cancel">Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} data-testid="confirm-dialog-confirm"
          className={cn("rounded-[10px]", destructive && "bg-[var(--app-danger)] hover:bg-[var(--app-danger)]/90")}>
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/** Label + control + hint/error, wired with aria attributes. */
export const FormField = ({ id, label, required, hint, error, children, className }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label htmlFor={id} className="text-[13px] font-medium">
      {label}
      {required && <span className="text-[var(--app-danger)]"> *</span>}
    </Label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-xs text-[var(--app-danger)]" data-testid={`${id}-error`}>{error}</p>
    ) : (
      hint && <p id={`${id}-hint`} className="text-xs fx-subtle">{hint}</p>
    )}
  </div>
);

export const inputCls = "h-10 rounded-[10px] border-[var(--app-border)] bg-white text-sm focus-visible:ring-[var(--app-focus)]";
