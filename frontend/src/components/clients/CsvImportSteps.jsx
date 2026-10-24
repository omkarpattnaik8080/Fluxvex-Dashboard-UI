import { useRef, useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { parseCsv, parseRecipients, downloadText } from "@/lib/validation";
import { cn } from "@/lib/utils";

/* ---------- Field model & pure helpers ---------- */

export const IMPORT_FIELDS = [
  { id: "name", label: "Name", required: true, aliases: ["name", "client", "client name", "company"] },
  { id: "website", label: "Website", aliases: ["website", "url", "domain", "site"] },
  { id: "timezone", label: "Timezone", aliases: ["timezone", "tz", "time zone"] },
  { id: "country", label: "Country", aliases: ["country"] },
  { id: "recipients", label: "Recipients", aliases: ["recipients", "emails", "email", "contacts"] },
  { id: "notes", label: "Notes", aliases: ["notes", "comments"] },
];
const UNMAPPED = "__none__";
const MAX_BYTES = 2 * 1024 * 1024;
const TEMPLATE = "name,website,timezone,country,recipients,notes\nNova Interiors,novainteriors.com,Europe/London,United Kingdom,hello@novainteriors.com,\nPeak Roofing,peakroofing.us,America/Denver,United States,owner@peakroofing.us;ops@peakroofing.us,Seasonal\n";

/** Guesses the mapping from CSV headers using field aliases. */
export const autoMap = (headers) =>
  Object.fromEntries(IMPORT_FIELDS.map((f) => [f.id, headers.find((h) => f.aliases.includes(h.toLowerCase())) ?? null]));

/** Builds row DTOs and flags invalid / duplicate rows. */
export function validateRows(rows, headers, mapping, existing) {
  const seen = new Set(existing.map((c) => c.name.toLowerCase()));
  return rows.map((cells, index) => {
    const get = (id) => (mapping[id] ? cells[headers.indexOf(mapping[id])]?.trim() ?? "" : "");
    const { valid, invalid } = parseRecipients(get("recipients"));
    const data = { name: get("name"), website: get("website"), timezone: get("timezone"), country: get("country"), recipients: valid, notes: get("notes") };
    let state = "valid";
    let reason = "";
    if (!data.name) { state = "invalid"; reason = "Missing name"; }
    else if (invalid.length) { state = "invalid"; reason = `Invalid email: ${invalid[0]}`; }
    else if (seen.has(data.name.toLowerCase())) { state = "duplicate"; reason = "Client already exists"; }
    if (data.name) seen.add(data.name.toLowerCase());
    return { index: index + 2, data, state, reason };
  });
}

/* ---------- Step 1 — Upload ---------- */
export const UploadStep = ({ file, onFile, onClear }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const read = (f) => {
    setError("");
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) return setError("Only .csv files are supported.");
    if (f.size > MAX_BYTES) return setError("File is larger than 2 MB. Split it into smaller files.");
    f.text().then((text) => {
      const parsed = parseCsv(text.replace(/^\uFEFF/, ""));
      if (!parsed.headers.length || !parsed.rows.length) return setError("We couldn't find a header row and at least one data row.");
      onFile({ name: f.name, size: f.size, ...parsed });
    });
  };

  return (
    <div className="space-y-4">
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--app-border)] p-4" data-testid="csv-selected-file">
          <FileSpreadsheet className="h-5 w-5 text-[var(--app-success)]" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.name}</p><p className="text-xs fx-subtle">{file.rows.length} rows · {file.headers.length} columns</p></div>
          <button type="button" onClick={onClear} aria-label="Remove file" className="rounded-lg p-1.5 hover:bg-[var(--app-inset)]"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} data-testid="csv-dropzone"
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files[0]); }}
          className={cn("flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors", drag ? "border-[var(--app-accent)] bg-[var(--app-accent-wash)]" : "border-[var(--app-border)] hover:border-[var(--app-accent-soft)]")}>
          <UploadCloud className="h-7 w-7 text-[var(--app-accent)]" />
          <span className="text-sm font-medium">Drag & drop your CSV, or <span className="text-[var(--app-accent)]">browse</span></span>
          <span className="text-xs fx-subtle">CSV only · up to 2 MB · UTF-8</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { read(e.target.files[0]); e.target.value = ""; }} data-testid="csv-file-input" />
      {error && <p role="alert" className="text-[13px] text-[var(--app-danger)]" data-testid="csv-upload-error">{error}</p>}
      <Button variant="outline" size="sm" className="rounded-[10px]" onClick={() => downloadText("fluxvex-clients-template.csv", TEMPLATE)} data-testid="csv-download-template">
        <Download className="mr-1.5 h-3.5 w-3.5" /> Download CSV template
      </Button>
    </div>
  );
};

