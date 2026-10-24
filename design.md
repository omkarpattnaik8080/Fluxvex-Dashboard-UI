# Fluxvex Dashboard — Design System & UI Specification

**Status:** Implementation spec  
**Product:** Fluxvex — automated client reporting for marketing agencies  
**Scope:** Authenticated SaaS application: Overview, Clients, Reports, Templates, and Settings  
**Primary reference:** The final “zentra” overview screenshot for dashboard composition and card density. The preceding Fluxvex screenshots define the information architecture, tables, modals, settings sections, and user flows.  
**Brand source of truth:** The supplied landing-page CSS variables and utilities.

---

## 1. Product and design intent

Build a calm, premium reporting workspace for digital marketing agencies. It should feel like the same product as the Fluxvex marketing site, while being optimized for daily operational work: scan performance, spot failed connections, review reports, manage clients, and adjust reporting settings quickly.

The dashboard should borrow the final reference’s **modular analytics layout**: a dominant performance chart, a compact right-side summary, and smaller supporting widgets below. Do not copy Zentra’s branding or make Fluxvex look like a fintech application. Use Fluxvex data, terminology, brand colors, and existing product workflows.

### Design principles

1. **Analytics first.** Performance trends and delivery health are the most important information on the Overview page.
2. **One strong accent.** Use Fluxvex indigo sparingly for selection, emphasis, focus, and important actions. Let data and hierarchy do most of the work.
3. **Quiet surfaces.** Warm off-white canvas, white cards, thin borders, restrained shadows, and generous spacing. Avoid gradients and decorative textures in the app shell.
4. **Fast scanning.** Clear page titles, compact but readable metadata, aligned numbers, consistent status labels, and predictable table structure.
5. **Actionable failures.** A disconnected account or failed report should always have an obvious next action.
6. **Real state, not decoration.** Counts, dates, charts, notices, and status labels must come from the selected workspace and filters. Mark seeded/demo content clearly.
7. **Responsive by design.** Preserve the horizontal desktop navigation, then collapse it intentionally for tablet and mobile rather than shrinking desktop UI until it breaks.

---

## 2. Brand tokens

Use the variables already defined by the landing page. Do not introduce an unrelated navy/blue design system or replace Inter with a different application font.

### 2.1 Core colors

| Token | Value | Intended use |
|---|---|---|
| `--bg` | `#FFFFFF` | Main cards, menus, modals, dropdowns |
| `--surface` | `#FAFAF7` | App canvas and quiet surface areas |
| `--elevated` | `#F4F2ED` | Inputs, inset panels, hover/selected neutral surfaces |
| `--line` | `#E7E5DE` | Card borders, dividers, table row separators |
| `--accent` | `#3D43E8` | Primary actions, selected navigation, links, focus, selected chart series |
| `--accent-soft` | `#7B7FFF` | Secondary chart series, subtle accent backgrounds, supporting emphasis |
| `--paper` | `#F4F2ED` | Report preview paper and neutral report canvas |
| `--ink` | `#101014` | Main text and brand mark; matches the supplied `body` color |

Define these aliases for app components so usage remains consistent:

```css
:root {
  --app-canvas: var(--surface);
  --app-card: var(--bg);
  --app-inset: var(--elevated);
  --app-border: var(--line);
  --app-ink: #101014;
  --app-muted: #697080;
  --app-subtle: #9299A8;
  --app-accent: var(--accent);
  --app-accent-soft: var(--accent-soft);
  --app-accent-wash: rgba(61, 67, 232, 0.08);
  --app-focus: rgba(61, 67, 232, 0.24);
  --app-success: #159A60;
  --app-success-wash: #E7F6EE;
  --app-warning: #C77812;
  --app-warning-wash: #FFF3DF;
  --app-danger: #D94355;
  --app-danger-wash: #FDE9EC;
  --app-info: #2F6FEB;
  --app-info-wash: #EAF1FF;
}
```

**Semantic colors** above are status colors, not competing brand accents. Always pair them with visible text or an icon; never communicate status by color alone. Use green for successful delivery/healthy connections, amber for review or setup incomplete, red for failed/expired/urgent, and blue for neutral informational states.

### 2.2 Color rules

- The application canvas uses `var(--app-canvas)`; primary content cards use `var(--app-card)`.
- Main text uses `#101014`; secondary text uses `--app-muted`; dates, helper text, and disabled metadata use `--app-subtle`.
- Use a 1px `--app-border` border on nearly all cards, fields, and menus.
- Primary buttons use `--accent` with white text. Secondary buttons are white with a subtle border. Destructive actions use red text and a clear confirmation for irreversible operations.
- Do not use large purple background fills for entire pages. A pale accent wash is only for selected rows, active sidebar items, focused filters, and small information callouts.
- Do not use pure black as a large page background. The app is a light analytics workspace.
- Charts can use the accent, accent-soft, and semantic colors; the rest of the interface should remain quiet.

### 2.3 Typography

