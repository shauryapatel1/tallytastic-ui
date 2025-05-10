
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { createForm } from "@/lib/api";
import { CircleDashed, FileText, Plus, Mail, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateType } from "./form-templates/types";
import { AIFormGenerator } from "./ai-form-generator/AIFormGenerator";
import { DragDropFormBuilder } from "./DragDropFormBuilder";
import { useAuth } from "@/lib/auth";

// Simplified template data with just core examples
const simplifiedTemplates: TemplateType[] = [
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a blank form.",
    category: "basic",
    icon: <Plus className="h-5 w-5" />,
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Collect contact information from your users.",
    category: "basic",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    id: "feedback",
    name: "Feedback Form",
    description: "Collect detailed feedback about your product or service.",
    category: "feedback",
    icon: <Check className="h-5 w-5" />,
  }
];

export function CreateFormDialog({
  open,
  onOpenChange,
  onFormCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormCreated?: () => void;
}) {
  const [step, setStep] = useState<"info" | "template" | "ai" | "builder">("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTemplate(null);
    setStep("info");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    handleCreateForm(templateId);
  };

  const handleFormGenerated = (formData: any) => {
    toast({
      title: "Form created with AI",
      description: "Your AI-generated form has been created successfully.",
    });
    if (onFormCreated) onFormCreated();
    handleClose();
  };

  const handleFormBuilt = (fields: any[]) => {
    toast({
      title: "Form created",
      description: "Your custom form has been created successfully.",
    });
    if (onFormCreated) onFormCreated();
    handleClose();
  };

  const handleNextStep = () => {
    if (step === "info") {
      setStep("template");
    }
  };

  const handlePreviousStep = () => {
    if (step === "template") {
      setStep("info");
    } else if (step === "ai") {
      setStep("template");
    } else if (step === "builder") {
      setStep("template");
    }
  };

  const handleCreateForm = async (templateId?: string) => {
    if (!title) {
      toast({
        title: "Form title required",
        description: "Please enter a title for your form",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await createForm({
        title,
        description,
        templateId: templateId || selectedTemplate || undefined,
        user
      });

      await queryClient.invalidateQueries({ queryKey: ["forms", user.id] });

      toast({
        title: "Form created",
        description: "Your new form has been created successfully",
      });

      if (onFormCreated) onFormCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating form:", error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "info" && (
            <motion.div
              key="info-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 py-4"
            >
              <div className="space-y-2">
                <Input
                  placeholder="Form Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Form Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNextStep} disabled={!title.trim()}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === "template" && (
            <motion.div
              key="template-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 py-4"
            >
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="ai">AI Generator</TabsTrigger>
                  <TabsTrigger value="builder">Form Builder</TabsTrigger>
                </TabsList>
                <TabsContent value="templates" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {simplifiedTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:shadow-sm ${
                          selectedTemplate === template.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                            {template.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="ai" className="space-y-4 mt-4">
                  <AIFormGenerator onFormGenerated={handleFormGenerated} />
                </TabsContent>
                <TabsContent value="builder" className="space-y-4 mt-4">
                  <DragDropFormBuilder onSave={handleFormBuilt} />
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                {/* Only show Create button for templates tab since the other tabs have their own buttons */}
                <Button
                  onClick={() => handleCreateForm()}
                  disabled={isLoading || !selectedTemplate}
                >
                  {isLoading ? (
                    <>
                      <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Form"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
