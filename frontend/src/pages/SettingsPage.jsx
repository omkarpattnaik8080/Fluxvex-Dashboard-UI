import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState, SkeletonCard } from "@/components/common/States";
import { SettingsNav, SETTINGS_SECTIONS } from "@/components/settings/SettingsLayout";
import { AgencyProfileSection } from "@/components/settings/AgencyProfileSection";
import { SecuritySection, UsersSection } from "@/components/settings/TeamSections";
import { DestinationsSection, GovernanceSection, UsageSection } from "@/components/settings/PolicySections";
import { ConnectionsSection } from "@/components/settings/ConnectionsSection";
import { EmailSection } from "@/components/settings/EmailSection";
import { useSettings } from "@/hooks/queries/useSystemData";

const SECTION_COMPONENTS = {
  agency: AgencyProfileSection,
  security: SecuritySection,
  users: UsersSection,
  destinations: DestinationsSection,
  governance: GovernanceSection,
  usage: UsageSection,
  connections: ConnectionsSection,
  email: EmailSection,
};

/** Settings — left category nav + content panel; section lives in the URL (?section=). */
export default function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("section");
  const section = SETTINGS_SECTIONS.some((s) => s.id === requested) ? requested : "agency";
  const { data, isLoading, isError, refetch } = useSettings();
  const Section = SECTION_COMPONENTS[section];

  return (
    <div data-testid="settings-page">
      <PageHeader title="Settings" description="Manage your agency settings and preferences." />
      <div className="grid gap-5 lg:grid-cols-[290px_1fr]">
        <SettingsNav active={section} onChange={(id) => setParams({ section: id })} />
        <div className="min-w-0">
          {isLoading ? <SkeletonCard lines={8} /> : isError ? <div className="fx-card"><ErrorState onRetry={refetch} /></div> : <Section settings={data} />}
        </div>
      </div>
    </div>
  );
}
