import type { 
  FormFieldDefinition, 
  ValidationRule, 
  FieldValidationResult,
  FormValidationResult,
  FormDefinition,
  FormValues,
  FormErrors
} from './types';
import { conditionalLogicEvaluator } from './logic';

/**
 * Validates a single field's value
 */
export function validateField(
  field: FormFieldDefinition,
  value: any,
  definition?: FormDefinition,
  allValues?: FormValues
): FieldValidationResult {
  const errorMessages: string[] = [];

  // Skip validation if field is not visible due to conditional logic
  if (definition && allValues && !conditionalLogicEvaluator(allValues, field, definition)) {
    return { isValid: true, errorMessages: [] };
  }

  // Check required validation
  if (field.isRequired && isValueEmpty(value)) {
    errorMessages.push(`${field.label} is required`);
  }

  // Skip other validations if value is empty and field is not required
  if (!field.isRequired && isValueEmpty(value)) {
    return { isValid: true, errorMessages: [] };
  }

  // Built-in field validations
  const builtInErrors = validateBuiltInRules(field, value);
  errorMessages.push(...builtInErrors);

  // Advanced validation rules
  if (field.advancedValidationRules) {
    for (const rule of field.advancedValidationRules) {
      if (rule.isActive !== false) {
        const ruleResult = validateRule(field, value, rule);
        if (!ruleResult.isValid && ruleResult.errorMessage) {
          errorMessages.push(ruleResult.errorMessage);
        }
      }
    }
  }

  return {
    isValid: errorMessages.length === 0,
    errorMessages
  };
}

/**
 * Validates built-in field rules (min/max, length, etc.)
 */
function validateBuiltInRules(field: FormFieldDefinition, value: any): string[] {
  const errors: string[] = [];

  // Text length validation
  if (typeof value === 'string') {
    if (field.minLength && value.length < field.minLength) {
      errors.push(`Must be at least ${field.minLength} characters`);
    }
    if (field.maxLength && value.length > field.maxLength) {
      errors.push(`Must be no more than ${field.maxLength} characters`);
    }
  }

  // Number validation
  if (field.type === 'number' && value !== '') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push('Must be a valid number');
    } else {
      if (field.min !== undefined && numValue < field.min) {
        errors.push(`Must be at least ${field.min}`);
      }
      if (field.max !== undefined && numValue > field.max) {
        errors.push(`Must be no more than ${field.max}`);
      }
    }
  }

  // Email validation
  if (field.type === 'email' && value && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push('Must be a valid email address');
    }
  }

  // Date validation
  if (field.type === 'date' && value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push('Must be a valid date');
    } else {
      if (field.minDate) {
        const minDate = new Date(field.minDate);
        if (date < minDate) {
          errors.push(`Date must be after ${field.minDate}`);
        }
      }
      if (field.maxDate) {
        const maxDate = new Date(field.maxDate);
        if (date > maxDate) {
          errors.push(`Date must be before ${field.maxDate}`);
        }
      }
    }
  }

  // File validation
  if (field.type === 'file' && value) {
    if (value instanceof File) {
      if (field.maxFileSizeMB && value.size > field.maxFileSizeMB * 1024 * 1024) {
        errors.push(`File size must be less than ${field.maxFileSizeMB}MB`);
      }
      if (field.allowedFileTypes && !field.allowedFileTypes.includes(value.type)) {
        errors.push(`File type must be one of: ${field.allowedFileTypes.join(', ')}`);
      }
    }
  }

  // Rating validation
  if (field.type === 'rating' && value !== undefined) {
    const rating = Number(value);
    if (isNaN(rating) || rating < 1 || rating > (field.maxRating || 5)) {
      errors.push(`Rating must be between 1 and ${field.maxRating || 5}`);
    }
  }

  return errors;
}

/**
 * Validates a single advanced validation rule
 */
