# Ingrid — Phased Implementation Plan

> Reference: `docs/design/INGRID_BRAND_AND_UX_BRIEF.md`
> Phase 0 (positioning + rebrand strings) is **defined; rollout in progress** — public surfaces renamed, but a final sweep for stray FormCraft/Tallytastic copy + asset references is still required before Phase 0 can be marked shipped.

## CTO-approved execution rules (apply to every phase)

1. **No raw colors / legacy patterns on new Ingrid surfaces.** Semantic tokens only. No hex literals, no `bg-indigo-500`, no `text-purple-700`. Token definitions in `index.css` are the single exception.
2. **No hybrid screens.** A page is either fully migrated to the new shell + tokens, or it is left untouched. Never half-migrate.
3. **Inbox > dashboard polish.** When trade-offs arise, Submissions Inbox usability wins.
4. **Status taxonomy is global.** The same status language must be used across submissions, routing, webhooks, and integrations. Define once, reuse everywhere.
5. **Planned ≠ live.** Integrations or features that are not implemented must be visibly labeled "Planned" / "Coming soon." Never imply live support.
6. **Legacy components must be re-tokenized before reuse.** A component built before Phase 1 cannot land on a new Ingrid surface unless it has been refactored to semantic tokens and reviewed for brand fit.

## Definition of "Ingrid UI done" (per page)

A page is Ingrid-complete when **all** of the following are true:
- Uses semantic design tokens only (no raw colors, no off-scale spacing).
- Spacing follows the 4-based token scale.
- Renders inside the shared `PageShell` + sidebar (for app pages).
- Empty, loading, and error states are explicitly designed.
- Status language matches the global product taxonomy.
- Dark mode works (app pages only).
- Legacy branding/copy (FormCraft, Tallytastic, "Boom!", emoji-headers) is removed.
- Passes WCAG AA contrast review.

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

**Success metrics**
- 0 raw hex colors in app code outside the token definitions.
- 0 direct Tailwind color utilities (`bg-indigo-500`, `text-purple-700`, etc.) in product surfaces — only semantic aliases.
- Dark mode functional across the app shell.
- ≥ 90% shared-token usage on redesigned pages (sampled audit).

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
- **Build shared primitives required by Phase 3 before exiting Phase 2:** status chip, stat card, table shell, detail panel, empty state, event-log row, integration card, rule row.

**Deliverables**
- `src/components/app/AppSidebar.tsx`
- `src/components/app/PageShell.tsx`, `Breadcrumbs.tsx`
- Updated `Layout.tsx` using `SidebarProvider` + always-visible `SidebarTrigger`.
- `src/components/app/primitives/` — StatusChip, StatCard, TableShell, DetailPanel, EmptyState, EventLogRow, IntegrationCard, RuleRow.

**Success metrics**
- 100% of authenticated app routes render inside `PageShell`.
- 0 per-page custom nav layouts remaining.
- All 8 shared primitives implemented, documented, and consumed by at least one screen.

---

## Phase 3 — Operational surfaces (Weeks 3–6)

Build the screens that express the rebrand. Inbox is the emotional center, but it depends on backend readiness — so 3A is a **data/model audit**, not a UI build.

### 3A. Inbox backend readiness (audit + fill gaps)

**Goal:** Confirm the data model can support persistent inbox behavior before any UI is built.

**Audit checklist** (must produce a written gap report before exiting 3A):
- [ ] Persistent submission status transitions (`submission_metadata.status` writes from UI, RLS-correct).
- [ ] Tags on submissions (read + write + filter).
- [ ] Assignment to a workspace member.
- [ ] Notes (free-text).
- [ ] Timeline events (where do they come from? `form_events`? a new `submission_events` table?).
- [ ] Resend-webhook action (does an edge function exist? Can `webhook_deliveries` rows be re-enqueued safely?).
- [ ] Attachment metadata exposure (size, mime, signed-URL access).

**Done when:** every checkbox above is either ✅ supported or has a written follow-up migration/edge-function task scheduled. Frontend will not start before this gate closes.

### 3B. Submissions inbox UI (priority strategic surface)
- Three-column layout (list · detail · actions rail) with responsive collapse.
- Status chips driven by the global taxonomy from Phase 2.
- Detail: field responses, metadata, source info, attachments, event timeline.
- Right rail actions: assign, tag, set status, resend webhook, AI summary, notes.
- Empty state per brief microcopy.

**Success metrics**
- Submissions inbox reachable from every form.
- Status updates persist and survive reload.
- Webhook delivery health visible inline in the detail view.
- A first-time user can go submission → inspect → mark status → resend webhook without confusion (validated in a 3-user usability pass).

### 3C. Overview / Forms / Routing / Integrations

#### Overview dashboard rebuild
- KPI row: submissions today/week/month, failed deliveries, spam blocked, active forms.
- Activity feed + recent submissions.
- Webhook health card driven by `webhook_deliveries.status` aggregations.

#### Forms list refresh
- Switch to operational table view as default (current grid stays as toggle).
- Columns: name, status, submissions, last activity, destinations, spam.
- Reuse new status chips + action menu component.

#### Routing rules screen (read + simple write)
- Rules list driven by `routing_rules` table.
- "When/If/Then" row component.
- Execution state badges (active, last run, success rate). Failures + retries link to webhook deliveries.
- Defer node-canvas builder.

#### Integrations
- Card grid driven by real connection state.
- **Live now:** Webhooks, Email.
- **Planned (clearly labeled, no fake CTA):** Slack, Google Sheets, HubSpot.
- Each card: name, status dot, last sync, linked forms, error state.

**Success metrics for 3C**
- All four surfaces use the shared shell + global status taxonomy.
- Integration cards never imply live support for planned providers.

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
