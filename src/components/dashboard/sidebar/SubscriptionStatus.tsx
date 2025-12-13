import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionStatusProps {
  isCollapsed: boolean;
}

export function SubscriptionStatus({ isCollapsed }: SubscriptionStatusProps) {
  const { subscription, quota, isLoading, startCheckout } = useSubscription();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className={cn(
        "p-3 border-t",
        isCollapsed && "flex justify-center"
      )}>
        <div className="h-16 animate-pulse bg-muted rounded" />
      </div>
    );
  }
  
  const isPro = subscription.plan !== "free";
  
  if (isCollapsed) {
    return (
      <div className="p-3 border-t flex flex-col items-center gap-2">
        {isPro ? (
          <Crown className="h-5 w-5 text-amber-500" />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => startCheckout("pro")}
            title="Upgrade to Pro"
          >
            <Zap className="h-5 w-5 text-primary" />
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="p-3 border-t">
      <div className="space-y-3">
        {/* Plan Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPro ? (
              <Crown className="h-4 w-4 text-amber-500" />
            ) : (
              <Zap className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium capitalize">
              {subscription.plan} Plan
            </span>
          </div>
        </div>
        
        {/* Quota Usage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Responses</span>
            <span className={cn(
              "font-medium",
              quota.percentUsed >= 90 ? "text-destructive" : "text-foreground"
            )}>
              {quota.responsesUsed} / {quota.responseLimit === 1000000 ? "∞" : quota.responseLimit.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={quota.percentUsed} 
            className={cn(
              "h-1.5",
              quota.percentUsed >= 90 && "[&>div]:bg-destructive"
            )}
          />
        </div>
        
        {/* Upgrade Button for Free Users */}
        {!isPro && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => startCheckout("pro")}
          >
            <Zap className="h-3 w-3 mr-1.5" />
            Upgrade to Pro
          </Button>
        )}
        
        {/* Warning if near limit */}
        {quota.percentUsed >= 80 && !isPro && (
          <p className="text-xs text-destructive">
            {quota.percentUsed >= 100 
              ? "Limit reached! Upgrade to continue."
              : "Approaching response limit"}
          </p>
        )}
      </div>
    </div>
  );
}
