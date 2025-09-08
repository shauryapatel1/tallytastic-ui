
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitFormResponse } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Form } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface FormSubmitHandlerProps {
  form: Form;
  formData: Record<string, any>;
  onSuccess?: () => void;
  onReset?: () => void;
}

export function FormSubmitHandler({ 
  form, 
  formData, 
  onSuccess, 
  onReset 
}: FormSubmitHandlerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const fields = form.sections?.flatMap(section => section.fields) || [];
      const requiredFields = fields.filter(field => field.isRequired);
      const missingFields = requiredFields.filter(field => {
        // Handle different field types differently
        if (field.type === 'checkbox') {
          return formData[field.id] !== true;
        }
        
        return !formData[field.id];
      });
      
      if (missingFields.length > 0) {
        const fieldLabels = missingFields.map(f => f.label).join(", ");
        toast({
          title: "Missing required fields",
          description: `Please fill out: ${fieldLabels}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Submit the form data
      await submitFormResponse(form.id, formData);
      
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      
      toast({
        title: "Form submitted",
        description: "Thank you for your submission!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setIsSubmitted(false);
    if (onReset) onReset();
  };
  
  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-medium">Thank you for your submission!</h3>
        <p className="text-muted-foreground">Your response has been recorded.</p>
        <Button onClick={handleReset}>Submit Another Response</Button>
      </div>
    );
  }
  
  return (
    <div className="flex justify-end py-4">
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-8"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
}
