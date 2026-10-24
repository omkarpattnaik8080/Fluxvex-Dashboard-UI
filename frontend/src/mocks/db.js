import { CLIENTS, REPORTS, TEMPLATES, NOTIFICATIONS, SETTINGS, CURRENT_USER } from "@/mocks/seed";

/**
 * In-memory "database" used while REACT_APP_USE_MOCK_API=true.
 * Mutations persist for the browser session only (refresh resets the sample workspace).
 */
export const db = {
  user: structuredClone(CURRENT_USER),
  clients: structuredClone(CLIENTS),
  reports: structuredClone(REPORTS),
  templates: structuredClone(TEMPLATES),
  notifications: structuredClone(NOTIFICATIONS),
  settings: structuredClone(SETTINGS),
};

let sequence = 100;
/** Generates sequential ids such as `cl_101`. */
export const nextId = (prefix) => `${prefix}_${++sequence}`;

/** Throws an error shaped like a NestJS HttpException message. */
export const httpError = (message) => {
  throw new Error(message);
};
