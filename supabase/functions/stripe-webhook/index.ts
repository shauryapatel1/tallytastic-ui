import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

// Plan configuration
const PLAN_CONFIG: Record<string, { plan: string; response_limit: number }> = {
  "prod_Tak3tez8VZ35AI": { plan: "pro", response_limit: 5000 },
  "prod_Tak3jRU4d48ItC": { plan: "enterprise", response_limit: 1000000 }, // Effectively unlimited
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

async function updateUserQuota(customerId: string, productId: string | null) {
  logStep("Updating user quota", { customerId, productId });
  
  // Get customer email from Stripe
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || customer.deleted) {
    logStep("Customer not found or deleted");
    return;
  }
  
  const email = (customer as Stripe.Customer).email;
  if (!email) {
    logStep("Customer has no email");
    return;
  }

  // Find user by email
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
  if (userError) {
    logStep("Error listing users", { error: userError.message });
    return;
  }
  
  const user = userData.users.find(u => u.email === email);
  if (!user) {
    logStep("User not found for email", { email });
    return;
  }

  // Determine plan and limits
  let plan = "free";
  let responseLimit = 100;
  
  if (productId && PLAN_CONFIG[productId]) {
    plan = PLAN_CONFIG[productId].plan;
    responseLimit = PLAN_CONFIG[productId].response_limit;
  }

  // Upsert quota record
  const { error: upsertError } = await supabaseAdmin
    .from("quotas")
    .upsert({
      user_id: user.id,
      plan,
      response_limit: responseLimit,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id",
    });

  if (upsertError) {
    logStep("Error upserting quota", { error: upsertError.message });
  } else {
    logStep("Quota updated successfully", { userId: user.id, plan, responseLimit });
  }
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    logStep("Missing signature or webhook secret");
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Webhook event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { sessionId: session.id });
        
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const productId = subscription.items.data[0]?.price?.product as string;
          await updateUserQuota(session.customer as string, productId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { 
          subscriptionId: subscription.id, 
          status: subscription.status 
        });
        
        if (subscription.status === "active") {
          const productId = subscription.items.data[0]?.price?.product as string;
          await updateUserQuota(subscription.customer as string, productId);
        } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
          // Downgrade to free
          await updateUserQuota(subscription.customer as string, null);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { subscriptionId: subscription.id });
        await updateUserQuota(subscription.customer as string, null);
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Webhook error", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
});
