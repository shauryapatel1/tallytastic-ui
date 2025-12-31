import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, ArrowRight, Sparkles, ArrowLeft, Lightbulb } from "lucide-react";
import { FormDefinition } from "@/lib/form/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

interface SmartFormGeneratorProps {
  onFormGenerated: (formDefinition: FormDefinition) => void;
  onBack: () => void;
}

const examplePrompts = [
  "Collect customer feedback about our mobile app with ratings and suggestions",
  "Register attendees for a tech conference with ticket selection and dietary needs",
  "Gather job applications with resume upload, experience, and cover letter",
  "Survey customers about their shopping experience with NPS score",
];

export const SmartFormGenerator = ({ onFormGenerated, onBack }: SmartFormGeneratorProps) => {
  const [formTitle, setFormTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [industry, setIndustry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke('generate-form', {
        body: { 
          title: formTitle.trim(), 
          purpose: purpose.trim(), 
          industry: industry || undefined 
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate form");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiSchema = data?.formSchema;
      if (!aiSchema) {
        throw new Error("No form schema returned from AI");
      }

      // Build complete FormDefinition from AI response
      const now = new Date().toISOString();
      const formId = uuidv4();

      const formDefinition: FormDefinition = {
        id: formId,
        title: aiSchema.title || formTitle,
        description: aiSchema.description || `Generated form for: ${purpose}`,
        sections: (aiSchema.sections || []).map((section: any) => ({
          id: section.id || uuidv4(),
          title: section.title,
          description: section.description,
          fields: (section.fields || []).map((field: any) => ({
            id: field.id || uuidv4(),
            name: field.name,
            type: field.type,
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            isRequired: field.isRequired ?? false,
            options: field.options,
            minLength: field.minLength,
            maxLength: field.maxLength,
            min: field.min,
            max: field.max,
            rows: field.rows,
            maxFileSizeMB: field.maxFileSizeMB,
            allowedFileTypes: field.allowedFileTypes,
            maxRating: field.maxRating,
            ratingType: field.ratingType
          }))
        })),
        status: "draft",
        version: 1,
        createdAt: now,
        updatedAt: now
      };
      
      toast({
        title: "Form Generated!",
        description: "Your AI-generated form is ready to customize."
      });
      
      onFormGenerated(formDefinition);
    } catch (error) {
      console.error("Generation error:", error);
      
      const message = error instanceof Error ? error.message : "Unknown error";
      
      // Handle specific error cases
      if (message.includes("Rate limit")) {
        toast({
          title: "Rate Limited",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive"
        });
      } else if (message.includes("credits")) {
        toast({
          title: "Credits Exhausted",
          description: "AI credits have run out. Please contact support.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Generation Failed",
          description: message || "There was an error generating your form. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPurpose(example);
    // Auto-fill title based on example
    if (example.includes("feedback")) {
      setFormTitle("Customer Feedback Form");
    } else if (example.includes("conference") || example.includes("attendees")) {
      setFormTitle("Event Registration Form");
    } else if (example.includes("job") || example.includes("applications")) {
      setFormTitle("Job Application Form");
    } else if (example.includes("NPS") || example.includes("shopping")) {
      setFormTitle("Customer Survey");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
          <Wand2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Form Generator</h2>
          <p className="text-muted-foreground mt-1">
            Describe your form and AI will create the perfect fields
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-5">
          {/* Form Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Form Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Customer Feedback Survey"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium">
              What should this form collect? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="purpose"
              placeholder="Describe the data you want to collect, questions to ask, and any specific requirements..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              More detail = better results
            </p>
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {example.length > 50 ? example.slice(0, 50) + "..." : example}
                </button>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Industry <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select for industry-specific suggestions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="events">Events & Entertainment</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                <SelectItem value="consulting">Consulting & Services</SelectItem>
                <SelectItem value="nonprofit">Nonprofit & Government</SelectItem>
                <SelectItem value="hospitality">Hospitality & Travel</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={!formTitle.trim() || !purpose.trim() || isGenerating}
          size="lg"
          className="min-w-[180px] gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              Generate Form
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
