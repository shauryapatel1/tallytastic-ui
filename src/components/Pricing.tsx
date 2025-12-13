import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { PLAN_CONFIG } from "@/lib/subscriptionService";

type PlanKey = "free" | "pro" | "enterprise";

type PricingPlanProps = {
  planKey: PlanKey;
  name: string;
  price: string;
  description: string;
  features: readonly { text: string; included: boolean }[];
  popular?: boolean;
  currentPlan: string;
  isSubscribed: boolean;
  onCheckout: (plan: "pro" | "enterprise") => Promise<void>;
  onManage: () => Promise<void>;
  isLoading: boolean;
};

const PricingPlan = ({ 
  planKey,
  name, 
  price, 
  description, 
  features, 
  popular,
  currentPlan,
  isSubscribed,
  onCheckout,
  onManage,
  isLoading
}: PricingPlanProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isCurrentPlan = currentPlan === planKey;
  
  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    if (isCurrentPlan && isSubscribed) {
      setIsProcessing(true);
      await onManage();
      setIsProcessing(false);
      return;
    }
    
    if (planKey === "free") {
      if (isSubscribed) {
        setIsProcessing(true);
        await onManage();
        setIsProcessing(false);
      }
      return;
    }
    
    setIsProcessing(true);
    await onCheckout(planKey as "pro" | "enterprise");
    setIsProcessing(false);
  };
  
  const getButtonText = () => {
    if (isProcessing || isLoading) return "Loading...";
    if (!isAuthenticated) return "Get started";
    if (isCurrentPlan) {
      if (planKey === "free") return "Current plan";
      return "Manage subscription";
    }
    if (planKey === "free") {
      return isSubscribed ? "Downgrade" : "Current plan";
    }
    return "Upgrade";
  };
  
  const isButtonDisabled = () => {
    if (isProcessing || isLoading) return true;
    if (isCurrentPlan && planKey === "free" && !isSubscribed) return true;
    return false;
  };
  
  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-lg relative' : 'border-border'} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Your Plan
        </div>
      )}
      
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold mb-2">{name}</CardTitle>
        <div className="mb-2 text-primary/60 text-sm">{description}</div>
      </CardHeader>
      
      <CardContent className="py-6 flex-1">
        <div className="mb-6">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-primary/60">/month</span>}
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-primary/40'}`}>
                <Check className="h-4 w-4" />
              </span>
              <span className={feature.included ? 'text-primary/80' : 'text-primary/40'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          onClick={handleClick}
          disabled={isButtonDisabled()}
        >
          {(isProcessing || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const { subscription, isLoading, startCheckout, manageSubscription } = useSubscription();
  
  const plans: { key: PlanKey; popular: boolean; description: string }[] = [
    { key: "free", popular: false, description: "Perfect for trying out FormCraft" },
    { key: "pro", popular: true, description: "Best for professionals & small teams" },
    { key: "enterprise", popular: false, description: "For organizations with advanced needs" },
  ];
  
  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-primary/60">
            Start for free, upgrade as you grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const config = PLAN_CONFIG[plan.key];
            return (
              <PricingPlan
                key={plan.key}
                planKey={plan.key}
                name={config.name}
                price={config.price}
                description={plan.description}
                features={config.features}
                popular={plan.popular}
                currentPlan={isAuthenticated ? subscription.plan : "free"}
                isSubscribed={subscription.subscribed}
                onCheckout={startCheckout}
                onManage={manageSubscription}
                isLoading={isLoading}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
