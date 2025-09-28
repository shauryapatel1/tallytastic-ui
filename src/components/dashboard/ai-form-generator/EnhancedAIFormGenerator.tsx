import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, ArrowRight } from "lucide-react";
import { FormDefinition } from "@/lib/form/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface EnhancedAIFormGeneratorProps {
  onFormGenerated: (formDefinition: FormDefinition) => void;
  onBack: () => void;
}

export const EnhancedAIFormGenerator = ({ onFormGenerated, onBack }: EnhancedAIFormGeneratorProps) => {
  const [formTitle, setFormTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [industry, setIndustry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateFormDefinition = (title: string, purpose: string, industry?: string): FormDefinition => {
    const now = new Date().toISOString();
    const formId = uuidv4();
    
    // AI logic to determine field types based on purpose and industry
    const fields = [];
    const sectionId = uuidv4();
    
    // Always include basic contact fields
    fields.push({
      id: uuidv4(),
      type: "text" as const,
      label: "Full Name",
      isRequired: true,
      placeholder: "Enter your full name"
    });

    fields.push({
      id: uuidv4(),
      type: "email" as const,
      label: "Email Address", 
      isRequired: true,
      placeholder: "your@email.com"
    });

    // Add purpose-specific fields
    if (purpose.toLowerCase().includes("contact") || purpose.toLowerCase().includes("inquiry")) {
      fields.push({
        id: uuidv4(),
        type: "tel" as const,
        label: "Phone Number",
        isRequired: false,
        placeholder: "(555) 123-4567"
      });
      
      fields.push({
        id: uuidv4(),
        type: "textarea" as const,
        label: "Message",
        isRequired: true,
        placeholder: "How can we help you?",
        rows: 4
      });
    }

    if (purpose.toLowerCase().includes("feedback") || purpose.toLowerCase().includes("review")) {
      fields.push({
        id: uuidv4(),
        type: "radio" as const,
        label: "Overall Rating",
        isRequired: true,
        options: [
          { id: uuidv4(), label: "Excellent", value: "excellent" },
          { id: uuidv4(), label: "Good", value: "good" },
          { id: uuidv4(), label: "Average", value: "average" },
          { id: uuidv4(), label: "Poor", value: "poor" }
        ]
      });

      fields.push({
        id: uuidv4(),
        type: "textarea" as const,
        label: "Comments and Suggestions",
        isRequired: false,
        placeholder: "Share your thoughts...",
        rows: 4
      });
    }

    if (purpose.toLowerCase().includes("registration") || purpose.toLowerCase().includes("signup")) {
      fields.push({
        id: uuidv4(),
        type: "tel" as const,
        label: "Phone Number",
        isRequired: true,
        placeholder: "(555) 123-4567"
      });

      if (industry === "events") {
        fields.push({
          id: uuidv4(),
          type: "select" as const,
          label: "Ticket Type",
          isRequired: true,
          options: [
            { id: uuidv4(), label: "General Admission", value: "general" },
            { id: uuidv4(), label: "VIP", value: "vip" },
            { id: uuidv4(), label: "Student", value: "student" }
          ]
        });
      }
    }

    if (purpose.toLowerCase().includes("application") || purpose.toLowerCase().includes("job")) {
      fields.push({
        id: uuidv4(),
        type: "tel" as const,
        label: "Phone Number",
        isRequired: true,
        placeholder: "(555) 123-4567"
      });

      fields.push({
        id: uuidv4(),
        type: "file" as const,
        label: "Resume/CV",
        isRequired: true,
        allowedFileTypes: [".pdf", ".doc", ".docx"],
        maxFileSizeMB: 5
      });

      fields.push({
        id: uuidv4(),
        type: "textarea" as const,
        label: "Cover Letter",
        isRequired: false,
        placeholder: "Why are you interested in this position?",
        rows: 5
      });
    }

    // Add industry-specific fields
    if (industry === "healthcare") {
      fields.push({
        id: uuidv4(),
        type: "date" as const,
        label: "Date of Birth",
        isRequired: false
      });
    }

    if (industry === "education") {
      fields.push({
        id: uuidv4(),
        type: "select" as const,
        label: "Grade Level",
        isRequired: false,
        options: [
          { id: uuidv4(), label: "Elementary", value: "elementary" },
          { id: uuidv4(), label: "Middle School", value: "middle" },
          { id: uuidv4(), label: "High School", value: "high" },
          { id: uuidv4(), label: "College", value: "college" }
        ]
      });
    }

    // Always add consent at the end if it's a business form
    if (!purpose.toLowerCase().includes("internal")) {
      fields.push({
        id: uuidv4(),
        type: "checkbox" as const,
        label: "I agree to be contacted about my submission",
        isRequired: false
      });
    }

    return {
      id: formId,
      title,
      description: `Generated form for: ${purpose}`,
      sections: [{
        id: sectionId,
        title: "Information",
        fields
      }],
      status: "draft",
      version: 1,
      createdAt: now,
      updatedAt: now
    };
  };

  const handleGenerate = async () => {
    if (!formTitle.trim() || !purpose.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a form title and purpose.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const formDefinition = generateFormDefinition(formTitle, purpose, industry);
      
      toast({
        title: "Form Generated!",
        description: "Your AI-generated form is ready to use."
      });
      
      onFormGenerated(formDefinition);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Form Generator</h2>
        <p className="text-muted-foreground">
          Describe your form and we'll generate the perfect fields for you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>
            Tell us about your form and we'll create it automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Form Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., Contact Form, Customer Survey, Job Application"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              What's the purpose of this form? <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="e.g., Collect customer feedback for our product, Register attendees for our conference, Accept job applications for marketing position"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Industry (optional)
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="nonprofit">Nonprofit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={!formTitle.trim() || !purpose.trim() || isGenerating}
        >
          {isGenerating ? (
            "Generating..."
          ) : (
            <>
              Generate Form
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};