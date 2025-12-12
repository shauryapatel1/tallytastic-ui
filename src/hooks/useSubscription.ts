import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import {
  checkSubscription,
  createCheckout,
  openCustomerPortal,
  getQuotaStatus,
  SubscriptionStatus,
  QuotaStatus,
  PLAN_CONFIG,
} from "@/lib/subscriptionService";

export function useSubscription() {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    plan: "free",
    productId: null,
    subscriptionEnd: null,
  });
  const [quota, setQuota] = useState<QuotaStatus>({
    plan: "free",
    responseLimit: 100,
    responsesUsed: 0,
    canSubmit: true,
    percentUsed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setSubscription({ subscribed: false, plan: "free", productId: null, subscriptionEnd: null });
      setQuota({ plan: "free", responseLimit: 100, responsesUsed: 0, canSubmit: true, percentUsed: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [subStatus, quotaStatus] = await Promise.all([
        checkSubscription(),
        getQuotaStatus(user.id),
      ]);
      setSubscription(subStatus);
      setQuota(quotaStatus);
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  // Refresh on URL change (after checkout)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      // Wait a bit for webhook to process
      setTimeout(refreshSubscription, 2000);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [refreshSubscription]);

  const startCheckout = async (plan: "pro" | "enterprise") => {
    const priceId = PLAN_CONFIG[plan].priceId;
    if (!priceId) return;

    const url = await createCheckout(priceId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const manageSubscription = async () => {
    const url = await openCustomerPortal();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return {
    subscription,
    quota,
    isLoading,
    refreshSubscription,
    startCheckout,
    manageSubscription,
    planConfig: PLAN_CONFIG,
  };
}
