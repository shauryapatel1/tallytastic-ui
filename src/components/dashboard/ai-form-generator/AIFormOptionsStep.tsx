
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { AIFormPrompt } from "@/lib/types";

// Industry options for the form
const industries = [
  { value: "general", label: "General" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "finance", label: "Finance" },
  { value: "technology", label: "Technology" },
  { value: "hospitality", label: "Hospitality" }
];

// Form purpose options
const purposes = [
  { value: "collect_info", label: "Collect Information" },
  { value: "feedback", label: "Get Feedback" },
  { value: "survey", label: "Survey" },
  { value: "registration", label: "Registration" },
  { value: "application", label: "Application" },
  { value: "order", label: "Order Form" }
];

// Form type templates
const formTypes = [
  { value: "contact", label: "Contact Form" },
  { value: "feedback", label: "Feedback Form" },
  { value: "survey", label: "Survey" },
  { value: "registration", label: "Event Registration" },
  { value: "application", label: "Job Application" },
  { value: "order", label: "Order Form" },
  { value: "custom", label: "Custom Form" }
];

interface AIFormOptionsStepProps {
  aiPrompt: AIFormPrompt;
  onAiPromptChange: (prompt: AIFormPrompt) => void;
  isGenerating: boolean;
  onPrevious: () => void;
  onGenerate: () => void;
}

export function AIFormOptionsStep({
  aiPrompt,
  onAiPromptChange,
  isGenerating,
  onPrevious,
  onGenerate,
}: AIFormOptionsStepProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          Configure AI Form Options
        </h3>
        <p className="text-sm text-muted-foreground">
          Customize the AI generation settings
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Select
            value={aiPrompt.industry}
            onValueChange={(value) => onAiPromptChange({...aiPrompt, industry: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Form Purpose</label>
          <Select
            value={aiPrompt.purpose}
            onValueChange={(value) => onAiPromptChange({...aiPrompt, purpose: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Purpose" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map((purpose) => (
                <SelectItem key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Form Type</label>
          <Select
            value={aiPrompt.formType}
            onValueChange={(value) => onAiPromptChange({...aiPrompt, formType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Form Type" />
            </SelectTrigger>
            <SelectContent>
              {formTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-settings">
            <AccordionTrigger className="text-sm font-medium">Advanced Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Form Complexity</label>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">Simple</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      defaultValue="3"
                      className="w-full"
                    />
                    <span className="text-xs ml-2">Complex</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Form
            </>
          )}
        </Button>
      </div>
    </>
  );
}
