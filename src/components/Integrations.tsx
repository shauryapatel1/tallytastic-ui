
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CreditCard, Mail, BarChart, MessageSquare, FileSpreadsheet, Building2, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Define integration data structure to match dashboard integrations
interface IntegrationType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

// Align our integration list with the dashboard integrations
const integrations: IntegrationType[] = [
  {
    id: "zapier",
    name: "Zapier",
    icon: <Zap className="h-8 w-8 text-orange-500" />,
    description: "Connect to 5,000+ apps",
    category: "automation"
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: <CreditCard className="h-8 w-8 text-purple-600" />,
    description: "Accept payments",
    category: "payment"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: <Mail className="h-8 w-8 text-yellow-500" />,
    description: "Email marketing",
    category: "marketing"
  },
  {
    id: "google_analytics",
    name: "Google Analytics",
    icon: <BarChart className="h-8 w-8 text-blue-500" />,
    description: "Track form performance",
    category: "analytics"
  },
  {
    id: "slack",
    name: "Slack",
    icon: <MessageSquare className="h-8 w-8 text-green-500" />,
    description: "Get notifications",
    category: "notification"
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    icon: <FileSpreadsheet className="h-8 w-8 text-green-600" />,
    description: "Store responses",
    category: "data"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    icon: <Building2 className="h-8 w-8 text-blue-600" />,
    description: "CRM integration",
    category: "crm"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    icon: <LineChart className="h-8 w-8 text-orange-600" />,
    description: "Marketing automation",
    category: "marketing"
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
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center p-3">
                  {integration.icon}
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
