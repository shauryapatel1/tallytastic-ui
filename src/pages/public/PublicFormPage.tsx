import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { FormDefinition, FormValues, FormErrors } from '@/types/forms';
import { ClassicFormRenderer } from '@/components/public/ClassicFormRenderer';
import { ConversationalFormRenderer } from '@/components/public/conversational/ConversationalFormRenderer';
import { useFormValidation } from '@/hooks/useFormValidation';
import { getFormById, submitFormResponse } from '@/services/formService';
import { toast } from 'sonner';
import { MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createFormTracker } from '@/lib/formEventsService';
import { trackFormPageView, trackSubmission, trackEmbedView } from '@/lib/posthogService';

export function PublicFormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Determine mode from URL or form settings
  const urlMode = searchParams.get('mode');
  const isEmbedded = searchParams.get('embedded') === 'true';
  const [renderMode, setRenderMode] = useState<'classic' | 'chat'>(
    urlMode === 'chat' ? 'chat' : 'classic'
  );

  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  
  // Form tracker ref to persist across renders
  const formTrackerRef = useRef<ReturnType<typeof createFormTracker> | null>(null);

  // Use unified validation hook
  const { 
    errors: formErrors, 
    validateField: validateSingleField, 
    validateForm: validateEntireForm,
    clearAllErrors 
  } = useFormValidation({
    formDefinition: formDefinition || { 
      id: '', 
      title: '', 
      sections: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    formValues
  });

  useEffect(() => {
    if (!formId) {
      setIsLoading(false);
      setNotFound(true);
      toast.error("Form ID is missing.");
      return;
    }

    // Capture metadata from URL parameters and referrer
    const captureMetadata = () => {
      const meta: Record<string, any> = {};
      
      // Capture referrer
      if (document.referrer) {
        meta.referrer = document.referrer;
      }

      // Capture all URL parameters
      const allParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });

      // Capture UTM parameters
      const utmParams: Record<string, string> = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = searchParams.get(param);
        if (value) {
          utmParams[param] = value;
        }
      });

      if (Object.keys(utmParams).length > 0) {
        meta.utm = utmParams;
      }

      // Capture any hidden field values from URL (prefixed with 'h_')
      const hiddenFields: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        if (key.startsWith('h_')) {
          const fieldName = key.substring(2); // Remove 'h_' prefix
          hiddenFields[fieldName] = value;
        }
      });

      if (Object.keys(hiddenFields).length > 0) {
        meta.hiddenFields = hiddenFields;
      }

      // Store all params for reference
      if (Object.keys(allParams).length > 0) {
        meta.urlParams = allParams;
      }

      // Capture timestamp
      meta.submittedAt = new Date().toISOString();

      setMetadata(meta);
    };

    captureMetadata();

    const fetchForm = async () => {
      setIsLoading(true);
      setNotFound(false);
      // Clear previous form definition and errors
      setFormDefinition(null);
      setFormValues({});
      clearAllErrors();
      try {
        const definition = await getFormById(formId); // Use actual service call

        if (definition) {
          setFormDefinition(definition);
          
          // Set render mode from form settings if not specified in URL
          if (!urlMode && (definition as any).mode) {
            setRenderMode((definition as any).mode === 'chat' ? 'chat' : 'classic');
          }
          
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

  // Initialize form tracking
  useEffect(() => {
    if (formId && formDefinition && !formTrackerRef.current) {
      formTrackerRef.current = createFormTracker(formId);
      formTrackerRef.current.trackView();
      
      // Track PostHog events
      const source = isEmbedded ? 'embed' : 'direct';
      
      if (isEmbedded) {
        trackEmbedView(formId, {
          referrer: document.referrer,
          utm_source: searchParams.get('utm_source') || undefined,
          utm_medium: searchParams.get('utm_medium') || undefined,
          utm_campaign: searchParams.get('utm_campaign') || undefined,
        });
      } else {
        trackFormPageView(formId, {
          mode: renderMode,
          source,
          referrer: document.referrer,
        });
      }
    }

    // Track drop-off on unmount
    return () => {
      if (formTrackerRef.current) {
        formTrackerRef.current.trackDropOff();
      }
    };
  }, [formId, formDefinition, isEmbedded, renderMode, searchParams]);

  const handleFormValueChange = useCallback((fieldId: string, value: any) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldId]: value
    }));
    
    // Track field interaction
    if (formTrackerRef.current) {
      formTrackerRef.current.trackFieldFocus(fieldId);
    }
  }, []);

  // Handle field blur for validation
  const handleFieldBlur = useCallback((fieldId: string) => {
    validateSingleField(fieldId);
    if (formTrackerRef.current) {
      formTrackerRef.current.setLastField(fieldId);
    }
  }, [validateSingleField]);

  // Handle page navigation (for pagination tracking)
  const handlePageChange = useCallback((direction: 'next' | 'back', pageIndex: number) => {
    if (formTrackerRef.current) {
      formTrackerRef.current.trackPageChange(direction, pageIndex);
    }
  }, []);

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!formDefinition || !formId) {
      toast.error("Form definition or ID is not loaded. Cannot submit.");
      return;
    }

    setIsSubmitting(true);

    // Validate entire form (automatically skips hidden fields)
    const isValid = validateEntireForm();

    if (!isValid) {
      toast.error("Please correct the errors in the form before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit with metadata (UTM params, referrer, hidden fields)
      await submitFormResponse(formId, formValues, metadata);
      
      // Track completion events
      if (formTrackerRef.current) {
        formTrackerRef.current.trackComplete();
        formTrackerRef.current = null; // Reset tracker to prevent drop-off on unmount
      }
      
      // Track in PostHog
      trackSubmission(formId, {
        form_title: formDefinition.title,
        source: isEmbedded ? 'embed' : 'direct',
        field_count: formDefinition.sections.reduce((acc, s) => acc + s.fields.length, 0),
      });
      
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
        clearAllErrors(); // Clear errors as well
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

  const toggleMode = () => {
    const newMode = renderMode === 'classic' ? 'chat' : 'classic';
    setRenderMode(newMode);
    setSearchParams({ mode: newMode });
  };

  // Send resize message for embedded forms
  useEffect(() => {
    if (searchParams.get('embedded') === 'true') {
      const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({
          type: 'formcraft-resize',
          height: height
        }, '*');
      };

      // Send initial height
      sendHeight();

      // Send height on content changes
      const observer = new ResizeObserver(sendHeight);
      observer.observe(document.body);

      return () => observer.disconnect();
    }
  }, [searchParams, formValues, renderMode]);

  return (
    <div className="container mx-auto p-4 py-8 md:p-12 max-w-3xl bg-background min-h-screen flex flex-col items-center">
      <div className="w-full bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl">
        {/* Mode toggle */}
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            {renderMode === 'classic' ? (
              <>
                <MessageSquare className="w-4 h-4" />
                Switch to Chat Mode
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Switch to Classic Mode
              </>
            )}
          </Button>
        </div>

        {/* Header - only show in classic mode */}
        {renderMode === 'classic' && (
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight text-card-foreground">
              {formDefinition.title}
            </h1>
            {formDefinition.description && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                {formDefinition.description}
              </p>
            )}
          </header>
        )}
        
        {/* Render based on mode */}
        {renderMode === 'classic' ? (
          <ClassicFormRenderer
            formDefinition={formDefinition}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            onFieldBlur={handleFieldBlur}
            formErrors={formErrors}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onPageChange={handlePageChange}
          />
        ) : (
          <ConversationalFormRenderer
            formDefinition={formDefinition}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            onFieldBlur={handleFieldBlur}
            formErrors={formErrors}
            onSubmit={() => handleSubmit()}
            isSubmitting={isSubmitting}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      
      <footer className="mt-12 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by FormCraft
        </p>
      </footer>
    </div>
  );
}