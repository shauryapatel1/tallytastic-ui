import type {
  FormFieldDefinition,
  ConditionalLogicRule, // Corrected type name
  ConditionalLogicBlock,
  // ConditionOperator, // Not a separate exported type
  FormFieldType,
} from '@/types/forms';

// Helper for robust date parsing
function parseConditionDate(dateInput: any): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) return dateInput;
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    // Try to handle plain "YYYY-MM-DD" as local time, not UTC.
    // Standard new Date("YYYY-MM-DD") parses as UTC midnight.
    // If it's just date, add time to make it local.
    let d;
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        d = new Date(dateInput + "T00:00:00");
    } else {
        d = new Date(dateInput);
    }
    return !isNaN(d.getTime()) ? d : null;
  }
  return null;
}

/**
 * Evaluates a single condition rule against a field's actual value.
 *
 * @param conditionRule The condition rule to evaluate.
 * @param sourceFieldActualValue The actual current value of the source field being checked.
 * @param sourceFieldType The type of the source field, for type-specific evaluations (e.g., 'is_empty').
 * @returns True if the condition is met, false otherwise.
 */
function evaluateSingleCondition(
  conditionRule: ConditionalLogicRule,
  sourceFieldActualValue: any,
  sourceFieldType?: FormFieldType,
): boolean {
  const { operator, value: conditionValue, sourceFieldId } = conditionRule; // Added sourceFieldId for context if needed

  if (operator === 'isEmpty') { // Corrected operator name from forms.ts
    if (Array.isArray(sourceFieldActualValue)) {
      return sourceFieldActualValue.length === 0;
    }
    if (typeof sourceFieldActualValue === 'object' && sourceFieldActualValue !== null) {
      return Object.keys(sourceFieldActualValue).length === 0;
    }
    return sourceFieldActualValue == null || sourceFieldActualValue === '';
  }
  if (operator === 'isNotEmpty') { // Corrected operator name
    if (Array.isArray(sourceFieldActualValue)) {
      return sourceFieldActualValue.length > 0;
    }
    if (typeof sourceFieldActualValue === 'object' && sourceFieldActualValue !== null) {
      return Object.keys(sourceFieldActualValue).length > 0;
    }
    return sourceFieldActualValue != null && sourceFieldActualValue !== '';
  }

  const valStr = String(sourceFieldActualValue ?? '');
  const condValStr = String(conditionValue ?? '');

  switch (operator) {
    case 'equals': {
      const actual = sourceFieldActualValue;
      const expected = conditionValue; // This is from the rule, typically string from UI

      if (actual == null && expected == null) return true; // null == undefined is true, treat them as equal for emptiness
      if (actual == null || expected == null) return false; // If one is null/undefined and other is not

      const actualType = sourceFieldType || (typeof actual);

      if (actualType === 'number' || typeof actual === 'number') {
        return parseFloat(String(actual)) === parseFloat(String(expected));
      }
      if (actualType === 'boolean' || typeof actual === 'boolean') {
        const actualBool = typeof actual === 'boolean' ? actual : String(actual).toLowerCase() === 'true' || String(actual) === '1';
        const expectedBool = String(expected).toLowerCase() === 'true' || String(expected) === '1';
        return actualBool === expectedBool;
      }
      // Default to string comparison for other types (text, email, url, select, radio etc.)
      return String(actual) === String(expected);
    }
    case 'notEquals': {
      const actual = sourceFieldActualValue;
      const expected = conditionValue;

      if (actual == null && expected == null) return false;
      if (actual == null || expected == null) return true;

      const actualType = sourceFieldType || (typeof actual);

      if (actualType === 'number' || typeof actual === 'number') {
        return parseFloat(String(actual)) !== parseFloat(String(expected));
      }
      if (actualType === 'boolean' || typeof actual === 'boolean') {
        const actualBool = typeof actual === 'boolean' ? actual : String(actual).toLowerCase() === 'true' || String(actual) === '1';
        const expectedBool = String(expected).toLowerCase() === 'true' || String(expected) === '1';
        return actualBool !== expectedBool;
      }
      return String(actual) !== String(expected);
    }
    case 'contains':
      return valStr.includes(condValStr);
    case 'notContains': // Corrected operator name
      return !valStr.includes(condValStr);
    case 'startsWith':
      return valStr.startsWith(condValStr);
    case 'endsWith':
      return valStr.endsWith(condValStr);
    
    // Combined handling for >, >=, <, <=
    case 'isGreaterThan': 
    case 'isGreaterThanOrEquals':
    case 'isLessThan':
    case 'isLessThanOrEquals': {
      const actualVal = sourceFieldActualValue;
      const ruleVal = conditionValue;

      if (actualVal == null || ruleVal == null) return false; // Cannot compare if one value is null/undefined

      // Date comparison if sourceFieldType suggests date/time
      if (sourceFieldType === 'date' || sourceFieldType === 'time' || actualVal instanceof Date || (typeof actualVal === 'string' && parseConditionDate(actualVal) instanceof Date) ) {
        const d1 = parseConditionDate(actualVal);
        const d2 = parseConditionDate(ruleVal);
        if (!d1 || !d2) return false; 

        switch(operator) {
          case 'isGreaterThan': return d1.getTime() > d2.getTime();
          case 'isGreaterThanOrEquals': return d1.getTime() >= d2.getTime();
          case 'isLessThan': return d1.getTime() < d2.getTime();
          case 'isLessThanOrEquals': return d1.getTime() <= d2.getTime();
        }
      }

      // Numeric comparison otherwise
      const numSource = parseFloat(String(actualVal)); 
      const numCond = parseFloat(String(ruleVal));
      if (isNaN(numSource) || isNaN(numCond)) return false; 

      switch(operator) {
        case 'isGreaterThan': return numSource > numCond;
        case 'isGreaterThanOrEquals': return numSource >= numCond;
        case 'isLessThan': return numSource < numCond;
        case 'isLessThanOrEquals': return numSource <= numCond;
      }
      return false; // Should not reach here if types were date or number
    }
    case 'isBefore':  // Date specific
    case 'isAfter':   // Date specific
    case 'isOnOrBefore': // Date specific
    case 'isOnOrAfter':  // Date specific
    {
      const d1 = parseConditionDate(sourceFieldActualValue);
      const d2 = parseConditionDate(conditionValue);
      if (!d1 || !d2) return false;

      // Normalize to date only if field type is 'date' (ignoring time)
      // For 'time' type, this normalization wouldn't make sense and full timestamp is used.
      // However, time fields usually compared with time-specific operators if needed, or within same day.
      // For now, rely on full timestamp comparison for all date/time related comparisons.
      // User can normalize in conditionValue if needed, e.g. "YYYY-MM-DDT00:00:00"

      switch(operator) {
        case 'isBefore': return d1.getTime() < d2.getTime();
        case 'isAfter': return d1.getTime() > d2.getTime();
        case 'isOnOrBefore': return d1.getTime() <= d2.getTime();
        case 'isOnOrAfter': return d1.getTime() >= d2.getTime();
      }
      return false; // Should not reach here
    }
    case 'isOneOf': {
      const actual = sourceFieldActualValue;
      // Ensure conditionValue is an array; if not, make it a single-element array or empty array.
      const allowedValues = Array.isArray(conditionValue) ? conditionValue.map(String) 
                            : (conditionValue != null ? [String(conditionValue)] : []);
      if (allowedValues.length === 0 && actual != null && String(actual) !== '') return false; // if no allowed values, nothing can be one of them unless actual is also empty/null
      if (allowedValues.length === 0 && (actual == null || String(actual) === '')) return true; // if allowed is empty and actual is empty considered true

      if (Array.isArray(actual)) { // For multi-checkbox values
        return actual.some(val => allowedValues.includes(String(val)));
      }
      return allowedValues.includes(String(actual ?? '')); // For single select, radio, text
    }
    case 'isNoneOf': {
      const actual = sourceFieldActualValue;
      const disallowedValues = Array.isArray(conditionValue) ? conditionValue.map(String)
                               : (conditionValue != null ? [String(conditionValue)] : []);
      if (disallowedValues.length === 0) return true; // If nothing is disallowed, then condition is met

      if (Array.isArray(actual)) { // For multi-checkbox values
        return actual.every(val => !disallowedValues.includes(String(val)));
      }
      return !disallowedValues.includes(String(actual ?? ''));
    }
    default:
      console.warn(`Unsupported operator: ${operator}`);
      return false;
  }
}

