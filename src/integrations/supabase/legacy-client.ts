/**
 * Legacy-typed Supabase client.
 *
 * The auto-generated `Database` types currently only cover the tables added in
 * the Phase 0 (workspaces / webhook / routing / submission_metadata / api_tokens)
 * migration. The `forms`, `form_responses`, `form_events`, `form_versions`,
 * `subscribers`, `user_quota_usage`, and `profiles` tables exist in the
 * database but are not yet in the generated types file.
 *
 * Use this client at any call site that touches those legacy tables. It is the
 * exact same runtime client — just typed as `any` so existing code compiles
 * until the types regenerate to include all tables.
 */
import { supabase } from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseLegacy: any = supabase;
