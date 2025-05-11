
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { FormField, AIFormPrompt } from "@/lib/types";
import { AIFormPromptStep } from "./AIFormPromptStep";
import { AIFormOptionsStep } from "./AIFormOptionsStep";
import { AIFormPreviewStep } from "./AIFormPreviewStep";

export function AIFormGenerator({ onFormGenerated }: { onFormGenerated: (formData: any) => void }) {
  const [prompt, setPrompt] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<"prompt" | "options" | "preview">("prompt");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [aiPrompt, setAiPrompt] = useState<AIFormPrompt>({
    industry: "general",
    purpose: "collect_info",
    formType: "contact"
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNextStep = () => {
    if (generationStep === "prompt") {
      if (!formTitle.trim()) {
        toast({
          title: "Form title required",
          description: "Please enter a title for your form",
          variant: "destructive",
        });
        return;
      }
      setGenerationStep("options");
    } else if (generationStep === "options") {
      handleGenerate();
    }
  };

  const handlePreviousStep = () => {
    if (generationStep === "options") {
      setGenerationStep("prompt");
    } else if (generationStep === "preview") {
      setGenerationStep("options");
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Combine all the inputs into a more structured prompt for the AI
      const fullPrompt = `
        Create a ${aiPrompt.formType} form for the ${aiPrompt.industry} industry. 
        Purpose: ${aiPrompt.purpose}.
        Additional details: ${prompt}
      `;
      
      console.log("Generating form with AI prompt:", fullPrompt);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate form fields based on the form type and industry using the utility function
      const { generateFormFieldsBasedOnType } = await import('./formFieldGenerator');
      const generatedFields = generateFormFieldsBasedOnType(aiPrompt.formType, aiPrompt.industry);
      
      setFormFields(generatedFields);
      setGenerationStep("preview");
      
      toast({
        title: "Form template generated",
        description: "Your AI-generated form template is ready for review.",
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

  const handleSaveForm = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create forms",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Prepare the form data for saving
      const formData = {
        title: formTitle,
        description: prompt,
        fields: formFields,
        user_id: user.id,
      };
      
      // Save the form to the database
      const { data, error } = await supabase
        .from('forms')
        .insert([formData])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating form:", error);
        throw error;
      }
      
      onFormGenerated(data);
      
      toast({
        title: "Form created!",
        description: "Your AI-generated form has been saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "Failed to save the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (generationStep === "preview") {
    return (
      <AIFormPreviewStep
        formTitle={formTitle}
        prompt={prompt}
        formFields={formFields}
        isGenerating={isGenerating}
        onPrevious={handlePreviousStep}
        onSave={handleSaveForm}
      />
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {generationStep === "prompt" && (
        <AIFormPromptStep
          formTitle={formTitle}
          prompt={prompt}
          onFormTitleChange={setFormTitle}
          onPromptChange={setPrompt}
          onNext={handleNextStep}
        />
      )}

      {generationStep === "options" && (
        <AIFormOptionsStep
          aiPrompt={aiPrompt}
          onAiPromptChange={setAiPrompt}
          isGenerating={isGenerating}
          onPrevious={handlePreviousStep}
          onGenerate={handleNextStep}
        />
      )}
    </div>
  );
}
