
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
import { templates } from "./form-templates/templateData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

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
  const [step, setStep] = useState<"info" | "template" | "ai">("info");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<"basic" | "feedback" | "data" | "popular">("popular");
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedTab, setSelectedTab] = useState<"template" | "ai">("template");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredTemplates = templates.filter(t => t.category === templateCategory);

  // Check for a selected template from localStorage (from landing page)
  useState(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
      localStorage.removeItem('selectedTemplate');
    }
  });

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
    
    // Simulate AI generation
    setTimeout(() => {
      // In a real implementation, this would call an AI service
      const generatedFormTitle = aiPrompt.split(" ").slice(0, 3).join(" ");
      setTitle(title || `${generatedFormTitle} Form`);
      
      toast({
        title: "Form generated successfully!",
        description: "Your AI-generated form is ready to use.",
      });
      
      // Select a random template based on the prompt keywords
      const keywords = {
        survey: ["survey", "feedback", "opinion", "rating", "review"],
        contact: ["contact", "email", "reach", "message"],
        payment: ["payment", "order", "purchase", "buy", "pricing"],
        event: ["event", "registration", "signup", "join", "attend"],
        donation: ["donation", "charity", "contribute", "give"],
      };
      
      let selectedCategory: string | null = null;
      
      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => aiPrompt.toLowerCase().includes(word))) {
          selectedCategory = category;
          break;
        }
      }
      
      setSelectedTemplate(selectedCategory || "contact");
      setIsGenerating(false);
      create({ 
        title: title || `${generatedFormTitle} Form`, 
        description: description || aiPrompt,
        templateId: selectedCategory || "contact"
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {step === "info" ? "Create a new form" : step === "template" ? "Choose a template" : "AI Form Generator"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {step === "info" 
                ? "Start by giving your form a name and description" 
                : step === "template"
                ? "Select a template to jumpstart your form creation"
                : "Describe the form you want to create and our AI will do the rest"}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          {step === "info" ? (
            <>
              <Tabs defaultValue="template" onValueChange={(value) => setSelectedTab(value as "template" | "ai")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="template">Use Template</TabsTrigger>
                  <TabsTrigger value="ai">AI Generator</TabsTrigger>
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
              filteredTemplates={filteredTemplates}
              handleBack={handleBack}
              handleSubmit={handleSubmit}
              isPending={isPending}
            />
          ) : (
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
                  <h4 className="text-sm font-medium text-amber-800 mb-2">AI Form Generation Tips:</h4>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Include the type of form (contact, survey, registration, etc.)</li>
                    <li>• Specify important fields you want to include</li>
                    <li>• Mention any conditional logic or validation needs</li>
                    <li>• Describe your target audience</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleAiGeneration} disabled={isGenerating || !aiPrompt.trim()}>
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
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
