import { daysFromNow } from "@/mocks/clock";

/**
 * Sample workspace seed. Shapes mirror the DTOs the NestJS API should return.
 * Every screen labels this content as sample data.
 */

export const CURRENT_USER = {
  id: "usr_1",
  name: "Maya Patel",
  email: "maya@northwind.agency",
  role: "Admin",
  identityProvider: "Google",
  initials: "MP",
};

const conn = (id, provider, accountName, status, syncedDaysAgo = 0) => ({
  id,
  provider,
  accountName,
  accountId: `${provider.slice(0, 2).toUpperCase()}-${id.replace(/\D/g, "").padStart(3, "0")}-4471`,
  status,
  lastSuccessfulSyncAt: status === "not_connected" ? null : daysFromNow(-syncedDaysAgo, -2),
  lastAttemptedSyncAt: status === "not_connected" ? null : daysFromNow(0, -1),
});

export const CLIENTS = [
  {
    id: "cl_1", name: "Acme Outdoor", email: "marketing@acmeoutdoor.com", website: "acmeoutdoor.com",
    timezone: "Europe/London", country: "United Kingdom", scale: 1.4, setupTasksPending: 0,
    recipients: ["marketing@acmeoutdoor.com", "ceo@acmeoutdoor.com"], notes: "Prefers PDF summary on Mondays.",
    connections: [conn("cn_1", "google_ads", "Acme — Search", "connected"), conn("cn_2", "meta_ads", "Acme Outdoor Ads", "connected"), conn("cn_3", "ga4", "acmeoutdoor.com GA4", "connected")],
    nextReportAt: daysFromNow(3), createdAt: daysFromNow(-210),
  },
  {
    id: "cl_2", name: "Bloom Botanics", email: "hello@bloombotanics.co", website: "bloombotanics.co",
    timezone: "Europe/London", country: "United Kingdom", scale: 0.9, setupTasksPending: 0,
    recipients: ["hello@bloombotanics.co"], notes: "",
    connections: [conn("cn_4", "google_ads", "Bloom — Shopping", "expired", 4), conn("cn_5", "meta_ads", "Bloom Botanics", "connected")],
    nextReportAt: daysFromNow(1), createdAt: daysFromNow(-160),
  },
  {
    id: "cl_3", name: "Copperleaf Dental", email: "office@copperleafdental.com", website: "copperleafdental.com",
    timezone: "America/New_York", country: "United States", scale: 0.7, setupTasksPending: 2,
    recipients: ["office@copperleafdental.com", "dr.lee@copperleafdental.com"], notes: "Lead-gen focus.",
    connections: [conn("cn_6", "google_ads", "Copperleaf Local", "connected"), conn("cn_7", "meta_ads", "Copperleaf Dental", "connected"), conn("cn_8", "ga4", "—", "not_connected")],
    nextReportAt: daysFromNow(6), createdAt: daysFromNow(-95),
  },
  {
    id: "cl_4", name: "Driftwood Coffee", email: "team@driftwood.coffee", website: "driftwood.coffee",
    timezone: "America/Los_Angeles", country: "United States", scale: 1.1, setupTasksPending: 0,
    recipients: ["team@driftwood.coffee"], notes: "",
    connections: [conn("cn_9", "google_ads", "Driftwood Search", "connected"), conn("cn_10", "meta_ads", "Driftwood Social", "connected"), conn("cn_11", "ga4", "driftwood.coffee GA4", "connected")],
    nextReportAt: daysFromNow(2), createdAt: daysFromNow(-300),
  },
  {
    id: "cl_5", name: "Evergreen Realty", email: "growth@evergreenrealty.com", website: "evergreenrealty.com",
    timezone: "America/Chicago", country: "United States", scale: 1.0, setupTasksPending: 0,
    recipients: ["growth@evergreenrealty.com"], notes: "Quarterly business reviews.",
    connections: [conn("cn_12", "google_ads", "Evergreen — Listings", "connected"), conn("cn_13", "ga4", "evergreenrealty.com GA4", "permission_error", 2)],
    nextReportAt: daysFromNow(9), createdAt: daysFromNow(-120),
  },
  {
    id: "cl_6", name: "Foxglove Fitness", email: "studio@foxglovefit.com", website: "foxglovefit.com",
    timezone: "Europe/Berlin", country: "Germany", scale: 0.8, setupTasksPending: 0,
    recipients: ["studio@foxglovefit.com", "ops@foxglovefit.com"], notes: "",
    connections: [conn("cn_14", "meta_ads", "Foxglove Studio", "connected"), conn("cn_15", "ga4", "foxglovefit.com GA4", "connected")],
    nextReportAt: daysFromNow(4), createdAt: daysFromNow(-60),
  },
  {
    id: "cl_7", name: "Granite & Co", email: "info@graniteandco.com", website: "graniteandco.com",
    timezone: "Australia/Sydney", country: "Australia", scale: 0.6, setupTasksPending: 3,
    recipients: [], notes: "Onboarding — awaiting account access.",
    connections: [],
    nextReportAt: null, createdAt: daysFromNow(-6),
  },
  {
    id: "cl_8", name: "Harbor Pet Clinic", email: "frontdesk@harborpets.com", website: "harborpets.com",
    timezone: "America/New_York", country: "United States", scale: 0.75, setupTasksPending: 0,
    recipients: ["frontdesk@harborpets.com"], notes: "",
    connections: [conn("cn_16", "google_ads", "Harbor — Local", "connected"), conn("cn_17", "ga4", "harborpets.com GA4", "connected")],
    nextReportAt: daysFromNow(5), createdAt: daysFromNow(-140),
  },
];

