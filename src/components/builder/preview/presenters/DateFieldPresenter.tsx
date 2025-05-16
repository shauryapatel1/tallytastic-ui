import type { FormFieldDefinition, FormFieldStyleOptions, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO } from 'date-fns';

export interface DateFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'date' | 'time'>;
    // minDate, maxDate, dateFormat are already optional in FormFieldDefinition
  };
  value?: string; // Value for interactive mode (e.g., "YYYY-MM-DD" or "HH:mm")
  onValueChange?: (newValue: string | undefined) => void; // Handler for value changes in interactive mode
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

export function DateFieldPresenter({ field, value: propValue, onValueChange }: DateFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    defaultValue, // Expected to be an ISO string, or could be pre-formatted
    minDate,      // ISO string
    maxDate,      // ISO string
    styleOptions = { labelIsVisible: true },
    type,
  } = field;

  const isInteractive = !!onValueChange;
  const widthClass = getWidthClass(styleOptions.width);

  const displayedValue = isInteractive 
    ? propValue ?? '' 
    : formatDateForInput(defaultValue as string, type);

  const inputElementProps = {
    id: id,
    placeholder: placeholder,
    value: displayedValue,
    disabled: !isInteractive, // Disabled if not interactive
    type: type, // 'date' or 'time'
    min: formatDateForInput(minDate, type) || undefined, // Ensure undefined if formatting fails or no date
    max: formatDateForInput(maxDate, type) || undefined, // Ensure undefined if formatting fails or no date
    onChange: isInteractive && onValueChange 
      ? (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value || undefined)
      : undefined,
    style: {
      color: styleOptions.inputTextColor,
      backgroundColor: styleOptions.inputBackgroundColor,
      borderColor: styleOptions.inputBorderColor,
      borderWidth: styleOptions.inputBorderColor ? '1px' : undefined,
      borderStyle: styleOptions.inputBorderColor ? 'solid' : undefined,
    },
    className: "mt-1",
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