/**
 * Determines if a field should be visible based on its static isHidden property
 * and any defined conditional logic.
 *
 * @param fieldToCheck The field whose visibility is being determined.
 * @param allFields Array of all field definitions in the form, used to look up source field types for conditions.
 * @param formValues A record of current form input values, keyed by fieldId.
 * @returns True if the field should be visible, false otherwise.
 */
export function isFieldVisible(
  fieldToCheck: FormFieldDefinition,
  allFields: FormFieldDefinition[], // All fields in the current form definition for context
  formValues: Record<string, any>,  // Current values of all fields in the form
): boolean {
  // 1. Static isHidden check (overrides all dynamic logic)
  if (fieldToCheck.isHidden) {
    return false;
  }

  const logicBlocks = fieldToCheck.conditionalLogic;

  // 2. If no conditional logic blocks are defined, the field is visible (since not statically hidden)
  if (!logicBlocks || logicBlocks.length === 0) {
    return true;
  }

  let hasAtLeastOneShowRuleDefined = false;
  let atLeastOneShowRuleIsMet = false;
  let atLeastOneHideRuleIsMet = false;

  for (const block of logicBlocks) {
    if (!block.conditions || block.conditions.length === 0) {
      // Define behavior for empty condition blocks:
      // For 'all': an empty condition set is true.
      // For 'any': an empty condition set is false.
      // Let's assume for now if a block has no conditions, it doesn't trigger its action unless specifically desired.
      // A simpler V1: skip blocks with no conditions.
      continue;
    }

    let blockConditionsMet: boolean;
    if (block.logicType === 'all') {
      blockConditionsMet = block.conditions.every(condition => {
        const sourceField = allFields.find(f => f.id === condition.sourceFieldId);
        if (!sourceField && condition.sourceFieldId) {
            console.warn(`Conditional logic: Source field with ID "${condition.sourceFieldId}" for field "${fieldToCheck.label || fieldToCheck.id}" not found.`);
        }
        return evaluateSingleCondition(
          condition,
          formValues[condition.sourceFieldId], // Value of the field the condition depends on
          sourceField?.type
        );
      });
    } else { // 'any'
      blockConditionsMet = block.conditions.some(condition => {
        const sourceField = allFields.find(f => f.id === condition.sourceFieldId);
        if (!sourceField && condition.sourceFieldId) {
            console.warn(`Conditional logic: Source field with ID "${condition.sourceFieldId}" for field "${fieldToCheck.label || fieldToCheck.id}" not found.`);
        }
        return evaluateSingleCondition(
          condition,
          formValues[condition.sourceFieldId],
          sourceField?.type
        );
      });
    }

    if (blockConditionsMet) {
      if (block.action === 'hide') {
        atLeastOneHideRuleIsMet = true;
        // If a hide rule is met, we can break early as hide takes precedence.
        break; 
      } else if (block.action === 'show') {
        atLeastOneShowRuleIsMet = true;
      }
    }
    // Track if there's at least one 'show' rule defined, regardless of whether its conditions are met yet
    if (block.action === 'show') {
        hasAtLeastOneShowRuleDefined = true;
    }
  }

  // Apply precedence:
  // 1. If any met hide block says "hide", the field is hidden.
  if (atLeastOneHideRuleIsMet) {
    return false;
  }

  // 2. If there are "show" rules defined:
  if (hasAtLeastOneShowRuleDefined) {
    // The field is shown IFF at least one "show" rule was met (and no "hide" rules were met).
    return atLeastOneShowRuleIsMet;
  }
  
  // 3. If there are no "show" rules defined, and no "hide" rules were met, the field is visible by default.
  //    (This also covers the case where there were only 'hide' rules and none of them were met).
  return true;
} 