
import React, { useState } from "react";
import { FormField } from "@/components/dashboard/form-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

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
    logo?: string;
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
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = "This field is required";
      }
      
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email";
        }
      }
      
      if (field.validation?.pattern && formData[field.id]) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(formData[field.id])) {
            newErrors[field.id] = "Invalid format";
          }
        } catch (e) {
          console.error("Invalid regex pattern", e);
        }
      }
      
      if (field.type === 'number' && formData[field.id] !== undefined) {
        const num = Number(formData[field.id]);
        if (field.validation?.min !== undefined && num < field.validation.min) {
          newErrors[field.id] = `Must be at least ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && num > field.validation.max) {
          newErrors[field.id] = `Must be at most ${field.validation.max}`;
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

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Submission Received</h2>
        <p className="text-gray-700 mb-4">{successMessage}</p>
        {redirectUrl && (
          <p className="text-sm text-gray-500">You will be redirected shortly...</p>
        )}
      </div>
    );
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
      {theme?.logo && (
        <div className="flex justify-center mb-6">
          <img src={theme.logo} alt="Logo" className="h-12" />
        </div>
      )}
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-700">{description}</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => {
          // Skip section fields which are just visual dividers
          if (field.type === 'section') {
            return (
              <div key={field.id} className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium">{field.label}</h3>
                {field.description && (
                  <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                )}
              </div>
            );
          }
          
          return (
            <div key={field.id} className="space-y-2">
              <Label 
                htmlFor={field.id} 
                className={`block text-sm font-medium ${errors[field.id] ? 'text-red-500' : ''}`}
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.description && (
                <div className="text-xs text-gray-500">{field.description}</div>
              )}
              
              {field.type === 'text' && (
                <Input 
                  id={field.id} 
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'email' && (
                <Input 
                  id={field.id} 
                  type="email"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'number' && (
                <Input 
                  id={field.id} 
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                  min={field.validation?.min}
                  max={field.validation?.max}
                />
              )}
              
              {field.type === 'phone' && (
                <Input 
                  id={field.id} 
                  type="tel"
                  placeholder={field.placeholder || "Phone number"}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'date' && (
                <Input 
                  id={field.id} 
                  type="date"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea 
                  id={field.id} 
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full min-h-[100px] ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={field.id}
                    checked={formData[field.id] || false}
                    onCheckedChange={(checked) => handleFieldChange(field.id, Boolean(checked))}
                    className={errors[field.id] ? 'border-red-500' : ''}
                  />
                  <label htmlFor={field.id} className="text-sm">
                    {field.placeholder || "Yes, I agree"}
                  </label>
                </div>
              )}
              
              {field.type === 'select' && field.options && (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                >
                  <SelectTrigger className={errors[field.id] ? 'border-red-500' : ''}>
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option, i) => (
                      <SelectItem key={i} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.type === 'radio' && field.options && (
                <RadioGroup
                  value={formData[field.id] || ''}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                  className={errors[field.id] ? 'border-red-500 border rounded-md p-2' : ''}
                >
                  {field.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${field.id}-${i}`} />
                      <Label htmlFor={`${field.id}-${i}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {field.type === 'file' && (
                <Input 
                  id={field.id} 
                  type="file"
                  onChange={(e) => handleFieldChange(field.id, e.target.files?.[0] || null)}
                  className={`w-full ${errors[field.id] ? 'border-red-500' : ''}`}
                />
              )}
              
              {field.type === 'rating' && (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button 
                      key={star} 
                      type="button" 
                      variant="outline"
                      size="sm"
                      onClick={() => handleFieldChange(field.id, star)}
                      className={
                        Number(formData[field.id]) >= star
                          ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-500"
                          : "bg-gray-100 hover:bg-gray-200"
                      }
                    >
                      {star}
                    </Button>
                  ))}
                </div>
              )}
              
              {errors[field.id] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        })}
        
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
