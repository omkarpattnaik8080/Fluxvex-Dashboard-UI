import { db, httpError, nextId } from "@/mocks/db";
import { DEMO_NOW } from "@/mocks/clock";

/** Mock implementation of ClientsController. */

const BROKEN = ["expired", "permission_error"];

/** Health is derived from connections + onboarding tasks, never stored (design.md §6.3). */
export function deriveHealth(client) {
  const broken = client.connections.filter((c) => BROKEN.includes(c.status));
  if (broken.length) return { status: "reconnect_required", reason: `${broken.length} connection${broken.length > 1 ? "s need" : " needs"} attention` };
  if (client.setupTasksPending > 0) return { status: "setup_incomplete", reason: `${client.setupTasksPending} tasks pending` };
  return { status: "healthy", reason: "All accounts syncing" };
}

const latestReport = (clientId) =>
  db.reports
    .filter((r) => r.clientId === clientId && r.generatedAt)
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0] ?? null;

/** Shapes a stored client into the list/detail DTO. */
export function toClientDto(client) {
  const health = deriveHealth(client);
  const last = latestReport(client.id);
  return {
    ...client,
    healthStatus: health.status,
    healthReason: health.reason,
    lastReport: last ? { id: last.id, generatedAt: last.generatedAt, status: last.status } : null,
    reportCount: db.reports.filter((r) => r.clientId === client.id).length,
  };
}

export function listClients({ search = "", status = "all", country = "all" } = {}) {
  const q = search.trim().toLowerCase();
  return db.clients
    .map(toClientDto)
    .filter((c) => !q || [c.name, c.email, c.website].some((v) => v.toLowerCase().includes(q)))
    .filter((c) => status === "all" || c.healthStatus === status)
    .filter((c) => country === "all" || c.country === country);
}

export function clientSummary() {
  const all = db.clients.map(toClientDto);
  const count = (s) => all.filter((c) => c.healthStatus === s).length;
  return {
    total: all.length,
    healthy: count("healthy"),
    setupIncomplete: count("setup_incomplete"),
    connectionIssues: count("reconnect_required"),
    totalReports: db.reports.length,
  };
}

export function getClient(id) {
  const client = db.clients.find((c) => c.id === id);
  if (!client) httpError("Client not found");
  return { ...toClientDto(client), reports: db.reports.filter((r) => r.clientId === id) };
}

const normaliseWebsite = (value = "") => value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase();

/** Validates & normalises client input exactly as the NestJS DTO would (class-validator). */
function validateClientInput(input, ignoreId) {
  const name = input.name?.trim();
  if (!name) httpError("Name is required");
  const duplicate = db.clients.find((c) => c.id !== ignoreId && c.name.toLowerCase() === name.toLowerCase());
  if (duplicate) httpError(`A client named "${name}" already exists`);
  return {
    name,
    website: normaliseWebsite(input.website),
    timezone: input.timezone || db.settings.agency.timezone,
    country: input.country || "",
    recipients: input.recipients ?? [],
    notes: input.notes?.trim() ?? "",
  };
}

export function createClient(input) {
  const data = validateClientInput(input);
  const client = {
    id: nextId("cl"), ...data, email: data.recipients[0] ?? "", scale: 0.8, setupTasksPending: 2,
    connections: [], nextReportAt: null, createdAt: DEMO_NOW.toISOString(),
  };
  db.clients.unshift(client);
  return toClientDto(client);
}

export function updateClient(id, input) {
  const client = db.clients.find((c) => c.id === id);
  if (!client) httpError("Client not found");
  Object.assign(client, validateClientInput(input, id));
  client.email = client.recipients[0] ?? client.email;
  return toClientDto(client);
}

export function deleteClient(id) {
  db.clients = db.clients.filter((c) => c.id !== id);
  db.reports = db.reports.filter((r) => r.clientId !== id);
  return { id };
}

/** Bulk import: never overwrites existing clients; duplicates are skipped (design.md §6.5). */
export function importClients(rows) {
  const result = { imported: 0, skipped: 0, failed: 0 };
  rows.forEach((row) => {
    try {
      createClient(row);
      result.imported += 1;
    } catch (e) {
      if (e.message.includes("already exists")) result.skipped += 1;
      else result.failed += 1;
    }
  });
  return result;
}
