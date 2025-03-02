
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AIFormGenerator({ onFormGenerated }: { onFormGenerated: (formData: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() || !formTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and description for your form.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example generated form
      const generatedForm = {
        title: formTitle,
        description: prompt,
        fields: [
          {
            id: crypto.randomUUID(),
            type: "text",
            label: "Name",
            required: true,
            placeholder: "Enter your name",
          },
          {
            id: crypto.randomUUID(),
            type: "email",
            label: "Email",
            required: true,
            placeholder: "Enter your email",
          },
          {
            id: crypto.randomUUID(),
            type: "textarea",
            label: "Message",
            required: false,
            placeholder: "Enter your message",
          }
        ]
      };
      
      onFormGenerated(generatedForm);
      
      toast({
        title: "Form generated!",
        description: "Your AI-generated form is ready to use.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: "Failed to generate the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
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
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>
        <div>
          <Textarea
            placeholder="Describe the form you want to create (e.g., 'A contact form for a restaurant with name, email, phone number, and preferred reservation date')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !prompt.trim() || !formTitle.trim()}
        className="w-full"
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
  );
}
