import React from 'react';
import type { FormDefinition, FormValues, FormErrors } from '@/types/forms';
import { FormRenderer } from '@/components/builder/preview/FormRenderer';
import { Button } from '@/components/ui/button';

interface ClassicFormRendererProps {
  formDefinition: FormDefinition;
  formValues: FormValues;
  onFormValueChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
  formErrors: FormErrors;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ClassicFormRenderer({
  formDefinition,
  formValues,
  onFormValueChange,
  onFieldBlur,
  formErrors,
  onSubmit,
  isSubmitting
}: ClassicFormRendererProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
      <FormRenderer
        formDefinition={formDefinition}
        formValues={formValues}
        onFormValueChange={onFormValueChange}
        onFieldBlur={onFieldBlur}
        formErrors={formErrors}
      />
      
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full text-base py-3"
      >
        {isSubmitting ? 'Submitting...' : formDefinition.settings?.submitButtonText || 'Submit Response'}
      </Button>
    </form>
  );
}
