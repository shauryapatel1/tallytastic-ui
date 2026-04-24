# Phase 3A — Submissions Inbox Backend Readiness Audit

**Status:** 🔴 Blocker found. Inbox UI cannot be safely built until the gaps below are closed.

## TL;DR

The Lovable Cloud database **only contains the Phase-0 workspace/inbox-shell tables**
(`workspaces`, `workspace_members`, `routing_rules`, `webhook_endpoints`,
`webhook_deliveries`, `submission_metadata`, `api_tokens`).

The **core product tables that 95% of the app code targets do not exist**:

| Table required by code | Exists in DB? | Status |
|---|---|---|
| `forms` | ❌ no | Missing |
| `form_responses` | ❌ no | Missing |
| `form_versions` | ❌ no | Missing |
| `form_events` | ❌ no | Missing |
| `profiles` | ❌ no | Missing |
| `subscribers` (Stripe) | ❌ no | Missing |
| `user_quota_usage` | ❌ no | Missing |

`src/integrations/supabase/legacy-client.ts` already documents this — it is a
typed-as-`any` escape hatch that lets the app *compile* but every call to
`forms` / `form_responses` will fail at runtime with a 404 from PostgREST.

The inbox table `submission_metadata` references `form_response_id uuid` but
**no FK exists**, because the parent table is missing.

## What the inbox UI needs

Per the Phase 3 brief the Submissions Inbox must support:

1. List submissions across a workspace (filter by form, status, tag, assignee).
2. Open a submission and see the original payload + uploaded files.
3. Persist status transitions (`new → in_progress → done | archived | spam`).
4. Add notes, tags, assignment.
5. Show a timeline of events for the submission (received, status changes,
   webhook deliveries, routing-rule firings, notes).
6. Resend a webhook delivery from the UI.
7. Show webhook delivery health badges.

## Gap matrix

| Capability | Backend support today | Gap |
|---|---|---|
| List submissions | ❌ `form_responses` doesn't exist | Need `forms` + `form_responses` tables, scoped to workspace |
| Submission ↔ workspace link | ⚠️ `forms` is owned by `user_id` in legacy code, but inbox is workspace-scoped | Need `forms.workspace_id` |
| Status / tags / notes / assignment | ✅ `submission_metadata` table | Needs trigger to auto-create row on submission |
| Submission timeline | ❌ no events table for submissions | Need `submission_events` table (or reuse `form_events` once it exists) |
| Webhook delivery health | ✅ `webhook_deliveries` exists | Needs `submission_id` to point at a real `form_responses.id` |
| Webhook resend | ❌ no edge function | Need `resend-webhook` edge function |
| Realtime updates | ❌ publication not configured | Need to add `form_responses` + `submission_metadata` to `supabase_realtime` |

## Risk callouts (per CTO rule "report risky renames separately")

1. **`forms` ownership model conflict.** Existing code keys forms by
   `user_id`. The new inbox is workspace-scoped. Migrating to `workspace_id`
   without a backfill will orphan every existing form. **Recommendation:** add
   `workspace_id` as nullable, backfill from a default personal workspace per
   user, then enforce NOT NULL in a follow-up migration. Keep `user_id` for
   one release as a soft fallback so the legacy dashboard keeps working.

2. **`form_responses → submission_metadata` lifecycle.** The cleanest model is
   1:1 with a trigger that inserts a `submission_metadata` row on every new
   `form_responses` insert. Without this trigger the inbox will silently miss
   submissions captured by the existing `submit-form` edge function.

3. **`webhook_deliveries.submission_id` orphan rows.** Right now this column
   has no FK and points at nothing. We should add the FK once `form_responses`
   exists, but only after backfilling/cleaning existing rows.

4. **RLS scope mismatch.** `submission_metadata` policies use
   `is_workspace_member(workspace_id, ...)`. New `forms` / `form_responses`
   policies must use the **same** helper so the inbox query
   (`form_responses` join `submission_metadata`) doesn't get filtered
   inconsistently.

5. **Public form submissions.** The `submit-form` edge function uses the
   service role and bypasses RLS — that's fine, but the new schema must let
   anonymous users INSERT into `form_responses` *only via the edge function*
   (i.e. no anon RLS policy; service-role only).

## Recommended split

Per the approved CTO note, split Phase 3 as follows.

### Phase 3A.1 — Schema migration (this step, requires user approval)

Single migration that introduces:

- `forms` (workspace-scoped, with `published_version_id`, settings columns).
- `form_versions` (immutable snapshots; required by `submit-form`).
- `form_responses` (workspace-scoped via `forms.workspace_id`, anon insert via service role only).
- `form_events` (interaction telemetry; views/starts/completions).
- `submission_events` (audit log for inbox actions: status change, note added, webhook resent, etc.).
- `profiles` (basic user data).
- `subscribers` + `user_quota_usage` (Stripe quota model).
- FK from `webhook_deliveries.submission_id → form_responses.id`.
- FK from `submission_metadata.form_response_id → form_responses.id`.
- Trigger: on `form_responses` insert → create `submission_metadata` with status='new'.
- Realtime publication for `form_responses`, `submission_metadata`, `submission_events`, `webhook_deliveries`.

### Phase 3A.2 — Edge functions

- `resend-webhook` — re-enqueues a webhook_deliveries row with attempt+1.
- Update `submit-form` to also write a `submission_events` row of type `received`.

### Phase 3A.3 — Service layer

- Replace `supabaseLegacy` reads with typed reads after types regenerate.
- Add `submissionsService.ts`: `listSubmissions`, `getSubmission`,
  `setStatus`, `addNote`, `setAssignee`, `addTag`, `resendWebhook`.

### Phase 3B — Inbox UI (only after 3A.1–3A.3 land)

- Submissions list page using `TableShell` + `StatusChip`.
- Detail panel using `DetailPanel` + `EventLog`.
- Wired to realtime channel.

## Decision requested

Approve the Phase 3A.1 migration set so we can proceed. The migration is
**additive only** — no existing tables are dropped or renamed, so the
workspace/webhook/routing surfaces continue to work unchanged.
