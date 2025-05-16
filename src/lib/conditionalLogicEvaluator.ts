import type {
  FormFieldDefinition,
  ConditionalLogicRule, // Corrected type name
  ConditionalLogicBlock,
  // ConditionOperator, // Not a separate exported type
  FormFieldType,
} from '@/types/forms';

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
    case 'equals':
      return String(sourceFieldActualValue) == condValStr; 
    case 'notEquals': // Corrected operator name
      return String(sourceFieldActualValue) != condValStr;
    case 'contains':
      return valStr.includes(condValStr);
    case 'notContains': // Corrected operator name
      return !valStr.includes(condValStr);
    case 'startsWith':
      return valStr.startsWith(condValStr);
    case 'endsWith':
      return valStr.endsWith(condValStr);
    case 'isGreaterThan': { // Corrected operator name
      const numSource = parseFloat(sourceFieldActualValue);
      const numCond = parseFloat(conditionValue);
      return !isNaN(numSource) && !isNaN(numCond) && numSource > numCond;
    }
    case 'isLessThan': { // Corrected operator name
      const numSource = parseFloat(sourceFieldActualValue);
      const numCond = parseFloat(conditionValue);
      return !isNaN(numSource) && !isNaN(numCond) && numSource < numCond;
    }
    // TODO: Add cases for other operators from ConditionalLogicRule.operator union type
    // e.g., isGreaterThanOrEquals, isLessThanOrEquals, isOneOf, isNoneOf, isBefore, isAfter, etc.
    default:
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
  allFields: FormFieldDefinition[],
  formValues: Record<string, any>,
): boolean {
  if (fieldToCheck.isHidden) {
    return false;
  }

  const logicBlocks = fieldToCheck.conditionalLogic; // Corrected: conditionalLogic is the array of blocks

  if (!logicBlocks || logicBlocks.length === 0) {
    return true;
  }

  let hasMetShowBlock = false; // Initialize show flag

  for (const block of logicBlocks) { // Iterate over logicBlocks directly
    if (!block.conditions || block.conditions.length === 0) {
      // Handle blocks with no conditions as per previous logic (currently skipped)
      // Example: if block.logicType === 'all' -> true, if 'any' -> false for conditionMet
      // Then apply action. For now, continue means it doesn't affect visibility.
      continue;
    }

    let blockConditionsMet: boolean;
    if (block.logicType === 'all') {
      blockConditionsMet = block.conditions.every(condition => {
        const sourceField = allFields.find(f => f.id === condition.sourceFieldId); // targetFieldId is now sourceFieldId
        return evaluateSingleCondition(
          condition,
          formValues[condition.sourceFieldId],
          sourceField?.type,
        );
      });
    } else { // 'any'
      blockConditionsMet = block.conditions.some(condition => {
        const sourceField = allFields.find(f => f.id === condition.sourceFieldId);
        return evaluateSingleCondition(
          condition,
          formValues[condition.sourceFieldId],
          sourceField?.type,
        );
      });
    }

    if (blockConditionsMet) {
      if (block.action === 'hide') {
        return false; // Hide action takes immediate precedence
      }
      if (block.action === 'show') {
        hasMetShowBlock = true;
      }
    }
  }

  // If no hide condition was met and triggered an early return:
  // visibility is true if a show condition was met, otherwise it defaults to true (not hidden).
  return hasMetShowBlock || logicBlocks.every(block => !block.conditions || block.conditions.length === 0 || !block.action); 
  // The last part of the OR is to ensure that if there are blocks, but none are met to SHOW, 
  // and none were met to HIDE, it should still be true (visible by default).
  // Simpler: if we reached here, no hide was triggered. So if a show was triggered, it's true. Otherwise, true.
  // return hasMetShowBlock ? true : true; // which is just 'return true' if only show blocks exist or no blocks met
  // Correct logic based on precedence: if a hide was met, we already returned false.
  // So if we are here, no hide was met. If a show was met, return true. Else (no show met, no hide met), return true.
  if (hasMetShowBlock) {
    return true;
  }
  // If no hide block made us return false, and no show block made us return true, then it's visible by default.
  return true; 
} 