import { describe, it, expect } from 'vitest';
import { conditionalLogicEvaluator, getVisibleFields, isFieldVisible } from '../logic';
import type { FormDefinition, FormFieldDefinition, FormValues } from '../types';

describe('conditionalLogicEvaluator', () => {
  const mockFormDefinition: FormDefinition = {
    id: 'test-form',
    title: 'Test Form',
    sections: [
      {
        id: 'section-1',
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Name',
            isRequired: false
          },
          {
            id: 'field-2',
            type: 'select',
            label: 'Type',
            isRequired: false,
            options: [
              { id: '1', label: 'Option A', value: 'a' },
              { id: '2', label: 'Option B', value: 'b' }
            ]
          },
          {
            id: 'field-3',
            type: 'text',
            label: 'Details',
            isRequired: false,
            conditionalLogic: {
              operator: 'AND',
              conditions: [
                {
                  fieldId: 'field-2',
                  comparator: 'equals',
                  value: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    status: 'draft',
    version: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  it('should return true when no conditional logic is defined', () => {
    const field = mockFormDefinition.sections[0].fields[0];
    const answers = {};
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should evaluate equals condition correctly', () => {
    const field = mockFormDefinition.sections[0].fields[2]; // field-3 with conditional logic
    const answers = { 'field-2': 'a' };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should evaluate not_equals condition correctly', () => {
    const field: FormFieldDefinition = {
      id: 'field-4',
      type: 'text',
      label: 'Test',
      isRequired: false,
      conditionalLogic: {
        operator: 'AND',
        conditions: [
          {
            fieldId: 'field-2',
            comparator: 'not_equals',
            value: 'b'
          }
        ]
      }
    };
    const answers = { 'field-2': 'a' };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should handle isEmpty condition', () => {
    const field: FormFieldDefinition = {
      id: 'field-5',
      type: 'text',
      label: 'Test',
      isRequired: false,
      conditionalLogic: {
        operator: 'AND',
        conditions: [
          {
            fieldId: 'field-1',
            comparator: 'isEmpty'
          }
        ]
      }
    };
    const answers = { 'field-1': '' };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should handle isNotEmpty condition', () => {
    const field: FormFieldDefinition = {
      id: 'field-6',
      type: 'text',
      label: 'Test',
      isRequired: false,
      conditionalLogic: {
        operator: 'AND',
        conditions: [
          {
            fieldId: 'field-1',
            comparator: 'isNotEmpty'
          }
        ]
      }
    };
    const answers = { 'field-1': 'John' };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should handle OR operator correctly', () => {
    const field: FormFieldDefinition = {
      id: 'field-7',
      type: 'text',
      label: 'Test',
      isRequired: false,
      conditionalLogic: {
        operator: 'OR',
        conditions: [
          {
            fieldId: 'field-1',
            comparator: 'equals',
            value: 'John'
          },
          {
            fieldId: 'field-2',
            comparator: 'equals',
            value: 'a'
          }
        ]
      }
    };
    const answers = { 'field-1': 'Jane', 'field-2': 'a' };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });

  it('should handle number comparisons', () => {
    const field: FormFieldDefinition = {
      id: 'field-8',
      type: 'text',
      label: 'Test',
      isRequired: false,
      conditionalLogic: {
        operator: 'AND',
        conditions: [
          {
            fieldId: 'age-field',
            comparator: 'gt',
            value: 18
          }
        ]
      }
    };
    const answers = { 'age-field': 25 };
    
    const result = conditionalLogicEvaluator(answers, field, mockFormDefinition);
    
    expect(result).toBe(true);
  });
});

describe('getVisibleFields', () => {
  const mockFormDefinition: FormDefinition = {
    id: 'test-form',
    title: 'Test Form',
    sections: [
      {
        id: 'section-1',
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Always Visible',
            isRequired: false
          },
          {
            id: 'field-2',
            type: 'text',
            label: 'Conditionally Visible',
            isRequired: false,
            conditionalLogic: {
              operator: 'AND',
              conditions: [
                {
                  fieldId: 'field-1',
                  comparator: 'isNotEmpty'
                }
              ]
            }
          }
        ]
      }
    ],
    status: 'draft',
    version: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  it('should return all visible fields', () => {
    const answers = { 'field-1': 'Some value' };
    
    const visibleFields = getVisibleFields(mockFormDefinition, answers);
    
    expect(visibleFields).toHaveLength(2);
    expect(visibleFields[0].id).toBe('field-1');
    expect(visibleFields[1].id).toBe('field-2');
  });

  it('should hide fields based on conditional logic', () => {
    const answers = { 'field-1': '' };
    
    const visibleFields = getVisibleFields(mockFormDefinition, answers);
    
    expect(visibleFields).toHaveLength(1);
    expect(visibleFields[0].id).toBe('field-1');
  });
});

describe('isFieldVisible', () => {
  const mockFormDefinition: FormDefinition = {
    id: 'test-form',
    title: 'Test Form',
    sections: [
      {
        id: 'section-1',
        fields: [
          {
            id: 'field-1',
            type: 'text',
            label: 'Control Field',
            isRequired: false
          },
          {
            id: 'field-2',
            type: 'text',
            label: 'Dependent Field',
            isRequired: false,
            conditionalLogic: {
              operator: 'AND',
              conditions: [
                {
                  fieldId: 'field-1',
                  comparator: 'equals',
                  value: 'show'
                }
              ]
            }
          }
        ]
      }
    ],
    status: 'draft',
    version: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  it('should return true for visible field', () => {
    const answers = { 'field-1': 'show' };
    
    const isVisible = isFieldVisible('field-2', mockFormDefinition, answers);
    
    expect(isVisible).toBe(true);
  });

  it('should return false for hidden field', () => {
    const answers = { 'field-1': 'hide' };
    
    const isVisible = isFieldVisible('field-2', mockFormDefinition, answers);
    
    expect(isVisible).toBe(false);
  });

  it('should return false for non-existent field', () => {
    const answers = {};
    
    const isVisible = isFieldVisible('non-existent', mockFormDefinition, answers);
    
    expect(isVisible).toBe(false);
  });
});