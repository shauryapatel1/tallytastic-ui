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
