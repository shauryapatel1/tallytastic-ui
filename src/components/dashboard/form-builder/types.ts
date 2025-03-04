
export type FieldType = 'text' | 'email' | 'textarea' | 'checkbox' | 'select';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface DragDropFormBuilderProps {
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => void;
}
