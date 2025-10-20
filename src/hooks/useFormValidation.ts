import { useState, useCallback } from 'react';
import type { FormDefinition, FormValues, FormErrors, FormFieldDefinition } from '@/types/forms';
import { validateField as validateFieldEngine } from '@/lib/ValidationEngine';
import { validateForm as validateEntireFormEngine } from '@/lib/form/validate';
import { isFieldVisible } from '@/lib/conditionalLogicEvaluator';

interface UseFormValidationProps {
  formDefinition: FormDefinition;
  formValues: FormValues;
}

interface UseFormValidationReturn {
  errors: FormErrors;
  validateField: (fieldId: string) => boolean;
  validateForm: () => boolean;
  clearFieldError: (fieldId: string) => void;
  clearAllErrors: () => void;
}

/**
 * Unified validation hook that integrates conditional logic and validation
 * Ensures hidden fields are skipped during validation
 */
export function useFormValidation({
  formDefinition,
  formValues
}: UseFormValidationProps): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  // Get all fields from the form definition
  const getAllFields = useCallback((): FormFieldDefinition[] => {
    return formDefinition.sections.flatMap(section => section.fields);
  }, [formDefinition]);

  // Validate a single field by ID
  const validateField = useCallback((fieldId: string): boolean => {
    const allFields = getAllFields();
    const field = allFields.find(f => f.id === fieldId);
    
    if (!field) {
      console.warn(`Field with ID "${fieldId}" not found`);
      return true;
    }

    // Skip validation for fields hidden by conditional logic
    if (!isFieldVisible(field, allFields, formValues)) {
      // Clear any existing error for this hidden field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
      return true;
    }

    const value = formValues[fieldId];
    const result = validateFieldEngine(field, value);

    setErrors(prev => {
      const newErrors = { ...prev };
      if (!result.isValid && result.errorMessages.length > 0) {
        newErrors[fieldId] = result.errorMessages;
      } else {
        delete newErrors[fieldId];
      }
      return newErrors;
    });

    return result.isValid;
  }, [formDefinition, formValues, getAllFields]);

  // Validate the entire form, skipping hidden fields
  const validateForm = useCallback((): boolean => {
    const result = validateEntireFormEngine(formDefinition as any, formValues);
    
    setErrors(result.fieldErrors);
    return result.isValid;
  }, [formDefinition, formValues]);

  // Clear error for a specific field
  const clearFieldError = useCallback((fieldId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearFieldError,
    clearAllErrors
  };
}
