import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from 'react'; // Import React for ChangeEvent

export interface NumberFieldPresenterProps {
  field: FormFieldDefinition & { 
    type: 'number';
    min?: number; 
    max?: number;
    // Error prop should not be in field type
  };
  value?: number | undefined; // Current value from form state, should be number or undefined
  onValueChange?: (newValue: number | undefined) => void; // Callback to update form state
  error?: string; // Error prop correctly defined at this level
}

// Helper to get Tailwind width class from styleOptions (can be shared if moved to a utils file)
const getWidthClass = (width?: FormFieldStyleOptions['width']) => { // Added optional chaining for safety
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto';
    case 'full':
    default: return 'w-full';
  }
};

export function NumberFieldPresenter({ field, value, onValueChange, error }: NumberFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    // defaultValue is no longer directly used for input's value if 'value' prop is present
    min,
    max,
    styleOptions = { labelIsVisible: true }, // Default style options
  } = field;

  const widthClass = getWidthClass(styleOptions.width);
  const isInteractive = !!onValueChange;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      const stringValue = event.target.value;
      if (stringValue === '') {
        onValueChange(undefined); // Treat empty string as undefined for numbers
      } else {
        const num = parseFloat(stringValue);
        onValueChange(isNaN(num) ? undefined : num); // Send undefined if parse fails, else the number
      }
    }
  };
  
  // Determine the value for the input field
  let displayValue: string;
  if (isInteractive) {
    // If value is null or undefined, use empty string, otherwise convert to string
    displayValue = typeof value === 'number' && !isNaN(value) ? String(value) : '';
  } else {
    // For non-interactive, use defaultValue, convert to string or use empty string
    displayValue = typeof field.defaultValue === 'number' && !isNaN(field.defaultValue) ? String(field.defaultValue) : '';
  }

  const inputElementProps = {
    id: id,
    placeholder: placeholder,
    value: displayValue,
    disabled: !isInteractive,
    type: "number",
    min: min,
    max: max,
    onChange: handleChange,
    style: {
      color: styleOptions.inputTextColor,
      backgroundColor: styleOptions.inputBackgroundColor,
      borderColor: error ? 'hsl(var(--destructive))' : styleOptions.inputBorderColor,
      borderWidth: styleOptions.inputBorderColor || error ? '1px' : undefined,
      borderStyle: styleOptions.inputBorderColor || error ? 'solid' : undefined,
    },
    className: cn("mt-1", error ? "border-destructive focus-visible:ring-destructive" : ""),
  };

  return (
    <div
      className={cn("flex flex-col", widthClass)}
      style={{
        backgroundColor: styleOptions.containerBackgroundColor,
        borderColor: styleOptions.containerBorderColor,
        padding: styleOptions.containerPadding,
        borderWidth: styleOptions.containerBorderColor ? '1px' : '0',
        borderStyle: styleOptions.containerBorderColor ? 'solid' : 'none',
      }}
    >
      {styleOptions.labelIsVisible !== false && (
        <Label
          htmlFor={id}
          style={{ color: styleOptions.labelTextColor }}
          className="text-sm font-medium mb-0.5"
        >
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p 
          className="text-xs text-muted-foreground mb-1"
        >
          {description}
        </p>
      )}
      <Input {...inputElementProps} />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
} 