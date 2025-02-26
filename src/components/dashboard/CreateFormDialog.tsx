
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
  const [step, setStep] = useState<"info" | "template">("info");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<"basic" | "feedback" | "data" | "popular">("popular");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredTemplates = templates.filter(t => t.category === templateCategory);

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
    if (!selectedTemplate) {
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
      templateId: selectedTemplate !== "blank" ? selectedTemplate : undefined
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
    setStep("template");
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
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {step === "info" ? "Create a new form" : "Choose a template"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {step === "info" 
                ? "Start by giving your form a name and description" 
                : "Select a template to jumpstart your form creation"}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          {step === "info" ? (
            <FormInfoStep
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              handleNext={handleNext}
              isPending={isPending}
            />
          ) : (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
