
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const UseCaseDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleTryTemplate = (templateName: string) => {
    localStorage.setItem('selectedTemplate', templateName);
    toast({
      title: "Template selected",
      description: "Sign in to start using this template",
    });
    navigate("/auth");
  };
  
  const handleViewMore = () => {
    toast({
      title: "View more examples",
      description: "Sign in to see our full template gallery",
    });
    navigate("/auth");
  };
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            See It In Action
          </Badge>
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold mb-4">
            See how FormCraft simplifies data collection
          </h2>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Watch how easy it is to create, share, and analyze forms with FormCraft
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-2">Create powerful forms in minutes</h3>
              <p className="text-primary/60">
                FormCraft combines ease of use with powerful features to help you collect data efficiently.
                Whether you need contact forms, surveys, or payment collection, we've got you covered.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Key benefits:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Drag-and-drop form builder",
                  "50+ customizable templates",
                  "Conditional logic",
                  "Mobile-friendly design",
                  "Real-time validation",
                  "File uploads",
                  "Payment collection",
                  "Multi-page forms"
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4">
              <p className="text-primary/60 text-sm mb-4">
                With FormCraft's AI-powered form builder, you can create professional forms in seconds.
                Just describe what you need, and our AI will generate a perfect form for you.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="default"
                  onClick={() => handleTryTemplate("contact")}
                >
                  Try AI Form Builder
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleViewMore}
                >
                  View Templates
                </Button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:pl-6"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-100">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-xl"
                poster="/placeholder.svg"
              >
                <source src="https://cdn-images.mailchimp.com/vfe/embedded-forms/v1.1/screen-recording-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-medium mb-2">AI-Powered Form Creation</h3>
                  <p className="text-sm text-white/80">Create professional forms instantly with AI assistance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
