
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Webhook, Mail, CreditCard, Share2, Database, MessageSquare, 
  BellRing, BrainCircuit, ArrowRight, PlusCircle, CheckIcon
} from "lucide-react";

type IntegrationType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: "notifications" | "payments" | "marketing" | "analytics" | "ai";
  setupRequired: boolean;
};

export const IntegrationsPanel = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [integrations, setIntegrations] = useState<IntegrationType[]>([
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect your forms to 4,000+ apps",
      icon: <Webhook className="h-8 w-8 text-orange-500" />,
      enabled: false,
      category: "marketing",
      setupRequired: true
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Add form submissions to your email lists",
      icon: <Mail className="h-8 w-8 text-blue-500" />,
      enabled: false,
      category: "marketing",
      setupRequired: true
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments through your forms",
      icon: <CreditCard className="h-8 w-8 text-purple-500" />,
      enabled: false,
      category: "payments",
      setupRequired: true
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get form submission notifications in Slack",
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      enabled: false,
      category: "notifications",
      setupRequired: true
    },
    {
      id: "google_analytics",
      name: "Google Analytics",
      description: "Track form performance and user behavior",
      icon: <Database className="h-8 w-8 text-yellow-500" />,
      enabled: false,
      category: "analytics",
      setupRequired: true
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Send form data to any custom endpoint",
      icon: <Webhook className="h-8 w-8 text-gray-500" />,
      enabled: false,
      category: "marketing",
      setupRequired: true
    },
    {
      id: "ai_analysis",
      name: "AI Response Analysis",
      description: "Automatically analyze and categorize responses",
      icon: <BrainCircuit className="h-8 w-8 text-indigo-600" />,
      enabled: false,
      category: "ai",
      setupRequired: true
    },
    {
      id: "push_notifications",
      name: "Push Notifications",
      description: "Send browser notifications on form submissions",
      icon: <BellRing className="h-8 w-8 text-red-500" />,
      enabled: false,
      category: "notifications",
      setupRequired: true
    }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map(integration => {
        if (integration.id === id) {
          const newState = !integration.enabled;
          
          // Show toast based on the new state
          toast({
            title: newState ? `${integration.name} enabled` : `${integration.name} disabled`,
            description: newState 
              ? `You've successfully enabled the ${integration.name} integration.` 
              : `You've disabled the ${integration.name} integration.`,
          });
          
          return {
            ...integration,
            enabled: newState
          };
        }
        return integration;
      })
    );
  };

  const setupIntegration = (id: string) => {
    toast({
      title: "Setup required",
      description: `You need to configure this integration before enabling it.`,
    });
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "enabled") return matchesSearch && integration.enabled;
    if (filter === "disabled") return matchesSearch && !integration.enabled;
    return matchesSearch && integration.category === filter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Integrations
        </h1>
        <p className="text-sm text-primary/60 mt-1">
          Connect your forms to external services to extend functionality
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
          <Input
            placeholder="Search integrations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button 
            size="sm" 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === "enabled" ? "default" : "outline"}
            onClick={() => setFilter("enabled")}
          >
            Enabled
          </Button>
          <Button 
            size="sm" 
            variant={filter === "notifications" ? "default" : "outline"}
            onClick={() => setFilter("notifications")}
          >
            Notifications
          </Button>
          <Button 
            size="sm" 
            variant={filter === "marketing" ? "default" : "outline"}
            onClick={() => setFilter("marketing")}
          >
            Marketing
          </Button>
          <Button 
            size="sm" 
            variant={filter === "payments" ? "default" : "outline"}
            onClick={() => setFilter("payments")}
          >
            Payments
          </Button>
          <Button 
            size="sm" 
            variant={filter === "analytics" ? "default" : "outline"}
            onClick={() => setFilter("analytics")}
          >
            Analytics
          </Button>
          <Button 
            size="sm" 
            variant={filter === "ai" ? "default" : "outline"}
            onClick={() => setFilter("ai")}
          >
            AI
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <IntegrationCard 
            key={integration.id}
            integration={integration}
            onToggle={toggleIntegration}
            onSetup={setupIntegration}
          />
        ))}
        
        <Card className="flex flex-col justify-center items-center p-6 text-center border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
          <PlusCircle className="h-12 w-12 mb-4 text-primary/40 group-hover:text-primary/60 transition-colors" />
          <h3 className="font-medium text-lg">Add Custom Integration</h3>
          <p className="text-sm text-primary/60 mt-1 mb-4">
            Connect to any service with our custom integration builder
          </p>
          <Button variant="outline" size="sm" className="mt-auto">
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
};

interface IntegrationCardProps {
  integration: IntegrationType;
  onToggle: (id: string) => void;
  onSetup: (id: string) => void;
}

const IntegrationCard = ({ integration, onToggle, onSetup }: IntegrationCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      integration.enabled ? 'border-indigo-200 bg-indigo-50/30' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white rounded-md shadow-sm">
              {integration.icon}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center">
                {integration.name}
                {integration.enabled && (
                  <CheckIcon className="h-4 w-4 ml-2 text-green-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {integration.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-primary/60">
            {integration.enabled ? 'Enabled' : 'Disabled'}
          </div>
          <Switch
            checked={integration.enabled}
            onCheckedChange={() => {
              if (integration.setupRequired && !integration.enabled) {
                onSetup(integration.id);
              } else {
                onToggle(integration.id);
              }
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 pt-3 pb-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs w-full justify-between"
          onClick={() => {
            if (!integration.enabled || integration.setupRequired) {
              onSetup(integration.id);
            }
          }}
        >
          {integration.enabled ? 'Configure' : 'Setup Required'}
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

import { Search } from "lucide-react";