/* ---------- Step 2 — Map columns ---------- */
export const MapStep = ({ headers, mapping, onChange }) => (
  <div className="space-y-3" data-testid="csv-map-step">
    <p className="text-[13px] fx-muted">Match your CSV columns to Fluxvex fields. Optional fields can stay unmapped.</p>
    {IMPORT_FIELDS.map((f) => (
      <div key={f.id} className="grid grid-cols-[1fr_1.3fr] items-center gap-3 rounded-xl border border-[var(--app-border)] px-4 py-2.5">
        <span className="text-sm font-medium">{f.label}{f.required && <span className="text-[var(--app-danger)]"> *</span>}</span>
        <Select value={mapping[f.id] ?? UNMAPPED} onValueChange={(v) => onChange({ ...mapping, [f.id]: v === UNMAPPED ? null : v })}>
          <SelectTrigger className="h-9 rounded-[10px]" data-testid={`csv-map-${f.id}`}><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value={UNMAPPED}>Don't import</SelectItem>
            {headers.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    ))}
    {!mapping.name && <p role="alert" className="text-xs text-[var(--app-danger)]">Map a column to Name to continue.</p>}
  </div>
);

/* ---------- Step 3 — Preview ---------- */
const STATE_BADGE = { valid: { label: "Valid", tone: "success" }, invalid: { label: "Invalid", tone: "danger" }, duplicate: { label: "Duplicate · skipped", tone: "warning" } };

export const PreviewStep = ({ rows }) => (
  <div className="space-y-3" data-testid="csv-preview-step">
    <Totals rows={rows} />
    <ul className="divide-y divide-[var(--app-border)] rounded-xl border border-[var(--app-border)]">
      {rows.slice(0, 50).map((r) => (
        <li key={r.index} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
          <span className="fx-num w-8 text-xs fx-subtle">#{r.index}</span>
          <span className="min-w-0 flex-1"><span className="block truncate font-medium">{r.data.name || "—"}</span><span className="block truncate text-xs fx-subtle">{r.reason || r.data.website || r.data.recipients.join(", ")}</span></span>
          <StatusBadge status={`csv-${r.state}`} {...STATE_BADGE[r.state]} />
        </li>
      ))}
    </ul>
    {rows.length > 50 && <p className="text-xs fx-subtle">Showing first 50 of {rows.length} rows.</p>}
  </div>
);

const Totals = ({ rows }) => {
  const count = (s) => rows.filter((r) => r.state === s).length;
  return (
    <div className="grid grid-cols-3 gap-2" data-testid="csv-totals">
      {[["Valid", count("valid"), "var(--app-success)"], ["Invalid", count("invalid"), "var(--app-danger)"], ["Duplicates", count("duplicate"), "var(--app-warning)"]].map(([l, v, c]) => (
        <div key={l} className="rounded-xl bg-[var(--app-inset)] px-3 py-2.5"><p className="text-xs fx-muted">{l}</p><p className="fx-num text-lg font-semibold" style={{ color: c }}>{v}</p></div>
      ))}
    </div>
  );
};

/* ---------- Step 4 — Confirm ---------- */
export const ConfirmStep = ({ rows, result }) =>
  result ? (
    <div className="flex flex-col items-center gap-3 py-10 text-center" data-testid="csv-import-result">
      <CheckCircle2 className="h-9 w-9 text-[var(--app-success)]" />
      <p className="text-base font-semibold">Import complete</p>
      <p className="text-[13px] fx-muted">{result.imported} imported · {result.skipped} skipped · {result.failed} failed</p>
    </div>
  ) : (
    <div className="space-y-4" data-testid="csv-confirm-step">
      <Totals rows={rows} />
      <p className="text-[13px] fx-muted">Only valid rows will be imported. Invalid and duplicate rows are skipped and existing clients stay untouched. Imported clients start with “Setup incomplete” until their accounts are connected.</p>
    </div>
  );
