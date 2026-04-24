import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Re-enqueues a failed/dead webhook delivery by inserting a new
 * webhook_deliveries row with attempt+1 referencing the same endpoint.
 * The actual HTTP fan-out is owned by the existing webhook dispatcher;
 * this endpoint just resets state so it gets picked up again.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller identity using their JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const deliveryId: string | undefined = body?.deliveryId;
    if (!deliveryId || typeof deliveryId !== "string") {
      return new Response(JSON.stringify({ error: "deliveryId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Fetch the delivery + endpoint workspace
    const { data: delivery, error: dErr } = await admin
      .from("webhook_deliveries")
      .select(
        "id, endpoint_id, submission_id, request_payload, attempt, max_attempts, webhook_endpoints!inner(workspace_id)",
      )
      .eq("id", deliveryId)
      .single();

    if (dErr || !delivery) {
      return new Response(
        JSON.stringify({ error: "Delivery not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // deno-lint-ignore no-explicit-any
    const workspaceId = (delivery as any).webhook_endpoints.workspace_id;

    // Authorize: caller must be a member of the workspace
    const { data: isMember } = await admin.rpc("is_workspace_member", {
      _workspace_id: workspaceId,
      _user_id: user.id,
    });
    if (!isMember) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert a fresh delivery (attempt + 1) — pending status
    const { data: newDelivery, error: insErr } = await admin
      .from("webhook_deliveries")
      .insert({
        endpoint_id: delivery.endpoint_id,
        submission_id: delivery.submission_id,
        request_payload: delivery.request_payload,
        attempt: (delivery.attempt ?? 0) + 1,
        max_attempts: delivery.max_attempts ?? 5,
        status: "pending",
        next_retry_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insErr) {
      console.error("[resend-webhook] insert error", insErr);
      return new Response(
        JSON.stringify({ error: "Failed to enqueue delivery" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Audit on the submission timeline
    await admin.from("submission_events").insert({
      form_response_id: delivery.submission_id,
      workspace_id: workspaceId,
      actor_id: user.id,
      event_type: "webhook_resent",
      payload: {
        original_delivery_id: deliveryId,
        new_delivery_id: newDelivery.id,
        endpoint_id: delivery.endpoint_id,
      },
    });

    return new Response(
      JSON.stringify({ success: true, deliveryId: newDelivery.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[resend-webhook] unexpected", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});