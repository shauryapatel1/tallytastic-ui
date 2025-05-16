import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormFieldDefinition } from "@/types/forms"; // For FormFieldDefinition['ratingType']

const RATING_TYPES: { value: NonNullable<FormFieldDefinition['ratingType']>; label: string }[] = [
  { value: 'star', label: 'Stars' },
  { value: 'number_scale', label: 'Numbers (1-N)' },
];

export interface RatingOptionsEditorProps {
  maxRating: number | undefined;
  ratingType: FormFieldDefinition['ratingType']; 
  onPropertyChange: (
    propertyName: 'maxRating' | 'ratingType',
    value: number | FormFieldDefinition['ratingType'] | undefined // Allow number for maxRating, specific type for ratingType
  ) => void;
}

export function RatingOptionsEditor({
  maxRating,
  ratingType,
  onPropertyChange,
}: RatingOptionsEditorProps) {

  const handleMaxRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.valueAsNumber;
    if (isNaN(value)) {
      onPropertyChange('maxRating', undefined);
    } else {
      if (value < 1) value = 1; // Enforce min of 1
      // if (value > 10) value = 10; // Optional: Enforce a max if desired by design
      onPropertyChange('maxRating', value);
    }
  };

  const handleRatingTypeChange = (value: string) => {
    // The Select component value is always a string, cast it to the specific literal type.
    onPropertyChange('ratingType', value as FormFieldDefinition['ratingType']);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="maxRating" className="text-xs font-medium">
          Number of Levels (e.g., 5 for 1-5 stars)
        </Label>
        <Input
          id="maxRating"
          type="number"
          min="1"
          // max="10" // Example practical maximum, can be uncommented if desired
          value={maxRating === undefined ? '' : maxRating}
          onChange={handleMaxRatingChange}
          placeholder="e.g., 5"
          className="mt-1 w-full"
        />
        <p className="text-xs text-muted-foreground">Determines the scale, e.g., 5 means a 1 to 5 rating.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ratingType" className="text-xs font-medium">Rating Symbol / Display Type</Label>
        <Select
          value={ratingType || 'star'} // Default to 'star' if undefined for consistent display
          onValueChange={handleRatingTypeChange}
        >
          <SelectTrigger id="ratingType" className="mt-1 w-full">
            <SelectValue placeholder="Select symbol type" />
          </SelectTrigger>
          <SelectContent>
            {RATING_TYPES.map(rt => (
              <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Visual representation of the rating choices.</p>
      </div>
    </div>
  );
} 