
# FormCraft → Developer/Agency-First Form Backend & Workflow Platform

## Strategic Pivot
Reposition from "AI form builder" to **"Reliable form backend and routing for modern websites."** Target agencies, indie devs, and technical SMBs. Compete with Formspark/Basin/Getform on infrastructure, not Tally/Typeform on builder UX.

---

## Phase 0 — Reposition (this PR)

### 1. Landing page rewrite
- **New `Hero.tsx`**: "Reliable form backend and routing for modern websites" + sub: "Capture submissions, block spam, trigger workflows, and manage responses — without building backend plumbing."
- **New `DeveloperFeatures.tsx`**: webhook delivery, signed payloads, retries, spam protection, framework SDKs (Next.js / React / Astro / HTML).
- **New `UseCases.tsx`**: 3 cards — Agencies, Indie devs, SaaS teams.
- **New `CodeShowcase.tsx`**: tabbed code block showing curl + Next.js + React + HTML embed.
- **New `WebhookShowcase.tsx`**: visual of submission → webhook → Slack/Sheets/CRM.
- Remove/demote: `InteractiveDemo`, `TemplateShowcase`, conversational marketing.
- Keep: `Pricing` (rewrite copy), `FAQ` (rewrite for dev/agency objections), `Footer`, `Navbar`.

### 2. Pricing rewrite (`Pricing.tsx`)
Replace plan copy with operational-value framing:
- **Free** — 1 workspace, 2 forms, 100 submissions/mo, webhooks, basic spam.
- **Pro ($19/mo)** — 5K submissions, unlimited forms, inbox, routing rules, file uploads.
- **Agency ($79/mo)** — multi-workspace, client branding, team members, priority support, 25K submissions.

### 3. Phase 0 architecture scaffolding (DB + types only, no UI)
Create the data model now so Phase 1 can move fast. Tables:
- `workspaces`, `workspace_members` (roles)
- `webhook_endpoints` (form_id, url, secret, is_active)
- `webhook_deliveries` (endpoint_id, submission_id, status, attempt, response_code, payload, next_retry_at)
- `routing_rules` (form_id, conditions, actions)
- `submission_tags`, `submission_status` (new, in_progress, done, archived) + `submission_assignments`
- `api_tokens` (workspace-scoped, for direct API submission)

All with RLS scoped to workspace membership via `has_workspace_role()` security-definer function.

### 4. Analytics instrumentation
PostHog events: `signup_source`, `use_case_selected`, `first_form_created`, `first_submission_received`, `first_webhook_configured`, `time_to_activation`.

---

## What I'm NOT building in this PR (Phase 1+)
- Webhook delivery edge function (Phase 1, ~1 week)
- Submission inbox UI (Phase 1)
- Framework SDK docs pages (Phase 1)
- Slack/Sheets integrations (Phase 2)
- AI summaries (Phase 2)
- Agency white-label/custom domains (Phase 3)

This PR is **positioning + data model foundation only** so the next prompts can ship features fast against a stable schema.

---

## Files to change
- `src/components/Hero.tsx` — full rewrite
- `src/pages/Index.tsx` — reorder, swap components
- `src/components/Pricing.tsx` — copy + plan rewrite
- `src/components/FAQ.tsx` — dev/agency objections
- `src/components/Navbar.tsx` — nav links: Product, Pricing, Docs, Agencies
- `index.html` — SEO title/meta
- **NEW**: `src/components/landing/CodeShowcase.tsx`
- **NEW**: `src/components/landing/WebhookShowcase.tsx`
- **NEW**: `src/components/landing/DeveloperFeatures.tsx`
- **NEW**: `src/components/landing/UseCases.tsx`
- **NEW** migration: workspaces, webhook_endpoints, webhook_deliveries, routing_rules, submission tags/status, api_tokens + RLS

## Memory updates
- Add core rule: positioning is "form backend + routing for modern websites" — never "Typeform alternative."
- New memory file: `mem://strategy/dev-agency-positioning`.