Use the supplied **Inter** stack throughout the application UI. Keep the landing-page display type and its animated reveal treatment on the marketing site; do not apply typewriter animation to dashboard labels, table rows, numbers, or settings fields.

| Role | Size | Weight | Notes |
|---|---:|---:|---|
| Page title | 28–32px | 600 | “Overview”, “Clients”, “Reports”, etc. |
| Section title | 18–20px | 600 | Card headings and settings-section headings |
| Card metric | 28–36px | 600–700 | Large KPI values; use tabular numerals |
| Table/client title | 14–15px | 500–600 | Names, report titles, account labels |
| Body | 14px | 400 | Most app content and button labels |
| Helper text | 12–13px | 400 | Descriptions, timestamps, form guidance |
| Eyebrow/metadata | 11–12px | 500 | Uppercase group labels, low-emphasis metadata only |

Typography rules:
- Use `font-variant-numeric: tabular-nums` for monetary values, percentages, KPI counts, and table data.
- Prefer sentence case. Avoid uppercase section headings except small, muted settings group labels.
- Use a maximum of two weights within a typical card. Reserve bold for values and primary labels.
- Avoid ultra-tight display tracking in tables. The `-0.055em` marketing headline treatment should not be copied into dense app content.

### 2.4 Spacing, sizing, shape, and elevation

Use a 4px base spacing scale, consistent with the supplied Tailwind setup.

| Token | Value | Common usage |
|---|---:|---|
| `space-1` | 4px | Icon-label gap, tight metadata |
| `space-2` | 8px | Small control gap |
| `space-3` | 12px | Compact card spacing |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Form groups, medium spacing |
| `space-6` | 24px | Main card padding |
| `space-8` | 32px | Section gap |
| `space-10` | 40px | Large content breaks |
| `space-12` | 48px | Occasional page-level separation |

- Default card radius: **16px**.
- Compact controls and badges: **8–10px** radius.
- Inputs and buttons: **10–12px** radius.
- Dialogs and drawers: **16px** radius; drawers may have square outer edges where they meet the viewport.
- Main desktop page gutter: **28px**; reduce to **20px** tablet and **16px** mobile.
- Standard card padding: **20–24px**; compact cards: **16px**.
- Borders are the main separation mechanism. Use only a very soft shadow for menus, floating panels, and modals, for example `0 12px 36px rgba(16, 16, 20, 0.08)`.
- Avoid heavy black shadows, glassmorphism, neon glows, and excessive rounded-pill controls.

---

## 3. Use of the existing landing-page CSS

The supplied stylesheet is the brand foundation, but not every marketing effect belongs in a data-heavy app.

### Reuse

- `:root` colors and the global Inter font stack.
- `html` focus/selection behavior, with accessible adjustments as needed.
- The existing `.range-light` or `.range-premium` styling only if a dashboard control genuinely needs a range slider.
- The existing `prefers-reduced-motion` pattern.
- `--accent` and `--accent-soft` as the source of truth for all interactive indigo styles.

### Do not apply by default inside the app

- `.grain`, `.fine-grid`, `.fine-grid-light`, `.pixel-blocks`: too decorative for a production analytics workspace.
- `.marquee-track`, `.footer-wordmark`, and marketing-only typewriter reveal classes such as `.ct-armed`: these belong to the landing page.
- `.bob` / `.bob-slow`: avoid floating cards in the core dashboard because it makes data surfaces feel unstable.
- `.spotlight`: do not add hover glows to every card. If kept, restrict it to one deliberate, non-interactive hero/empty-state illustration.
- Global smooth-scroll effects should not interfere with dropdowns, table scrolling, dialogs, or nested scroll containers.

The dashboard should feel related to the landing page through typography, color, and restraint—not through animation applied everywhere.

---

## 4. Application shell and global navigation

### 4.1 Desktop header

Keep the horizontal navigation shown in the supplied Fluxvex screenshots. Do **not** replace it with a permanent left navigation rail; the final reference’s compact top navigation and broad analytics canvas are a better fit for this product.

**Header height:** 72px.  
**Position:** sticky at the top; white background with a bottom border.  
**Horizontal padding:** 28px at desktop.

From left to right:

1. Fluxvex logo mark and wordmark.
2. Primary navigation: `Dashboard`, `Clients`, `Reports`, `Templates`, `Settings`.
3. Flexible whitespace.
4. Global search input with `⌘K` on macOS and `Ctrl K` on Windows/Linux.
5. Notifications button with unread count when applicable.
6. Account/profile dropdown.

Navigation behavior:
- Active item uses a clearly visible accent treatment: indigo-tinted surface and indigo icon/text, or a dark text treatment plus indigo indicator. Do not mix several unrelated active styles across pages.
- Each item is an actual route link and supports keyboard navigation.
- Keep labels visible on desktop. On smaller screens, collapse to a compact menu with the current page and a clear menu trigger.
- Header controls remain available across all authenticated screens.
- Keep the logo mark at approximately 36–40px and the wordmark aligned to its visual center.

