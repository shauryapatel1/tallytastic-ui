import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from 'date-fns';
import React from 'react';

export interface DateFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'date' | 'time'>;
    minDate?: string;
    maxDate?: string;
  };
  value?: string | undefined; // ISO string or specific format for date/time
  onValueChange?: (newValue: string | undefined) => void;
  onBlur?: () => void; // Callback for blur event
  error?: string; // Added error prop
}

// Helper to get Tailwind width class from styleOptions
const getWidthClass = (width?: FormFieldStyleOptions['width']) => {
  switch (width) {
    case '1/2': return 'w-1/2';
    case '1/3': return 'w-1/3';
    case '2/3': return 'w-2/3';
    case 'auto': return 'w-auto';
    case 'full':
    default: return 'w-full';
  }
};

const formatDateForInput = (isoString: string | undefined, type: 'date' | 'time'): string => {
  if (!isoString) return '';
  try {
    const dateObj = parseISO(isoString);
    if (type === 'date') return format(dateObj, 'yyyy-MM-dd');
    if (type === 'time') return format(dateObj, 'HH:mm'); // Standard HH:mm for time input
  } catch (e) {
    // console.error("Error parsing date/time for input:", isoString, e); // Optional: for debugging
    // Fallback for invalid date/time string or if it doesn't match expected ISO format
    // For defaultValue, if it's already pre-formatted, this parsing might not be needed or might fail.
    // Assuming defaultValue for date/time is expected to be an ISO string from backend/state.
    if ((type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(isoString)) || 
        (type === 'time' && /^\d{2}:\d{2}(:\d{2})?$/.test(isoString))) {
      return isoString; // Already in correct format
    }
    return ''; 
  }
  return ''; // Should not be reached if logic above is complete
};

export function DateFieldPresenter({ field, value, onValueChange, onBlur, error }: DateFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    type,
    minDate,
    maxDate,
    styleOptions = { labelIsVisible: true },
  } = field;

  const widthClass = getWidthClass(styleOptions.width);
  const isInteractive = !!onValueChange;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.value || undefined); // Send undefined if empty
    }
  };
  
  // For date/time fields, HTML input expects 'yyyy-mm-dd' or 'HH:MM' respectively.
  // The 'value' prop might be an ISO string or another format. We need to ensure it matches input requirements.
  // For simplicity in V1, we assume the value passed is already in the correct format or will be handled by the browser.
  // For date type, value should be in "YYYY-MM-DD" format for the input element.
  // For time type, value should be in "HH:MM" or "HH:MM:SS" format.
  let displayValue = '';
  const formValue = isInteractive ? value : field.defaultValue;

  if (formValue) {
    if (type === 'date') {
      // Assuming formValue (if string) is ISO-like (e.g., "2023-10-26T10:00:00.000Z") or "YYYY-MM-DD"
      // We need to extract YYYY-MM-DD part.
      try {
        displayValue = new Date(formValue).toISOString().split('T')[0];
      } catch (e) { /* ignore parse error, displayValue remains empty */ }
    } else if (type === 'time') {
      // Assuming formValue (if string) is ISO-like or just time string "HH:MM" or "HH:MM:SS"
      // We need to extract HH:MM part.
      try {
        const dateObj = new Date(formValue);
        // Check if it's a valid date object before trying to get hours/minutes
        if (!isNaN(dateObj.getTime())) {
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          displayValue = `${hours}:${minutes}`;
        } else if (typeof formValue === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(formValue)) {
          // If it's already in HH:MM or HH:MM:SS format
          displayValue = formValue.substring(0,5); // take HH:MM
        }
      } catch (e) { /* ignore parse error */ }
    }
  }

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
        <Label htmlFor={id} style={{ color: styleOptions.labelTextColor }} className="text-sm font-medium mb-0.5">
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mb-1">
          {description}
        </p>
      )}
      <Input
        type={type} // 'date' or 'time'
        id={id}
        placeholder={placeholder} // Usually not very relevant for date/time pickers but can be set
        value={displayValue}
        disabled={!isInteractive}
        onChange={handleChange}
        onBlur={onBlur}
        min={type === 'date' ? minDate : undefined} // HTML min/max for date input
        max={type === 'date' ? maxDate : undefined} // HTML min/max for date input
        style={{
          color: styleOptions.inputTextColor,
          backgroundColor: styleOptions.inputBackgroundColor,
          borderColor: error ? 'hsl(var(--destructive))' : styleOptions.inputBorderColor,
          borderWidth: styleOptions.inputBorderColor || error ? '1px' : undefined,
          borderStyle: styleOptions.inputBorderColor || error ? 'solid' : undefined,
        }}
        className={cn("mt-1", error ? "border-destructive focus-visible:ring-destructive" : "")}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
} 