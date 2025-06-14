
import type { FormFieldDefinition } from '@/types/forms';

// All types are now derived from the canonical definitions in `src/types/forms.ts`
// to ensure consistency across the application.

export type FieldType = FormFieldDefinition['type'];

// This is now an alias to the canonical FormFieldDefinition
export type FormField = FormFieldDefinition;

export interface DragDropFormBuilderProps {
  initialFields?: FormFieldDefinition[];
  onSave: (fields: FormFieldDefinition[]) => void;
}
