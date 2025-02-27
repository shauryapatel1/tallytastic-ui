
import { Check, Zap, Code, Sparkles, PenTool, Palette, FileText, Workflow, Bell, BarChart, Database, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  details: string;
}

const features: FeatureItem[] = [
  {
    title: "Intuitive Builder",
    description: "Drag and drop interface makes form creation a breeze",
    icon: PenTool,
    details: "Our intuitive drag-and-drop builder lets you create forms in minutes without any technical knowledge. Simply drag elements onto your form, arrange them as you like, and customize their properties with a few clicks."
  },
  {
    title: "Smart Templates",
    description: "Start with professionally designed templates for any use case",
    icon: FileText,
    details: "Choose from dozens of professionally designed templates for contact forms, surveys, event registrations, payment forms, and more. Each template is fully customizable to fit your specific needs."
  },
  {
    title: "Real-time Preview",
    description: "See changes as you make them with instant visual feedback",
    icon: Sparkles,
    details: "Get instant visual feedback with our real-time preview feature. As you make changes to your form, you'll see them reflected immediately, ensuring your form looks exactly as you want it to."
  },
  {
    title: "Advanced Logic",
    description: "Create dynamic forms with conditional logic and branching",
    icon: Workflow,
    details: "Build intelligent forms that adapt to user responses with our powerful conditional logic. Show or hide fields, skip to specific sections, or display custom messages based on previous answers."
  },
  {
    title: "File Uploads",
    description: "Securely collect files from respondents with size controls",
    icon: Database,
    details: "Allow users to securely upload files to your forms. Set file type restrictions, size limits, and multiple file uploads. All files are stored securely and can be easily accessed from your dashboard."
  },
  {
    title: "Custom Styling",
    description: "Match your brand with custom themes, fonts, and colors",
    icon: Palette,
    details: "Make your forms match your brand perfectly with customizable themes, fonts, colors, and spacing. You can even add your own CSS for complete control over your form's appearance."
  },
  {
    title: "Powerful Integrations",
    description: "Connect to your favorite tools like Zapier, Stripe, and more",
    icon: Zap,
    details: "Seamlessly connect your forms to over 2,000 apps through Zapier, or use our direct integrations with popular services like Stripe, Mailchimp, Google Sheets, and more."
  },
  {
    title: "Advanced Analytics",
    description: "Gain insights with detailed response analytics and charts",
    icon: BarChart,
    details: "Understand your form performance with comprehensive analytics. Track completion rates, view response trends over time, and generate visual reports to better understand your data."
  },
  {
    title: "Custom Code",
    description: "Add your own JavaScript and CSS for advanced customizations",
    icon: Code,
    details: "For advanced users, add custom JavaScript and CSS to your forms for complete control. Implement complex validation, add custom animations, or integrate with external services."
  },
  {
    title: "Smart Notifications",
    description: "Get notified of form submissions via email or Slack",
    icon: Bell,
    details: "Stay informed about new submissions with instant notifications. Receive alerts via email, SMS, or Slack, and customize notification content based on submission data."
  },
  {
    title: "AI Response Analysis",
    description: "Analyze form responses with AI-powered insights",
    icon: Sparkles,
    details: "Let our AI analyze your form responses to identify patterns, sentiment, and key insights. Get automatic categorization of open-ended responses and actionable recommendations."
  },
  {
    title: "Mobile Responsive",
    description: "Forms look perfect on any device, desktop to mobile",
    icon: Check,
    details: "All forms are fully responsive and optimized for any device. Your forms will look great and function perfectly whether viewed on a desktop, tablet, or smartphone."
  },
];

export const Features = () => {
  const navigate = useNavigate();
  
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
            <Dialog key={feature.title}>
              <DialogTrigger asChild>
                <motion.div
                  className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:bg-indigo-50/30 cursor-pointer"
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
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </DialogTitle>
                  <DialogDescription>
                    {feature.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-primary/80 leading-relaxed">
                    {feature.details}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => navigate("/auth")}>
                    Try this feature
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
