import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Ready if tooltips are desired

// FormFieldDefinition is not directly used, but its properties inform this interface.
// import type { FormFieldDefinition } from '@/types/forms'; 

export interface TextOptionsEditorProps {
  minLength: number | undefined;
  maxLength: number | undefined;
  rows: number | undefined;
  fieldType: 'text' | 'textarea';
  onPropertyChange: (
    propertyName: 'minLength' | 'maxLength' | 'rows',
    value: number | undefined
  ) => void;
}

export function TextOptionsEditor({
  minLength,
  maxLength,
  rows,
  fieldType,
  onPropertyChange,
}: TextOptionsEditorProps) {

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    propertyName: 'minLength' | 'maxLength' | 'rows'
  ) => {
    const value = e.target.valueAsNumber;
    // Ensure NaN from empty input becomes undefined, otherwise pass the number.
    onPropertyChange(propertyName, isNaN(value) ? undefined : value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="minLength" className="text-xs font-medium">Minimum Length</Label>
        <Input
          id="minLength"
          type="number"
          min="0"
          value={minLength === undefined ? '' : minLength} // Controlled component: use empty string for undefined
          onChange={(e) => handleNumberChange(e, 'minLength')}
          placeholder="e.g., 0 (no minimum)"
          className="mt-1 w-full"
        />
        {/* <p className="text-xs text-muted-foreground">The minimum number of characters required.</p> */}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="maxLength" className="text-xs font-medium">Maximum Length</Label>
        <Input
          id="maxLength"
          type="number"
          min="0" 
          value={maxLength === undefined ? '' : maxLength}
          onChange={(e) => handleNumberChange(e, 'maxLength')}
          placeholder="e.g., 255 (leave blank for no max)"
          className="mt-1 w-full"
        />
        {/* <p className="text-xs text-muted-foreground">The maximum number of characters allowed.</p> */}
      </div>

      {fieldType === 'textarea' && (
        <div className="space-y-1.5">
          <Label htmlFor="rows" className="text-xs font-medium">Visible Rows</Label>
          <Input
            id="rows"
            type="number"
            min="1"
            value={rows === undefined ? '' : rows}
            onChange={(e) => handleNumberChange(e, 'rows')}
            placeholder="e.g., 3"
            className="mt-1 w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">Default number of text lines visible for the textarea.</p>
        </div>
      )}
    </div>
  );
} 