const rpt = (n, clientId, title, type, startDays, endDays, status, generatedDays, extra = {}) => ({
  id: `RPT-${1000 + n}`, clientId, title, type, templateId: type === "Weekly" ? "tpl_2" : "tpl_1",
  periodStart: daysFromNow(startDays), periodEnd: daysFromNow(endDays), status,
  generatedAt: status === "scheduled" ? null : daysFromNow(generatedDays, -3),
  scheduledFor: status === "scheduled" ? daysFromNow(generatedDays) : null,
  sentAt: status === "sent" ? daysFromNow(generatedDays, -1) : null,
  failureReason: null, ...extra,
});

export const REPORTS = [
  rpt(48, "cl_1", "Acme Outdoor — Weekly Performance", "Weekly", -8, -1, "needs_review", 0),
  rpt(47, "cl_4", "Driftwood Coffee — Weekly Performance", "Weekly", -8, -1, "needs_review", 0),
  rpt(46, "cl_3", "Copperleaf Dental — Lead Gen Weekly", "Weekly", -8, -1, "needs_review", -1),
  rpt(45, "cl_2", "Bloom Botanics — Weekly Performance", "Weekly", -8, -1, "failed", -1, { failureReason: "Google Ads connection expired" }),
  rpt(44, "cl_6", "Foxglove Fitness — Social Snapshot", "Weekly", -8, -1, "approved", -1),
  rpt(43, "cl_8", "Harbor Pet Clinic — Weekly Performance", "Weekly", -8, -1, "sent", -1),
  rpt(42, "cl_5", "Evergreen Realty — Monthly Review", "Monthly", -31, -1, "sent", -2),
  rpt(41, "cl_1", "Acme Outdoor — Monthly Review", "Monthly", -31, -1, "sent", -2),
  rpt(40, "cl_4", "Driftwood Coffee — Monthly Review", "Monthly", -31, -1, "sent", -3),
  rpt(39, "cl_6", "Foxglove Fitness — Monthly Review", "Monthly", -31, -1, "sent", -3),
  rpt(38, "cl_3", "Copperleaf Dental — Monthly Review", "Monthly", -31, -1, "failed", -3, { failureReason: "Recipient mailbox rejected delivery" }),
  rpt(37, "cl_8", "Harbor Pet Clinic — Monthly Review", "Monthly", -31, -1, "sent", -4),
  rpt(36, "cl_1", "Acme Outdoor — Weekly Performance", "Weekly", -15, -8, "sent", -7),
  rpt(35, "cl_4", "Driftwood Coffee — Weekly Performance", "Weekly", -15, -8, "sent", -7),
  rpt(34, "cl_2", "Bloom Botanics — Weekly Performance", "Weekly", -15, -8, "sent", -8),
  rpt(33, "cl_1", "Acme Outdoor — Weekly Performance", "Weekly", -1, 6, "scheduled", 7),
  rpt(32, "cl_4", "Driftwood Coffee — Weekly Performance", "Weekly", -1, 6, "scheduled", 7),
  rpt(31, "cl_5", "Evergreen Realty — Monthly Review", "Monthly", -1, 29, "scheduled", 30),
];

