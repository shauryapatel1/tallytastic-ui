
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const integrations = [
  {
    name: "Zapier",
    logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg",
    description: "Connect to 5,000+ apps",
    category: "automation"
  },
  {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    description: "Accept payments",
    category: "payment"
  },
  {
    name: "Mailchimp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Mailchimp_logo.svg/2560px-Mailchimp_logo.svg.png",
    description: "Email marketing",
    category: "marketing"
  },
  {
    name: "Google Analytics",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Google_Analytics_logo.svg/1200px-Google_Analytics_logo.svg.png",
    description: "Track form performance",
    category: "analytics"
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png",
    description: "Get notifications",
    category: "notification"
  },
  {
    name: "Google Sheets",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1498px-Google_Sheets_logo_%282014-2020%29.svg.png",
    description: "Store responses",
    category: "data"
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png",
    description: "CRM integration",
    category: "crm"
  },
  {
    name: "HubSpot",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Hubspot_Logo.svg/2560px-Hubspot_Logo.svg.png",
    description: "Marketing automation",
    category: "marketing"
  },
];

export const Integrations = () => {
  const navigate = useNavigate();
  
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
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 mb-4 relative">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center p-3">
                  <img 
                    src={integration.logo} 
                    alt={integration.name} 
                    className="max-w-full max-h-full object-contain"
                  />
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
