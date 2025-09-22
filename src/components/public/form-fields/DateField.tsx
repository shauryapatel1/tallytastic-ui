
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/lib/types";

interface DateFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateField({ field, value, onChange, error }: DateFieldProps) {
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
      
      <Input 
        id={field.id} 
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${error ? 'border-red-500' : ''}`}
      />
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
