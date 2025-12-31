import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormFieldDefinition } from "@/types/forms";
import { v4 as uuidv4 } from "uuid";

interface RegenerateFormDialogProps {
  currentTitle?: string;
  onRegenerate: (fields: FormFieldDefinition[]) => void;
}

export function RegenerateFormDialog({ currentTitle, onRegenerate }: RegenerateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formTitle, setFormTitle] = useState(currentTitle || "");
  const [purpose, setPurpose] = useState("");
  const [industry, setIndustry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleRegenerate = async () => {
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
        throw new Error(error.message || "Failed to generate form");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiSchema = data?.formSchema;
      if (!aiSchema) {
        throw new Error("No form schema returned from AI");
      }

      // Extract fields from the AI response
      const newFields: FormFieldDefinition[] = (aiSchema.sections || []).flatMap((section: any) =>
        (section.fields || []).map((field: any) => ({
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
      );

      onRegenerate(newFields);
      setOpen(false);
      setPurpose("");
      setIndustry("");

      toast({
        title: "Form Regenerated!",
        description: "New fields have been generated based on your description."
      });
    } catch (error) {
      console.error("Regeneration error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";

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
          title: "Regeneration Failed",
          description: message || "There was an error generating your form.",
          variant: "destructive"
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Regenerate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Regenerate Form with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you need and AI will generate new fields. This will replace your current fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Form Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., Customer Feedback Survey"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              What do you need this form to do? <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="e.g., Collect detailed feedback about our mobile app including ratings, feature requests, and bug reports"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific for better results
            </p>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRegenerate}
            disabled={!formTitle.trim() || !purpose.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
