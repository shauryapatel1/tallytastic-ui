
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormFieldDefinition } from "@/types/forms";

interface CheckboxFieldProps {
  field: FormFieldDefinition;
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur?: () => void;
  error?: string;
}

export function CheckboxField({ field, value, onChange, onBlur, error }: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={field.id}
          checked={value || false}
          onCheckedChange={(checked) => {
            onChange(Boolean(checked));
            onBlur?.();
          }}
          className={error ? 'border-red-500' : ''}
        />
        <Label htmlFor={field.id} className="text-sm">
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {field.description && (
        <div className="text-xs text-gray-500 ml-6">{field.description}</div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
