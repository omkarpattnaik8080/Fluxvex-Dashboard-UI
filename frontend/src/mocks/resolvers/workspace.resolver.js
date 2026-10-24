import { db, httpError, nextId } from "@/mocks/db";
import { DEMO_NOW } from "@/mocks/clock";

/** Mock implementations of Templates, Notifications, Settings, Connections & Search controllers. */

/* ---------- Templates ---------- */
export const listTemplates = ({ search = "" } = {}) => {
  const q = search.trim().toLowerCase();
  return db.templates.filter((t) => !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
};

export const getTemplate = (id) => db.templates.find((t) => t.id === id) ?? httpError("Template not found");

/** Draft saves never overwrite the published template (design.md §8.2). */
export function saveTemplate(id, { draft }) {
  const t = getTemplate(id);
  if (draft) t.draftSavedAt = DEMO_NOW.toISOString();
  else {
    t.updatedAt = DEMO_NOW.toISOString();
    t.draftSavedAt = null;
  }
  return t;
}

/* ---------- Notifications ---------- */
export const listNotifications = () => db.notifications;
export function markAllNotificationsRead() {
  db.notifications.forEach((n) => (n.read = true));
  return db.notifications;
}
export function markNotificationRead(id) {
  const n = db.notifications.find((x) => x.id === id);
  if (n) n.read = true;
  return db.notifications;
}

/* ---------- Settings ---------- */
export const getSettings = () => db.settings;

const SECTION_RULES = {
  agency: (next) => {
    if (!next.name?.trim()) httpError("Agency name is required");
    if (next.name.length > 60) httpError("Agency name must be 60 characters or fewer");
  },
  destinations: (next) => {
    if (next.googleDrive && !next.googleDriveConnected) httpError("Connect Google Drive before enabling it as a destination");
    const enabled = { email: next.email, googleDrive: next.googleDrive, downloadOnly: next.downloadOnly };
    if (!enabled[next.defaultDestination]) httpError("The default destination must be enabled");
  },
  email: (next) => {
    if (next.whiteLabel && next.verification !== "verified") httpError("Verify your domain before enabling white-label sending");
  },
};

export function updateSettingsSection(section, patch) {
  const next = { ...db.settings[section], ...patch };
  SECTION_RULES[section]?.(next);
  db.settings[section] = next;
  return db.settings;
}

export function inviteMember({ email, role }) {
  if (!/^\S+@\S+\.\S+$/.test(email ?? "")) httpError("Enter a valid email address");
  if (db.settings.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) httpError("This person is already on your team");
  db.settings.users.push({ id: nextId("usr"), email, name: "", role, state: "pending" });
  return db.settings;
}

export function removeMember(id) {
  const member = db.settings.users.find((u) => u.id === id);
  const admins = db.settings.users.filter((u) => u.role === "Admin" && u.state === "active");
  if (member?.role === "Admin" && admins.length <= 1) httpError("You can't remove the last administrator");
  db.settings.users = db.settings.users.filter((u) => u.id !== id);
  return db.settings;
}

export function verifyDomain() {
  const email = db.settings.email;
  email.verification = "verified";
  email.dnsRecords.forEach((r) => (r.status = "verified"));
  return db.settings;
}

/* ---------- Connections ---------- */
export const listConnections = () =>
  db.clients.flatMap((c) => c.connections.map((cn) => ({ ...cn, clientId: c.id, clientName: c.name })));

const findConnection = (id) => db.clients.flatMap((c) => c.connections).find((cn) => cn.id === id) ?? httpError("Connection not found");

export function syncConnection(id) {
  const cn = findConnection(id);
  cn.lastAttemptedSyncAt = DEMO_NOW.toISOString();
  if (cn.status !== "connected") httpError("Sync failed — credentials are no longer valid. Reconnect this account.");
  cn.lastSuccessfulSyncAt = DEMO_NOW.toISOString();
  return cn;
}

export function reconnectConnection(id) {
  const cn = findConnection(id);
  Object.assign(cn, { status: "connected", lastSuccessfulSyncAt: DEMO_NOW.toISOString(), lastAttemptedSyncAt: DEMO_NOW.toISOString() });
  return cn;
}

export function disconnectConnection(id) {
  const cn = findConnection(id);
  cn.status = "not_connected";
  return cn;
}

/* ---------- Search ---------- */
export function globalSearch(q = "") {
  const term = q.trim().toLowerCase();
  if (!term) return { clients: [], reports: [], templates: [] };
  return {
    clients: db.clients.filter((c) => c.name.toLowerCase().includes(term) || c.email.includes(term)).slice(0, 5),
    reports: db.reports.filter((r) => r.title.toLowerCase().includes(term) || r.id.toLowerCase().includes(term)).slice(0, 5),
    templates: db.templates.filter((t) => t.name.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)).slice(0, 5),
  };
}
