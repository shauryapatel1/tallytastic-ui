import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SubmissionStatus = Database["public"]["Enums"]["submission_status"];
export type WebhookDeliveryStatus =
  Database["public"]["Enums"]["webhook_delivery_status"];

export interface SubmissionListItem {
  id: string; // form_response.id
  formId: string;
  formTitle: string | null;
  workspaceId: string;
  submittedAt: string;
  status: SubmissionStatus;
  tags: string[];
  assignedTo: string | null;
  preview: string;
  data: Record<string, unknown>;
}

export interface SubmissionDetail extends SubmissionListItem {
  notes: string | null;
  aiSummary: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface SubmissionEvent {
  id: string;
  eventType: string;
  actorId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface WebhookDelivery {
  id: string;
  endpointId: string;
  status: WebhookDeliveryStatus;
  attempt: number;
  responseCode: number | null;
  errorMessage: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

export interface ListSubmissionsFilters {
  workspaceId: string;
  status?: SubmissionStatus | "all";
  formId?: string;
  search?: string;
  limit?: number;
}

function buildPreview(data: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [, value] of Object.entries(data)) {
    if (value == null || value === "") continue;
    const str = typeof value === "string" ? value : JSON.stringify(value);
    parts.push(str.slice(0, 80));
    if (parts.join(" · ").length > 140) break;
  }
  return parts.join(" · ").slice(0, 160) || "(empty submission)";
}

export const submissionsService = {
  async listSubmissions(
    filters: ListSubmissionsFilters,
  ): Promise<SubmissionListItem[]> {
    const { workspaceId, status, formId, limit = 100 } = filters;

    // Pull responses for forms in this workspace, joined with metadata + form title.
    let query = supabase
      .from("form_responses" as never)
      .select(
        `
        id, form_id, submitted_at, data,
        forms!inner(id, title, workspace_id),
        submission_metadata(status, tags, assigned_to, workspace_id)
      `,
      )
      .eq("forms.workspace_id" as never, workspaceId)
      .order("submitted_at", { ascending: false })
      .limit(limit);

    if (formId) query = query.eq("form_id" as never, formId);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as unknown as Array<{
      id: string;
      form_id: string;
      submitted_at: string;
      data: Record<string, unknown>;
      forms: { id: string; title: string | null; workspace_id: string };
      submission_metadata: Array<{
        status: SubmissionStatus;
        tags: string[];
        assigned_to: string | null;
        workspace_id: string;
      }>;
    }>;

    const mapped: SubmissionListItem[] = rows.map((r) => {
      const meta = r.submission_metadata?.[0];
      return {
        id: r.id,
        formId: r.form_id,
        formTitle: r.forms?.title ?? null,
        workspaceId: r.forms?.workspace_id ?? workspaceId,
        submittedAt: r.submitted_at,
        status: meta?.status ?? "new",
        tags: meta?.tags ?? [],
        assignedTo: meta?.assigned_to ?? null,
        preview: buildPreview(r.data ?? {}),
        data: r.data ?? {},
      };
    });

    if (status && status !== "all") {
      return mapped.filter((m) => m.status === status);
    }
    return mapped;
  },

  async getSubmission(responseId: string): Promise<SubmissionDetail | null> {
    const { data, error } = await supabase
      .from("form_responses" as never)
      .select(
        `
        id, form_id, submitted_at, data, metadata, ip_address, user_agent,
        forms!inner(id, title, workspace_id),
        submission_metadata(status, tags, assigned_to, notes, ai_summary, workspace_id)
      `,
      )
      .eq("id", responseId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const r = data as unknown as {
      id: string;
      form_id: string;
      submitted_at: string;
      data: Record<string, unknown>;
      metadata: Record<string, unknown>;
      ip_address: string | null;
      user_agent: string | null;
      forms: { id: string; title: string | null; workspace_id: string };
      submission_metadata: Array<{
        status: SubmissionStatus;
        tags: string[];
        assigned_to: string | null;
        notes: string | null;
        ai_summary: string | null;
        workspace_id: string;
      }>;
    };
    const meta = r.submission_metadata?.[0];

    return {
      id: r.id,
      formId: r.form_id,
      formTitle: r.forms?.title ?? null,
      workspaceId: r.forms?.workspace_id,
      submittedAt: r.submitted_at,
      status: meta?.status ?? "new",
      tags: meta?.tags ?? [],
      assignedTo: meta?.assigned_to ?? null,
      notes: meta?.notes ?? null,
      aiSummary: meta?.ai_summary ?? null,
      preview: buildPreview(r.data ?? {}),
      data: r.data ?? {},
      metadata: r.metadata ?? {},
      ipAddress: r.ip_address,
      userAgent: r.user_agent,
    };
  },

  async listEvents(responseId: string): Promise<SubmissionEvent[]> {
    const { data, error } = await supabase
      .from("submission_events" as never)
      .select("id, event_type, actor_id, payload, created_at")
      .eq("form_response_id", responseId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return ((data ?? []) as unknown as Array<{
      id: string;
      event_type: string;
      actor_id: string | null;
      payload: Record<string, unknown>;
      created_at: string;
    }>).map((e) => ({
      id: e.id,
      eventType: e.event_type,
      actorId: e.actor_id,
      payload: e.payload ?? {},
      createdAt: e.created_at,
    }));
  },

  async listWebhookDeliveries(
    responseId: string,
  ): Promise<WebhookDelivery[]> {
    const { data, error } = await supabase
      .from("webhook_deliveries")
      .select(
        "id, endpoint_id, status, attempt, response_code, error_message, created_at, delivered_at",
      )
      .eq("submission_id", responseId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((d) => ({
      id: d.id,
      endpointId: d.endpoint_id,
      status: d.status,
      attempt: d.attempt,
      responseCode: d.response_code,
      errorMessage: d.error_message,
      createdAt: d.created_at,
      deliveredAt: d.delivered_at,
    }));
  },

  async setStatus(
    responseId: string,
    workspaceId: string,
    status: SubmissionStatus,
    actorId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("submission_metadata")
      .update({ status })
      .eq("form_response_id", responseId);
    if (error) throw error;
    await supabase.from("submission_events").insert({
      form_response_id: responseId,
      workspace_id: workspaceId,
      actor_id: actorId,
      event_type: "status_changed",
      payload: { status },
    });
  },

  async addNote(
    responseId: string,
    workspaceId: string,
    note: string,
    actorId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("submission_metadata")
      .update({ notes: note })
      .eq("form_response_id", responseId);
    if (error) throw error;
    await supabase.from("submission_events").insert({
      form_response_id: responseId,
      workspace_id: workspaceId,
      actor_id: actorId,
      event_type: "note_added",
      payload: { note },
    });
  },

  async addTag(
    responseId: string,
    workspaceId: string,
    tag: string,
    actorId: string,
    currentTags: string[],
  ): Promise<void> {
    if (currentTags.includes(tag)) return;
    const next = [...currentTags, tag];
    const { error } = await supabase
      .from("submission_metadata")
      .update({ tags: next })
      .eq("form_response_id", responseId);
    if (error) throw error;
    await supabase.from("submission_events").insert({
      form_response_id: responseId,
      workspace_id: workspaceId,
      actor_id: actorId,
      event_type: "tag_added",
      payload: { tag },
    });
  },

  async removeTag(
    responseId: string,
    tag: string,
    currentTags: string[],
  ): Promise<void> {
    const next = currentTags.filter((t) => t !== tag);
    const { error } = await supabase
      .from("submission_metadata")
      .update({ tags: next })
      .eq("form_response_id", responseId);
    if (error) throw error;
  },

  async resendWebhook(deliveryId: string): Promise<{ deliveryId: string }> {
    const { data, error } = await supabase.functions.invoke("resend-webhook", {
      body: { deliveryId },
    });
    if (error) throw error;
    return data as { deliveryId: string };
  },
};