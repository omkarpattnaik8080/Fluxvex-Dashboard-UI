import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, FilePlus2, FileText, Plug, UserPlus } from "lucide-react";
import { WidgetCard } from "@/components/common/WidgetCard";
import { PersonAvatar } from "@/components/common/DataViz";
import { ClientFormDialog } from "@/components/clients/ClientFormDialog";
import { ReportCreateWizard } from "@/components/reports/ReportCreateWizard";
import { useSettings } from "@/hooks/queries/useSystemData";

/** Quick actions + team strip (reference "Your team" card). Each tile launches the real flow. */
export const QuickActions = ({ delay }) => {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null);
  const team = useSettings().data?.users ?? [];

  const actions = [
    { id: "add-client", label: "Add client", icon: UserPlus, onClick: () => setDialog("client"), tint: "#3D43E8" },
    { id: "connect-account", label: "Connect account", icon: Plug, onClick: () => navigate("/settings?section=connections"), tint: "#159A60" },
    { id: "create-report", label: "Create report", icon: FilePlus2, onClick: () => setDialog("report"), tint: "#C77812" },
    { id: "view-reports", label: "View reports", icon: FileText, onClick: () => navigate("/reports"), tint: "#D94355" },
  ];

  return (
    <WidgetCard testId="quick-actions" title="Quick Actions" delay={delay}>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ id, label, icon: Icon, onClick, tint }) => (
          <button key={id} type="button" onClick={onClick} data-testid={`quick-action-${id}`}
            className="group relative flex flex-col items-start gap-4 rounded-[18px] bg-[#F7F6F3] p-3.5 text-left text-[13px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_28px_-10px_rgba(16,16,20,0.18)] active:scale-[0.98]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110" style={{ color: tint }}><Icon className="h-4 w-4" /></span>
            {label}
            <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-[var(--app-subtle)] opacity-0 transition-all duration-300 group-hover:opacity-100" />
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[var(--app-border)] px-3.5 py-3">
        <div>
          <p className="text-[14px] font-medium">Your team</p>
          <p className="text-xs fx-subtle">{team.length} members</p>
        </div>
        <div className="flex -space-x-2.5">
          {team.map((u) => <PersonAvatar key={u.id} person={u} size={32} className="rounded-full ring-2 ring-white transition-transform duration-200 hover:z-10 hover:-translate-y-1" />)}
        </div>
        <button type="button" onClick={() => navigate("/settings?section=users")} className="rounded-[10px] border border-[var(--app-border)] px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[var(--app-inset)]" data-testid="quick-actions-team-edit">Edit</button>
      </div>

      <ClientFormDialog open={dialog === "client"} onOpenChange={(o) => !o && setDialog(null)} />
      <ReportCreateWizard open={dialog === "report"} onOpenChange={(o) => !o && setDialog(null)} />
    </WidgetCard>
  );
};