### 4.2 Global search

- Search across clients, reports, and templates.
- Open from the header input or keyboard shortcut.
- Results are grouped by entity type and show a title plus one useful secondary field, such as client email, report date, or template category.
- Include loading, no-results, keyboard-highlight, and error states.
- Selecting a result opens its detail or destination. Search must not visually pretend to search entities the current user cannot access.

### 4.3 Notifications menu

- Anchored dropdown, approximately 380–420px wide on desktop.
- Header row: “Notifications” and `Mark all read`.
- Each item has a semantic icon, concise title, short detail, and relative timestamp.
- Examples grounded in the current UI: `Connection expired`, `Email domain not verified`, `Report run failed`.
- Clicking a notification opens the relevant settings or report context.
- Include a `View all activity` destination if the full activity view exists; otherwise link to the notification list rather than using a dead control.
- Unread count must update after the user marks notifications read.

### 4.4 Profile menu

Show the signed-in user name and email, then links for `Profile`, `Subscription`, `Settings`, `Help center`, and `Sign out`. Items that are not available should be explicitly disabled/labeled as upcoming; do not use low-contrast text that looks enabled but does nothing. Sign out requires no confirmation unless unsaved work exists.

---

## 5. Overview dashboard

### 5.1 Purpose

The Overview page answers three questions without requiring navigation:

1. How are client campaigns performing in the selected period?
2. Are reports being reviewed and delivered successfully?
3. What needs attention now?

Use the final reference image’s large analytics card, narrow summary card, and modular lower widgets as the main layout inspiration. Adapt its visual structure to marketing reporting.

### 5.2 Page header and controls

- Title: `Overview`.
- Supporting text: `Monitor campaign performance and reporting health across your clients.`
- Right-aligned controls: client filter, platform filter, date range, compare toggle/period, and optional `Customize` / `Add widget` menu.
- Default period: `Last 7 days`; comparison defaults to the previous equivalent period when enabled.
- Keep filters in a single line on wide desktop. On tablet/mobile, wrap them into a compact filter row or a single `Filters` panel.
- A filter change must update every dependent chart, metric, and table on the page. Show the selected scope plainly.

### 5.3 Desktop grid

Use a 12-column grid with 20px gaps and a maximum content width of approximately 1680px. At large desktop widths use a 28px page gutter. Recommended composition:

**Row 1 — primary analytics, 8/4 split**

- **Performance Overview — 8 columns.** Large card with heading, selected date/period context, metric selector/legend, inline KPI summaries, chart, and hover tooltip. Make this the visual anchor of the dashboard.
- **Reporting Pulse — 4 columns.** Compact summary of reports awaiting review, reports sent, connector issues, and scheduled automations. Each item is clickable and takes the user to the relevant filtered Reports or Connections view.

**Row 2 — operational widgets**

- **Needs Your Attention — 4 columns.** Prioritized client/account issue list, showing client name, reason, last sync time, severity, and a direct action such as `Reconnect` or `Review`.
- **Channel Breakdown — 4 columns.** Google Ads, Meta Ads, and GA4 performance in the selected period. Use compact bars or a small chart, not a decorative donut without labels.
- **Recent Reports — 4 columns.** Latest generated reports with client, date, status, and a link to view/review.

**Row 3 — optional full-width detail**

- **Top Campaigns / Recent Activity / Key Insights** may appear as configurable widgets where the account has sufficient data. Do not show three redundant copies of the same KPI information.
- Keep the number of widgets modest. The page should be scannable without requiring a long scroll on a standard desktop display.

### 5.4 Performance Overview card anatomy

- Header: `Performance Overview`, helper text, and a contextual overflow menu.
- Metric summaries: spend, clicks, conversions, and ROAS. A selected metric may receive a subtle accent treatment; all values remain readable.
- Chart: line or area chart over time. The reference uses a smooth, low-noise analytics style; use gentle gridlines and minimal axes.
- Legend: visible labels with colored dots/line samples; every series can be turned on/off when multiple series are available.
- Tooltip: date, metric values, and comparison values where enabled. Use exact values and proper currency formatting.
- Axis labels should remain legible and never collide with the legend, dropdowns, or card border.
- Provide a table or accessible summary equivalent for chart data where practical.
- Empty state: explain which connection or date filter is preventing data from appearing and provide the next action.

Suggested initial metric palette:

- Spend: `--accent`.
- Clicks: `--app-danger` or a distinct warm-red series.
- Conversions: `--accent-soft`.
- ROAS: `--app-success`.

Do not rely on color alone to identify a series. Keep the legend visible and consistent across all chart contexts.

### 5.5 Reporting Pulse card

Use four compact rows with labels and large/tabular values:

- `Awaiting review`
- `Reports sent`
- `Connector issues`
- `Scheduled reports`

