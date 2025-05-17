export type FormStatus = 'draft' | 'published' | 'archived';

export interface FormSummary {
  id: string;
  title: string;
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
  status: FormStatus;
  responseCount: number;
}

export interface FormFilterCriteria {
  status: FormStatus | 'all' | null;
}

// Re-defining FieldOption as per user's earlier context or common usage
export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

// Ensure FormFieldType is as we last aligned it
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'rating'
  | 'file'
  | 'divider'
  | 'heading'
  | 'paragraph';

export interface BaseFieldProps {
  label: string;
  description?: string; // Helper text / sub-label
  placeholder?: string;
  isRequired: boolean;   // Now non-optional
  isHidden?: boolean;     // Added formally
  defaultValue?: any;     // Consider refining 'any' later based on field type
  // TODO: Add common styling properties if needed later
  // columns?: 1 | 2 | 3 | 4; // Retained from previous, can be reviewed
}

// Illustrative specific prop interfaces - these will mostly be optional props on FormFieldDefinition
export interface TextFieldProps { // Example, not directly extended by FormFieldDefinition
  minLength?: number;
  maxLength?: number;
}

export interface OptionsSpecificProps { // For select, radio, checkbox_group (if we add it)
  options?: FieldOption[];
  allowOther?: boolean; // For "Other" option in choices
}

export interface HeadingFieldProps { // Not directly extended
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    // text content will come from BaseFieldProps.label
}

export interface ParagraphFieldProps { // Not directly extended
    content?: string; // Rich text or markdown
}
// ... other specific prop interfaces as needed when building specific editors ...

// Conditional Logic Rule (assuming structure from previous plan, ensure it's defined)
export interface ConditionalLogicRule {
  id: string; // Unique ID for this specific condition row
  sourceFieldId: string; // ID of the field whose value triggers the condition
  operator:
    | 'isEmpty'
    | 'isNotEmpty'
    | 'equals'
    | 'notEquals'
    | 'contains' // For text, or array of selections
    | 'notContains' // For text, or array of selections
    | 'startsWith' // For text
    | 'endsWith' // For text
    | 'isGreaterThan' // For number, date
    | 'isLessThan' // For number, date
    | 'isGreaterThanOrEquals' // For number, date
    | 'isLessThanOrEquals' // For number, date
    | 'isOneOf' // For multi-select source field, value is an array of strings
    | 'isNoneOf' // For multi-select source field, value is an array of strings
    // Added new operators for date/time fields, mirroring ConditionalLogicEditor.tsx
    | 'isBefore'
    | 'isAfter'
    | 'isOnOrBefore'
    | 'isOnOrAfter';
  value?: any; // Value to compare against (type depends on sourceField type & operator)
}

export interface ConditionalLogicBlock {
  id: string; // Unique ID for this entire logic block
  action: 'show' | 'hide'; // Action to take on THE CURRENT field if conditions are met
  logicType: 'all' | 'any'; // IF ALL conditions are met OR IF ANY condition is met
  conditions: ConditionalLogicRule[];
}

// Style Options for Form Fields (NEW)
export interface FormFieldStyleOptions {
  // Label Styling
  labelIsVisible?: boolean;          // default true
  labelTextColor?: string;           // hex

  // Field Container Styling
  width?: 'full' | '1/2' | '1/3' | '2/3' | 'auto';
  containerBackgroundColor?: string; // hex
  containerBorderColor?: string;     // hex
  containerPadding?: string;         // e.g., "4px" or "1rem"

  // Input Element Styling
  inputTextColor?: string;           // hex
  inputBackgroundColor?: string;     // hex
  inputBorderColor?: string;         // hex for the input itself
}

export interface FormFieldDefinition extends BaseFieldProps {
  id: string;                 // Unique ID for the field
  type: FormFieldType;
  name: string;               // Added: Internal name/key for submission data (NON-OPTIONAL)

  // Optional type-specific properties (examples, expand as needed)
  // Text/Textarea specific
  minLength?: number;
  maxLength?: number;
  rows?: number; // For textarea (specific to textarea type)

  // Number specific
  min?: number; // Consider renaming from minValue for consistency
  max?: number; // Consider renaming from maxValue for consistency

  // Date specific (e.g., format, range limits - placeholder for now)
  dateFormat?: string; // e.g., "MM/dd/yyyy", "dd-MM-yyyy"
  minDate?: string; // Added: ISO string e.g., "2025-01-01T00:00:00.000Z"
  maxDate?: string; // Added: ISO string e.g., "2025-12-31T00:00:00.000Z"

