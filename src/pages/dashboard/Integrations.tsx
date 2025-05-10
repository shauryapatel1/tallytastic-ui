
import { useState } from "react";
import { DashboardLayout } from "./Layout";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Link, ChevronRight, Database, Search } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  color: string;
  enabled: boolean;
  configured?: boolean;
}

// Mock integrations
const getIntegrations = async (): Promise<Integration[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect your form to over 5,000+ apps",
      category: "automation",
      logoUrl: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
      color: "#FF4A00",
      enabled: true,
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments through your forms",
      category: "payment",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
      color: "#6772E5",
      enabled: true,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Add subscribers to your email lists",
      category: "marketing",
      logoUrl: "https://cdn-images.mailchimp.com/monkey_rewards/grow-business-banner-new-logo.png",
      color: "#FFE01B",
      enabled: true,
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      description: "Save form responses to spreadsheets",
      category: "data",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
      color: "#0F9D58",
      enabled: true,
    },
    {
      id: "google_analytics",
      name: "Google Analytics",
      description: "Track form performance and conversions",
      category: "analytics",
      logoUrl: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
      color: "#E37400",
      enabled: true,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get notified when forms are submitted",
      category: "notification",
      logoUrl: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_128.png",
      color: "#4A154B",
      enabled: true,
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Sync form data with your CRM",
      category: "crm",
      logoUrl: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
      color: "#FF7A59",
      enabled: true,
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Connect form submissions to your Salesforce",
      category: "crm",
      logoUrl: "https://c1.sfdcstatic.com/content/dam/sfdc-docs/www/logos/logo-salesforce.svg",
      color: "#00A1E0",
      enabled: false,
    }
  ];
};

export default function Integrations() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: integrations, isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: getIntegrations,
  });

  const handleIntegrationClick = (integration: Integration) => {
    if (!integration.enabled) {
      toast({
        title: "Integration unavailable",
        description: "This integration is coming soon.",
        variant: "default",
      });
      return;
    }
    
    toast({
      title: "Setting up integration",
      description: `Preparing to connect ${integration.name}...`,
    });

    // In a real app, this would navigate to the integration setup page
    console.log(`Setting up ${integration.name} integration`);
  };

  const filteredIntegrations = integrations?.filter(integration => {
    // Filter by search term
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category tab
    const matchesCategory = activeTab === "all" || integration.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Integrations", icon: <Zap className="h-4 w-4" /> },
    { id: "automation", name: "Automation", icon: <Zap className="h-4 w-4" /> },
    { id: "payment", name: "Payments", icon: <Database className="h-4 w-4" /> },
    { id: "marketing", name: "Marketing", icon: <Link className="h-4 w-4" /> },
    { id: "analytics", name: "Analytics", icon: <Search className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect your forms with your favorite tools and services.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search integrations..."
              className="w-full rounded-md border border-input pl-8 pr-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 space-x-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="hover:shadow-md transition-all opacity-50">
                    <CardHeader className="h-24 animate-pulse bg-muted"></CardHeader>
                    <CardContent className="h-20 animate-pulse bg-muted mt-4"></CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations?.map((integration) => (
                  <Card 
                    key={integration.id} 
                    className={`hover:shadow-md transition-all ${!integration.enabled ? 'opacity-50' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 relative">
                          <div 
                            className="w-full h-full rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${integration.color}15` }}
                          >
                            <div className="w-8 h-8 overflow-hidden">
                              <img
                                src={integration.logoUrl}
                                alt={`${integration.name} logo`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {integration.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between" 
                        onClick={() => handleIntegrationClick(integration)}
                        disabled={!integration.enabled}
                      >
                        {integration.enabled ? "Connect" : "Coming Soon"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {filteredIntegrations?.length === 0 && (
              <div className="p-12 text-center border rounded-lg">
                <h3 className="text-lg font-medium">No integrations found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
