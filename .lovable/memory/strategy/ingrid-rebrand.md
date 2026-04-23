---
name: Ingrid Rebrand
description: Product rebranded from FormCraft/Tallytastic to Ingrid. What changed publicly vs. what was preserved internally for backwards-compat.
type: constraint
---

The product is **Ingrid**. Never call it "FormCraft" or "Tallytastic" in any user-facing string, copy, meta tag, or asset.

## Renamed (public-facing)
- All UI copy, marketing strings, navbar/sidebar logos, footer, auth screens, "Powered by" footer.
- HTML `<title>`, meta description, OG tags, author tag.
- Code samples on landing page now use `https://api.ingrid.dev/...`.
- Toast messages ("Welcome to Ingrid", etc.).

## Preserved (internal — DO NOT rename)
**Why:** renaming these would break customer integrations, billing reconciliation, deployed embeds, or require destructive Postgres migrations.

- Database table names: `forms`, `form_responses`, `form_events`, `workspaces`, etc.
- Postgres enum types: `workspace_role`, `submission_status`, `webhook_delivery_status`.
- Edge function names: `submit-form`, `generate-form`, `stripe-webhook`, `delete-user-account`, `check-subscription`, `create-checkout`, `customer-portal`.
- Public API endpoint paths and request/response shapes.
- Webhook signature header name and payload contract.
- Stripe product/price IDs and metadata.
- Supabase project ref and `.lovable.app` published URL (until a custom domain is set up).

## Soft-migrated with legacy fallback
- `sessionStorage` key: now `ingrid_session_id`, but `formcraft_session_id` is read on startup so returning users keep their session id.
- iframe postMessage event type: emits both `ingrid-resize` (new) AND `formcraft-resize` (legacy) so already-installed embeds keep auto-resizing.
- Iframe DOM id: new embed code uses `ingrid-embed-{id}`, but the embed listener accepts both event types.

## How to add new brand strings
Import from `src/config/brand.ts`:
```ts
import { BRAND } from "@/config/brand";
// BRAND.name, BRAND.tagline, BRAND.positioning, BRAND.metaDescription, BRAND.apiHost, etc.
```
Never hardcode "Ingrid" in new files — always reference the constant so future renames are one-line changes.

See `docs/REBRAND_NOTICE.md` for the full audit and migration notes.

## Design system + UX direction
The full brand foundation, color tokens, type scale, IA, and screen-by-screen UX brief is in **`docs/design/INGRID_BRAND_AND_UX_BRIEF.md`**. The phased build plan (Phase 1 design tokens → Phase 4 marketing polish) is in **`.lovable/plan.md`**. Read those before starting any visual / IA work — they define palette (Indigo `#5B6CFF` accent on Cloud/Mist neutrals + Midnight dark), top nav order (Overview · Forms · Submissions · Routing · Integrations · …), and the rule that the **Submissions Inbox** is the emotional center of the app.

## CTO-approved execution rules (from plan v2)
- **Phase 0 status:** positioning is *defined; rollout in progress* — a final sweep for stray FormCraft/Tallytastic copy and asset references is still pending. Do not mark Phase 0 shipped until that sweep is done.
- **No raw colors / legacy patterns on new Ingrid surfaces.** Semantic tokens only.
- **No hybrid screens.** A page is either fully migrated to the new shell + tokens, or untouched.
- **Inbox > dashboard polish.** When trade-offs arise, Submissions Inbox usability wins.
- **Status taxonomy is global** — submissions, routing, webhooks, integrations all share the same language.
- **Planned ≠ live.** Slack / Sheets / HubSpot must be labeled "Planned" until they actually work.
- **Legacy components must be re-tokenized before reuse** on any new Ingrid surface.
- **Phase 3 is split into 3A (backend readiness audit) → 3B (inbox UI) → 3C (other operational surfaces).** Frontend cannot start 3B until the 3A gap report closes.
- Every page must meet the "Definition of Ingrid UI done" checklist in `.lovable/plan.md` before being considered complete.
