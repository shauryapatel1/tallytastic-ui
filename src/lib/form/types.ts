import { z } from 'zod';

// Core field types
export const FormFieldTypeSchema = z.enum([
  'text',
  'textarea', 
  'email',
  'number',
  'tel',
  'select',
  'radio',
  'checkbox',
  'date',
  'rating',
  'file',
  'heading',
  'paragraph',
  'divider'
]);

export type FormFieldType = z.infer<typeof FormFieldTypeSchema>;

// Field option for choice fields
export const FieldOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string()
});

export type FieldOption = z.infer<typeof FieldOptionSchema>;

// Conditional logic comparators
export const ComparatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'gt',
  'lt',
  'gte',
  'lte',
  'isEmpty',
  'isNotEmpty'
]);

export type Comparator = z.infer<typeof ComparatorSchema>;

// Conditional logic condition
export const ConditionalConditionSchema = z.object({
  fieldId: z.string(),
  comparator: ComparatorSchema,
  value: z.any().optional()
});

export type ConditionalCondition = z.infer<typeof ConditionalConditionSchema>;

// Conditional logic block
export const ConditionalLogicSchema = z.object({
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(ConditionalConditionSchema)
});

export type ConditionalLogic = z.infer<typeof ConditionalLogicSchema>;

// Validation rule types
export const ValidationRuleTypeSchema = z.enum([
  'required',
  'minLength',
  'maxLength',
  'exactLength',
  'pattern',
  'isEmail',
  'isURL',
  'minValue',
  'maxValue',
  'numberInteger',
  'stringContains',
  'stringNotContains'
]);

export type ValidationRuleType = z.infer<typeof ValidationRuleTypeSchema>;

// Validation rule
export const ValidationRuleSchema = z.object({
  id: z.string(),
  type: ValidationRuleTypeSchema,
  params: z.record(z.any()).optional(),
  customMessage: z.string(),
  isActive: z.boolean().default(true)
});

export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

// Base field definition
export const FormFieldDefinitionSchema = z.object({
  id: z.string(),
  type: FormFieldTypeSchema,
  label: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().default(false),
  width: z.enum(['full', '1/2', '1/3', '2/3', 'auto']).default('full').optional(),
  
  // Type-specific properties
  options: z.array(FieldOptionSchema).optional(), // for select, radio, checkbox
  allowMultipleSelection: z.boolean().optional(), // for select
  allowOther: z.boolean().optional(), // for choice fields
  
  // Number specific
  min: z.number().optional(),
  max: z.number().optional(),
  
  // Text specific
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  rows: z.number().optional(), // for textarea
  
  // Date specific
  dateFormat: z.string().optional(),
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  
  // File specific
  maxFileSizeMB: z.number().optional(),
  allowedFileTypes: z.array(z.string()).optional(),
  
  // Rating specific
  maxRating: z.number().default(5).optional(),
  ratingType: z.enum(['star', 'number_scale']).default('star').optional(),
  
  // Heading specific
  level: z.number().min(1).max(6).default(2).optional(),
  
  // Paragraph specific
  content: z.string().optional(),
  
  // Advanced features
  conditionalLogic: ConditionalLogicSchema.optional(),
  advancedValidationRules: z.array(ValidationRuleSchema).optional(),
  
  // Default value
  defaultValue: z.any().optional()
});

export type FormFieldDefinition = z.infer<typeof FormFieldDefinitionSchema>;

// Form section definition
export const FormSectionDefinitionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(FormFieldDefinitionSchema)
});

export type FormSectionDefinition = z.infer<typeof FormSectionDefinitionSchema>;

// Form status
export const FormStatusSchema = z.enum(['draft', 'published', 'archived']);
export type FormStatus = z.infer<typeof FormStatusSchema>;

// Form settings
export const FormSettingsSchema = z.object({
  submitButtonText: z.string().default('Submit'),
  customSuccessMessage: z.string().optional(),
  redirectUrl: z.string().optional(),
  allowMultipleSubmissions: z.boolean().default(true),
  collectEmail: z.boolean().default(false),
  requireLogin: z.boolean().default(false)
});

export type FormSettings = z.infer<typeof FormSettingsSchema>;

// Main form definition
export const FormDefinitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(FormSectionDefinitionSchema),
  status: FormStatusSchema.default('draft'),
  settings: FormSettingsSchema.optional(),
  version: z.number().default(1),
  
  // Metadata
  userId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type FormDefinition = z.infer<typeof FormDefinitionSchema>;

// Form values for submissions
export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string[]>;

// Validation result
export interface FieldValidationResult {
  isValid: boolean;
  errorMessages: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  fieldErrors: FormErrors;
}

// Helper function to parse and validate form definitions
export function parseFormDefinition(data: unknown): FormDefinition {
  return FormDefinitionSchema.parse(data);
}

// Helper function to validate form definition
export function validateFormDefinition(data: unknown): { success: true; data: FormDefinition } | { success: false; error: z.ZodError } {
  const result = FormDefinitionSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// Helper to get all fields from a form definition (flattened)
export function getAllFields(formDefinition: FormDefinition): FormFieldDefinition[] {
  return formDefinition.sections.flatMap(section => section.fields);
}

// Helper to find a specific field by ID
export function findFieldById(formDefinition: FormDefinition, fieldId: string): FormFieldDefinition | undefined {
  return getAllFields(formDefinition).find(field => field.id === fieldId);
}