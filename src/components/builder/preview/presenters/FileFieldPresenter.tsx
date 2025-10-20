import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Used for visual representation
import { FileUp } from "lucide-react";
import type { FormFieldDefinition, FormFieldType } from "@/types/forms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
  value?: FileList | string | undefined; // string could be a filename if already uploaded/persisted
  onValueChange?: (newValue: FileList | undefined) => void; // FileList from input event
  onBlur?: () => void; // Callback for blur event
  error?: string; // Added error prop
}

export function FileFieldPresenter({ field, value, onValueChange, onBlur, error }: FileFieldPresenterProps) {
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
    borderColor: error ? 'hsl(var(--destructive))' : styleOptions?.inputBorderColor,
    borderWidth: styleOptions?.inputBorderColor || error ? '1px' : undefined,
    borderStyle: styleOptions?.inputBorderColor || error ? 'solid' : undefined,
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.files || undefined);
    }
  };

  // Displaying current file info for interactive mode if `value` provides it.
  // For a FileList, we might show the name of the first file.
  // If `value` is a string, assume it's a previously uploaded filename.
  let fileInfo: string | null = null;
  if (isInteractive && value) {
    if (typeof value === 'string') {
      fileInfo = value;
    } else if (value instanceof FileList && value.length > 0) {
      fileInfo = value[0].name;
      if (value.length > 1) {
        fileInfo += ` (+${value.length - 1} more)`;
      }
    }
  }
  // Non-interactive mode doesn't typically show a value for file inputs unless defaultValue is a filename string
  else if (!isInteractive && typeof field.defaultValue === 'string') {
    fileInfo = field.defaultValue;
  }

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
      <Input
        type="file"
        id={id}
        placeholder={placeholder} // Browser usually shows "No file chosen" or similar
        disabled={!isInteractive}
        onChange={handleChange}
        onBlur={onBlur}
        accept={allowedFileTypes?.join(',')}
        // The Input component itself might need specific styling for error states or to use the style prop effectively for file inputs
        // Standard border styling might be overridden by browser default file input styling.
        style={inputRepresentationStyling}
        className={cn("mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20", error ? "ring-1 ring-destructive focus-visible:ring-destructive" : "")}
      />
      {fileInfo && !error && (
        <p className="text-xs text-muted-foreground mt-1">
          Current file: {fileInfo}
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}

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