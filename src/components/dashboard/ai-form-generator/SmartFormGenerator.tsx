import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, ArrowRight, Sparkles } from "lucide-react";
import { FormDefinition } from "@/lib/form/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

interface SmartFormGeneratorProps {
  onFormGenerated: (formDefinition: FormDefinition) => void;
  onBack: () => void;
}

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Smart Form Generator</h2>
        <p className="text-muted-foreground">
          Describe your form and our AI will generate the perfect fields for you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Form Details
          </CardTitle>
          <CardDescription>
            Tell us what you need and AI will create it automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Form Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., Customer Feedback Survey, Event Registration"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              What's the purpose of this form? <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="e.g., Collect detailed feedback from customers about our new product launch, including satisfaction ratings and improvement suggestions"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The more detail you provide, the better the generated form
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Industry (optional)
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select an industry for tailored fields" />
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

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={!formTitle.trim() || !purpose.trim() || isGenerating}
          className="min-w-[160px]"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Generating...
            </>
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
