# Ingrid — Complete Branding and UI/UX Design Brief

> **Status:** Reference document. Source of truth for the Ingrid rebrand and product UX redesign.
> **Owner:** Product + Design.
> **Last updated:** Phase 0 (positioning) is shipped. This brief covers Phase 1+ (design system + product surfaces).

---

## 1. Brand foundation

- **Name:** Ingrid
- **Positioning:** The inbound engine for forms, routing, and workflow.
- **Core promise:** Capture submissions, route work, and automate follow-up.
- **Category:** Form backend + workflow platform.
- **Target users:** Agencies, developers, technical SMB teams managing inbound forms, applications, intake, and lead routing.

## 2. Brand personality

**Is:** reliable, calm, technical, intentional, structured, modern, operational.
**Is not:** playful, toy-like, generic no-code, over-marketed, over-animated, "AI wrapper" trendy.

Reference points: Vercel clarity, Linear restraint, Stripe systems confidence, Notion approachability (less soft).

## 3. Messaging hierarchy

- **Primary:** Capture submissions, route work, and automate follow-up.
- **Secondary:** Reliable form backend and workflow for modern websites and teams.
- **Themes:** submission reliability, spam protection, webhooks/integrations, response visibility, routing/workflow, agency-ready collaboration.
- **Avoid centering on:** "beautiful forms," "AI-powered forms," "Typeform alternative," "conversational forms." Those remain secondary features.

## 4. Visual identity

**Motif:** inbound signal, intake, movement through a system, routing, clarity from incoming complexity.

- **Use:** converging lines, directional arrows, nodes/connectors, stacked paths, calm grids, subtle routing diagrams.
- **Avoid:** cartoon blobs, neon startup gradients, noisy 3D renders, playful hand-drawn illustrations.

## 5. Logo direction

Concept options to explore in Figma:
- **A — Inbound node:** three lines converging into a central node.
- **B — Routed "I":** monogram I formed from a connected route.
- **C — Signal tray:** geometric form showing entries dropping into an intake layer.
- **D — Split path:** one source entering, branching cleanly to multiple endpoints.

Requirements: works at favicon size, monochrome-compatible, clean in light/dark, scalable, low detail, technical not corporate.

## 6. Color system

### Neutrals
| Token | Hex |
| --- | --- |
| Midnight | `#0B1020` |
| Slate | `#1B2435` |
| Graphite | `#2C3648` |
| Steel | `#8A94A6` |
| Mist | `#E7ECF3` |
| Cloud | `#F7F9FC` |
| White | `#FFFFFF` |

### Brand accent
| Token | Hex |
| --- | --- |
| Indigo | `#5B6CFF` |
| Indigo Hover | `#4C5DF2` |
| Soft Indigo | `#E8EBFF` |

### Semantic
| Token | Hex |
| --- | --- |
| Success / Soft | `#16A34A` / `#E8F8EE` |
| Warning / Soft | `#F59E0B` / `#FFF4DB` |
| Danger / Soft | `#DC2626` / `#FDECEC` |
| Info / Soft | `#2563EB` / `#EAF3FF` |

## 7. Typography

- **Primary:** Inter (400/500 body, 600/700 headings).
- **Mono:** JetBrains Mono or IBM Plex Mono — used for code, API samples, IDs/tokens.

### Type scale

| Role | Size / Line |
| --- | --- |
| Display | 56 / 64 |
| H1 | 48 / 56 |
| H2 | 36 / 44 |
| H3 | 28 / 36 |
| H4 | 22 / 30 |
| Body L | 18 / 28 |
| Body | 16 / 24 |
| Small | 14 / 20 |
| Caption | 12 / 18 |

## 8. UX principles

1. **Outcome-first UX** — every screen answers: what was captured, where did it go, what happened next, what needs attention.
2. **Calm operational design** — control, not dazzle.
3. **Progressive complexity** — simple by default, advanced on demand.
4. **Observability everywhere** — surface received / sent / failed / blocked / assigned / retried.
5. **Frictionless setup** — create form → connect destination → publish → receive → verify delivery.

## 9. App information architecture

Top-level nav (in this order):
1. Overview
2. Forms
3. Submissions
4. Routing
5. Integrations
6. Templates
7. Analytics
8. Billing
9. Settings

## 10. Core product screens

### A. Overview (command center)
- KPI row: submissions today/week/month, failed deliveries, spam blocked, active forms.
- Mid: activity feed + recent submissions.
- Lower: failures / form health / destinations / webhook health.

### B. Forms list
Per-row: name, type/template, status, total submissions, last activity, connected destinations, spam status.
Actions: edit, preview, embed/share, submissions, connect routing, duplicate, archive.

### C. Form builder
Layout: left palette · center canvas · right properties · top toolbar (save / publish / preview / embed / test).
Sticky side modules: spam protection, notifications, webhook destination, redirect/confirmation, workflow hooks.
UX rule: a form is not "done" until delivery/routing is configured.

