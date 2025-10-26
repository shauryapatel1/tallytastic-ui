
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormFieldDefinition } from "@/types/forms";

interface RatingFieldProps {
  field: FormFieldDefinition;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
}

export function RatingField({ field, value, onChange, onBlur, error }: RatingFieldProps) {
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
      
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button 
            key={star} 
            type="button" 
            variant="outline"
            size="sm"
            onClick={() => {
              onChange(star);
              onBlur?.();
            }}
            className={
              Number(value) >= star
                ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-500"
                : "bg-gray-100 hover:bg-gray-200"
            }
          >
            {star}
          </Button>
        ))}
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
