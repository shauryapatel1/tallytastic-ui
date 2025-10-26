
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldDefinition } from "@/types/forms";

interface NumberFieldProps {
  field: FormFieldDefinition;
  value: number | undefined;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
}

export function NumberField({ field, value, onChange, onBlur, error }: NumberFieldProps) {
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
        type="number"
        placeholder={field.placeholder}
        value={value !== undefined ? value : ''}
        onChange={(e) => {
          const val = e.target.value !== '' ? Number(e.target.value) : undefined;
          if (val !== undefined) {
            onChange(val);
          }
        }}
        onBlur={onBlur}
        className={`w-full ${error ? 'border-red-500' : ''}`}
        min={field.min}
        max={field.max}
      />
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
