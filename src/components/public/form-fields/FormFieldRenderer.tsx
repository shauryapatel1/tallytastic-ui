
import { FormField } from "@/lib/types";
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

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FormFieldRenderer({ field, value, onChange, error }: FormFieldRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'email':
      return <EmailField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'textarea':
      return <TextareaField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'checkbox':
      return <CheckboxField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'radio':
      return <RadioGroupField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'number':
      return <NumberField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'date':
      return <DateField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'file':
      return <FileField field={field} onChange={onChange} error={error} />;
      
    case 'phone':
      return <PhoneField field={field} value={value} onChange={onChange} error={error} />;
      
    case 'rating':
      return <RatingField field={field} value={value || 0} onChange={onChange} error={error} />;
      
    case 'section':
      return <SectionField field={field} />;
      
    default:
      return (
        <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
          Unsupported field type: {field.type}
        </div>
      );
  }
}
