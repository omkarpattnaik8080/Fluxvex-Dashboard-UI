import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, FileText, LayoutTemplate, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useGlobalSearch } from "@/hooks/queries/useSystemData";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/format";

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

/** Header search (⌘K / Ctrl K) across clients, reports and templates (design.md §4.2). */
export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { data, isFetching, isError } = useGlobalSearch(q);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to) => {
    setOpen(false);
    setQ("");
    navigate(to);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="global-search-trigger"
        aria-label="Search"
        className="flex h-10 items-center gap-2 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-inset)] px-3 text-sm fx-subtle transition-colors hover:border-[var(--app-accent-soft)] md:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="hidden flex-1 truncate whitespace-nowrap text-left md:inline">Search clients, reports…</span>
        <kbd className="hidden rounded-md border border-[var(--app-border)] bg-white px-1.5 text-[11px] font-medium md:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-[560px]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <Command shouldFilter={false} className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-[var(--app-subtle)]">
            <CommandInput value={q} onValueChange={setQ} placeholder="Search clients, reports and templates…" data-testid="global-search-input" />
            <CommandList className="max-h-[380px]">
              {!q && <p className="px-4 py-8 text-center text-[13px] fx-subtle">Start typing to search your workspace.</p>}
              {q && isFetching && !data && <SearchLoading />}
              {q && isError && <p className="px-4 py-8 text-center text-[13px] text-[var(--app-danger)]">Search is unavailable. Try again.</p>}
              {q && data && <CommandEmpty>No results for “{q}”.</CommandEmpty>}
              {q && data && <SearchResults data={data} onSelect={go} />}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SearchLoading = () => (
  <div className="flex items-center justify-center gap-2 py-8 text-[13px] fx-subtle">
    <Loader2 className="h-4 w-4 animate-spin" /> Searching…
  </div>
);

const SearchResults = ({ data, onSelect }) => (
  <>
    {data.clients.length > 0 && (
      <CommandGroup heading="Clients">
        {data.clients.map((c) => (
          <ResultItem key={c.id} icon={Users} title={c.name} meta={c.email} onSelect={() => onSelect(ROUTES.clientDetail(c.id))} testId={`search-result-${c.id}`} />
        ))}
      </CommandGroup>
    )}
    {data.reports.length > 0 && (
      <CommandGroup heading="Reports">
        {data.reports.map((r) => (
          <ResultItem key={r.id} icon={FileText} title={r.title} meta={`${r.id} · ${formatDate(r.periodEnd)}`} onSelect={() => onSelect(`${ROUTES.reports}?q=${r.id}`)} testId={`search-result-${r.id}`} />
        ))}
      </CommandGroup>
    )}
    {data.templates.length > 0 && (
      <CommandGroup heading="Templates">
        {data.templates.map((t) => (
          <ResultItem key={t.id} icon={LayoutTemplate} title={t.name} meta={t.category} onSelect={() => onSelect(ROUTES.templatePreview(t.id))} testId={`search-result-${t.id}`} />
        ))}
      </CommandGroup>
    )}
  </>
);

const ResultItem = ({ icon: Icon, title, meta, onSelect, testId }) => (
  <CommandItem value={`${title}-${meta}`} onSelect={onSelect} className="cursor-pointer gap-3 rounded-lg" data-testid={testId}>
    <Icon className="h-4 w-4 text-[var(--app-muted)]" />
    <span className="flex-1 truncate text-sm">{title}</span>
    <span className="truncate text-xs fx-subtle">{meta}</span>
  </CommandItem>
);
