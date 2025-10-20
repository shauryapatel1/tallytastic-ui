import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For textarea type
import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import React from 'react'; // Import React for ChangeEvent

interface TextFieldPresenterProps {
  // Allow more specific field type if needed, but FormFieldDefinition is base
  field: FormFieldDefinition & { type: Extract<FormFieldType, 'text' | 'textarea' | 'email' | 'tel' | 'url'> }; 
  value?: any; // Current value from form state
  onValueChange?: (newValue: string) => void; // Callback to update form state
  onBlur?: () => void; // Callback for blur event
  error?: string; // Added error prop
}

// Helper to get Tailwind width class from styleOptions
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

export function TextFieldPresenter({ field, value, onValueChange, onBlur, error }: TextFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    // defaultValue is no longer directly used for input's value if 'value' prop is present
    type,
    rows, // For textarea
    styleOptions = { labelIsVisible: true }, // Default style options
  } = field;

  const widthClass = getWidthClass(styleOptions.width);
  const isInteractive = !!onValueChange;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  const commonInputProps = {
    id: id, // Use field.id for the input id as well
    placeholder: placeholder,
    value: isInteractive ? (value as string ?? '') : (field.defaultValue as string ?? ''),
    disabled: !isInteractive, 
    onChange: handleChange, // Add common onChange handler
    onBlur: onBlur, // Add blur handler
    style: {
      color: styleOptions.inputTextColor,
      backgroundColor: styleOptions.inputBackgroundColor,
      borderColor: error ? 'hsl(var(--destructive))' : styleOptions.inputBorderColor, // Use destructive border color on error
      // Ensure border is visible if color is set
      borderWidth: styleOptions.inputBorderColor || error ? '1px' : undefined,
      borderStyle: styleOptions.inputBorderColor || error ? 'solid' : undefined,
    },
    className: cn("mt-1", error ? "border-destructive focus-visible:ring-destructive" : ""),
  };

  return (
    <div
      className={cn("flex flex-col", widthClass)} // Use flex-col for better structure within the width
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
          className="text-sm font-medium mb-0.5" // Adjusted label styling slightly
        >
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p 
          className="text-xs text-muted-foreground mb-1"
          // Potentially allow styling for description text color via styleOptions in future if needed
          // style={{ color: styleOptions.descriptionTextColor || styleOptions.labelTextColor }}
        >
          {description}
        </p>
      )}
      {type === 'textarea' ? (
        <Textarea
          {...commonInputProps}
          rows={rows || 3} // Default to 3 rows for textarea if not specified
        />
      ) : (
        <Input
          {...commonInputProps}
          type={type === 'text' ? 'text' : type} // Handles email, tel, url directly
        />
      )}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
} 