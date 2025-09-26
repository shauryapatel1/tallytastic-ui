import { describe, it, expect } from 'vitest';
import { validateField, validateForm } from '../validate';
import type { FormFieldDefinition, FormDefinition } from '../types';

describe('validateField', () => {
  it('should validate required fields', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      isRequired: true
    };

    // Empty value should fail
    let result = validateField(field, '');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Test Field is required');

    // Non-empty value should pass
    result = validateField(field, 'Some value');
    expect(result.isValid).toBe(true);
    expect(result.errorMessages).toHaveLength(0);
  });

  it('should validate text length', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      isRequired: false,
      minLength: 5,
      maxLength: 10
    };

    // Too short
    let result = validateField(field, 'abc');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be at least 5 characters');

    // Too long
    result = validateField(field, 'this is way too long');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be no more than 10 characters');

    // Just right
    result = validateField(field, 'perfect');
    expect(result.isValid).toBe(true);
  });

  it('should validate numbers', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'number',
      label: 'Test Field',
      isRequired: false,
      min: 1,
      max: 100
    };

    // Too small
    let result = validateField(field, '0');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be at least 1');

    // Too large
    result = validateField(field, '101');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be no more than 100');

    // Not a number
    result = validateField(field, 'abc');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be a valid number');

    // Valid number
    result = validateField(field, '50');
    expect(result.isValid).toBe(true);
  });

  it('should validate email fields', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'email',
      label: 'Email Field',
      isRequired: false
    };

    // Invalid email
    let result = validateField(field, 'invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be a valid email address');

    // Valid email
    result = validateField(field, 'test@example.com');
    expect(result.isValid).toBe(true);
  });

  it('should validate advanced validation rules', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      isRequired: false,
      advancedValidationRules: [
        {
          id: 'rule-1',
          type: 'pattern',
          params: { pattern: '^[A-Z]+$' },
          customMessage: 'Must be uppercase letters only',
          isActive: true
        }
      ]
    };

    // Invalid pattern
    let result = validateField(field, 'abc');
    expect(result.isValid).toBe(false);
    expect(result.errorMessages).toContain('Must be uppercase letters only');

    // Valid pattern
    result = validateField(field, 'ABC');
    expect(result.isValid).toBe(true);
  });

  it('should skip validation for inactive rules', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      isRequired: false,
      advancedValidationRules: [
        {
          id: 'rule-1',
          type: 'minLength',
          params: { length: 10 },
          customMessage: 'Too short',
          isActive: false
        }
      ]
    };

    const result = validateField(field, 'abc');
    expect(result.isValid).toBe(true);
  });

  it('should skip validation for empty optional fields', () => {
    const field: FormFieldDefinition = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      isRequired: false,
      minLength: 5
    };

    const result = validateField(field, '');
    expect(result.isValid).toBe(true);
  });
});

describe('validateForm', () => {
  const mockFormDefinition: FormDefinition = {
    id: 'test-form',
    title: 'Test Form',
    sections: [
      {
        id: 'section-1',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Name',
            isRequired: true
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            isRequired: true
          },
          {
            id: 'age',
            type: 'number',
            label: 'Age',
            isRequired: false,
            min: 18
          },
          {
            id: 'heading',
            type: 'heading',
            label: 'Section Header',
            isRequired: false
          }
        ]
      }
    ],
    status: 'draft',
    version: 1,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  it('should validate entire form and return errors', () => {
    const values = {
      name: '',
      email: 'invalid-email',
      age: '15'
    };

    const result = validateForm(mockFormDefinition, values);

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.name).toContain('Name is required');
    expect(result.fieldErrors.email).toContain('Must be a valid email address');
    expect(result.fieldErrors.age).toContain('Must be at least 18');
  });

  it('should pass validation for valid form', () => {
    const values = {
      name: 'John Doe',
      email: 'john@example.com',
      age: '25'
    };

    const result = validateForm(mockFormDefinition, values);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.fieldErrors)).toHaveLength(0);
  });

  it('should skip validation for non-input fields', () => {
    const values = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const result = validateForm(mockFormDefinition, values);

    expect(result.isValid).toBe(true);
    expect(result.fieldErrors.heading).toBeUndefined();
  });

  it('should handle conditional logic in form validation', () => {
    const formWithConditionalField: FormDefinition = {
      ...mockFormDefinition,
      sections: [
        {
          id: 'section-1',
          fields: [
            {
              id: 'show-optional',
              type: 'checkbox',
              label: 'Show Optional Field',
              isRequired: false
            },
            {
              id: 'optional-field',
              type: 'text',
              label: 'Optional Field',
              isRequired: true,
              conditionalLogic: {
                operator: 'AND',
                conditions: [
                  {
                    fieldId: 'show-optional',
                    comparator: 'equals',
                    value: true
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    // Field should be hidden and not validated
    let values = {
      'show-optional': false,
      'optional-field': ''
    };

    let result = validateForm(formWithConditionalField, values);
    expect(result.isValid).toBe(true);

    // Field should be visible and validated
    values = {
      'show-optional': true,
      'optional-field': ''
    };

    result = validateForm(formWithConditionalField, values);
    expect(result.isValid).toBe(false);
    expect(result.fieldErrors['optional-field']).toContain('Optional Field is required');
  });
});