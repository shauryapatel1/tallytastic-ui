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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Sparkles, Replace, Merge, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormFieldDefinition } from "@/types/forms";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertDescription } from "@/components/ui/alert";

type GenerationMode = "replace" | "merge";

interface RegenerateFormDialogProps {
  currentTitle?: string;
  currentFieldCount?: number;
  onRegenerate: (fields: FormFieldDefinition[]) => void;
  onMerge: (fields: FormFieldDefinition[]) => void;
}

export function RegenerateFormDialog({ 
  currentTitle, 
  currentFieldCount = 0,
  onRegenerate,
  onMerge 
}: RegenerateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formTitle, setFormTitle] = useState(currentTitle || "");
  const [purpose, setPurpose] = useState("");
  const [industry, setIndustry] = useState("");
  const [mode, setMode] = useState<GenerationMode>("merge");
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

      if (mode === "replace") {
        onRegenerate(newFields);
        toast({
          title: "Form Regenerated!",
          description: `Replaced with ${newFields.length} new AI-generated fields.`
        });
      } else {
        onMerge(newFields);
        toast({
          title: "Fields Added!",
          description: `Added ${newFields.length} new AI-generated fields to your form.`
        });
      }

      setOpen(false);
      setPurpose("");
      setIndustry("");
    } catch (error) {
      console.error("Generation error:", error);
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
          title: "Generation Failed",
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
          <span className="hidden sm:inline">AI Generate</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            Generate Fields with AI
          </DialogTitle>
          <DialogDescription>
            Describe what fields you need and AI will generate them for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Form Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Form Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Customer Feedback Survey"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">
              What fields do you need? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="purpose"
              placeholder="e.g., Add fields for collecting user satisfaction ratings, feature requests, and contact information for follow-up"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about the data you want to collect
            </p>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label>Industry (optional)</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select for industry-specific fields" />
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

          {/* Mode Selection */}
          {currentFieldCount > 0 && (
            <div className="space-y-3">
              <Label>How should we add the new fields?</Label>
              <RadioGroup 
                value={mode} 
                onValueChange={(v) => setMode(v as GenerationMode)}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="merge"
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    mode === "merge" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="merge" id="merge" className="mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-sm">
                      <Merge className="h-3.5 w-3.5" />
                      Add to existing
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Keep your {currentFieldCount} field{currentFieldCount !== 1 ? 's' : ''} and add new ones
                    </p>
                  </div>
                </Label>
                <Label
                  htmlFor="replace"
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    mode === "replace" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value="replace" id="replace" className="mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-sm">
                      <Replace className="h-3.5 w-3.5" />
                      Replace all
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Remove existing and start fresh
                    </p>
                  </div>
                </Label>
              </RadioGroup>

              {mode === "replace" && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This will remove all {currentFieldCount} existing field{currentFieldCount !== 1 ? 's' : ''}. You can undo after.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!formTitle.trim() || !purpose.trim() || isGenerating}
            className="min-w-[120px]"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                {mode === "merge" ? "Add Fields" : "Replace All"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