Each row includes a small icon, value, and brief status/context. Use semantic color only for rows that imply a problem or completion. The whole row should be clickable where there is a clear destination. Avoid large oversized icon circles that dominate the number.

### 5.6 Needs Your Attention card

- Sort urgent connector failures first, followed by report failures, overdue reviews, and incomplete setups.
- Each item shows client/avatar, issue, last synced/generated timestamp, status pill, and a chevron or direct action.
- Limit the first view to 4–5 entries with `View all` for the full list.
- Use `Urgent`, `Review`, and `Setup` labels only when those are actual workflow states; do not invent urgency based on a failed sync alone.
- If all systems are healthy, show a calm success/empty state instead of an empty blank card.

### 5.7 Quick actions

Keep the actions readily accessible from the Overview page, preferably as a small `Quick actions` card or a compact action menu:

- `Add client`
- `Connect account`
- `Create report`
- `View reports`

Each action must launch the actual flow described below. Avoid duplicating oversized quick-action tiles if the screen becomes visually crowded; use compact icon-button rows on narrower screens.

### 5.8 Dashboard states

- Initial loading: skeletons that match the dimensions of the eventual cards, not a full-screen spinner.
- Partial connection data: show available data and clearly annotate the missing channel.
- Stale sync: display the last successful sync timestamp and a `Sync now` or `Reconnect` action as appropriate.
- No clients: a first-run state prioritizing `Add your first client` and `Connect an account`.
- No report data: a short explanation and one useful CTA. Do not render fabricated zero-valued charts as if data were available.
- Error: inline message inside the affected widget, with retry where safe. Do not fail the entire dashboard because one connector fails.

---

## 6. Clients page

### 6.1 Page header

- Title: `Clients`.
- Description: `Manage and monitor all your clients in one place.`
- Primary action: `Add client`.
- Secondary action: `Import CSV`.

### 6.2 Summary cards

Display the current product’s summary metrics above the list:

- Total clients
- Healthy clients
- Setup incomplete
- Connection issues
- Total reports

Use 5 evenly sized cards on wide desktop. At smaller widths, wrap to 2 columns and then a horizontal scroller only if the summary remains useful. Keep cards low-profile and avoid excessive icon-circle decoration.

### 6.3 Client table

Toolbar:

- Search by client name, email, or website.
- Client health/status filter.
- `Filters` control for more options.

Recommended columns:

1. Client — avatar/initial, name, email.
2. Website — domain and external-link icon.
3. Recipients — count; full addresses appear in the client detail/edit view.
4. Connected accounts — compact provider icons/count.
5. Health status — status plus concise reason, such as `3 tasks pending`.
6. Next report — schedule date or em dash if unscheduled.
7. Last report — date and delivery state.
8. Actions — overflow menu.

Behavior:

- Clicking a client row opens its client detail view; action menus must not trigger the row navigation.
- Long names/domains truncate with a tooltip, not wrap table rows to excessive height.
- Preserve sorting, pagination or a deliberate “load more” pattern once lists grow. Search and filters should be reflected in the URL if the app uses URL-driven table state.
- Empty search, no clients, filtered-empty, loading, and load-error states are required.
- Use real dates consistently. Do not mix old report examples from different periods in the same seeded workspace without an explicit demo-data label.

### 6.4 Add Client modal

Open from `Add client` or the Overview quick action.

Fields:

- Name* (required)
- Website
- Timezone
- Country
- Recipients (comma-separated, with email validation)
- Notes

Actions: `Cancel`, `Save client`.

Validation:

- Validate the required name on submit and show a field-level message.
- Normalize website URLs and validate email recipients without discarding valid values silently.
- Default timezone may be suggested from the agency profile, but it must remain editable per client.
- Preserve entered form values if the API returns a recoverable validation error.
- Disable the submit button only while saving or when the form is invalid; do not leave it permanently disabled due to placeholder text.
- On successful save, close the dialog, show a concise confirmation, refresh the list, and optionally open the new client’s detail/setup checklist.

### 6.5 CSV import flow

Use the right-side drawer shown in the supplied screenshot. Keep the underlying page visible with a neutral dim overlay. The drawer should fit common desktop heights without horizontal scrolling.

**Four-step flow:**

1. **Upload CSV** — drag-and-drop area, file picker, CSV-only helper, and `Download CSV template`.
2. **Map columns** — map CSV headers to Fluxvex fields; mark required fields and allow unmapped optional fields.
3. **Preview & validate** — preview a manageable set of rows and show row-level validation errors, duplicates, and skipped rows.
4. **Confirm import** — show totals for valid, invalid, duplicate, and skipped rows before the final confirmation.

Required behavior:

- Accept `.csv` only. Validate file size and encoding, and explain errors without losing the selected file where possible.
- Never silently overwrite an existing client. Detect duplicates using stable fields and offer a clear skip/review policy.
- Allow the user to go back a step without losing completed mappings.
- On completion, show imported/failed counts and provide access to the import results.
- Footer actions remain visible; the content area scrolls independently. Avoid the horizontal scrollbar visible in the reference screenshot.
- Keep one clear primary CTA per step; use `Back`, `Cancel`, and `Continue` consistently.

