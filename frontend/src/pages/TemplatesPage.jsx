import { useState } from "react";
import { LayoutTemplate, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, SkeletonCard } from "@/components/common/States";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { useTemplates } from "@/hooks/queries/useSystemData";

/** Template gallery — 3/2/1 columns (design.md §8.1). */
export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useTemplates({ search });

  return (
    <div data-testid="templates-page">
      <PageHeader title="Templates" description="Choose a report layout for your clients."
        actions={<>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fx-subtle" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates" aria-label="Search templates" className="h-10 rounded-[10px] bg-white pl-9" data-testid="templates-search-input" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span><Button disabled className="h-10 rounded-[10px]" data-testid="create-template-button"><Plus className="mr-2 h-4 w-4" />Create template</Button></span>
            </TooltipTrigger>
            <TooltipContent>Custom templates are coming soon</TooltipContent>
          </Tooltip>
        </>} />

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <SkeletonCard key={i} className="h-[340px]" />)}</div>
      ) : data.length === 0 ? (
        <div className="fx-card"><EmptyState icon={LayoutTemplate} title="No templates found" description={`Nothing matches “${search}”.`} testId="templates-empty" /></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{data.map((t) => <TemplateCard key={t.id} template={t} />)}</div>
      )}
    </div>
  );
}
