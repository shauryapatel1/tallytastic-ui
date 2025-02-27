
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define integration data structure to match dashboard integrations
interface IntegrationType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  logoUrl: string;
  color: string;
}

// Align our integration list with the dashboard integrations
const integrations: IntegrationType[] = [
  {
    id: "zapier",
    name: "Zapier",
    icon: null,
    description: "Connect to 5,000+ apps",
    category: "automation",
    logoUrl: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
    color: "#FF4A00"
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: null,
    description: "Accept payments",
    category: "payment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    color: "#6772E5"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: null,
    description: "Email marketing",
    category: "marketing",
    logoUrl: "https://cdn-images.mailchimp.com/monkey_rewards/grow-business-banner-new-logo.png",
    color: "#FFE01B"
  },
  {
    id: "google_analytics",
    name: "Google Analytics",
    icon: null,
    description: "Track form performance",
    category: "analytics",
    logoUrl: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
    color: "#E37400"
  },
  {
    id: "slack",
    name: "Slack",
    icon: null,
    description: "Get notifications",
    category: "notification",
    logoUrl: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_128.png",
    color: "#4A154B"
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    icon: null,
    description: "Store responses",
    category: "data",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg",
    color: "#0F9D58"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: null,
    description: "CRM integration",
    category: "crm",
    logoUrl: "https://c1.sfdcstatic.com/content/dam/sfdc-docs/www/logos/logo-salesforce.svg",
    color: "#00A1E0"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: null,
    description: "Marketing automation",
    category: "marketing",
    logoUrl: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
    color: "#FF7A59"
  },
];

export const Integrations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create a function to handle integration selection and store in localStorage
  const handleIntegrationClick = (integration: IntegrationType) => {
    // Store the selected integration in localStorage for access after auth
    localStorage.setItem('selectedIntegration', integration.id);
    
    toast({
      title: `${integration.name} selected`,
      description: `Sign in to configure your ${integration.name} integration.`,
    });
    
    // Navigate to auth page
    navigate("/auth");
  };
  
  return (
    <section className="py-24 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            Seamless Connections
          </Badge>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Integrate with your favorite tools
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            FormCraft connects with all the tools you already use, making it easy to build a complete workflow without any coding.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 text-center flex flex-col items-center justify-center cursor-pointer"
              onClick={() => handleIntegrationClick(integration)}
            >
              <div className="w-16 h-16 mb-4 relative">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center p-2 bg-white shadow-sm"
                  style={{ 
                    backgroundColor: integration.color === "#FFFFFF" ? "#F8F9FA" : `${integration.color}15` 
                  }}
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <img
                      src={integration.logoUrl}
                      alt={`${integration.name} logo`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback to the first letter of the name if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const letter = document.createElement('div');
                          letter.className = 'text-xl font-bold';
                          letter.style.color = integration.color;
                          letter.textContent = integration.name[0];
                          parent.appendChild(letter);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {integration.category}
                </div>
              </div>
              <h3 className="font-medium mb-1">{integration.name}</h3>
              <p className="text-sm text-primary/60">{integration.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate("/auth")}
            className="px-6"
          >
            Explore all integrations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