function validateRule(
  field: FormFieldDefinition,
  value: any,
  rule: ValidationRule
): { isValid: boolean; errorMessage?: string } {
  const { type, params, customMessage } = rule;

  switch (type) {
    case 'required':
      if (isValueEmpty(value)) {
        return { isValid: false, errorMessage: customMessage || 'This field is required' };
      }
      return { isValid: true };

    case 'minLength':
      if (typeof value === 'string' && params?.length) {
        if (value.length < params.length) {
          return { isValid: false, errorMessage: customMessage || `Must be at least ${params.length} characters` };
        }
      }
      return { isValid: true };

    case 'maxLength':
      if (typeof value === 'string' && params?.length) {
        if (value.length > params.length) {
          return { isValid: false, errorMessage: customMessage || `Must be no more than ${params.length} characters` };
        }
      }
      return { isValid: true };

    case 'exactLength':
      if (typeof value === 'string' && params?.length) {
        if (value.length !== params.length) {
          return { isValid: false, errorMessage: customMessage || `Must be exactly ${params.length} characters` };
        }
      }
      return { isValid: true };

    case 'pattern':
      if (typeof value === 'string' && params?.pattern) {
        try {
          const regex = new RegExp(params.pattern);
          if (!regex.test(value)) {
            return { isValid: false, errorMessage: customMessage || 'Invalid format' };
          }
        } catch (e) {
          console.error('Invalid regex pattern:', params.pattern);
          return { isValid: false, errorMessage: 'Invalid validation pattern' };
        }
      }
      return { isValid: true };

    case 'isEmail':
      if (typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, errorMessage: customMessage || 'Must be a valid email address' };
        }
      }
      return { isValid: true };

    case 'isURL':
      if (typeof value === 'string') {
        try {
          new URL(value);
        } catch {
          return { isValid: false, errorMessage: customMessage || 'Must be a valid URL' };
        }
      }
      return { isValid: true };

    case 'minValue':
      if (params?.value !== undefined) {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue < params.value) {
          return { isValid: false, errorMessage: customMessage || `Must be at least ${params.value}` };
        }
      }
      return { isValid: true };

    case 'maxValue':
      if (params?.value !== undefined) {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue > params.value) {
          return { isValid: false, errorMessage: customMessage || `Must be no more than ${params.value}` };
        }
      }
      return { isValid: true };

    case 'numberInteger':
      const numValue = Number(value);
      if (!isNaN(numValue) && !Number.isInteger(numValue)) {
        return { isValid: false, errorMessage: customMessage || 'Must be a whole number' };
      }
      return { isValid: true };

    case 'stringContains':
      if (typeof value === 'string' && params?.substring) {
        if (!value.includes(params.substring)) {
          return { isValid: false, errorMessage: customMessage || `Must contain "${params.substring}"` };
        }
      }
      return { isValid: true };

    case 'stringNotContains':
      if (typeof value === 'string' && params?.substring) {
        if (value.includes(params.substring)) {
          return { isValid: false, errorMessage: customMessage || `Must not contain "${params.substring}"` };
        }
      }
      return { isValid: true };

    default:
      console.warn(`Unknown validation rule type: ${type}`);
      return { isValid: true };
  }
}

/**
 * Validates an entire form
 */
export function validateForm(
  definition: FormDefinition,
  values: FormValues
): FormValidationResult {
  const fieldErrors: FormErrors = {};
  let isValid = true;

  for (const section of definition.sections) {
    for (const field of section.fields) {
      // Skip non-input fields
      if (['heading', 'paragraph', 'divider'].includes(field.type)) {
        continue;
      }

      const fieldResult = validateField(field, values[field.id], definition, values);
      
      if (!fieldResult.isValid) {
        fieldErrors[field.id] = fieldResult.errorMessages;
        isValid = false;
      }
    }
  }

  return { isValid, fieldErrors };
}

/**
 * Checks if a value is considered empty
 */
function isValueEmpty(value: any): boolean {
  if (value == null || value === '') {
    return true;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * Hook for custom validation that can be extended
 */
export function addCustomValidation(
  validator: (field: FormFieldDefinition, value: any) => FieldValidationResult
) {
  // This allows for extending validation with custom rules
  // Implementation would depend on how you want to manage custom validators
  console.warn('Custom validation hooks not yet implemented');
}