
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField } from "@/lib/types";

interface SelectFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SelectField({ field, value, onChange, error }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={field.id} 
        className={`block text-sm font-medium ${error ? 'text-red-500' : ''}`}
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <div className="text-xs text-gray-500">{field.description}</div>
      )}
      
      <Select
        value={value || ''}
        onValueChange={onChange}
      >
        <SelectTrigger id={field.id} className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option, i) => (
            <SelectItem key={i} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
