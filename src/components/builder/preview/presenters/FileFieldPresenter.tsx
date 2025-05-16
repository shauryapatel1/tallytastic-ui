import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Used for visual representation
import { FileUp } from "lucide-react";
import type { FormFieldDefinition, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";

// Helper to determine width class
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

export interface FileFieldPresenterProps {
  field: FormFieldDefinition & {
    type: Extract<FormFieldType, 'file'>;
    maxFileSizeMB?: number;
    allowedFileTypes?: string[];
  };
  value?: string | undefined; // Mock filename for interactive preview
  onValueChange?: (newValue: string | undefined) => void; // Handler for simulated file selection/deselection
}

export function FileFieldPresenter({ field, value: propValue, onValueChange }: FileFieldPresenterProps) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    styleOptions = { labelIsVisible: true },
    maxFileSizeMB,
    allowedFileTypes,
  } = field;

  const isInteractive = !!onValueChange;
  const widthClass = getWidthClass(styleOptions?.width);

  const containerStyles: React.CSSProperties = {
    backgroundColor: styleOptions?.containerBackgroundColor,
    borderColor: styleOptions?.containerBorderColor,
    padding: styleOptions?.containerPadding ? `${styleOptions.containerPadding}px` : undefined,
    borderWidth: styleOptions?.containerBorderColor ? '1px' : '0px',
    borderStyle: styleOptions?.containerBorderColor ? 'solid' : 'none',
  };
  const labelStyling: React.CSSProperties = { color: styleOptions?.labelTextColor };
  const inputRepresentationStyling: React.CSSProperties = {
    color: styleOptions?.inputTextColor, // For placeholder text/icon
    backgroundColor: styleOptions?.inputBackgroundColor,
    borderColor: styleOptions?.inputBorderColor,
    borderWidth: styleOptions?.inputBorderColor ? '1px' : undefined,
    borderStyle: styleOptions?.inputBorderColor ? 'solid' : undefined,
  };

  return (
    <div
      className={cn("mb-4 flex flex-col", widthClass)}
      style={containerStyles}
      aria-labelledby={id && styleOptions.labelIsVisible !== false ? `${id}-label` : undefined}
    >
      {styleOptions?.labelIsVisible !== false && (
        <Label id={`${id}-label`} style={labelStyling} htmlFor={id} className="text-sm font-medium mb-0.5">
          {label} {isRequired && <span className="text-destructive font-normal">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mb-1" id={`${id}-desc`}>
          {description}
        </p>
      )}
      <Button
        variant="outline"
        disabled={!isInteractive} // Disabled if not interactive
        className={cn(
          "mt-1 justify-start text-muted-foreground h-10",
          isInteractive ? "cursor-pointer" : "cursor-not-allowed",
          propValue && isInteractive && "text-foreground" // Change text color if a mock file is "selected"
        )}
        style={inputRepresentationStyling}
        aria-label={label || 'File upload input'}
        onClick={() => {
          if (isInteractive && onValueChange) {
            if (propValue) {
              onValueChange(undefined); // Simulate clearing the file
            } else {
              onValueChange("sample-file.pdf"); // Simulate selecting a mock file
            }
          }
        }}
      >
        <FileUp className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {isInteractive && propValue 
            ? propValue 
            : (placeholder || (isInteractive ? "Choose File (Preview)" : "No file chosen"))}
        </span>
      </Button>

      <div className="mt-1.5 space-y-0.5"> {/* Increased top margin slightly */}
        {maxFileSizeMB && (
          <p className="text-xs text-muted-foreground">
            Max file size: {maxFileSizeMB}MB
          </p>
        )}
        {(allowedFileTypes && allowedFileTypes.length > 0) && (
          <p className="text-xs text-muted-foreground">
            Allowed types: {allowedFileTypes.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
} 