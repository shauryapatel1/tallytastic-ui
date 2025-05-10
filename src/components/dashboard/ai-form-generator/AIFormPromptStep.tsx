
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

interface AIFormPromptStepProps {
  formTitle: string;
  prompt: string;
  onFormTitleChange: (title: string) => void;
  onPromptChange: (prompt: string) => void;
  onNext: () => void;
}

export function AIFormPromptStep({
  formTitle,
  prompt,
  onFormTitleChange,
  onPromptChange,
  onNext
}: AIFormPromptStepProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-indigo-500" />
          Generate Form with AI
        </h3>
        <p className="text-sm text-muted-foreground">
          Describe your form and we'll create it for you using AI.
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <Input
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => onFormTitleChange(e.target.value)}
          />
        </div>
        <div>
          <Textarea
            placeholder="Describe the form you want to create (e.g., 'A contact form for a restaurant with name, email, phone number, and preferred reservation date')"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      
      <Button 
        onClick={onNext} 
        disabled={!formTitle.trim()}
        className="w-full"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Next: Configure Options
      </Button>
    </>
  );
}
