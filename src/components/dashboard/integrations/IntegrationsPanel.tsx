import { useState, useEffect } from "react";
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
  setupUrl?: string; // Optional URL for external setup
  apiKey?: string; // Optional API key for configured integrations
};

export const IntegrationsPanel = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<string | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState("");
  
  const [integrations, setIntegrations] = useState<IntegrationType[]>([
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect your forms to 4,000+ apps",
      icon: <Webhook className="h-8 w-8 text-orange-500" />,
      enabled: false,
      category: "marketing",
      setupRequired: true,
      setupUrl: "https://zapier.com/apps/formcraft/integrations"
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Add form submissions to your email lists",
      icon: <Mail className="h-8 w-8 text-blue-500" />,
      enabled: false,
      category: "marketing",
      setupRequired: true,
      setupUrl: "https://mailchimp.com/developer/marketing/api/root/"
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments through your forms",
      icon: <CreditCard className="h-8 w-8 text-purple-500" />,
      enabled: false,
      category: "payments",
      setupRequired: true,
      setupUrl: "https://stripe.com/docs/api"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get form submission notifications in Slack",
      icon: <MessageSquare className="h-8 w-8 text-green-500" />,
      enabled: false,
      category: "notifications",
      setupRequired: true,
      setupUrl: "https://api.slack.com/messaging/webhooks"
    },
    {
      id: "google_analytics",
      name: "Google Analytics",
      description: "Track form performance and user behavior",
      icon: <Database className="h-8 w-8 text-yellow-500" />,
      enabled: false,
      category: "analytics",
      setupRequired: true,
      setupUrl: "https://developers.google.com/analytics/devguides/collection/analyticsjs"
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

  // Check for selectedIntegration from localStorage on component mount
  useEffect(() => {
    const selectedIntegrationId = localStorage.getItem('selectedIntegration');
    
    if (selectedIntegrationId) {
      // Find the integration in our list
      const integrationIndex = integrations.findIndex(
        integration => integration.id === selectedIntegrationId
      );
      
      if (integrationIndex !== -1) {
        // Scroll to the integration
        setTimeout(() => {
          const element = document.getElementById(`integration-${selectedIntegrationId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-integration');
            
            // Show the setup flow
            setShowApiKeyInput(selectedIntegrationId);
            
            // Remove the highlight after 2 seconds
            setTimeout(() => {
              element.classList.remove('highlight-integration');
            }, 2000);
          }
        }, 500);
        
        // Show toast notification
        toast({
          title: `Configure ${integrations[integrationIndex].name}`,
          description: `Follow the steps to set up your ${integrations[integrationIndex].name} integration.`,
        });
        
        // Clear the localStorage item so it doesn't trigger again on refresh
        localStorage.removeItem('selectedIntegration');
      }
    }
  }, [integrations, toast]);

  const saveApiKey = (id: string) => {
    if (!apiKeyValue) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key to configure this integration.",
        variant: "destructive"
      });
      return;
    }
    
    setIntegrations(
      integrations.map(integration => {
        if (integration.id === id) {
          const updatedIntegration = {
            ...integration,
            enabled: true,
            setupRequired: false,
            apiKey: apiKeyValue
          };
          
          // Store API key in localStorage for persistence
          localStorage.setItem(`integration_${id}_key`, apiKeyValue);
          
          toast({
            title: `${integration.name} Configured`,
            description: `Your ${integration.name} integration has been successfully set up and enabled.`,
          });
          
          setShowApiKeyInput(null);
          setApiKeyValue("");
          
          return updatedIntegration;
        }
        return integration;
      })
    );
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map(integration => {
        if (integration.id === id) {
          const newState = !integration.enabled;
          
          // If enabling and setup is required, show API key input
          if (newState && integration.setupRequired) {
            setShowApiKeyInput(id);
            return integration;
          }
          
          // If disabling, keep the API key but disable
          if (!newState && integration.apiKey) {
            toast({
              title: `${integration.name} disabled`,
              description: `You've disabled the ${integration.name} integration. Your settings have been saved.`,
            });
            
            return {
              ...integration,
              enabled: false
            };
          }
          
          // Regular toggle for already configured integrations
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
    const integration = integrations.find(i => i.id === id);
    
    if (!integration) return;
    
    if (integration.setupUrl) {
      // For integrations with external setup URLs, open in new tab
      window.open(integration.setupUrl, "_blank");
    }
    
    // Show API key input
    setShowApiKeyInput(id);
    
    toast({
      title: "Setup required",
      description: `Configure your ${integration.name} integration with your API key or webhook URL.`,
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
      {/* Add CSS for highlight animation */}
      <style>{`
        .highlight-integration {
          animation: pulse 2s;
          box-shadow: 0 0 0 10px rgba(99, 102, 241, 0.2);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
      
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
          <Card 
            key={integration.id}
            id={`integration-${integration.id}`}
            className={`overflow-hidden transition-all hover:shadow-md ${
              integration.enabled ? 'border-indigo-200 bg-indigo-50/30' : ''
            }`}
          >
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
              {showApiKeyInput === integration.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {integration.id === 'webhooks' ? 'Webhook URL' : 'API Key'}
                    </label>
                    <Input
                      type="text"
                      placeholder={integration.id === 'webhooks' ? 'https://...' : 'Enter your API key'}
                      value={apiKeyValue}
                      onChange={(e) => setApiKeyValue(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-primary/60">
                      {integration.id === 'webhooks' 
                        ? 'Enter the webhook URL where form submissions should be sent.'
                        : `Your ${integration.name} API key will be stored securely.`
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => saveApiKey(integration.id)}
                    >
                      Save & Enable
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowApiKeyInput(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-primary/60">
                    {integration.enabled 
                      ? integration.apiKey 
                        ? 'Configured & Enabled' 
                        : 'Enabled'
                      : 'Disabled'
                    }
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => {
                      if (integration.setupRequired && !integration.enabled) {
                        setupIntegration(integration.id);
                      } else {
                        toggleIntegration(integration.id);
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
            
            {!showApiKeyInput && (
              <CardFooter className="bg-muted/30 pt-3 pb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs w-full justify-between"
                  onClick={() => {
                    if (!integration.enabled || integration.setupRequired) {
                      setupIntegration(integration.id);
                    } else {
                      // For configured integrations, show the configuration UI again
                      setShowApiKeyInput(integration.id);
                      // Pre-populate with existing API key if available
                      if (integration.apiKey) {
                        setApiKeyValue(integration.apiKey);
                      }
                    }
                  }}
                >
                  {integration.enabled ? 'Configure' : 'Setup Required'}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
        
        <Card className="flex flex-col justify-center items-center p-6 text-center border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
          <PlusCircle className="h-12 w-12 mb-4 text-primary/40 group-hover:text-primary/60 transition-colors" />
          <h3 className="font-medium text-lg">Add Custom Integration</h3>
          <p className="text-sm text-primary/60 mt-1 mb-4">
            Connect to any service with our custom integration builder
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-auto"
            onClick={() => {
              setIntegrations([
                ...integrations,
                {
                  id: `custom_${Date.now()}`,
                  name: "Custom Integration",
                  description: "Your custom integration",
                  icon: <Webhook className="h-8 w-8 text-gray-500" />,
                  enabled: false,
                  category: "marketing",
                  setupRequired: true
                }
              ]);
              
              toast({
                title: "Custom Integration Added",
                description: "Configure your custom integration to connect with external services.",
              });
            }}
          >
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
};

import { Search } from "lucide-react";