---

## 7. Reports page

### 7.1 Page header and summary

- Title: `Reports`.
- Description: `Review, approve and send reports to your clients.`
- Primary action: `Create report`.

Summary cards:

- Needs review
- Approved
- Sent
- Failed
- Total reports

All counts must reconcile with the report list and current filter semantics. If statuses are mutually exclusive, their totals should not contradict the total count. Scheduled reports may be shown as a dedicated tab or secondary metric, but avoid double-counting them as sent or failed.

### 7.2 Toolbar and status tabs

- Search by report or client name.
- Filters for client, status, report type, and platform if supported.
- Date range control.
- Tabs: `All Reports`, `Needs Review`, `Approved`, `Scheduled`, `Sent`, `Failed`.
- Selecting a tab updates the result set and selected-state styling. Keep tab counts synced with the displayed scope.

### 7.3 Reports table

Recommended columns:

- Report title and report ID.
- Client.
- Report type/cadence.
- Reporting date range.
- Status.
- Generated timestamp.
- Actions (`Review` / `View` plus overflow menu).

Use compact status pills with semantic colors. The primary row action depends on state: `Review` for drafts awaiting approval, `View` for approved/sent reports, and `Retry` or `View details` for failed reports where retry is supported.

### 7.4 Create report flow

The supplied screenshots show the entry point but not the complete wizard. Implement a clear, linear flow rather than one long form:

1. Select client(s) and reporting date range.
2. Choose available data sources/accounts and confirm connection health.
3. Choose a template and review the sections included.
4. Select generate now or schedule; confirm recipients and destination.
5. Show a final summary before generating/scheduling.

Rules:

- Disable only choices that are genuinely unavailable; explain why (for example, a disconnected Google Ads account).
- Save a draft when the user exits partway through if the system supports drafts.
- After generation, route to the report detail/preview and show the actual state: generating, needs review, approved, sent, scheduled, or failed.
- Never show “Sent” until delivery has succeeded.
- If approval-before-send is enabled in Governance & Policies, enforce it in both UI and backend behavior.

---

## 8. Templates page and template preview

### 8.1 Template gallery

- Title: `Templates`.
- Description: `Choose a report layout for your clients.`
- Search templates by name/category.
- `Create template` is a primary action when the user has permission; if custom templates are not yet supported, omit or clearly disable the control rather than rendering white text on a white background.
- Use a three-column gallery on wide screens, two columns on tablet, and one column on mobile.

Each template card includes:

- A consistent, restrained thumbnail/preview area.
- Template name and one-line description.
- Provider/source badges for Google Ads, Meta Ads, and GA4 as relevant.
- Section count, approximate page count, and updated date.
- `Preview` action.
- Overflow menu for duplicate/edit/delete only where the permission and feature exist.

Do not use a generic blank icon area as the only visual difference between templates. Create small, clear layout thumbnails with the same palette and typography as the real report.

### 8.2 Template preview workspace

Match the supplied three-panel structure:

- **Left panel:** `Report Sections` navigation: Executive Summary, Overview Metrics, Performance Trends, Channel Breakdown, Top Campaigns, Key Insights & Recommendations, Appendix.
- **Center panel:** paper-like report preview, with agency/client labels, selected date range, section heading, KPI tiles, charts, and tables.
- **Right panel:** preview notice, template details, and short contextual guidance.
- Top actions: `Edit Template`, `Save as Draft`, `Save Template`, with one visually primary action.

Behavior:

- Clicking a section on the left scrolls the center preview to that section and shows the selected state.
- Preview must be explicitly labelled if it uses sample data. Do not imply sample metrics represent the selected client’s actual results.
- Keep the preview’s typography and paper area intentionally different from the surrounding editor chrome, while using Fluxvex design tokens.
- Save actions must have distinct behavior: draft does not overwrite the published/current saved template until the user confirms; save template persists changes and returns a real success/error state.
- If a section has no usable source data, show a graceful unavailable-data block rather than a fake chart.

---

## 9. Settings information architecture

Keep the settings sub-navigation in the left column as shown in the screenshots. The selected item uses a pale accent wash and an accent icon/text. At desktop, the sidebar is approximately 280–300px wide; the content panel fills the remaining width.

Page header: `Settings` and `Manage your agency settings and preferences.`

Settings categories:

1. Agency Profile
2. Account & Security
3. Users & Roles
4. Export Destinations
5. Governance & Policies
6. Usage & Alerts
7. Connections
8. Email

On mobile, replace the persistent left panel with a settings-category select/menu above the content. Keep labels and descriptions intact.

### 9.1 Agency Profile

Fields:

- Agency name and character count.
- Website.
- Timezone.
- Date format.
- Currency.
- Language.
- Logo upload (PNG/JPG, show file size/type constraints).
- Brand color, using the selected brand color for report title/header treatment where appropriate.