### D. Submission inbox (the emotional center)
Three-column pattern:
- **Left:** submission list (name/email/title, form source, timestamp, status chip, spam marker).
- **Center:** submission detail (field responses, metadata, source info, attachments, event timeline).
- **Right:** actions/context (assign, tag, status, resend webhook, trigger email, AI summary, notes, linked integrations).
- **Status model:** New, Reviewed, Routed, Needs follow-up, Closed, Spam.

### E. Routing
Rules builder: **When** X · **If** Y · **Then** Z.
Surface execution state (active, last run, success rate, failures, retries).
Defer: large node-canvas automation builder.

### F. Integrations
Cards show name, connection state, last sync/use, linked forms, error state.
First integrations: Webhooks, Email, Slack, Google Sheets, HubSpot. Zapier/Make later.

### G. Analytics
Volume trend, spam blocked trend, destination success rate, top forms, routing outcome split, time-to-review.

## 11. Marketing website structure

1. **Hero** — Ingrid · Capture submissions, route work, and automate follow-up. CTAs: Start free / View docs.
2. **Problem** — submissions lost in inboxes, spam noise, no routing logic, too much custom backend.
3. **Solution** — form backend, submission inbox, routing rules, webhooks, spam protection, integrations.
4. **Use cases** — agencies, developers, intake workflows, lead routing.
5. **Product screenshots** — inbox, forms overview, routing rules, delivery logs.
6. **Dev proof** — API, webhooks, starter kits, docs.
7. **Pricing** — simple, confidence-building.
8. **FAQ** — short and technical.

## 12. Component system

Build these reusable pieces first (Tailwind + shadcn variants):

- **Navigation:** top nav, sidebar nav, workspace switcher, breadcrumb.
- **Inputs:** text, textarea, select, multiselect, checkbox, radio, toggle, date/time, file uploader.
- **Status UI:** badge/chip, alert, toast, inline validation, health indicator, event-log row.
- **Data display:** stat card, table, empty state, detail panel, timeline, accordion, metadata row.
- **Actions:** button variants, split button, action menu, modal, drawer, confirm dialog.
- **Builder:** field item, section block, conditional logic row, workflow setup callout, embed snippet panel.

## 13. Design tokens

- **Spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80.
- **Radius:** input 10, button 10, card 12, modal 16, pill 999.
- **Borders:** default `1px solid #E7ECF3`, strong `1px solid #D5DCE7` (+ dark equivalents).
- **Shadows:** subtle only — card low, dropdown medium, modal medium-high. Avoid floating glass.

## 14. Dark mode

- Website: light default.
- App: light + dark.
- Docs: dark optional.

Dark palette: bg `#0B1020`, elevated `#131A2B`, panel `#182133`, text `#F3F6FB` / `#A8B3C7`, border `#253049`, accent indigo unchanged. Serious and legible — not neon.

## 15. Microcopy

Tone: direct, clear, concise, low-hype, trustworthy.

Good: "Submission received" · "Webhook failed — retry scheduled" · "Spam filter active" · "2 destinations connected" · "No submissions yet" · "Connect Slack to route responses".

Avoid: "Boom!", "Magic activated", "Workflow beast unleashed".

## 16. Empty states

- **Submissions:** "No submissions yet." Actions: send test submission · open publish settings.
- **Routing:** "No routing rules configured." Actions: create rule · view examples.
- **Integrations:** "No integrations connected." Actions: connect Slack · set up webhook.

## 17. Motion

OK: slide-in drawers, subtle fades, hover elevation, status pulse for active delivery.
Avoid: hero overload, bounce, large parallax, decorative loading theatrics.

## 18. Figma brief (paste-ready)

Project: Ingrid Rebrand + Product UX Redesign. Deliverables: logo (3 directions), color palette (light + dark), typography, tokens, marketing site, app shell, forms list, builder, submissions inbox, routing, integrations, pricing, docs page, component library. UX principles: operational clarity, outcome-first, progressive complexity, status everywhere, understandable workflows. Output: polished desktop product flows, mobile-responsive site, design token sheet, component library, annotated rationale.

## 19. Frontend implementation rules

1. Centralize tokens (colors, spacing, radius, shadows, type) in `index.css` + `tailwind.config.ts`.
2. Build reusable components before page-level one-offs.
3. Screen priority: app shell → overview → forms list → builder → inbox → routing → integrations.
4. App: light + dark. Marketing: light first.
5. Status visual language must be consistent across submissions, webhooks, spam, integrations, routing.
6. Use table + panel layouts for operational views.
7. Minimal animation. Clarity over complexity. Responsive breakpoints throughout.

## 20. First screens to design (Week 1)

1. Homepage
2. App shell / navigation
3. Overview dashboard
4. Submissions inbox
5. Routing rules
6. Forms list

## 21. Strongest recommendation

Make the **Submissions Inbox** the emotional center of the app. If the inbox is excellent, users feel visibility, control, and workflow continuity. If the product stays builder-centric in UI, the rebrand feels superficial.

## 22. Do not over-design (yet)

Skip: dozens of theme presets, marketing animation systems, complex automation canvases, custom charting, bespoke illustration. Focus on brand core, dashboard clarity, inbox usability, routing clarity, docs legibility, setup flow.

## 23. Direction in one sentence

**Ingrid should look like a calm, reliable operating layer for inbound work — not a flashy form builder.**
