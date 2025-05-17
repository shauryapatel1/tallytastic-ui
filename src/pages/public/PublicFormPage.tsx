import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormDefinition, FormFieldDefinition, FormValues, FormErrors } from '@/types/forms';
import { FormRenderer } from '@/components/builder/preview/FormRenderer';
import { validateField } from '@/lib/ValidationEngine';
import { getFormById, submitFormResponse } from '@/services/formService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PublicFormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!formId) {
      setIsLoading(false);
      setNotFound(true);
      toast.error("Form ID is missing.");
      return;
    }

    const fetchForm = async () => {
      setIsLoading(true);
      setNotFound(false);
      // Clear previous form definition and errors
      setFormDefinition(null);
      setFormValues({});
      setFormErrors({});
      try {
        const definition = await getFormById(formId); // Use actual service call

        if (definition) {
          setFormDefinition(definition);
          const initialValues: FormValues = {};
          definition.sections.forEach(section => {
            section.fields.forEach(field => {
              // Ensure defaultValue is not null/undefined before assigning, or fallback to empty string
              initialValues[field.id] = field.defaultValue !== null && field.defaultValue !== undefined ? field.defaultValue : '';
            });
          });
          setFormValues(initialValues);
          // No need to setFormErrors({}) here as it's done at the start of fetchForm
        } else {
          // This case should ideally be caught by getFormById throwing an error if form not found
          setNotFound(true);
          toast.error("Form not found.");
        }
      } catch (error) {
        console.error("Error fetching form definition:", error);
        setNotFound(true); // Assume any error in fetching means form is not accessible or found
        // Check if error is an instance of Error to safely access message property
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        if (errorMessage.toLowerCase().includes("not found")) {
          toast.error("Form not found.");
        } else {
          toast.error("Failed to load the form. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleFormValueChange = useCallback((fieldId: string, value: any) => {
    setFormValues(prevValues => {
      const newValues = { ...prevValues, [fieldId]: value };
      
      if (formDefinition) {
        const fieldDef = formDefinition.sections
          .flatMap(s => s.fields)
          .find(f => f.id === fieldId);
        
        if (fieldDef) {
          // Adjusted call to validateField and handling of its result
          const validationResult = validateField(fieldDef, value);
          setFormErrors(prevErrors => ({
            ...prevErrors,
            [fieldId]: validationResult.errorMessages.length > 0 ? validationResult.errorMessages : undefined,
          }));
        }
      }
      return newValues;
    });
  }, [formDefinition]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formDefinition || !formId) {
      toast.error("Form definition or ID is not loaded. Cannot submit.");
      return;
    }

    setIsSubmitting(true);
    setFormErrors({}); // Clear previous errors before new validation
    let allErrors: FormErrors = {};
    let isValid = true;

    formDefinition.sections.forEach(section => {
      section.fields.forEach(field => {
        const valueToValidate = formValues[field.id] !== undefined ? formValues[field.id] : ''; // Ensure value is not undefined for validation
        const validationResult = validateField(field, valueToValidate);
        if (!validationResult.isValid && validationResult.errorMessages.length > 0) {
          allErrors[field.id] = validationResult.errorMessages;
          isValid = false;
        }
      });
    });

    setFormErrors(allErrors);

    if (!isValid) {
      toast.error("Please correct the errors in the form before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Ensure formValues are passed, formId is already confirmed not null
      await submitFormResponse(formId, formValues); 
      
      // Use a more specific success message if available from formDefinition, otherwise a default
      toast.success(formDefinition.customSuccessMessage || "Your response has been submitted successfully!");
      
      if (formDefinition.redirectUrl) {
        // Add a small delay for the user to see the success toast before redirecting
        setTimeout(() => {
          if (formDefinition.redirectUrl) { // Double check in case state changes
            window.location.href = formDefinition.redirectUrl;
          }
        }, 1500); // 1.5 seconds delay
      } else {
        // If no redirect, clear the form values for a potential new submission or indicate completion
        const initialValues: FormValues = {};
        formDefinition.sections.forEach(section => {
          section.fields.forEach(field => {
            initialValues[field.id] = field.defaultValue !== null && field.defaultValue !== undefined ? field.defaultValue : '';
          });
        });
        setFormValues(initialValues);
        setFormErrors({}); // Clear errors as well
        // Potentially scroll to top or show a persistent success message area if not redirecting
      }
    } catch (error) {
      console.error("Error submitting form response:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred during submission.";
      toast.error(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg"><p>Loading form...</p></div>;
  }

  if (notFound) {
    return <div className="flex justify-center items-center h-screen text-lg text-destructive"><p>Form not found or an error occurred.</p></div>;
  }

  if (!formDefinition) {
    return <div className="flex justify-center items-center h-screen text-lg"><p>Could not load form definition.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-12 max-w-3xl bg-background min-h-screen flex flex-col items-center">
      <div className="w-full bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight text-card-foreground">{formDefinition.title}</h1>
          {formDefinition.description && <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">{formDefinition.description}</p>}
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <FormRenderer
            formDefinition={formDefinition}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            formErrors={formErrors}
          />
          {/* TODO: Implement customizable submit button text from formDefinition.settings.submitButtonText */}
          <Button type="submit" disabled={isSubmitting || isLoading} className="w-full text-base py-3">
            {isSubmitting ? 'Submitting...' : 'Submit Response'} 
          </Button>
        </form>
      </div>
      <footer className="mt-12 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by FormCraft
        </p>
      </footer>
    </div>
  );
} 