Behavior:

- Use two-column field layout on desktop and one column on mobile.
- Show unsaved changes and an explicit save action if fields auto-save is not guaranteed.
- Do not silently change historical report currency or dates when agency preferences change. Explain which settings affect future reports.
- Validate color contrast if the brand color is configurable.

### 9.2 Account & Security

- Show connected identity provider, account/email, and connection state.
- If Google sign-in is active, explain that password changes must happen through Google when appropriate; do not show a misleading password-change flow that cannot work.
- Provide sign-out/session controls only if supported by the authentication implementation.
- Security controls must use clear success/error feedback and never reveal secret tokens.

### 9.3 Users & Roles

- Invite form: email, role selector, invite action.
- Role definitions must be visible: Admin manages settings/users; Editor creates and edits reports; Viewer can view but not edit. Adjust language if the actual permission matrix differs.
- Team members list below the invite form with email, role, invitation state, and management actions.
- Empty state: `No team members yet` plus a clear invitation prompt.
- Prevent a user from removing the last required administrator if that would lock the workspace.
- Enforce permissions on the backend; hiding a button is not authorization.

### 9.4 Export Destinations

Available destinations shown in the reference:

- Email — send a PDF link to recipients.
- Google Drive — upload a copy to a shared folder.
- Download only — generate and download without sending.

Include a toggle per destination and a `Default destination` selector. A default destination must be enabled before it can be selected. If Google Drive is not connected, explain the setup needed and do not let the user enable an unusable destination without feedback.

### 9.5 Governance & Policies

Settings shown in the screenshots:

- Require approval before sending.
- Allow Editors to send reports.
- Auto-archive reports after 12 months.

Use rows with title, a one-sentence explanation, and an accessible toggle. Where two policies interact, define the precedence and reflect it in the UI. Example: if approval is required, an Editor cannot bypass approval merely because `Allow Editors to send reports` is enabled. Confirm destructive or retention-related changes and document their impact.

### 9.6 Usage & Alerts

- Usage section with current clients and reports this month, plan limits, percentage/progress bars, and reset timing.
- Alert preferences for connection expired, report failed, report sent, and other supported events.
- Each notification preference has a label and explanation.
- Do not represent usage values with decorative progress bars that lack numeric totals. Always show `used / limit`.
- At or near a limit, explain what changes and what action is available. Do not automatically interrupt workflow with upsell modals.

### 9.7 Connections

Group connected account records by provider: Google and Meta at minimum for the current product scope. Within each provider group, display connected customer/ad accounts or properties as individual rows.

Each provider panel includes:

- Provider icon and name.
- Connection status and last successful sync timestamp.
- Associated accounts/properties.
- Actions: `Sync`, `Reconnect`, `Disconnect`, depending on state.

Behavior:

- `Sync` shows in-progress feedback and the time of the last completed sync.
- `Reconnect` launches the OAuth reconnection flow and reports success/failure clearly.
- `Disconnect` requires confirmation and explains the impact on scheduled reports and data refreshes.
- Expired credentials and permission failures must be distinct error states.
- Keep Google Ads, GA4, and Meta account labels specific; do not make one generic Google connection look like every Google product is healthy if only one scope is authorized.

### 9.8 Email / white-label email

Fields shown in the supplied screen:

- Domain.
- Sender address.
- From name.
- White-label toggle.
- DNS verification table.

Behavior:

- Show `Not verified`, `Verifying`, or `Verified` with both status text and icon.
- Provide copy-to-clipboard controls for DNS values and show a short copied confirmation.
- Do not activate white-label sending until the domain and sender configuration pass verification.
- Use real provider DNS records from the backend; never hardcode demo values such as `fluxvex-verify=demo` in production.
- Keep a `Verify domain` action and report success/failure with helpful next steps.
- Explain that white-label mode changes the visible sender identity, not the underlying report data or delivery guarantees.

---

## 10. Shared components and interaction standards

Use a small, consistent component vocabulary rather than hand-styling every page separately.

### Core components

- `AppHeader`
- `PrimaryNavigation`
- `GlobalSearch`
- `NotificationMenu`
- `ProfileMenu`
- `PageHeader`
- `FilterBar`
- `DateRangePicker`
- `MetricCard`
- `ChartCard`
- `StatusBadge`
- `ProviderBadge`
- `ClientAvatar`
- `DataTable`
- `EmptyState`
- `ErrorState`
- `SkeletonCard` / `SkeletonTable`
- `ConfirmDialog`
- `ModalDialog`
- `SideDrawer`
- `FormField`
- `SettingsNav`
- `ToggleRow`
- `Toast`

### Buttons

- **Primary:** accent fill, white text, 40–44px height.
- **Secondary:** white background, subtle border, dark text.
- **Tertiary/ghost:** transparent background, dark/muted text, hover surface.
- **Destructive:** semantic red treatment; always explicit in wording.
- Icon-only buttons must have accessible names and visible hover/focus styles.
- Buttons must show pending state when an asynchronous action is running and prevent duplicate submissions.

