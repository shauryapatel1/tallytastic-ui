import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from 'react'; // Import React for ChangeEvent

export interface NumberFieldPresenterProps {
  field: FormFieldDefinition & { 
    type: Extract<FormFieldType, 'number'>; 
    min?: number; 
    max?: number;
  };
  value?: any; // Current value from form state (can be string or number)
  onValueChange?: (newValue: string) => void; // Callback to update form state, passes string value
}

// Helper to get Tailwind width class from styleOptions (can be shared if moved to a utils file)
const getWidthClass = (width: FormFieldStyleOptions['width']) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto';
    case 'full':
    default: return 'w-full';
  }
};

export function NumberFieldPresenter({ field, value, onValueChange }: NumberFieldPresenterProps) {
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
      onValueChange(event.target.value); // Pass the string value from input
    }
  };
  
  // Determine the value for the input field
  let displayValue: string;
  if (isInteractive) {
    // If value is null or undefined, use empty string, otherwise convert to string
    displayValue = value == null ? '' : String(value);
  } else {
    // For non-interactive, use defaultValue, convert to string or use empty string
    displayValue = field.defaultValue == null ? '' : String(field.defaultValue);
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
      borderColor: styleOptions.inputBorderColor,
      borderWidth: styleOptions.inputBorderColor ? '1px' : undefined,
      borderStyle: styleOptions.inputBorderColor ? 'solid' : undefined,
    },
    className: "mt-1", // Standard spacing from label/description
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
    </div>
  );
} 