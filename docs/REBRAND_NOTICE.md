# Rebrand: FormCraft / Tallytastic → Ingrid

**Effective**: 2026-04-22

## Summary

The product previously known as **FormCraft** (and earlier internally as
**Tallytastic**) has been rebranded to **Ingrid**.

- **New name**: Ingrid
- **New positioning**: Capture submissions, route work, and automate follow-up.
- **New descriptor**: The inbound engine for forms, routing, and workflow.

## What Changed

### Public-facing
- All UI strings, marketing copy, meta tags, OG tags, and the `<title>` tag
  now say **Ingrid**.
- Public form footer now reads "Powered by Ingrid".
- Auth flows ("Welcome to Ingrid", "Create your Ingrid Account") updated.
- Code samples on the landing page now use `https://api.ingrid.dev/...`.
- Brand strings are centralized in `src/config/brand.ts` for future updates.

### Internal — Preserved for Compatibility
The following identifiers were **deliberately not renamed** to preserve API,
webhook, and embed compatibility:

| Identifier | Reason |
|---|---|
| Database tables (`forms`, `form_responses`, `form_events`, …) | Renaming would require destructive migration and break existing RLS policies, edge functions, and the typed Supabase client. |
| Public submit endpoint paths | Already-deployed forms POST to existing routes; renaming would break customer integrations. |
| Webhook signature header (`X-Webhook-Signature`) | Already documented and consumed by customer endpoints. |
| Stripe product/price IDs and metadata | Renaming would break billing reconciliation; will be migrated on the next plan change. |
| Supabase enums (`workspace_role`, `submission_status`, …) | Renaming Postgres enums in production requires a schema migration; not worth the risk for a brand change. |
| Edge function names (`submit-form`, `generate-form`, `stripe-webhook`, …) | Function URLs are referenced by the frontend client and any external automations; stable names are part of the contract. |
| `formcraft-resize` postMessage event type | Already-installed embeds listen for this exact type. We now emit BOTH `ingrid-resize` (new) and `formcraft-resize` (legacy) so existing embeds keep working. |
| `formcraft-embed-{id}` iframe id (in already-copied embed snippets) | Live HTML on customer sites already references this id. New embed code generated from the dashboard now uses `ingrid-embed-{id}`, but the listener accepts both event types. |

### Soft-migrated (legacy fallback in place)
- `sessionStorage` analytics key migrated from `formcraft_session_id` →
  `ingrid_session_id`. The legacy key is read on startup and copied to the
  new key for continuity of returning sessions.

## Risky Rename Areas — Reported, NOT Modified

These areas were audited and intentionally left alone. Each requires a
scheduled, versioned migration before being touched:

1. **Custom domain / Lovable preview URL** — `tallytastic-ui.lovable.app` is
   the published URL. If we move to `ingrid.lovable.app` (or a custom
   `ingrid.dev`), we must:
   - Set up 301 redirects from the old host
   - Update Stripe webhook callback URL
   - Update OAuth/social-auth redirect URLs in Supabase Auth config
   - Update any customer-side webhook URLs that target our domain
   - Update sitemap and canonical tags
2. **Supabase project name / ref** — kept as-is. The project ref is part of
   the URL of every edge function and the auth client; changing it would be
   a full re-deploy with downtime.
3. **Database table & enum names** — see table above.
4. **Public API contract** — endpoint paths, request/response shapes, and
   error codes are unchanged. A future v2 API can use `ingrid`-prefixed
   resources if desired.
5. **Email sender domain** — currently uses Lovable's default sender. When a
   custom email domain is configured, it should be a subdomain of `ingrid`'s
   domain (e.g., `notify.ingrid.dev`).
6. **Favicon / OG image asset** — `public/og-image.png` and the favicon
   still reference the old visual identity. The image files themselves were
   not regenerated as part of this rebrand; replace them when new
   brand assets are available.

## How to Update Brand Strings Going Forward

All user-facing brand strings should be sourced from `src/config/brand.ts`:

```ts
import { BRAND } from "@/config/brand";

<h1>{BRAND.name}</h1>
<meta property="og:title" content={`${BRAND.name} — ${BRAND.tagline}`} />
```

This keeps future renames to a single file change.
