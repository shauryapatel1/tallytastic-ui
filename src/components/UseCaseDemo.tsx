
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const UseCaseDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeDemo, setActiveDemo] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
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

  // Animated demo content instead of GIFs
  const demos = [
    {
      title: "Creating a form with AI",
      description: "Generate a complete form by describing what you need in natural language",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Building with drag and drop",
      description: "Easily arrange form elements with our intuitive builder",
      color: "from-indigo-500 to-pink-500"
    },
    {
      title: "Analyzing responses in real-time",
      description: "Get instant insights from your form submissions",
      color: "from-green-400 to-teal-500"
    }
  ];

  const nextDemo = () => {
    setActiveDemo((prev) => (prev + 1) % demos.length);
  };

  const prevDemo = () => {
    setActiveDemo((prev) => (prev - 1 + demos.length) % demos.length);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30 overflow-hidden">
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg group"
                >
                  <MousePointerClick className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  <span>Try AI Form Builder</span>
                  <motion.span
                    className="ml-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.span>
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
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:pl-6 relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-100 bg-white h-[500px]">
              {/* Navigation dots */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {demos.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeDemo === index ? "bg-white scale-125 shadow-md" : "bg-white/50"
                    }`}
                    onClick={() => setActiveDemo(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              {/* Navigation arrows */}
              <div className="absolute inset-y-0 left-4 z-10 flex items-center">
                <motion.button
                  onClick={prevDemo}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </motion.button>
              </div>
              
              <div className="absolute inset-y-0 right-4 z-10 flex items-center">
                <motion.button
                  onClick={nextDemo}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </motion.button>
              </div>
              
              {/* Interactive Demo */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-br ${demos[activeDemo].color} p-6 flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
                      <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
                      <div className="w-3 h-3 rounded-full bg-white opacity-70"></div>
                    </motion.div>
                    
                    <motion.div 
                      className="h-12 bg-white/10 rounded-md backdrop-blur-sm w-2/3"
                      initial={{ width: "20%" }}
                      animate={{ width: "50%" }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    ></motion.div>
                    
                    {activeDemo === 0 && (
                      <div className="space-y-3 mt-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="flex items-center gap-2"
                        >
                          <Zap className="h-5 w-5 text-white" />
                          <div className="h-8 bg-white/10 rounded w-full max-w-[250px] backdrop-blur-sm"></div>
                        </motion.div>
                        
                        {[1, 2, 3].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.2), duration: 0.5 }}
                            className="h-16 bg-white/10 rounded-md backdrop-blur-sm w-full"
                          ></motion.div>
                        ))}
                        
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2, duration: 0.5 }}
                          className="flex justify-end"
                        >
                          <div className="h-10 w-40 bg-white rounded-md flex items-center justify-center">
                            <motion.span 
                              className="text-sm font-medium text-indigo-600 flex items-center" 
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Form
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeDemo === 1 && (
                      <div className="space-y-3 mt-6">
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5, 6].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                              className="h-20 bg-white/10 rounded-md backdrop-blur-sm flex items-center justify-center cursor-move"
                              whileHover={{ 
                                y: -5, 
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", 
                                backgroundColor: "rgba(255,255,255,0.2)" 
                              }}
                              drag
                              dragConstraints={{
                                top: -50,
                                right: 50,
                                bottom: 50,
                                left: -50,
                              }}
                            >
                              <div className="h-6 w-6 bg-white/30 rounded-full"></div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.5 }}
                          className="h-32 mt-6 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="text-white/70 flex flex-col items-center"
                          >
                            <MousePointerClick className="h-8 w-8 mb-2" />
                            <span className="text-sm">Drag and drop form elements here</span>
                          </motion.div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeDemo === 2 && (
                      <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                              className="h-24 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                            >
                              <div className="h-4 w-1/2 bg-white/20 rounded-sm mb-2"></div>
                              <motion.div 
                                className="h-8 bg-white/20 rounded-sm"
                                initial={{ width: "30%" }}
                                animate={{ width: ["30%", "80%", "60%"] }}
                                transition={{ duration: 4, repeat: Infinity }}
                              ></motion.div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.5 }}
                          className="h-32 bg-white/10 rounded-lg p-3 backdrop-blur-sm mt-4"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="h-4 w-1/4 bg-white/20 rounded-sm"></div>
                            <div className="h-4 w-1/6 bg-white/20 rounded-sm"></div>
                          </div>
                          <div className="relative h-20">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute bottom-0 w-[8%] bg-white/40 rounded-sm"
                                style={{ left: `${i * 20}%`, height: `${20 + Math.random() * 60}%` }}
                                initial={{ height: 0 }}
                                animate={{ height: `${20 + Math.random() * 60}%` }}
                                transition={{ duration: 0.5, delay: 0.9 + (i * 0.1) }}
                              ></motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-white">
                    <motion.h3 
                      className="text-xl font-semibold mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {demos[activeDemo].title}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {demos[activeDemo].description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
