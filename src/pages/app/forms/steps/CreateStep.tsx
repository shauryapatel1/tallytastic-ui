import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FormsApi from "@/lib/api/forms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Wand2, Sparkles, ArrowRight } from "lucide-react";
import { EnhancedTemplateCard } from "@/components/dashboard/form-templates/EnhancedTemplateCard";
import { EnhancedAIFormGenerator } from "@/components/dashboard/ai-form-generator/EnhancedAIFormGenerator";
import { templateDefinitions } from "@/lib/templateDefinitions";
import { FormDefinition } from "@/lib/form/types";

// Featured templates for the create step
const featuredTemplates = [
  {
    id: "lead_capture",
    name: "Lead Capture",
    description: "Collect potential customer information",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    category: "business"
  },
  {
    id: "product_feedback", 
    name: "Product Feedback",
    description: "Gather specific product improvement ideas",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "feedback"
  },
  {
    id: "event_registration",
    name: "Event Registration", 
    description: "Register attendees for your event",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "events"
  },
  {
    id: "nps_survey",
    name: "NPS Survey",
    description: "Measure Net Promoter Score",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "feedback"
  },
  {
    id: "job_application",
    name: "Job Application",
    description: "Collect resumes and applicant information", 
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "business"
  },
  {
    id: "bug_report",
    name: "Bug Report",
    description: "Collect software issue details",
    icon: <FileText className="h-8 w-8 text-primary" />,
    category: "technical"
  }
];

interface ContextType {
  formData: any;
  navigationState: any;
}

type CreateMode = "select" | "blank" | "template" | "ai";

export default function CreateStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<CreateMode>("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const updateFormMutation = useMutation({
    mutationFn: ({ formId, formDefinition }: { formId: string; formDefinition: Partial<FormDefinition> }) =>
      FormsApi.updateForm(formId, formDefinition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formData.id] });
      toast({
        title: "Form created",
        description: "Your form is ready to build!"
      });
      // Navigate to build step
      navigate(`/app/forms/${formData.id}/build`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create form.",
        variant: "destructive"
      });
    }
  });

  const handleStartBlank = () => {
    const blankFormDefinition: Partial<FormDefinition> = {
      title: "Untitled Form",
      description: "",
      sections: [{
        id: crypto.randomUUID(),
        title: "Section 1",
        fields: []
      }]
    };

    updateFormMutation.mutate({
      formId: formData.id,
      formDefinition: blankFormDefinition
    });
  };

  const handleUseTemplate = (templateId: string) => {
    const templateGenerator = templateDefinitions[templateId];
    if (!templateGenerator) {
      toast({
        title: "Template not found",
        description: "The selected template is not available.",
        variant: "destructive"
      });
      return;
    }

    const templateDefinition = templateGenerator();
    
    updateFormMutation.mutate({
      formId: formData.id,
      formDefinition: {
        title: templateDefinition.title,
        description: templateDefinition.description,
        sections: templateDefinition.sections
      }
    });
  };

  const handleAIFormGenerated = (formDefinition: FormDefinition) => {
    updateFormMutation.mutate({
      formId: formData.id,
      formDefinition: {
        title: formDefinition.title,
        description: formDefinition.description,
        sections: formDefinition.sections
      }
    });
  };

  if (mode === "ai") {
    return (
      <EnhancedAIFormGenerator
        onFormGenerated={handleAIFormGenerated}
        onBack={() => setMode("select")}
      />
    );
  }

  if (mode === "template") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
          <p className="text-muted-foreground">
            Start with a professionally designed template
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTemplates.map((template) => (
            <EnhancedTemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onClick={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setMode("select")}>
            Back
          </Button>
          <Button 
            onClick={() => handleUseTemplate(selectedTemplate)}
            disabled={!selectedTemplate || updateFormMutation.isPending}
          >
            {updateFormMutation.isPending ? "Creating..." : "Use Template"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Create Your Form</h2>
        <p className="text-muted-foreground">
          Choose how you'd like to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Start from Blank */}
        <Card className="cursor-pointer hover:shadow-md transition-all group" onClick={handleStartBlank}>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <FileText className="h-8 w-8 group-hover:text-primary transition-colors" />
            </div>
            <CardTitle>Start from Blank</CardTitle>
            <CardDescription>
              Build your form from scratch with complete control
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Use Template */}
        <Card className="cursor-pointer hover:shadow-md transition-all group" onClick={() => setMode("template")}>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <Sparkles className="h-8 w-8 group-hover:text-primary transition-colors" />
            </div>
            <CardTitle>Use Template</CardTitle>
            <CardDescription>
              Choose from professionally designed templates
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="text-xs">
              6 templates available
            </Badge>
          </CardContent>
        </Card>

        {/* AI Generator */}
        <Card className="cursor-pointer hover:shadow-md transition-all group" onClick={() => setMode("ai")}>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
              <Wand2 className="h-8 w-8 group-hover:text-primary transition-colors" />
            </div>
            <CardTitle>AI Generator</CardTitle>
            <CardDescription>
              Describe your needs and let AI create your form
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="text-xs">
              Powered by AI
            </Badge>
          </CardContent>
        </Card>
      </div>

      {updateFormMutation.isPending && (
        <div className="text-center text-muted-foreground">
          <p>Creating your form...</p>
        </div>
      )}
    </div>
  );
}