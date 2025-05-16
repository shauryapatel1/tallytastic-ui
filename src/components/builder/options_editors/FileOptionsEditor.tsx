import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export interface FileOptionsEditorProps {
  maxFileSizeMB: number | undefined;
  allowedFileTypes: string[] | undefined;
  onPropertyChange: (
    propertyName: 'maxFileSizeMB' | 'allowedFileTypes',
    value: number | string[] | undefined
  ) => void;
}

export function FileOptionsEditor({
  maxFileSizeMB,
  allowedFileTypes,
  onPropertyChange,
}: FileOptionsEditorProps) {
  // Local state for the comma-separated string input for allowedFileTypes
  const [fileTypesString, setFileTypesString] = useState<string>(
    allowedFileTypes ? allowedFileTypes.join(', ') : ''
  );

  useEffect(() => {
    // Sync local state if prop changes from outside
    setFileTypesString(allowedFileTypes ? allowedFileTypes.join(', ') : '');
  }, [allowedFileTypes]);

  const handleMaxFileSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    // Allow clearing the input, which results in NaN, then treat as undefined
    onPropertyChange('maxFileSizeMB', isNaN(value) ? undefined : (value < 0.1 ? 0.1 : value));
  };

  const handleAllowedFileTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStringValue = e.target.value;
    setFileTypesString(newStringValue);
    // For immediate parsing and propagation:
    // const newArrayValue = newStringValue
    //   .split(',')
    //   .map(s => s.trim())
    //   .filter(s => s.length > 0);
    // onPropertyChange('allowedFileTypes', newArrayValue.length > 0 ? newArrayValue : undefined);
  };

  const parseAndSubmitFileTypes = () => {
    const newArrayValue = fileTypesString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    onPropertyChange('allowedFileTypes', newArrayValue.length > 0 ? newArrayValue : undefined);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="maxFileSizeMB" className="text-xs font-medium">
          Max File Size (MB)
        </Label>
        <Input
          id="maxFileSizeMB"
          type="number"
          min="0.1"
          step="0.1" // Allow finer control if desired, or "1" for whole MBs
          value={maxFileSizeMB === undefined ? '' : String(maxFileSizeMB)} // Ensure value is string or number
          onChange={handleMaxFileSizeChange}
          placeholder="e.g., 10"
          className="mt-1"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="allowedFileTypes" className="text-xs font-medium">
          Allowed File Types
        </Label>
        <Input
          id="allowedFileTypes"
          type="text"
          value={fileTypesString}
          onChange={handleAllowedFileTypesChange}
          onBlur={parseAndSubmitFileTypes} // Update parent on blur
          placeholder=".jpg, .png, .pdf, image/*"
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Comma-separated: e.g., .jpg, .pdf, image/png, video/*
        </p>
      </div>
    </div>
  );
} 