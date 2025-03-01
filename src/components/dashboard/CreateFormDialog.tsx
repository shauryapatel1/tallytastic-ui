
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createForm } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInfoStep } from "./form-templates/FormInfoStep";
import { TemplateSelector } from "./form-templates/TemplateSelector";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

// Simplified template data
const simplifiedTemplates = [
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a blank canvas",
    icon: "📋",
    category: "basic"
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Basic contact information collection",
    icon: "✉️",
    category: "basic"
  },
  {
    id: "survey",
    name: "Feedback Survey",
    description: "Get user feedback and ratings",
    icon: "📊",
    category: "feedback"
  },
  {
    id: "event",
    name: "Event Registration",
    description: "Register attendees for your event",
    icon: "🗓️",
    category: "popular"
  },
  {
    id: "payment",
    name: "Payment Form",
    description: "Collect payment details securely",
    icon: "💳",
    category: "data"
  },
];

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFormDialog = ({
  open,
  onOpenChange,
}: CreateFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"info" | "template" | "ai" | "builder">("info");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<"basic" | "feedback" | "data" | "popular">("popular");
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTab, setSelectedTab] = useState<"template" | "ai" | "builder">("template");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredTemplates = simplifiedTemplates.filter(t => t.category === templateCategory);

  const { mutate: create, isPending } = useMutation({
    mutationFn: createForm,
    onSuccess: (form) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      onOpenChange(false);
      navigate(`/dashboard/forms/${form.id}`);
      toast({
        title: "Form created successfully! 🎉",
        description: "You're ready to start building your form.",
      });
      // Reset state
      setTitle("");
      setDescription("");
      setStep("info");
      setSelectedTemplate(null);
      setAiPrompt("");
    },
    onError: (error) => {
      console.error("Error creating form:", error);
      toast({
        title: "Error creating form",
        description: "There was an error creating your form. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTab === "template" && !selectedTemplate) {
      toast({
        title: "Please select a template",
        description: "Please select a template to continue.",
        variant: "destructive",
      });
      return;
    }
    
    create({ 
      title, 
      description,
      templateId: selectedTab === "template" && selectedTemplate !== "blank" ? selectedTemplate : undefined
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your form.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedTab === "ai") {
      setStep("ai");
    } else if (selectedTab === "builder") {
      setStep("builder");
    } else {
      setStep("template");
    }
  };

  const handleBack = () => {
    setStep("info");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form state
    setTimeout(() => {
      setTitle("");
      setDescription("");
      setStep("info");
      setSelectedTemplate(null);
      setAiPrompt("");
    }, 200);
  };
  
  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description of the form you want to create.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      setTimeout(() => {
        // In a real implementation, this would call an AI service
        toast({
          title: "Form generated successfully!",
          description: "Your AI-generated form is ready to use.",
        });
        
        // Create the form
        create({ 
          title: title || `${aiPrompt.split(" ").slice(0, 3).join(" ")} Form`, 
          description: description || aiPrompt,
          templateId: "contact" // Default template for AI generation
        });
        
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating form with AI:", error);
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: "There was an error generating your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formBuilderContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          Back
        </Button>
      </div>
      
      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <Sparkles className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Form Builder</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              The drag and drop form builder is coming soon! This feature will allow you to visually build your form.
            </p>
            <Button onClick={() => {
              toast({
                title: "Coming Soon!",
                description: "The drag and drop form builder will be available in the next update.",
              });
            }}>
              Create Basic Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const dialogContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {step === "info" ? "Create a new form" : 
               step === "template" ? "Choose a template" : 
               step === "ai" ? "AI Form Generator" : 
               "Form Builder"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {step === "info" 
                ? "Start by giving your form a name and description" 
                : step === "template"
                ? "Select a template to jumpstart your form creation"
                : step === "ai"
                ? "Describe the form you want to create and our AI will do the rest"
                : "Build your form by adding elements"}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dialogContentVariants}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {step === "info" ? (
              <>
                <Tabs defaultValue="template" value={selectedTab} onValueChange={(value) => setSelectedTab(value as "template" | "ai" | "builder")}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="template">Use Template</TabsTrigger>
                    <TabsTrigger value="ai">AI Generator</TabsTrigger>
                    <TabsTrigger value="builder">Form Builder</TabsTrigger>
                  </TabsList>
                </Tabs>
                <FormInfoStep
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  handleNext={handleNext}
                  isPending={isPending}
                />
              </>
            ) : step === "template" ? (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                templateCategory={templateCategory}
                setTemplateCategory={setTemplateCategory}
                filteredTemplates={filteredTemplates.map(t => ({
                  ...t,
                  icon: <div className="text-2xl">{t.icon}</div>
                }))}
                handleBack={handleBack}
                handleSubmit={handleSubmit}
                isPending={isPending}
              />
            ) : step === "ai" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" onClick={handleBack} className="gap-2">
                    Back
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="ai-prompt" className="text-sm font-medium">
                      Describe your form <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="e.g., 'Create a customer feedback survey with ratings and open-ended questions' or 'Make a simple contact form with name, email, and message fields'"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="resize-none h-40"
                      disabled={isGenerating}
                    />
                    <p className="text-sm text-primary/60">
                      Be as specific as possible about the type of form, fields, and purpose.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      AI Form Generation Tips:
                    </h4>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Include the type of form (contact, survey, registration, etc.)</li>
                      <li>• Specify important fields you want to include</li>
                      <li>• Mention any conditional logic or validation needs</li>
                      <li>• Describe your target audience</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAiGeneration} 
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="relative overflow-hidden"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Form
                      </>
                    )}
                    
                    {/* Animated gradient border effect */}
                    {!isGenerating && (
                      <motion.div
                        className="absolute -z-10 inset-0 rounded-md opacity-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                      />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              formBuilderContent
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
