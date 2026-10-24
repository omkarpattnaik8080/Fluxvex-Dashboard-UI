/** Validation & parsing helpers shared by forms and the CSV importer. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Splits "a@x.com, b@y.com" and returns { valid, invalid }. */
export const parseRecipients = (value = "") => {
  const list = value.split(/[,;\s]+/).map((v) => v.trim()).filter(Boolean);
  return { valid: list.filter((e) => EMAIL_RE.test(e)), invalid: list.filter((e) => !EMAIL_RE.test(e)) };
};

/** Minimal RFC-4180 CSV parser (quoted fields, escaped quotes, CRLF). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const clean = rows.filter((r) => r.some((c) => c.trim()));
  return { headers: (clean[0] ?? []).map((h) => h.trim()), rows: clean.slice(1) };
}

/** Triggers a browser download for generated text content. */
export function downloadText(filename, content, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
