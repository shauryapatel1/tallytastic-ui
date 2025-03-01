
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  MousePointerClick, 
  LayoutTemplate, 
  GitBranch, 
  Smartphone, 
  CheckCircle, 
  Upload, 
  CreditCard,
  ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";

export const UseCaseDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeDemo, setActiveDemo] = useState<number>(0);
  
  // Auto-advance demo with proper useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveDemo((prev) => (prev + 1) % demos.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [activeDemo]);
  
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

  const benefits = [
    {
      icon: <MousePointerClick className="h-6 w-6 text-indigo-600" />,
      title: "Drag-and-drop form builder",
      description: "Build forms visually by dragging and dropping elements onto the canvas.",
      useCase: "A marketing team created a lead capture form in under 5 minutes without any coding."
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-purple-600" />,
      title: "50+ customizable templates",
      description: "Start with professionally designed templates for any use case.",
      useCase: "An event organizer used a registration template and had 500+ signups within days."
    },
    {
      icon: <GitBranch className="h-6 w-6 text-blue-600" />,
      title: "Conditional logic",
      description: "Create dynamic forms that change based on user responses.",
      useCase: "A survey showed different questions to users based on their initial answers, increasing completion rates by 40%."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-green-600" />,
      title: "Mobile-friendly design",
      description: "All forms automatically adapt to any screen size for perfect mobile experiences.",
      useCase: "A nonprofit saw 65% of donations come through mobile after switching to FormCraft's responsive forms."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-amber-600" />,
      title: "Real-time validation",
      description: "Catch errors before submission with instant field validation.",
      useCase: "A job application form reduced invalid submissions by 90% after implementing real-time validation."
    },
    {
      icon: <Upload className="h-6 w-6 text-rose-600" />,
      title: "File uploads",
      description: "Allow users to securely upload documents, images, and files.",
      useCase: "A legal firm collected signed documents through forms, streamlining their client onboarding process."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-emerald-600" />,
      title: "Payment collection",
      description: "Accept payments directly through your forms with Stripe integration.",
      useCase: "A small business increased product sales by 75% by embedding payment forms on their website."
    }
  ];

  // Fix GIFs with working links to high-quality demo GIFs
  const demos = [
    {
      title: "Creating a form with AI",
      description: "Generate a complete form by describing what you need in natural language",
      image: "https://i.imgur.com/6TfpJ48.gif" // New GIF - AI form generation
    },
    {
      title: "Building with drag and drop",
      description: "Easily arrange form elements with our intuitive builder",
      image: "https://i.imgur.com/V1Ia9bA.gif" // New GIF - drag and drop building
    },
    {
      title: "Analyzing responses in real-time",
      description: "Get instant insights from your form submissions",
      image: "https://i.imgur.com/jcBdUu9.gif" // New GIF - analytics dashboard
    }
  ];
  
  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            See It In Action
          </Badge>
          <motion.h2 
            className="text-3xl md:text-4xl font-playfair font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            See how FormCraft simplifies data collection
          </motion.h2>
          <motion.p 
            className="text-primary/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Watch how easy it is to create, share, and analyze forms with FormCraft
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Create powerful forms in minutes</h3>
              <p className="text-primary/60">
                FormCraft combines ease of use with powerful features to help you collect data efficiently.
                Whether you need contact forms, surveys, or payment collection, we've got you covered.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-medium text-lg">See how our features make form creation effortless:</h4>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                    onClick={() => {
                      toast({
                        title: benefit.title,
                        description: benefit.useCase,
                      });
                    }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h5 className="font-medium group-hover:text-indigo-600 transition-colors flex items-center">
                        {benefit.title}
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                      </h5>
                      <p className="text-sm text-primary/60 mt-0.5">{benefit.description}</p>
                      <p className="text-xs text-indigo-600 mt-1 italic opacity-0 group-hover:opacity-100 transition-all">
                        {benefit.useCase}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <MousePointerClick className="mr-2 h-4 w-4" />
                  Try AI Form Builder
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleViewMore}
                  className="hover:text-indigo-600 hover:border-indigo-600 transition-colors"
                >
                  <LayoutTemplate className="mr-2 h-4 w-4" />
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
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-100 bg-white h-[500px]">
              {/* Navigation dots */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {demos.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeDemo === index ? "bg-white scale-125 shadow-md" : "bg-white/50"
                    }`}
                    onClick={() => setActiveDemo(index)}
                  />
                ))}
              </div>
              
              {/* Demos */}
              {demos.map((demo, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeDemo === index ? "opacity-100 z-0" : "opacity-0 -z-10"
                  }`}
                >
                  <img 
                    src={demo.image} 
                    alt={demo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image: ${demo.image}`);
                      e.currentTarget.src = "https://placehold.co/600x400/indigo/white?text=FormCraft+Demo";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                      <p className="text-sm text-white/90">{demo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
