
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormFieldDefinition } from "@/types/forms";

interface SelectFieldProps {
  field: FormFieldDefinition;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function SelectField({ field, value, onChange, onBlur, error }: SelectFieldProps) {
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
      
      <Select
        value={value || ''}
        onValueChange={(val) => {
          onChange(val);
          onBlur?.();
        }}
      >
        <SelectTrigger id={field.id} className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option, i) => (
            <SelectItem key={i} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
