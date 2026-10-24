import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus2, FileText, Plug, UserPlus } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { ReportCreateWizard } from "@/components/reports/ReportCreateWizard";

/** Compact quick actions — each launches the real flow (design.md §5.7). */
export const QuickActions = () => {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null);

  const actions = [
    { id: "add-client", label: "Add client", icon: UserPlus, onClick: () => setDialog("client") },
    { id: "connect-account", label: "Connect account", icon: Plug, onClick: () => navigate("/settings?section=connections") },
    { id: "create-report", label: "Create report", icon: FilePlus2, onClick: () => setDialog("report") },
    { id: "view-reports", label: "View reports", icon: FileText, onClick: () => navigate("/reports") },
  ];

  return (
    <WidgetCard testId="quick-actions" title="Quick Actions">
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ id, label, icon: Icon, onClick }) => (
          <button key={id} type="button" onClick={onClick} data-testid={`quick-action-${id}`}
            className="flex flex-col items-start gap-3 rounded-xl border border-[var(--app-border)] p-3 text-left text-[13px] font-medium transition-colors duration-200 hover:border-[var(--app-accent-soft)] hover:bg-[var(--app-accent-wash)]">
            <Icon className="h-4 w-4 text-[var(--app-accent)]" />
            {label}
          </button>
        ))}
      </div>
      <ClientFormDialog open={dialog === "client"} onOpenChange={(o) => !o && setDialog(null)} />
      <ReportCreateWizard open={dialog === "report"} onOpenChange={(o) => !o && setDialog(null)} />
    </WidgetCard>
  );
};
