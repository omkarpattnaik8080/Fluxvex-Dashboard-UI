import { db, httpError, nextId } from "@/mocks/db";
import { DEMO_NOW, daysFromNow } from "@/mocks/clock";
import { DATE_RANGES } from "@/constants/domain";

/** Mock implementation of ReportsController. */

const withClient = (r) => ({ ...r, clientName: db.clients.find((c) => c.id === r.clientId)?.name ?? "Deleted client" });
const find = (id) => db.reports.find((r) => r.id === id) ?? httpError("Report not found");

export function listReports({ status = "all", search = "", clientId = "all", type = "all" } = {}) {
  const q = search.trim().toLowerCase();
  return db.reports
    .map(withClient)
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => clientId === "all" || r.clientId === clientId)
    .filter((r) => type === "all" || r.type === type)
    .filter((r) => !q || r.title.toLowerCase().includes(q) || r.clientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
}

/** Mutually exclusive status counts — they always add up to total. */
export function reportSummary() {
  const count = (s) => db.reports.filter((r) => r.status === s).length;
  return {
    needs_review: count("needs_review"), approved: count("approved"), scheduled: count("scheduled"),
    sent: count("sent"), failed: count("failed"), total: db.reports.length,
  };
}

export function getReport(id) {
  return withClient(find(id));
}

export function createReports({ clientIds = [], rangeId, providers = [], templateId, mode, scheduleAt, recipients = [] }) {
  if (!clientIds.length) httpError("Select at least one client");
  if (!templateId) httpError("Choose a template");
  if (!recipients.length) httpError("Add at least one recipient");
  const days = DATE_RANGES.find((r) => r.id === rangeId)?.days ?? 7;
  const template = db.templates.find((t) => t.id === templateId);

  return clientIds.map((clientId) => {
    const client = db.clients.find((c) => c.id === clientId);
    const usable = client.connections.filter((cn) => cn.status === "connected" && providers.includes(cn.provider));
    if (!usable.length) httpError(`${client.name} has no healthy connection for the selected sources`);
    const report = {
      id: `RPT-${1100 + db.reports.length}`, clientId, templateId, type: days >= 28 ? "Monthly" : "Weekly",
      title: `${client.name} — ${template.name}`, periodStart: daysFromNow(-days), periodEnd: daysFromNow(-1),
      status: mode === "schedule" ? "scheduled" : db.settings.governance.requireApproval ? "needs_review" : "approved",
      generatedAt: mode === "schedule" ? null : DEMO_NOW.toISOString(),
      scheduledFor: mode === "schedule" ? scheduleAt : null, sentAt: null, failureReason: null, recipients,
    };
    db.reports.unshift(report);
    return withClient(report);
  });
}

export function approveReport(id) {
  const r = find(id);
  if (r.status !== "needs_review") httpError("Only reports awaiting review can be approved");
  r.status = "approved";
  return withClient(r);
}

/** Delivery honours Governance & Policies (approval-before-send). */
export function sendReport(id) {
  const r = find(id);
  if (db.settings.governance.requireApproval && r.status !== "approved") httpError("This report must be approved before it can be sent");
  const client = db.clients.find((c) => c.id === r.clientId);
  if (!client?.recipients.length) httpError(`${client?.name ?? "This client"} has no recipients configured`);
  r.status = "sent";
  r.sentAt = DEMO_NOW.toISOString();
  return withClient(r);
}

export function retryReport(id) {
  const r = find(id);
  const client = db.clients.find((c) => c.id === r.clientId);
  const broken = client?.connections.find((cn) => ["expired", "permission_error"].includes(cn.status));
  if (broken) httpError("Reconnect the expired account before retrying this report");
  r.status = db.settings.governance.requireApproval ? "needs_review" : "approved";
  r.generatedAt = DEMO_NOW.toISOString();
  r.failureReason = null;
  return withClient(r);
}

export const newReportId = () => nextId("rpt");
