# Memory: index.md
Updated: just now

# Project Memory

## Core
- Product is **Ingrid** (NEVER "FormCraft" or "Tallytastic"). Positioning: "Capture submissions, route work, and automate follow-up." Descriptor: "The inbound engine for forms, routing, and workflow."
- Brand strings live in `src/config/brand.ts` — use `BRAND.name`/etc. for new UI copy. Internal identifiers (DB tables, enums, edge function names, embed postMessage `formcraft-resize`) intentionally NOT renamed for backwards compatibility — see `docs/REBRAND_NOTICE.md`.
- Stack: React, Vite, TS, Tailwind, shadcn/ui, Supabase (DB/Auth/Edge), Stripe, PostHog.
- Builder UX: 3-panel layout, simple WYSIWYG preview that perfectly matches public rendering.
- Modes: Classic (standard) and Conversational (keyboard-first, 1-by-1). Identical submission logic.
- Security: Submissions via `submit-form` Edge Function. Rate limited, validated against `published_version_id`.
- Analytics: PostHog for app events, `form_events` for journeys. Respect DNT, strip PII.
- Billing: Stripe webhook Edge Functions manage quotas. Enforced on submission, show upgrade paths.
- Workflow: Linear 6-step creation: Create → Build → Preview → Publish → Share → Analyze.

## Memories
- [Rebrand to Ingrid](mem://strategy/ingrid-rebrand) — Brand changeover from FormCraft, what was renamed vs. preserved, and risky areas.
- [Preview Constraint](mem://constraints/preview-must-match-public) — Preview must render exactly identical to public form with device toggles.
- [Conversational UX](mem://features/conversational-ux) — Keyboard navigation rules, transitions, and inline validation.
- [Builder UX](mem://features/builder-ux) — Typeform-style 3 panels, 14 field types, and drag-and-drop.
- [Public Form Modes](mem://features/public-form-modes) — Classic vs Conversational toggles and implementation logic.
- [Event Tracking](mem://architecture/event-tracking) — Dual tracking system combining PostHog and form_events table.
- [6-Step Workflow](mem://features/6-step-workflow) — Strict gating from Create through Analyze with status badges.
- [Publish Readiness](mem://features/publish-readiness-checks) — Required validations before transitioning from Draft to Published.
- [Embed Tracking](mem://features/embed-and-tracking) — Iframe embed specs, auto-resize, and metadata capture.
- [Subscription Model](mem://billing/free-pro-plan-model) — Free/Pro quota management system via Stripe.
- [Stripe Webhooks](mem://architecture/stripe-webhook-edge-function) — Edge function implementation for handling Stripe events.
- [Quota Enforcement](mem://billing/quota-enforcement-logic) — Logic for enforcing response limits and showing upgrade prompts.
- [FormCard Navigation](mem://workflow/formcard-smart-navigation) — Smart routing logic based on form status and responses.
- [Subscription UI](mem://billing/subscription-status-visibility) — Dashboard persistent sidebar for plan and quota monitoring.
- [Secure Submission](mem://architecture/secure-submission-engine) — Rate limits and server validation in the submit-form function.
- [Redirect Validation](mem://security/redirect-url-validation) — Open redirect and XSS protection on form redirect URLs.
- [User Data Deletion](mem://features/user-data-deletion) — Cascading deletion handled by delete-user-account edge function.
- [Form Versioning](mem://architecture/form-versioning-system) — Immutable snapshots on publish to protect response data integrity.
- [Dashboard Analytics](mem://features/analytics-dashboard-metrics) — Analyze step layers, trends, and field-level drop-off stats.
- [AI Generator](mem://features/ai-generator-implementation) — Lovable AI (Gemini Flash) edge function with loading skeletons.
- [Template System](mem://features/template-system-v2) — 12 categorized templates with field-level previews.
- [AI Regeneration](mem://features/ai-form-regeneration) — Replace vs Add merge logic for AI builder prompts.
- [Preview Theming](mem://features/preview-and-theming) — Cross-device views and real-time font/color customization.
