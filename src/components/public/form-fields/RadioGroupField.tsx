
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField } from "@/lib/types";

interface RadioGroupFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RadioGroupField({ field, value, onChange, error }: RadioGroupFieldProps) {
  return (
    <div className="space-y-2">
      <Label 
        className={`block text-sm font-medium ${error ? 'text-red-500' : ''}`}
      >
        {field.label}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <div className="text-xs text-gray-500">{field.description}</div>
      )}
      
      <RadioGroup
        value={value || ''}
        onValueChange={onChange}
        className={error ? 'border-red-500 border rounded-md p-2' : ''}
      >
        {field.options?.map((option, i) => (
          <div key={i} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${field.id}-${i}`} />
            <Label htmlFor={`${field.id}-${i}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
