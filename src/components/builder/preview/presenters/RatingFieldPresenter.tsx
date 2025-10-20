import React from 'react';
import { Label } from "@/components/ui/label";
import { Star, Circle } from "lucide-react"; // Using Circle for number scale
import type { FormFieldDefinition, FormFieldType, FormFieldStyleOptions } from "@/types/forms";
import { cn } from "@/lib/utils";

// Helper to determine width class (can be shared or defined locally)
const getWidthClass = (width?: FormFieldStyleOptions['width']): string => {
  const widthMap: Record<string, string> = {
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    'auto': 'w-auto',
  };
  return widthMap[width] || 'w-full';
};

export interface RatingFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'rating'>;
    maxRating?: number;
    ratingType?: 'star' | 'number_scale';
  };
  value?: number | undefined;
  onValueChange?: (newValue: number | undefined) => void;
  onBlur?: () => void; // Callback for blur event
  error?: string;
}

export function RatingFieldPresenter({ field, value, onValueChange, onBlur, error }: RatingFieldPresenterProps) {
  const {
    id,
    label,
    description,
    isRequired,
    maxRating = 5,
    ratingType = 'star',
    styleOptions = { labelIsVisible: true },
  } = field;

  const widthClass = getWidthClass(styleOptions.width);
  const isInteractive = !!onValueChange;

  const currentRating = isInteractive ? value : (field.defaultValue as number | undefined);

  const handleRatingClick = (rating: number) => {
    if (isInteractive && onValueChange) {
      // If clicking the same rating, deselect it (treat as undefined)
      onValueChange(currentRating === rating ? undefined : rating);
    }
  };

  const ratingElements = Array.from({ length: maxRating }, (_, i) => {
    const ratingValue = i + 1;
    const isFilled = currentRating !== undefined && ratingValue <= currentRating;
    const isHovered = false; // Hover state could be added for more interactivity if needed

    const iconProps = {
      key: ratingValue,
      size: 28, // Consistent size
      className: cn(
        isInteractive ? "cursor-pointer" : "cursor-default",
        isFilled ? (error ? "text-destructive" : "text-yellow-400 dark:text-yellow-500") : "text-muted-foreground/70",
        error && !isFilled ? "text-destructive/50" : "", // Lighter error color for unfilled icons if error exists
        isHovered && isInteractive ? (error ? "text-destructive/80" : "text-yellow-300 dark:text-yellow-400") : ""
      ),
      onClick: () => handleRatingClick(ratingValue),
      fill: isFilled ? (error ? "hsl(var(--destructive))" : "currentColor") : "none",
    };

    if (ratingType === 'number_scale') {
      return (
        <div
          key={ratingValue}
          onClick={() => handleRatingClick(ratingValue)}
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium",
            isInteractive ? "cursor-pointer" : "cursor-default",
            isFilled 
              ? (error ? "bg-destructive text-destructive-foreground border-destructive" : "bg-primary text-primary-foreground border-primary") 
              : (error ? "border-destructive text-destructive" : "border-muted-foreground/50 text-muted-foreground"),
            styleOptions.inputBorderColor && !error ? `border-[${styleOptions.inputBorderColor}]` : '' // Custom border if no error
          )}
          style={{
             // Apply custom text/bg color if NOT filled and error (for the number itself)
            color: isFilled ? (error ? undefined : styleOptions.inputTextColor) : (error ? 'hsl(var(--destructive))' : styleOptions.inputTextColor),
            backgroundColor: isFilled ? (error ? undefined : styleOptions.inputBackgroundColor) : styleOptions.inputBackgroundColor,
            borderColor: error ? 'hsl(var(--destructive))' : styleOptions.inputBorderColor,
          }}
        >
          {ratingValue}
        </div>
      );
    }
    // Default to star
    return <Star {...iconProps} />;
  });

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
      <div className={cn("flex items-center gap-1.5 mt-1", error && ratingType === 'star' ? "ring-1 ring-destructive rounded-md p-1 w-min" : "", error && ratingType === 'number_scale' ? "ring-1 ring-destructive rounded-lg p-1 w-min" : "")}>
        {ratingElements}
      </div>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
} 