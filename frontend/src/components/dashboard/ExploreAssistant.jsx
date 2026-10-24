import { useState } from "react";
import { ArrowUp, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { useExplore } from "@/hooks/queries/useWorkspaceData";
import { cn } from "@/lib/utils";

const SUGGESTIONS = ["What caused the drop in conversions?", "Where is most of the spend going?", "Which channel has the best ROAS?"];

/**
 * "What would you like to explore next?" bar (reference screenshot).
 * Answers are canned/rule-based from the filtered data — no AI is connected.
 */
export const ExploreAssistant = ({ filters }) => {
  const [open, setOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const explore = useExplore();

  const ask = (q) => {
    const text = q.trim();
    if (!text) return;
    setQuestion(text);
    explore.mutate({ question: text, filters });
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--app-border)] bg-[var(--app-accent-wash)]" data-testid="explore-assistant">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-2 px-4 py-2.5 text-[13px] font-medium" data-testid="explore-toggle" aria-expanded={open}>
        <Sparkles className="h-4 w-4 text-[var(--app-accent)]" />
        What would you like to explore next?
        <span className="ml-auto fx-subtle">{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </button>
      {open && (
        <div className="space-y-3 bg-white px-4 py-3">
          <form onSubmit={(e) => { e.preventDefault(); ask(question); }} className="flex items-center gap-2">
            <label htmlFor="explore-input" className="sr-only">Ask about your performance</label>
            <input
              id="explore-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="I want to know what caused the drop-off in conversions…"
              className="h-10 flex-1 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-inset)] px-3 text-[13px] outline-none transition-colors focus:border-[var(--app-accent)] focus:bg-white"
              data-testid="explore-input"
            />
            <button type="submit" disabled={explore.isPending || !question.trim()} aria-label="Ask" data-testid="explore-submit"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--app-accent)] text-white transition-opacity disabled:opacity-40">
              {explore.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </button>
          </form>
          {!explore.data && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={s} type="button" onClick={() => ask(s)} data-testid={`explore-suggestion-${i}`}
                  className="rounded-lg border border-[var(--app-border)] px-2.5 py-1 text-xs fx-muted transition-colors hover:border-[var(--app-accent-soft)] hover:text-[var(--app-accent)]">
                  {s}
                </button>
              ))}
            </div>
          )}
          {explore.data && (
            <p className={cn("rounded-lg bg-[var(--app-inset)] px-3 py-2.5 text-[13px] leading-relaxed", explore.isPending && "opacity-50")} data-testid="explore-answer" aria-live="polite">
              {explore.data.answer}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
