import { Loader2, Send, CheckCircle2, RotateCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useWorkspaceMutation } from "@/hooks/queries/useWorkspaceData";
import { useSettings } from "@/hooks/queries/useSystemData";
import { reportsService } from "@/services/reports.service";
import { formatDate, formatDateRange } from "@/lib/format";

const INVALIDATE = ["reports", "dashboard", "clients"];

/** Report review/detail dialog — action depends on the real status (design.md §7.3). */
export const ReportReviewDialog = ({ report, onOpenChange }) => {
  const { data: settings } = useSettings();
  const approve = useWorkspaceMutation(reportsService.approve, { invalidate: INVALIDATE, success: "Report approved", onSuccess: () => onOpenChange(false) });
  const send = useWorkspaceMutation(reportsService.send, { invalidate: INVALIDATE, success: "Report sent to recipients", onSuccess: () => onOpenChange(false) });
  const retry = useWorkspaceMutation(reportsService.retry, { invalidate: INVALIDATE, success: "Report regenerated — ready for review", onSuccess: () => onOpenChange(false) });
  const pending = approve.isPending || send.isPending || retry.isPending;
  const requireApproval = settings?.governance.requireApproval;

  return (
    <Dialog open={!!report} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[620px]" data-testid="report-review-dialog">
        {report && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2"><DialogTitle className="text-lg">{report.title}</DialogTitle></div>
              <DialogDescription>{report.id} · {report.clientName} · {formatDateRange(report.periodStart, report.periodEnd)}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[13px]">
                <StatusBadge status={report.status} testId="report-dialog-status" />
                <span className="fx-muted">{report.status === "scheduled" ? `Scheduled for ${formatDate(report.scheduledFor)}` : `Generated ${formatDate(report.generatedAt)}`}</span>
                {report.sentAt && <span className="fx-muted">· Delivered {formatDate(report.sentAt)}</span>}
              </div>
              {report.failureReason && <p className="rounded-xl bg-[var(--app-danger-wash)] px-3 py-2 text-[13px] text-[var(--app-danger)]" data-testid="report-failure-reason">{report.failureReason}</p>}

              <div className="rounded-xl bg-[var(--paper)] p-5">
                <p className="text-[11px] font-medium uppercase tracking-wide fx-subtle">Preview · sample layout</p>
                <p className="mt-2 text-base font-semibold">Executive summary</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["Spend", "Conversions", "ROAS"].map((k) => <div key={k} className="rounded-lg bg-white p-3"><p className="text-xs fx-muted">{k}</p><div className="mt-2 h-2 w-3/4 rounded bg-[var(--app-inset)]" /></div>)}
                </div>
                <div className="mt-3 h-20 rounded-lg bg-white" />
              </div>
              {report.status === "needs_review" && requireApproval && <p className="text-xs fx-subtle">Approval is required before sending (Settings → Governance & Policies).</p>}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-[10px]" onClick={() => onOpenChange(false)} data-testid="report-dialog-close">Close</Button>
              {report.status === "needs_review" && (
                <Button className="rounded-[10px]" disabled={pending} onClick={() => approve.mutate(report.id)} data-testid="report-approve-button">
                  {approve.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Approve
                </Button>
              )}
              {report.status === "approved" && (
                <Button className="rounded-[10px]" disabled={pending} onClick={() => send.mutate(report.id)} data-testid="report-send-button">
                  {send.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send to client
                </Button>
              )}
              {report.status === "failed" && (
                <Button className="rounded-[10px]" disabled={pending} onClick={() => retry.mutate(report.id)} data-testid="report-retry-button">
                  {retry.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}Retry
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
