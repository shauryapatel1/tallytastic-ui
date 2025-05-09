
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'textarea' 
  | 'checkbox' 
  | 'select'
  | 'number'
  | 'date'
  | 'phone'
  | 'file'
  | 'rating'
  | 'radio'
  | 'section';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  // New properties for advanced customization
  description?: string;
  defaultValue?: string | string[] | boolean | number;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  style?: {
    width?: string;
    height?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
  };
  // For conditional logic
  conditional?: {
    fieldId?: string;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value?: string | number | boolean;
  };
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    borderRadius?: number;
    logo?: string;
  };
  settings?: {
    redirectUrl?: string;
    successMessage?: string;
    allowMultipleSubmissions?: boolean;
    captchaEnabled?: boolean;
  };
}

export interface DragDropFormBuilderProps {
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => void;
}
