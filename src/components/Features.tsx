
import { Check, Zap, Code, Sparkles, PenTool, Palette, FileText, Workflow, Bell, BarChart, Database, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: FeatureItem[] = [
  {
    title: "Intuitive Builder",
    description: "Drag and drop interface makes form creation a breeze",
    icon: PenTool,
  },
  {
    title: "Smart Templates",
    description: "Start with professionally designed templates for any use case",
    icon: FileText,
  },
  {
    title: "Real-time Preview",
    description: "See changes as you make them with instant visual feedback",
    icon: Sparkles,
  },
  {
    title: "Advanced Logic",
    description: "Create dynamic forms with conditional logic and branching",
    icon: Workflow,
  },
  {
    title: "File Uploads",
    description: "Securely collect files from respondents with size controls",
    icon: Database,
  },
  {
    title: "Custom Styling",
    description: "Match your brand with custom themes, fonts, and colors",
    icon: Palette,
  },
  {
    title: "Powerful Integrations",
    description: "Connect to your favorite tools like Zapier, Stripe, and more",
    icon: Zap,
  },
  {
    title: "Advanced Analytics",
    description: "Gain insights with detailed response analytics and charts",
    icon: BarChart,
  },
  {
    title: "Custom Code",
    description: "Add your own JavaScript and CSS for advanced customizations",
    icon: Code,
  },
  {
    title: "Smart Notifications",
    description: "Get notified of form submissions via email or Slack",
    icon: Bell,
  },
  {
    title: "AI Response Analysis",
    description: "Analyze form responses with AI-powered insights",
    icon: Sparkles,
  },
  {
    title: "Mobile Responsive",
    description: "Forms look perfect on any device, desktop to mobile",
    icon: Check,
  },
];

export const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            Everything you need to create perfect forms
          </h2>
          <p className="text-primary/60">
            Powerful features that make form building effortless
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:bg-indigo-50/30"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-primary/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