export const TEMPLATES = [
  { id: "tpl_1", name: "Full Performance Review", description: "Complete monthly story across paid and organic channels.", category: "Monthly", providers: ["google_ads", "meta_ads", "ga4"], sections: 7, pages: 8, layout: "chart", updatedAt: daysFromNow(-12) },
  { id: "tpl_2", name: "Weekly Pulse", description: "One-page KPI snapshot for fast weekly check-ins.", category: "Weekly", providers: ["google_ads", "meta_ads"], sections: 4, pages: 2, layout: "kpi", updatedAt: daysFromNow(-4) },
  { id: "tpl_3", name: "Paid Social Snapshot", description: "Meta Ads reach, creative performance and cost trends.", category: "Channel", providers: ["meta_ads"], sections: 5, pages: 4, layout: "split", updatedAt: daysFromNow(-20) },
  { id: "tpl_4", name: "Search Ads Deep Dive", description: "Keyword, campaign and query-level Google Ads analysis.", category: "Channel", providers: ["google_ads"], sections: 6, pages: 6, layout: "table", updatedAt: daysFromNow(-33) },
  { id: "tpl_5", name: "Ecommerce Revenue", description: "Revenue, ROAS and product contribution for online stores.", category: "Monthly", providers: ["google_ads", "meta_ads", "ga4"], sections: 6, pages: 5, layout: "chart", updatedAt: daysFromNow(-9) },
  { id: "tpl_6", name: "Local Lead Generation", description: "Calls, form fills and cost per lead for local businesses.", category: "Monthly", providers: ["google_ads", "ga4"], sections: 5, pages: 4, layout: "kpi", updatedAt: daysFromNow(-41) },
];

export const NOTIFICATIONS = [
  { id: "nt_1", kind: "danger", title: "Connection expired", detail: "Bloom Botanics — Google Ads needs to be reconnected.", createdAt: daysFromNow(0, -2), read: false, href: "/settings?section=connections" },
  { id: "nt_2", kind: "danger", title: "Report run failed", detail: "Copperleaf Dental — Monthly Review could not be delivered.", createdAt: daysFromNow(0, -5), read: false, href: "/reports?status=failed" },
  { id: "nt_3", kind: "warning", title: "Email domain not verified", detail: "Verify northwind.agency to enable white-label sending.", createdAt: daysFromNow(-1), read: false, href: "/settings?section=email" },
  { id: "nt_4", kind: "info", title: "3 reports awaiting review", detail: "Weekly reports were generated this morning.", createdAt: daysFromNow(0, -6), read: true, href: "/reports?status=needs_review" },
  { id: "nt_5", kind: "success", title: "Report sent", detail: "Harbor Pet Clinic — Weekly Performance was delivered.", createdAt: daysFromNow(-1, -3), read: true, href: "/reports?status=sent" },
];

export const SETTINGS = {
  agency: { name: "Northwind Digital", website: "https://northwind.agency", timezone: "Europe/London", dateFormat: "DD MMM YYYY", currency: "USD", language: "English", brandColor: "#3D43E8", logoName: null },
  security: { identityProvider: "Google", email: CURRENT_USER.email, connected: true, lastSignInAt: daysFromNow(0, -1), sessions: 2 },
  users: [
    { id: "usr_1", email: CURRENT_USER.email, name: CURRENT_USER.name, role: "Admin", state: "active" },
    { id: "usr_2", email: "leo@northwind.agency", name: "Leo Brandt", role: "Editor", state: "active" },
    { id: "usr_3", email: "sana@northwind.agency", name: "", role: "Viewer", state: "pending" },
  ],
  destinations: { email: true, googleDrive: false, downloadOnly: true, defaultDestination: "email", googleDriveConnected: false },
  governance: { requireApproval: true, allowEditorsToSend: false, autoArchive: true },
  usage: { clients: { used: 8, limit: 15 }, reports: { used: 42, limit: 100 }, resetsAt: daysFromNow(18) },
  alerts: { connectionExpired: true, reportFailed: true, reportSent: false, weeklyDigest: true },
  email: {
    domain: "northwind.agency", senderAddress: "reports@northwind.agency", fromName: "Northwind Reporting",
    whiteLabel: false, verification: "not_verified",
    dnsRecords: [
      { type: "TXT", host: "_fluxvex.northwind.agency", value: "fluxvex-site-verification=nw-8c21f0d4", status: "not_verified" },
      { type: "CNAME", host: "fx1._domainkey.northwind.agency", value: "fx1.dkim.fluxvex-mail.com", status: "not_verified" },
      { type: "MX", host: "bounce.northwind.agency", value: "feedback.fluxvex-mail.com", status: "not_verified" },
    ],
  },
};
