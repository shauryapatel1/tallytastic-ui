import React from 'react';
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react"; // For star ratings
import type { FormFieldDefinition, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";

// Helper to determine width class (can be shared or defined locally)
const getWidthClass = (widthOption?: string): string => {
  const widthMap: Record<string, string> = {
    'full': 'w-full',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '2/3': 'w-2/3',
    'auto': 'w-auto',
  };
  return widthMap[widthOption || 'full'] || 'w-full';
};

export interface RatingFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'rating'>;
    // maxRating and ratingType are optional on FormFieldDefinition, defaults handled in component
  };
  value?: number; // Current rating value for interactive mode
  onValueChange?: (newValue: number | undefined) => void; // Handler for value changes
}

export function RatingFieldPresenter({ field, value: propValue, onValueChange }: RatingFieldPresenterProps) {
  const {
    id,
    label,
    description,
    isRequired,
    defaultValue, // Should be a number for rating type
    styleOptions = { labelIsVisible: true },
    maxRating = 5, // Default to 5 if not specified
    ratingType = 'star', // Default to 'star' if not specified
  } = field;

  const isInteractive = !!onValueChange;
  const widthClass = getWidthClass(styleOptions?.width);
  const currentRating = isInteractive ? (propValue ?? 0) : (typeof defaultValue === 'number' ? defaultValue : 0);

  const containerStyles: React.CSSProperties = {
    backgroundColor: styleOptions?.containerBackgroundColor,
    borderColor: styleOptions?.containerBorderColor,
    padding: styleOptions?.containerPadding ? `${styleOptions.containerPadding}px` : undefined,
    borderWidth: styleOptions?.containerBorderColor ? '1px' : '0px',
    borderStyle: styleOptions?.containerBorderColor ? 'solid' : 'none',
  };
  const labelStyling: React.CSSProperties = { color: styleOptions?.labelTextColor };

  const renderStars = () => {
    return (
      <div className="flex space-x-1 mt-1" aria-label={`Rating: ${currentRating} out of ${maxRating} stars`}>
        {[...Array(maxRating)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <Star
              key={`${id}-star-${i}`}
              className={cn(
                "h-5 w-5",
                isInteractive ? "cursor-pointer" : "cursor-default",
                ratingValue <= currentRating
                  ? (styleOptions?.inputTextColor ? '' : "text-yellow-400 fill-yellow-400")
                  : (styleOptions?.inputTextColor ? "text-muted-foreground/50 fill-muted-foreground/20" : "text-muted-foreground/50 fill-muted-foreground/20")
              )}
              style={ratingValue <= currentRating && styleOptions?.inputTextColor ? { color: styleOptions.inputTextColor, fill: styleOptions.inputTextColor } : {}}
              onClick={isInteractive && onValueChange ? () => onValueChange(ratingValue) : undefined}
              aria-hidden="true" // Individual stars are decorative
            />
          );
        })}
      </div>
    );
  };

  const renderNumberScale = () => {
    return (
      <div className="flex space-x-2 mt-1" role="group" aria-label={`Rating: ${currentRating} out of ${maxRating}`}>
        {[...Array(maxRating)].map((_, i) => {
          const ratingValue = i + 1;
          const isSelected = ratingValue === currentRating;
          return (
            <div
              key={`${id}-num-${i}`}
              className={cn(
                "h-7 w-7 flex items-center justify-center rounded border text-xs font-medium",
                isInteractive ? "cursor-pointer" : "cursor-default",
                !isSelected && "bg-muted text-muted-foreground border-border"
              )}
              style={isSelected ? {
                backgroundColor: styleOptions?.inputBackgroundColor || 'var(--primary)',
                borderColor: styleOptions?.inputBorderColor || 'var(--primary)',
                color: styleOptions?.inputTextColor || 'var(--primary-foreground)',
              } : {
                borderColor: styleOptions?.inputBorderColor || undefined,
              }}
              onClick={isInteractive && onValueChange ? () => onValueChange(ratingValue) : undefined}
              aria-label={`${ratingValue} out of ${maxRating}${isSelected ? ", selected" : ""}`}
            >
              {ratingValue}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn("mb-4 flex flex-col", widthClass)}
      style={containerStyles}
      role="group"
      aria-labelledby={id && styleOptions.labelIsVisible !== false ? `${id}-label` : undefined}
    >
      {styleOptions?.labelIsVisible !== false && (
        <Label id={`${id}-label`} style={labelStyling} className="text-sm font-medium mb-0.5" htmlFor={id}>
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mb-1" id={`${id}-desc`}>
          {description}
        </p>
      )}
      {ratingType === 'star' ? renderStars() : renderNumberScale()}
    </div>
  );
} 