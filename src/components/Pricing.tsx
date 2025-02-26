
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type PlanFeature = {
  text: string;
  included: boolean;
};

type PricingPlanProps = {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
};

const PricingPlan = ({ name, price, description, features, popular }: PricingPlanProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-lg relative' : 'border-border'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
          Most Popular
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
          onClick={() => navigate("/auth")}
        >
          Get started
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out FormCraft",
      popular: false,
      features: [
        { text: "3 forms", included: true },
        { text: "100 responses/month", included: true },
        { text: "Basic form fields", included: true },
        { text: "Email notifications", included: true },
        { text: "Custom branding", included: false },
        { text: "File uploads", included: false },
        { text: "Conditional logic", included: false },
        { text: "API access", included: false },
      ]
    },
    {
      name: "Professional",
      price: "$29",
      description: "Best for professionals & small teams",
      popular: true,
      features: [
        { text: "Unlimited forms", included: true },
        { text: "5,000 responses/month", included: true },
        { text: "All form fields", included: true },
        { text: "Email notifications", included: true },
        { text: "Custom branding", included: true },
        { text: "File uploads", included: true },
        { text: "Conditional logic", included: true },
        { text: "API access", included: false },
      ]
    },
    {
      name: "Enterprise",
      price: "$89",
      description: "For organizations with advanced needs",
      popular: false,
      features: [
        { text: "Unlimited forms", included: true },
        { text: "Unlimited responses", included: true },
        { text: "All form fields", included: true },
        { text: "Email notifications", included: true },
        { text: "Custom branding", included: true },
        { text: "File uploads", included: true },
        { text: "Conditional logic", included: true },
        { text: "API access", included: true },
      ]
    }
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
          {plans.map((plan) => (
            <PricingPlan
              key={plan.name}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
