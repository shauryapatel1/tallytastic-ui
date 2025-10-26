
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormFieldDefinition } from "@/types/forms";

interface TextareaFieldProps {
  field: FormFieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function TextareaField({ field, value, onChange, onBlur, error }: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={field.id} 
        className={`block text-sm font-medium ${error ? 'text-red-500' : ''}`}
      >
        {field.label}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <div className="text-xs text-gray-500">{field.description}</div>
      )}
      
      <Textarea 
        id={field.id} 
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full min-h-[100px] ${error ? 'border-red-500' : ''}`}
      />
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
