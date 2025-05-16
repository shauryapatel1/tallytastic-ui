import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormFieldDefinition } from "@/types/forms"; // To reference potential types

// Define heading levels with numeric values and string labels
const HEADING_LEVELS: Array<{ value: 1 | 2 | 3 | 4 | 5 | 6; label: string }> = [
  { value: 1, label: 'Heading 1 (H1)' },
  { value: 2, label: 'Heading 2 (H2)' },
  { value: 3, label: 'Heading 3 (H3)' },
  { value: 4, label: 'Heading 4 (H4)' },
  { value: 5, label: 'Heading 5 (H5)' },
  { value: 6, label: 'Heading 6 (H6)' },
];

export interface HeadingOptionsEditorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  onPropertyChange: (
    propertyName: 'level', // Only 'level' for this editor
    value: 1 | 2 | 3 | 4 | 5 | 6 | undefined
  ) => void;
}

export function HeadingOptionsEditor({
  level,
  onPropertyChange,
}: HeadingOptionsEditorProps) {
  const handleLevelChange = (valueString: string) => {
    // The value from Select onValueChange is a string
    const numericValue = parseInt(valueString, 10);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 6) {
      onPropertyChange('level', numericValue as 1 | 2 | 3 | 4 | 5 | 6);
    } else {
      // Fallback or if an unexpected value is received
      onPropertyChange('level', undefined); 
    }
  };

  // Determine the string value for the Select component.
  // If level is undefined, pass an empty string to allow the placeholder to show.
  // Otherwise, convert the numeric level to a string.
  const selectValue = level !== undefined ? level.toString() : "";

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="heading-level" className="text-xs font-medium">Heading Level</Label>
        <Select
          value={selectValue}
          onValueChange={handleLevelChange}
        >
          <SelectTrigger id="heading-level" className="mt-1 w-full"> {/* Ensure trigger takes full width if desired */}
            <SelectValue placeholder="Select level (e.g., H2)" />
          </SelectTrigger>
          <SelectContent>
            {HEADING_LEVELS.map(lvl => (
              <SelectItem key={lvl.value} value={lvl.value.toString()}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          The text for the heading is set in the 'Label / Question Text' field under General Properties.
        </p>
      </div>
    </div>
  );
} 