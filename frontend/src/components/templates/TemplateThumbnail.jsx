import { cn } from "@/lib/utils";

const Bar = ({ className }) => <span className={cn("block rounded-[3px] bg-[var(--app-border)]", className)} />;

/** Small layout thumbnails so templates are visually distinct (design.md §8.1). */
export const TemplateThumbnail = ({ layout, accent = "#3D43E8" }) => (
  <div className="relative h-40 overflow-hidden rounded-xl bg-[var(--paper)] p-4" aria-hidden>
    <div className="mx-auto flex h-full w-[78%] flex-col gap-2 rounded-md bg-white p-3 shadow-[0_6px_20px_rgba(16,16,20,0.06)]">
      <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: accent }} /><Bar className="h-1.5 w-16" /></div>
      {layout === "kpi" && (
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded bg-[var(--app-inset)] p-1.5"><Bar className="h-1 w-6" /><span className="mt-1.5 block h-2 w-8 rounded-sm" style={{ background: i === 0 ? accent : "#D6D3CB" }} /></div>)}
        </div>
      )}
      {layout === "chart" && (
        <>
          <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-5 rounded bg-[var(--app-inset)]" />)}</div>
          <div className="flex flex-1 items-end gap-1 rounded bg-[var(--app-inset)] p-1.5">
            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? accent : `${accent}40` }} />)}
          </div>
        </>
      )}
      {layout === "split" && (
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <div className="flex items-center justify-center rounded bg-[var(--app-inset)]"><span className="h-9 w-9 rounded-full border-[5px]" style={{ borderColor: accent, borderRightColor: "#D6D3CB" }} /></div>
          <div className="space-y-1.5 rounded bg-[var(--app-inset)] p-1.5">{[0, 1, 2, 3].map((i) => <Bar key={i} className="h-1.5 w-full" />)}</div>
        </div>
      )}
      {layout === "table" && (
        <div className="flex-1 space-y-1 rounded bg-[var(--app-inset)] p-1.5">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex gap-1.5"><Bar className="h-1.5 flex-[3]" /><Bar className="h-1.5 flex-1" /><span className="h-1.5 flex-1 rounded-[3px]" style={{ background: i === 0 ? accent : "#D6D3CB" }} /></div>)}
        </div>
      )}
    </div>
  </div>
);
