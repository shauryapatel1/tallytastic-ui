import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitFormResponse } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Form } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { checkFormOwnerQuota } from "@/lib/subscriptionService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [quotaError, setQuotaError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setQuotaError(null);
    
    try {
      // Check form owner's quota before submitting
      const quotaCheck = await checkFormOwnerQuota(form.id);
      if (!quotaCheck.canSubmit) {
        setQuotaError(quotaCheck.message || "This form has reached its response limit.");
        setIsSubmitting(false);
        return;
      }
      
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
    <div className="space-y-4">
      {quotaError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to submit</AlertTitle>
          <AlertDescription>{quotaError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end py-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !!quotaError}
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
    </div>
  );
}
