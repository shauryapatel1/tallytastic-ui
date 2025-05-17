import type { FormFieldDefinition, ValidationRule, ValidationRuleType, ValidationRuleParams } from '@/types/forms';

// Type for the validation result
export interface FieldValidationResult {
  isValid: boolean;
  errorMessages: string[];
}

/**
 * Validates a single field's value against all its advanced validation rules.
 *
 * @param fieldDefinition The definition of the field to validate.
 * @param value The current value of the field.
 * @returns FieldValidationResult indicating if the field is valid and any error messages.
 */
export function validateField(
  fieldDefinition: FormFieldDefinition,
  value: any,
): FieldValidationResult {
  const errorMessages: string[] = [];

  if (!fieldDefinition.advancedValidationRules || fieldDefinition.advancedValidationRules.length === 0) {
    return { isValid: true, errorMessages: [] };
  }

  for (const rule of fieldDefinition.advancedValidationRules) {
    // If isActive is undefined, treat as true. Skip if explicitly false.
    if (rule.isActive === false) {
        continue;
    }
    const ruleValidationResult = evaluateSingleValidationRule(fieldDefinition, value, rule);
    if (!ruleValidationResult.isValid && ruleValidationResult.errorMessage) {
      errorMessages.push(ruleValidationResult.errorMessage);
    }
  }

  return {
    isValid: errorMessages.length === 0,
    errorMessages,
  };
}

/**
 * Evaluates a single advanced validation rule.
 *
 * @param field The field definition (for context like field type).
 * @param value The current value of the field.
 * @param rule The specific validation rule to evaluate.
 * @returns Object with isValid (boolean) and optional errorMessage (string).
 */
function evaluateSingleValidationRule(
  field: FormFieldDefinition,
  value: any,
  rule: ValidationRule
): { isValid: boolean; errorMessage?: string } {
  const { type: ruleType, params, customMessage } = rule;
  
  const isValueEffectivelyEmpty = value == null || value === '' || (Array.isArray(value) && value.length === 0);
  
  // If field is not required (based on the main isRequired flag) AND is empty, 
  // most validation rules (except a 'required' rule itself) should pass.
  if (!field.isRequired && isValueEffectivelyEmpty && ruleType !== 'required') {
      return { isValid: true };
  }

  switch (ruleType) {
    case 'required':
      if (isValueEffectivelyEmpty) {
        return { isValid: false, errorMessage: customMessage || 'This field is required.' };
      }
      return { isValid: true };

    case 'minLength': {
      const min = params?.length as number;
      if (typeof value !== 'string' && !Array.isArray(value)) return { isValid: true }; // Pass if not a string or array (or handle as error?)
      if (value.length < min) {
        return { isValid: false, errorMessage: customMessage || `Must be at least ${min} characters.` };
      }
      return { isValid: true };
    }

    case 'maxLength': {
      const max = params?.length as number;
      if (typeof value !== 'string' && !Array.isArray(value)) return { isValid: true };
      if (value.length > max) {
        return { isValid: false, errorMessage: customMessage || `Must be no more than ${max} characters.` };
      }
      return { isValid: true };
    }

    case 'exactLength': {
      const length = params?.length as number;
      if (typeof value !== 'string' && !Array.isArray(value)) return { isValid: true };
      if (value.length !== length) {
        return { isValid: false, errorMessage: customMessage || `Must be exactly ${length} characters.` };
      }
      return { isValid: true };
    }
    
    case 'pattern': {
      const regexPattern = params?.pattern as string;
      if (typeof value !== 'string' || !regexPattern) return { isValid: true }; 
      try {
        const regex = new RegExp(regexPattern);
        if (!regex.test(value)) {
          return { isValid: false, errorMessage: customMessage || 'Invalid format.' };
        }
      } catch (e) {
        console.error("Invalid regex pattern in validation rule:", regexPattern, e);
        return { isValid: false, errorMessage: 'Invalid validation rule pattern (contact admin).' };
      }
      return { isValid: true };
    }

    case 'minValue': {
      const min = params?.value as number;
      if (isValueEffectivelyEmpty && typeof value !== 'number') return { isValid: true }; // Allow empty optional fields
      const numValue = parseFloat(String(value));
      if (isNaN(numValue) || numValue < min) {
        return { isValid: false, errorMessage: customMessage || `Value must be at least ${min}.` };
      }
      return { isValid: true };
    }

    case 'maxValue': {
      const max = params?.value as number;
      if (isValueEffectivelyEmpty && typeof value !== 'number') return { isValid: true }; // Allow empty optional fields
      const numValue = parseFloat(String(value));
      if (isNaN(numValue) || numValue > max) {
        return { isValid: false, errorMessage: customMessage || `Value must be no more than ${max}.` };
      }
      return { isValid: true };
    }
    
    case 'numberInteger': {
        if (isValueEffectivelyEmpty && typeof value !== 'number') return { isValid: true }; // Allow empty optional fields
        const numValue = parseFloat(String(value));
        if (isNaN(numValue) || !Number.isInteger(numValue)) {
            return { isValid: false, errorMessage: customMessage || 'Value must be a whole number.' };
        }
        return { isValid: true };
    }

    case 'stringContains': {
        const substring = params?.substring as string;
        if (typeof value !== 'string' || typeof substring !== 'string') return { isValid: true }; 
        if (!value.includes(substring)) {
            return { isValid: false, errorMessage: customMessage || `Must contain "${substring}".` };
        }
        return { isValid: true };
    }
    
    case 'stringNotContains': {
        const substring = params?.substring as string;
        if (typeof value !== 'string' || typeof substring !== 'string') return { isValid: true };
        if (value.includes(substring)) {
            return { isValid: false, errorMessage: customMessage || `Must not contain "${substring}".` };
        }
        return { isValid: true };
    }

    // TODO: Implement other validation types like isEmail, isURL, date comparisons, file checks etc.
    case 'isEmail':
      if (typeof value !== 'string' || isValueEffectivelyEmpty) return { isValid: true };
      // Basic email regex, consider a more robust one if needed
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { isValid: false, errorMessage: customMessage || 'Invalid email address.' };
      }
      return { isValid: true };

    case 'isURL':
      if (typeof value !== 'string' || isValueEffectivelyEmpty) return { isValid: true };
      try {
        new URL(value);
      } catch (_) {
        return { isValid: false, errorMessage: customMessage || 'Invalid URL.' };
      }
      return { isValid: true };

    default:
      console.warn(`Unsupported advanced validation rule type: ${ruleType}`);
      return { isValid: true }; 
  }
} 