
import React, { useState, useEffect } from "react";
import { FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormFieldRenderer } from "./form-fields/FormFieldRenderer";
import { FormSubmissionSuccess } from "./form-fields/FormSubmissionSuccess";

interface PublicFormViewProps {
  title: string;
  description?: string;
  fields: FormField[];
  successMessage?: string;
  redirectUrl?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    borderRadius?: number;
  };
  onSubmit?: (formData: Record<string, any>) => Promise<void>;
}

export function PublicFormView({ 
  title, 
  description, 
  fields, 
  successMessage = "Thank you for your submission!",
  redirectUrl,
  theme,
  onSubmit 
}: PublicFormViewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      // Skip divider/heading/paragraph fields (they're just visual)
      if (['divider', 'heading', 'paragraph'].includes(field.type)) return;
      
      // Skip validation for fields that are hidden by conditional logic
      if (field.conditionalLogic && !isFieldVisible(field)) return;
      
      if (field.isRequired && !formData[field.id]) {
        newErrors[field.id] = "This field is required";
      }
      
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email";
        }
      }
      
      // Basic validation - skip advanced validation for now
      if (field.type === 'number' && formData[field.id] !== undefined) {
        const num = Number(formData[field.id]);
        if (field.min !== undefined && num < field.min) {
          newErrors[field.id] = `Must be at least ${field.min}`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[field.id] = `Must be at most ${field.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please check your answers",
        description: "Some fields need your attention",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      setIsSubmitted(true);
      
      toast({
        title: "Form submitted",
        description: "Thank you for your submission",
      });
      
      // Redirect if URL is provided
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a field should be visible based on conditional logic
  const isFieldVisible = (field: FormField): boolean => {
    // If no conditional logic, field is always visible
    if (!field.conditionalLogic || field.conditionalLogic.length === 0) return true;
    
    return true;
  };

  if (isSubmitted) {
    return <FormSubmissionSuccess successMessage={successMessage} redirectUrl={redirectUrl} />;
  }

  return (
    <div 
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow"
      style={{
        backgroundColor: theme?.backgroundColor || "white",
        fontFamily: theme?.fontFamily || "inherit",
        borderRadius: theme?.borderRadius !== undefined ? `${theme.borderRadius}px` : "0.5rem"
      }}
    >
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-700">{description}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          // Only render fields that should be visible based on conditional logic
          isFieldVisible(field) && (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={errors[field.id]}
            />
          )
        ))}
        
        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full py-2 ${theme?.primaryColor ? `bg-[${theme.primaryColor}]` : ''}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
