import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionStatus {
  subscribed: boolean;
  plan: "free" | "pro" | "enterprise";
  productId: string | null;
  subscriptionEnd: string | null;
}

export interface QuotaStatus {
  plan: string;
  responseLimit: number;
  responsesUsed: number;
  canSubmit: boolean;
  percentUsed: number;
}

// Plan configuration matching Stripe products
export const PLAN_CONFIG = {
  free: {
    name: "Starter",
    priceId: null,
    productId: null,
    price: "Free",
    responseLimit: 100,
    features: [
      { text: "3 forms", included: true },
      { text: "100 responses/month", included: true },
      { text: "Basic form fields", included: true },
      { text: "Email notifications", included: true },
      { text: "Custom branding", included: false },
      { text: "File uploads", included: false },
      { text: "Conditional logic", included: false },
      { text: "API access", included: false },
    ],
  },
  pro: {
    name: "Professional",
    priceId: "price_1SdYZ6BQDRhzaJ6U4hE3F6FS",
    productId: "prod_Tak3tez8VZ35AI",
    price: "$29",
    responseLimit: 5000,
    features: [
      { text: "Unlimited forms", included: true },
      { text: "5,000 responses/month", included: true },
      { text: "All form fields", included: true },
      { text: "Email notifications", included: true },
      { text: "Custom branding", included: true },
      { text: "File uploads", included: true },
      { text: "Conditional logic", included: true },
      { text: "API access", included: false },
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceId: "price_1SdYZCBQDRhzaJ6UjgsDdKQt",
    productId: "prod_Tak3jRU4d48ItC",
    price: "$89",
    responseLimit: 1000000,
    features: [
      { text: "Unlimited forms", included: true },
      { text: "Unlimited responses", included: true },
      { text: "All form fields", included: true },
      { text: "Email notifications", included: true },
      { text: "Custom branding", included: true },
      { text: "File uploads", included: true },
      { text: "Conditional logic", included: true },
      { text: "API access", included: true },
    ],
  },
} as const;

export async function checkSubscription(): Promise<SubscriptionStatus> {
  try {
    const { data, error } = await supabase.functions.invoke("check-subscription");
    
    if (error) {
      console.error("Error checking subscription:", error);
      return { subscribed: false, plan: "free", productId: null, subscriptionEnd: null };
    }

    return {
      subscribed: data.subscribed,
      plan: data.plan || "free",
      productId: data.product_id,
      subscriptionEnd: data.subscription_end,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { subscribed: false, plan: "free", productId: null, subscriptionEnd: null };
  }
}

export async function createCheckout(priceId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId },
    });

    if (error) {
      console.error("Error creating checkout:", error);
      return null;
    }

    return data.url;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return null;
  }
}

export async function openCustomerPortal(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("customer-portal");

    if (error) {
      console.error("Error opening customer portal:", error);
      return null;
    }

    return data.url;
  } catch (error) {
    console.error("Error opening customer portal:", error);
    return null;
  }
}

export async function getQuotaStatus(userId: string): Promise<QuotaStatus> {
  try {
    // Get user's quota
    const { data: quota, error: quotaError } = await supabase
      .from("quotas")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (quotaError) {
      console.error("Error fetching quota:", quotaError);
    }

    const plan = quota?.plan || "free";
    const responseLimit = quota?.response_limit || 100;

    // Get current month's response count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: responsesUsed, error: countError } = await supabase
      .from("form_responses")
      .select("id, forms!inner(user_id)", { count: "exact", head: true })
      .gte("submitted_at", startOfMonth.toISOString())
      .eq("forms.user_id", userId);

    if (countError) {
      console.error("Error counting responses:", countError);
    }

    const used = responsesUsed || 0;
    const percentUsed = Math.min((used / responseLimit) * 100, 100);

    return {
      plan,
      responseLimit,
      responsesUsed: used,
      canSubmit: used < responseLimit,
      percentUsed,
    };
  } catch (error) {
    console.error("Error getting quota status:", error);
    return {
      plan: "free",
      responseLimit: 100,
      responsesUsed: 0,
      canSubmit: true,
      percentUsed: 0,
    };
  }
}

export async function checkFormOwnerQuota(formId: string): Promise<{ canSubmit: boolean; message?: string }> {
  try {
    // Get form owner
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("user_id")
      .eq("id", formId)
      .single();

    if (formError || !form) {
      console.error("Error fetching form:", formError);
      return { canSubmit: true }; // Allow on error
    }

    const quotaStatus = await getQuotaStatus(form.user_id);
    
    if (!quotaStatus.canSubmit) {
      return {
        canSubmit: false,
        message: "This form has reached its monthly response limit. Please contact the form owner.",
      };
    }

    return { canSubmit: true };
  } catch (error) {
    console.error("Error checking form owner quota:", error);
    return { canSubmit: true }; // Allow on error
  }
}
