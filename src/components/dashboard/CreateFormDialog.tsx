
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createForm } from "@/lib/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, List, FileText, Clipboard, MessageSquare } from "lucide-react";

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TemplateType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

export const CreateFormDialog = ({
  open,
  onOpenChange,
}: CreateFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"info" | "template">("info");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const templates: TemplateType[] = [
    {
      id: "blank",
      name: "Blank Form",
      description: "Start from scratch with a blank canvas",
      icon: <FileText className="h-8 w-8 text-primary/60" />,
    },
    {
      id: "contact",
      name: "Contact Form",
      description: "Basic contact information collection",
      icon: <MessageSquare className="h-8 w-8 text-primary/60" />,
    },
    {
      id: "survey",
      name: "Feedback Survey",
      description: "Get user feedback and ratings",
      icon: <Clipboard className="h-8 w-8 text-primary/60" />,
    },
  ];

  const { mutate: create, isPending } = useMutation({
    mutationFn: createForm,
    onSuccess: (form) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      onOpenChange(false);
      navigate(`/dashboard/forms/${form.id}`);
      toast({
        title: "Form created",
        description: "Your form has been created successfully.",
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === "info" ? "Create a new form" : "Choose a template"}
          </DialogTitle>
          <DialogDescription>
            {step === "info" 
              ? "Give your form a name and optional description." 
              : "Select a template or start with a blank form."}
          </DialogDescription>
        </DialogHeader>
        
        {step === "info" ? (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Form Title
              </label>
              <Input
                id="title"
                placeholder="Enter a title for your form"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-primary/40">(optional)</span>
              </label>
              <Textarea
                id="description"
                placeholder="Enter a description for your form"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-base"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg">Continue</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-primary/60">
              Choose a template to get started or create a blank form.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:shadow-sm ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-md bg-secondary p-2">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-primary/60">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
