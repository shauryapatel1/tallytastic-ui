
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
import { 
  FileText, Clipboard, MessageSquare, Check, CreditCard, 
  CalendarDays, BarChart, Users, ChevronLeft, SparklesIcon
} from "lucide-react";

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TemplateType = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "basic" | "feedback" | "data" | "popular";
};

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

  const templates: TemplateType[] = [
    {
      id: "blank",
      name: "Blank Form",
      description: "Start from scratch with a blank canvas",
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      category: "basic"
    },
    {
      id: "contact",
      name: "Contact Form",
      description: "Basic contact information collection",
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      category: "basic"
    },
    {
      id: "survey",
      name: "Feedback Survey",
      description: "Get user feedback and ratings",
      icon: <Clipboard className="h-8 w-8 text-indigo-600" />,
      category: "feedback"
    },
    {
      id: "customer",
      name: "Customer Survey",
      description: "Collect customer satisfaction data",
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      category: "feedback"
    },
    {
      id: "payment",
      name: "Payment Form",
      description: "Collect payment details securely",
      icon: <CreditCard className="h-8 w-8 text-indigo-600" />,
      category: "data"
    },
    {
      id: "event",
      name: "Event Registration",
      description: "Register attendees for your event",
      icon: <CalendarDays className="h-8 w-8 text-indigo-600" />,
      category: "popular"
    },
    {
      id: "quiz",
      name: "Quiz or Assessment",
      description: "Test knowledge with scored questions",
      icon: <BarChart className="h-8 w-8 text-indigo-600" />,
      category: "popular"
    },
  ];

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
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Form Title <span className="text-red-500">*</span>
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
                  onChange={(e) => setDescription(e.target.