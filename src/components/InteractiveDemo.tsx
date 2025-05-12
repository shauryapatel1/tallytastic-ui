
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  MousePointerClick, 
  Sparkles, 
  Plus,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/components/dashboard/form-builder/types";

export const InteractiveDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [demoStep, setDemoStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [demoFormFields, setDemoFormFields] = useState<FormField[]>([
    {
      id: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your name",
      required: true,
    }
  ]);

  const addDemoField = (type: string) => {
    setIsAnimating(true);
    
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: type as any,
      label: type === "email" ? "Email Address" : type === "textarea" ? "Message" : "New Field",
      placeholder: type === "email" ? "your@email.com" : type === "textarea" ? "Type your message here..." : "Enter value",
      required: false
    };
    
    setDemoFormFields([...demoFormFields, newField]);
    
    toast({
      title: "Field added!",
      description: "You've added a new field to your form.",
    });
    
    // Move to next step after brief delay
    setTimeout(() => {
      setDemoStep(prev => Math.min(prev + 1, 3));
      setIsAnimating(false);
    }, 800);
  };

  const handleTryItNow = () => {
    toast({
      title: "Let's get started!",
      description: "Taking you to the form builder...",
    });
    navigate("/auth");
  };
  
  const handleViewDemo = () => {
    toast({
      title: "Preview activated",
      description: "This is how your form would appear to users",
    });
    setDemoStep(3);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <section id="interactive-demo" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="outline" className="px-3 py-1 border-indigo-200 text-indigo-700 bg-indigo-50 mb-4">
            Try It Now
          </Badge>
          <motion.h2 
            className="text-3xl md:text-4xl font-playfair font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Build your first form without signing up
          </motion.h2>
          <motion.p 
            className="text-primary/60 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience how easy it is to build beautiful forms in seconds. 
            Add fields, customize your form, and see instant results.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Demo Controls */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm flex items-center justify-center mr-2">1</span>
                Add form fields
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex items-center ${demoFormFields.some(f => f.type === 'text') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                  onClick={() => addDemoField('text')}
                  disabled={isAnimating || demoStep > 0}
                >
                  {demoFormFields.some(f => f.type === 'text') ? <Check className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
                  Text
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex items-center ${demoFormFields.some(f => f.type === 'email') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                  onClick={() => addDemoField('email')}
                  disabled={isAnimating || demoStep > 1}
                >
                  {demoFormFields.some(f => f.type === 'email') ? <Check className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
                  Email
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`flex items-center ${demoFormFields.some(f => f.type === 'textarea') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                  onClick={() => addDemoField('textarea')}
                  disabled={isAnimating || demoStep > 2}
                >
                  {demoFormFields.some(f => f.type === 'textarea') ? <Check className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
                  Message
                </Button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm flex items-center justify-center mr-2">2</span>
                Preview your form
              </h3>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleViewDemo}
                disabled={demoStep < 1}
              >
                <MousePointerClick className="mr-2 h-4 w-4" />
                Preview Form
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm flex items-center justify-center mr-2">3</span>
                Ready to create your own?
              </h3>
              
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleTryItNow}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start Building For Real
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <p className="text-sm text-center mt-2 text-gray-500">
                No credit card required
              </p>
            </motion.div>
          </motion.div>
          
          {/* Form Preview */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              {/* Browser-like header */}
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white rounded-md py-1 px-3 text-xs flex-1 text-gray-500 text-center">
                  formcraft.io/your-form
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                  <p className="text-gray-600 text-sm">We'd love to hear from you!</p>
                </div>
                
                <div className="space-y-4">
                  {demoFormFields.map((field, index) => (
                    <motion.div 
                      key={field.id} 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input 
                          type="text"
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )}
                      
                      {field.type === 'email' && (
                        <input 
                          type="email"
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea 
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )}
                    </motion.div>
                  ))}
                  
                  {demoStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Submit
                      </button>
                    </motion.div>
                  )}
                </div>
                
                {demoStep < 3 && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-dashed border-indigo-300 text-center">
                    <div className="flex flex-col items-center justify-center text-indigo-600">
                      <Edit className="h-5 w-5 mb-2" />
                      <p className="text-sm">
                        {demoStep === 0 && "Add your first field to get started"}
                        {demoStep === 1 && "Great! Now add an email field"}
                        {demoStep === 2 && "Perfect! Add a message field to complete your form"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Design elements */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-2xl"></div>
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Join thousands of businesses creating forms with FormCraft
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {['Nike', 'Airbnb', 'Spotify', 'Slack', 'Google'].map((company) => (
              <div key={company} className="text-lg font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
