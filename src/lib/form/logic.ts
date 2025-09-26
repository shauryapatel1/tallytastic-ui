import type { 
  FormDefinition, 
  FormFieldDefinition, 
  ConditionalLogic, 
  ConditionalCondition, 
  FormValues,
  Comparator
} from './types';

/**
 * Evaluates conditional logic to determine if a field should be visible
 */
export function conditionalLogicEvaluator(
  answers: FormValues,
  field: FormFieldDefinition,
  definition: FormDefinition
): boolean {
  // If no conditional logic is defined, field is visible by default
  if (!field.conditionalLogic) {
    return true;
  }

  return evaluateConditionalLogic(field.conditionalLogic, answers, definition);
}

/**
 * Evaluates a conditional logic block
 */
function evaluateConditionalLogic(
  logic: ConditionalLogic,
  answers: FormValues,
  definition: FormDefinition
): boolean {
  if (logic.conditions.length === 0) {
    return true;
  }

  const results = logic.conditions.map(condition => 
    evaluateCondition(condition, answers, definition)
  );

  return logic.operator === 'AND' 
    ? results.every(result => result)
    : results.some(result => result);
}

/**
 * Evaluates a single condition
 */
function evaluateCondition(
  condition: ConditionalCondition,
  answers: FormValues,
  definition: FormDefinition
): boolean {
  const { fieldId, comparator, value: expectedValue } = condition;
  const actualValue = answers[fieldId];
  
  // Get field definition for type context
  const sourceField = findFieldById(definition, fieldId);
  
  return evaluateComparator(actualValue, expectedValue, comparator, sourceField?.type);
}

/**
 * Evaluates a comparison based on the comparator
 */
function evaluateComparator(
  actualValue: any,
  expectedValue: any,
  comparator: Comparator,
  fieldType?: string
): boolean {
  switch (comparator) {
    case 'equals':
      return actualValue === expectedValue;
      
    case 'not_equals':
      return actualValue !== expectedValue;
      
    case 'contains':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
        return actualValue.includes(expectedValue);
      }
      if (Array.isArray(actualValue)) {
        return actualValue.includes(expectedValue);
      }
      return false;
      
    case 'not_contains':
      if (typeof actualValue === 'string' && typeof expectedValue === 'string') {
        return !actualValue.includes(expectedValue);
      }
      if (Array.isArray(actualValue)) {
        return !actualValue.includes(expectedValue);
      }
      return true;
      
    case 'gt':
      return Number(actualValue) > Number(expectedValue);
      
    case 'lt':
      return Number(actualValue) < Number(expectedValue);
      
    case 'gte':
      return Number(actualValue) >= Number(expectedValue);
      
    case 'lte':
      return Number(actualValue) <= Number(expectedValue);
      
    case 'isEmpty':
      return isValueEmpty(actualValue);
      
    case 'isNotEmpty':
      return !isValueEmpty(actualValue);
      
    default:
      console.warn(`Unknown comparator: ${comparator}`);
      return false;
  }
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
 * Helper to find a field by ID in the form definition
 */
function findFieldById(definition: FormDefinition, fieldId: string): FormFieldDefinition | undefined {
  for (const section of definition.sections) {
    const field = section.fields.find(f => f.id === fieldId);
    if (field) {
      return field;
    }
  }
  return undefined;
}

/**
 * Gets all visible fields based on current form values
 */
export function getVisibleFields(
  definition: FormDefinition,
  answers: FormValues
): FormFieldDefinition[] {
  const visibleFields: FormFieldDefinition[] = [];
  
  for (const section of definition.sections) {
    for (const field of section.fields) {
      if (conditionalLogicEvaluator(answers, field, definition)) {
        visibleFields.push(field);
      }
    }
  }
  
  return visibleFields;
}

/**
 * Checks if a specific field is visible given current answers
 */
export function isFieldVisible(
  fieldId: string,
  definition: FormDefinition,
  answers: FormValues
): boolean {
  const field = findFieldById(definition, fieldId);
  if (!field) {
    return false;
  }
  
  return conditionalLogicEvaluator(answers, field, definition);
}