### Status badges

Use small, low-height pills with a lightly tinted semantic background and readable text. Do not use badges for decorative section labels. Use status text consistently everywhere:

- Healthy / Connected
- Setup incomplete
- Reconnect required
- Needs review
- Approved
- Scheduled
- Sent
- Failed
- Not verified

The label must correspond to the actual system state. Avoid using `Approved` and `Sent` interchangeably.

### Inputs and filters

- Field labels remain visible; placeholders are examples, not the only label.
- Provide clear validation text beneath the relevant field.
- Focus uses a 2px accent outline, consistent with the supplied `:focus-visible` pattern.
- Filter changes should be reversible and should not silently reset unrelated filter choices.
- Use `Clear all` when several filters are active.
- On mobile, place complex filters in a drawer or popover, not a line of squeezed controls.

### Tables

- Header row: 12–13px muted text, medium weight.
- Body: 14px text with consistent vertical alignment.
- Default row height: approximately 64–72px, depending on whether secondary text is shown.
- Use horizontal dividers, not strong cell borders around every field.
- Align numeric values by their numeric edge where useful; use tabular numerals.
- Keep row-action menus inside their own click target.
- Support sorting only where the sort semantics are defined.
- On mobile, use either a deliberate horizontal-scroll table with pinned key identity or a card-list layout; do not let the whole page overflow horizontally.

### Toasts and confirmations

- Success toast: concise result, e.g. `Client added`.
- Error toast: say what failed and how to continue; provide a durable inline error for form or connection issues.
- Confirm dialogs are reserved for destructive or high-impact actions such as disconnecting a provider, deleting a template, or changing retention policy.
- Dialogs must support Escape to close unless the action is in a non-dismissible critical state; return focus to the trigger on close.

---

## 11. Motion and micro-interactions

The product should feel responsive, not animated for its own sake.

- Standard hover/focus transition: 150–220ms.
- Popovers/drawers: subtle opacity and 6–8px translate entrance, approximately 180–240ms.
- Chart transitions: 200–300ms when data changes; avoid a long animated redraw when filters change repeatedly.
- Button hover: slight surface/color shift only; no scale bounce.
- Row hover: subtle neutral background or accent wash.
- Loading: skeleton shimmer or restrained placeholder; avoid pulsing every metric.
- Respect `prefers-reduced-motion: reduce`. Disable nonessential transforms and animated chart transitions in reduced-motion mode.
- Use the existing `.menu-pop` only if it is compatible with the component’s lifecycle and reduced-motion behavior; add a reduced-motion override if needed.
- Never use marketing typewriter text reveal on KPI labels, table content, settings text, errors, or status messages. It harms scan speed and can make live data look unstable.

---

## 12. Responsive behavior

### Desktop — 1280px and wider

- Full horizontal header navigation.
- Dashboard uses the 12-column widget grid.
- Clients and Reports use full tables.
- Settings uses a left navigation panel and content area.
- Template gallery uses three columns; template preview uses the full three-panel layout.

### Tablet — 768px to 1279px

- Header keeps the logo and may collapse primary nav into fewer visible items or a `More` menu, but search and profile remain reachable.
- Dashboard primary chart and Reporting Pulse may remain 7/5 or stack where the chart would otherwise become too narrow.
- Summary cards use two or three columns.
- Clients/Reports tables keep key columns and hide lower-priority metadata only when the same detail remains available in row detail.
- Settings uses a narrower category panel.
- Template preview may turn the right details panel into a collapsible sidebar.

### Mobile — below 768px

- Compact header with logo, current page/menu, search icon, and profile/notification access.
- One-column dashboard widgets; chart controls wrap cleanly.
- Tables become card rows or controlled horizontal scroll; never shrink text to illegibility.
- Use full-screen or near-full-screen drawers for CSV import and complex flows.
- Modals use almost the full viewport width with safe margins; fields become single-column.
- Touch targets should be at least 44×44px where practical.
- Maintain 16px page padding and avoid horizontal overflow.

---

## 13. Accessibility and usability requirements

- Meet WCAG AA contrast for body text, controls, status labels, and focus indicators.
- Every icon-only control has a label for assistive technology.
- Keyboard navigation works across header, menus, tables, dialogs, settings, and CSV steps.
- Use semantic buttons/links; do not implement clickable `<div>` elements without keyboard support.
- Modal/drawer focus is trapped while open and restored when closed. Escape behavior is consistent.
- Form fields connect labels, hints, and errors programmatically.
- Charts have meaningful titles and accessible text/table summaries; do not encode meaning only by color.
- Respect reduced-motion settings.
- Status messages should be announced appropriately without repeatedly interrupting screen readers.
- Avoid low-contrast disabled text that could be mistaken for enabled controls. State clearly when an action is unavailable and why.