  // File specific
  maxFileSizeMB?: number;
  allowedFileTypes?: string[]; // e.g., ['image/jpeg', 'application/pdf']

  // Rating specific
  maxRating?: number; // e.g., 5 for 5 stars, 10 for a 1-10 scale
  ratingType?: 'star' | 'number_scale'; // Visual representation

  // Choice/Select specific (options defined in OptionsSpecificProps, used here)
  options?: FieldOption[];
  allowMultipleSelection?: boolean; // For multi-select dropdown if 'select' type supports it, or for checkbox group
  allowOther?: boolean;             // Added: For "Other" option in choices

  // Heading specific (level defined in HeadingFieldProps, used here)
  level?: 1 | 2 | 3 | 4 | 5 | 6; // For 'heading' type (text comes from 'label')

  // Paragraph specific (content defined in ParagraphFieldProps, used here)
  content?: string; // For 'paragraph' type (HTML/markdown for rich text)

  // Conditional Logic
  conditionalLogic?: ConditionalLogicBlock[];

  advancedValidationRules?: ValidationRule[];
  styleOptions?: FormFieldStyleOptions; // CORRECTED PLACEMENT

  // Advanced Validation Rules (beyond isRequired)
  // validationRules?: { type: 'regex', pattern: string, message: string }[]; // Example
}

// Validation Rules (NEW)
export type ValidationRuleType =
  | 'required' // Added to allow custom message for required rule via advanced validation
  | 'minLength'
  | 'maxLength'
  | 'exactLength' // Added
  | 'pattern'   // Regex
  | 'isEmail' // Already exists, but good to confirm
  | 'isURL'   // Already exists, but good to confirm
  | 'minValue'  // For number/date/rating
  | 'maxValue'  // For number/date/rating
  | 'numberInteger' // Added
  | 'stringContains' // Added
  | 'stringNotContains' // Added
  // Add more specific types as needed, e.g.:
  // | 'dateIsBefore'
  // | 'dateIsAfter'
  // | 'selectionMinCount'
  // | 'selectionMaxCount'
  ;

export interface ValidationRuleParams {
  length?: number;       // For minLength, maxLength, exactLength
  value?: number | string; // For minValue, maxValue (string if comparing dates for minValue/maxValue)
  pattern?: string;        // For pattern (renamed from regex for clarity with type)
  substring?: string;    // For stringContains, stringNotContains
  // Add other specific params as needed
}

export interface ValidationRule {
  id: string; // Unique ID for this specific rule instance (e.g., UUID)
  type: ValidationRuleType;
  params?: ValidationRuleParams;
  customMessage: string; // User-defined error message for this rule
  isActive?: boolean; // Added: Defaults to true if not present
}

// Definition for a section within a form
export interface FormSectionDefinition {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldDefinition[];
  // conditionalLogicId?: string; // If sections can also be conditional
  // layoutColumns?: 1 | 2 | 3 | 4; // Default layout for fields in this section
}

// The complete definition of a form structure for the builder
export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  sections: FormSectionDefinition[];

  // New properties for consistency with reducer
  customSuccessMessage?: string;
  redirectUrl?: string;
  version: number;

  // Meta-data
  userId?: string;
  createdAt: string; // Was optional, now required
  updatedAt: string; // Was lastModified?: string, now required and renamed
  status?: FormStatus;
  // themeId?: string;
  // customCSS?: string;
  // allowMultipleSubmissions?: boolean;
  // submissionDeadline?: string;
  // redirectOnCompletion?: string;
  // emailNotifications?: string[];
}

// Types for managing form state during data entry and validation
export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string[] | undefined>;

// The existing 'Form' interface might need to be reconciled or deprecated
// if FormDefinition becomes the canonical structure for a loaded form.
export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldDefinition[]; // Now uses the detailed FormFieldDefinition
  status: FormStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // ... other Form properties
}

// Represents a single submitted response for a form
export interface FormResponse {
  id: string; // Unique ID of the response submission
  formId: string; // ID of the form this response belongs to
  submittedAt: string; // ISO date string of when the response was submitted
  data: FormValues; // The actual key-value pairs (fieldId: value) of the submission
  // Optional respondent details for future enhancements:
  // respondentUserId?: string; // If submitted by a logged-in user
  // respondentIpAddress?: string;
  // respondentUserAgent?: string;
} 