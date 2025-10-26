import { FormFieldDefinition } from "@/types/forms";
import { TextField } from "./TextField";
import { EmailField } from "./EmailField";
import { TextareaField } from "./TextareaField";
import { CheckboxField } from "./CheckboxField";
import { SelectField } from "./SelectField";
import { RadioGroupField } from "./RadioGroupField";
import { NumberField } from "./NumberField";
import { DateField } from "./DateField";
import { FileField } from "./FileField";
import { PhoneField } from "./PhoneField";
import { RatingField } from "./RatingField";
import { SectionField } from "./SectionField";
import { UrlField } from "./UrlField";
import { TimeField } from "./TimeField";

interface FormFieldRendererProps {
  field: FormFieldDefinition;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
}

export function FormFieldRenderer({ field, value, onChange, onBlur, error }: FormFieldRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'email':
      return <EmailField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'textarea':
      return <TextareaField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'checkbox':
      return <CheckboxField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'radio':
      return <RadioGroupField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'number':
      return <NumberField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'date':
      return <DateField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'file':
      return <FileField field={field} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'tel':
      return <PhoneField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'rating':
      return <RatingField field={field} value={value || 0} onChange={onChange} onBlur={onBlur} error={error} />;
    
    case 'url':
      return <UrlField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
    
    case 'time':
      return <TimeField field={field} value={value} onChange={onChange} onBlur={onBlur} error={error} />;
      
    case 'divider':
    case 'heading':
    case 'paragraph':
      return <SectionField field={field} />;
      
    default:
      return (
        <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
          Unsupported field type: {field.type}
        </div>
      );
  }
}
