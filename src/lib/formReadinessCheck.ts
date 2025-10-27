import type { FormDefinition, FormFieldDefinition } from '@/types/forms';

export interface ReadinessIssue {
  type: 'error' | 'warning';
  message: string;
  fieldId?: string;
}

export interface ReadinessCheckResult {
  isReady: boolean;
  issues: ReadinessIssue[];
}

/**
 * Checks if a form is ready to be published
 * - All fields must have labels
 * - Conditional logic must reference valid field IDs
 * - Choice fields (radio, select, checkbox) must have options
 */
export function checkFormReadiness(formDefinition: FormDefinition): ReadinessCheckResult {
  const issues: ReadinessIssue[] = [];

  // Get all fields from all sections
  const allFields = formDefinition.sections.flatMap(section => section.fields);
  
  // Build a map of field IDs for quick lookup
  const fieldIdMap = new Set(allFields.map(f => f.id));

  // Check each field
  allFields.forEach((field: FormFieldDefinition) => {
    // Skip display-only fields for label checks
    const isDisplayField = ['divider', 'heading', 'paragraph'].includes(field.type);
    
    // Check 1: All non-display fields must have labels
    if (!isDisplayField && (!field.label || field.label.trim() === '')) {
      issues.push({
        type: 'error',
        message: `Field "${field.name || field.id}" is missing a label`,
        fieldId: field.id
      });
    }

    // Check 2: Choice fields must have options
    if (['radio', 'select', 'checkbox'].includes(field.type)) {
      if (!field.options || field.options.length === 0) {
        issues.push({
          type: 'error',
          message: `Choice field "${field.label || field.name || field.id}" has no options defined`,
          fieldId: field.id
        });
      }
    }

    // Check 3: Conditional logic must reference valid field IDs
    if (field.conditionalLogic && field.conditionalLogic.length > 0) {
      field.conditionalLogic.forEach((block, blockIndex) => {
        if (block.conditions && block.conditions.length > 0) {
          block.conditions.forEach((condition, condIndex) => {
            if (!fieldIdMap.has(condition.sourceFieldId)) {
              issues.push({
                type: 'error',
                message: `Field "${field.label || field.name || field.id}" has conditional logic referencing non-existent field ID: "${condition.sourceFieldId}"`,
                fieldId: field.id
              });
            }
          });
        }
      });
    }
  });

  // Check that form has at least one field
  if (allFields.length === 0) {
    issues.push({
      type: 'error',
      message: 'Form must have at least one field before publishing'
    });
  }

  // Only errors block publishing, warnings are informational
  const hasBlockingErrors = issues.some(issue => issue.type === 'error');

  return {
    isReady: !hasBlockingErrors,
    issues
  };
}
