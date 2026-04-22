# Ingrid — Phased Implementation Plan

> Reference: `docs/design/INGRID_BRAND_AND_UX_BRIEF.md`
> Phase 0 (positioning + rebrand strings) is **shipped**. This plan covers Phase 1 → Phase 4.

---

## Phase 1 — Design system foundation (Week 1)

**Goal:** Replace the current ad-hoc palette with the Ingrid token system so every new screen is on-brand by default.

**Scope**
- Rewrite `src/index.css` token block:
  - Light theme: Cloud `#F7F9FC` bg, Midnight `#0B1020` fg, Indigo `#5B6CFF` accent, Mist `#E7ECF3` border, semantic Success/Warning/Danger/Info (+ soft variants).
  - Add `.dark` block: Midnight bg, Slate elevated, Graphite panel, `#F3F6FB` text, `#A8B3C7` muted, `#253049` border.
  - All values stored as HSL (per project rule).
- Extend `tailwind.config.ts`:
  - Add `success`, `warning`, `danger`, `info` semantic color families with `DEFAULT` + `soft` + `foreground`.
  - Add radius tokens (input/button 10, card 12, modal 16).
  - Add shadow tokens (`shadow-card`, `shadow-dropdown`, `shadow-modal`).
  - Load Inter (already used) + JetBrains Mono via index.html or font import.
- Strip the loud `indigo`/`purple` 50–950 palettes — replace usage with semantic `primary`/`accent`.
- Add `ThemeProvider` (next-themes or local) for light/dark toggle in app shell only (marketing stays light).

**Deliverables**
- New token sheet in `index.css` + `tailwind.config.ts`
- `src/components/ui/theme-toggle.tsx`
- Visual regression: every page still renders (using semantic tokens means low risk).

**Done when:** the dashboard renders with calm Indigo accent on Cloud/Mist neutrals, dark mode works in the app shell, and no component uses raw color hex/Tailwind color classes.

---

## Phase 2 — App shell + navigation IA (Week 2)

**Goal:** Bring the dashboard IA in line with the brief.

**Scope**
- Replace the legacy custom `Sidebar` with shadcn `Sidebar` (collapsible icon variant) using `SidebarProvider` in `Layout.tsx`.
- New nav order: Overview · Forms · Submissions · Routing · Integrations · Templates · Analytics · Billing · Settings.
- Add `WorkspaceSwitcher` placeholder in sidebar header (data model already has `workspaces`).
- Add breadcrumb component for app pages.
- Build a shared `PageShell` (header / body / right-rail slot) used by every dashboard page — eliminates per-page padding drift.
- Add a global top bar with: workspace switcher, search (cmd-k stub), theme toggle, user menu.

**Deliverables**
- `src/components/app/AppSidebar.tsx`
- `src/components/app/PageShell.tsx`, `Breadcrumbs.tsx`
- Updated `Layout.tsx` using `SidebarProvider` + always-visible `SidebarTrigger`.

**Done when:** every existing dashboard page renders inside the new shell with consistent spacing, the sidebar collapses to icons, and the new IA order is live.

---

## Phase 3 — Operational surfaces (Weeks 3–5)

Build the screens that actually express the rebrand. **Inbox first** — per the brief, it is the emotional center.

### 3a. Submissions inbox (priority)
- Three-column layout (list · detail · actions rail) with responsive collapse.
- Status chips: New / Reviewed / Routed / Needs follow-up / Closed / Spam (driven by existing `submission_status` enum).
- Detail: field responses, metadata, source info, attachments, event timeline.
- Right rail actions: assign, tag, set status, resend webhook, AI summary, notes.
- Backend: surface `submission_metadata` table; wire status update + tagging to `useMutation`s.
- Empty state per brief microcopy.

### 3b. Overview dashboard rebuild
- KPI row: submissions today/week/month, failed deliveries, spam blocked, active forms.
- Activity feed + recent submissions.
- Webhook health card driven by `webhook_deliveries.status` aggregations.

### 3c. Forms list refresh
- Switch to operational table view as default (current grid stays as toggle).
- Columns: name, status, submissions, last activity, destinations, spam.
- Reuse new status chips + action menu component.

### 3d. Routing rules screen (read + simple write)
- Rules list driven by `routing_rules` table.
- "When/If/Then" row component.
- Execution state badges (active, last run, success rate). Failures + retries link to webhook deliveries.
- Defer node-canvas builder.

### 3e. Integrations
- Card grid driven by real connection state (start with Webhooks + Email; Slack/Sheets/HubSpot stubs marked "Coming soon").
- Each card: name, status dot, last sync, linked forms, error state.

**Done when:** all five surfaces use the new shell, share status visual language, and read from the corresponding tables (or clearly marked stubs).

---

## Phase 4 — Marketing site polish + docs (Week 6)

**Goal:** Site visually matches product. Light theme only.

**Scope**
- Refactor `Hero` to lead with operational proof — replace decorative gradients with calm neutral background + subtle routing-line motif (SVG).
- Reorder sections per brief: Hero → Problem → Solution → Use cases → Product screenshots → Dev proof → Pricing → FAQ.
- Replace any remaining illustration that reads as "playful no-code."
- Pricing page in operational-value framing (already partially done in Phase 0 — extend with Agency tier).
- Stand up a minimal `/docs` route (MDX or static markdown) with sidebar nav, mono code blocks, and dark-mode toggle.
- Add structured metadata + OG image referencing the new motif.

**Done when:** marketing site visually reads as the same product as the redesigned app shell.

---

## Cross-cutting workstreams

- **Component library:** before each phase, build/upgrade the reusable primitives the phase needs (status chip, stat card, event-log row, empty state, detail panel, timeline, integration card, rule row).
- **Microcopy pass:** sweep replace marketing-style copy ("Boom!", emojis in headers) for the brief's tone in every new component.
- **Motion budget:** remove existing `framer-motion` page transitions on app routes (they conflict with "calm operational"); keep only drawer slide + status pulse.
- **Accessibility:** every status chip has text + color + icon; tables are keyboard navigable; dark-mode contrast meets WCAG AA.

---

## Out of scope for now

- Full automation canvas (deferred — keep "When/If/Then" rows).
- Theme presets / heavy charting / bespoke illustration system.
- Native mobile app shell.
- Multi-language.

---

## Tracking

Each phase maps to a Lovable task list created when work begins. Phase 1 unblocks every later phase, so it ships first.
