import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Ready if tooltips are desired

export interface NumberOptionsEditorProps {
  min: number | undefined;
  max: number | undefined;
  onPropertyChange: (
    propertyName: 'min' | 'max',
    value: number | undefined
  ) => void;
}

export function NumberOptionsEditor({
  min,
  max,
  onPropertyChange,
}: NumberOptionsEditorProps) {

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    propertyName: 'min' | 'max'
  ) => {
    const value = e.target.valueAsNumber;
    // Ensure NaN from empty input becomes undefined, otherwise pass the number.
    onPropertyChange(propertyName, isNaN(value) ? undefined : value);
  };

  // TODO: Implement cross-validation: if max < min, show warning or prevent invalid state.

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="number-min" className="text-xs font-medium">Minimum Value</Label>
        <Input
          id="number-min"
          type="number"
          value={min === undefined ? '' : min} // Controlled component: use empty string for undefined
          onChange={(e) => handleNumberChange(e, 'min')}
          placeholder="e.g., 0 (leave blank for no min)"
          className="mt-1 w-full"
        />
        {/* <p className="text-xs text-muted-foreground mt-1">Smallest allowed number.</p> */}
        {/* TODO: Add visual warning if min > max, perhaps below the input or via tooltip */} 
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="number-max" className="text-xs font-medium">Maximum Value</Label>
        <Input
          id="number-max"
          type="number"
          value={max === undefined ? '' : max}
          onChange={(e) => handleNumberChange(e, 'max')}
          placeholder="e.g., 100 (leave blank for no max)"
          className="mt-1 w-full"
          // HTML5 input validation: max should not be less than min if min is set.
          // This provides some browser-level feedback but custom UI warning is better.
          {...(min !== undefined && { min: String(min) })} 
        />
        {/* <p className="text-xs text-muted-foreground mt-1">Largest allowed number.</p> */}
        {/* TODO: Add visual warning if max < min, perhaps below the input or via tooltip */} 
      </div>
    </div>
  );
} 