---

## 14. Data consistency and product behavior

The screenshots contain a mixture of sample dates and sample entities. For the real dashboard:

- Use one coherent seed dataset per demo workspace and mark sample mode visibly.
- Ensure report totals agree across Overview, Clients, and Reports when the same scope is selected.
- Respect the agency timezone for page-level date selection and report generation; show timestamps in the relevant client/account timezone only when intentional and label it.
- Format currency using the agency/report currency, and percentages with consistent rounding.
- Distinguish `last successful sync` from `last attempted sync`.
- Do not treat an expired credential as healthy just because historical metrics are available.
- If one source is unavailable, show which metrics are incomplete rather than presenting a complete aggregate.
- Persist settings and show the saved state. A toggle must not visually remain on if the backend rejects the update.
- Ensure the frontend permission state matches server-side authorization.

---

## 15. Suggested implementation structure

Adapt paths to the existing repository; these names are suggestions, not a requirement to duplicate components that already exist.

```text
app/
  (app)/
    layout.tsx                 # Authenticated shell
    dashboard/page.tsx         # Overview
    clients/page.tsx
    reports/page.tsx
    templates/page.tsx
    templates/[templateId]/page.tsx
    settings/page.tsx
components/
  app-shell/
    app-header.tsx
    primary-nav.tsx
    global-search.tsx
    notification-menu.tsx
    profile-menu.tsx
  dashboard/
    performance-overview.tsx
    reporting-pulse.tsx
    needs-attention.tsx
    channel-breakdown.tsx
    recent-reports.tsx
    quick-actions.tsx
  clients/
    client-table.tsx
    client-form-dialog.tsx
    csv-import-drawer.tsx
  reports/
    report-table.tsx
    report-create-wizard.tsx
  templates/
    template-card.tsx
    template-preview-workspace.tsx
  settings/
    settings-nav.tsx
    agency-profile-form.tsx
    connection-provider-card.tsx
    toggle-row.tsx
  ui/
    button.tsx
    card.tsx
    data-table.tsx
    status-badge.tsx
    empty-state.tsx
    skeleton.tsx
    dialog.tsx
    drawer.tsx
```

### Styling implementation notes

- Keep the supplied global stylesheet as the brand foundation.
- Prefer existing Tailwind utility conventions and shared component variants over page-specific hard-coded colors.
- Add dashboard semantic CSS variables once, not as separate values across individual components.
- Avoid hard-coding chart colors independently in every chart. Define a shared chart palette and map series to it.
- Keep app-level layout and product data components separate from marketing-page animation components.
- Do not place sensitive account tokens or OAuth credentials in client-side code or persisted browser storage.

---

## 16. Implementation acceptance checklist

### Design consistency

- [ ] Inter and the supplied brand tokens are used across authenticated screens.
- [ ] The app uses a warm off-white canvas, white cards, thin warm borders, and restrained shadows.
- [ ] Indigo is the interactive brand accent; semantic colors are reserved for data/status meaning.
- [ ] The final reference’s modular analytics composition is reflected on Overview without copying Zentra branding.
- [ ] Marketing-only textures and typewriter/floating animations are not applied to dashboard content.

### Dashboard

- [ ] Performance Overview is the dominant analytics card and responds to all selected filters.
- [ ] Reporting Pulse shows coherent counts and links to filtered destinations.
- [ ] Needs Your Attention prioritizes actionable problems.
- [ ] Channel Breakdown and Recent Reports provide useful secondary context without duplicating the same metrics.
- [ ] All loading, no-data, stale-data, partial-data, and error states are designed.

### Clients and CSV import

- [ ] Client search, status filters, table row navigation, and row actions work independently.
- [ ] Add Client validates fields and gives clear success/error feedback.
- [ ] CSV import supports upload, column mapping, validation preview, and confirmation.
- [ ] Duplicate and invalid rows are explained; the flow has no horizontal overflow.

### Reports and Templates

- [ ] Report statuses are consistent and accurate; `Sent` only appears after successful delivery.
- [ ] The create-report flow checks client, connection, template, recipient, and approval requirements.
- [ ] Template gallery, preview navigation, sample-data disclosure, and save actions work.

### Settings and system behavior

- [ ] All eight settings categories are reachable and responsive.
- [ ] Toggles persist and reflect server state; access is enforced server-side.
- [ ] Provider health and sync timestamps are specific and accurate.
- [ ] White-label email cannot be enabled before domain verification.
- [ ] Keyboard navigation, focus behavior, modal handling, contrast, and reduced motion are tested.

---

## Final direction

**Use the Fluxvex landing page as the source of truth for brand and tokens; use the final Zentra screenshot as the source of truth for dashboard composition; use the Fluxvex screenshots as the source of truth for feature inventory and workflows.** The result should be a restrained analytics workspace whose visual focus is performance, whose secondary focus is report delivery health, and whose every warning points to a concrete next action.
