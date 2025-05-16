import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormFieldStyleOptions } from '@/types/forms';
// Consider lodash.debounce if frequent updates become an issue, for now direct updates are fine.
// import { debounce } from 'lodash';

interface FieldStylingEditorProps {
  styleOptions: FormFieldStyleOptions | undefined;
  onStyleChange: (newStyles: FormFieldStyleOptions) => void;
}

export function FieldStylingEditor({ styleOptions, onStyleChange }: FieldStylingEditorProps) {
  // Initialize with default for labelIsVisible if not present in styleOptions
  const [currentStyles, setCurrentStyles] = useState<FormFieldStyleOptions>({
    labelIsVisible: true, // Default to true
    ...(styleOptions || {}),
  });

  useEffect(() => {
    // Update local state if prop changes, ensuring default for labelIsVisible
    setCurrentStyles({
      labelIsVisible: true,
      ...(styleOptions || {}),
    });
  }, [styleOptions]);

  const handleChange = (key: keyof FormFieldStyleOptions, value: any) => {
    const newStyles = { ...currentStyles, [key]: value };
    setCurrentStyles(newStyles);
    onStyleChange(newStyles);
  };

  return (
    <div className="space-y-6 p-1"> {/* Added a bit of padding for visual separation */}
      {/* Label Styling */}
      <div className="space-y-3 p-4 border rounded-lg bg-background/50 shadow-sm">
        <h4 className="text-sm font-semibold tracking-tight text-foreground">Label Styling</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Label htmlFor="labelIsVisible" className="text-xs text-muted-foreground">Show Label</Label>
          <div className="flex justify-start sm:justify-end">
            <Switch
              id="labelIsVisible"
              checked={currentStyles.labelIsVisible}
              onCheckedChange={(checked) => handleChange('labelIsVisible', checked)}
              aria-label="Toggle label visibility"
            />
          </div>
        </div>
        {currentStyles.labelIsVisible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Label htmlFor="labelTextColor" className="text-xs text-muted-foreground">Text Color</Label>
            <Input
              id="labelTextColor"
              type="text"
              placeholder="#000000 or theme variable"
              value={currentStyles.labelTextColor || ''}
              onChange={(e) => handleChange('labelTextColor', e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>

      {/* Field Container Styling */}
      <div className="space-y-3 p-4 border rounded-lg bg-background/50 shadow-sm">
        <h4 className="text-sm font-semibold tracking-tight text-foreground">Field Container</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Label htmlFor="fieldWidth" className="text-xs text-muted-foreground">Width</Label>
          <Select
            value={currentStyles.width || 'full'}
            onValueChange={(value) => handleChange('width', value)}
          >
            <SelectTrigger id="fieldWidth" className="h-8 text-xs">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="1/2">Half</SelectItem>
              <SelectItem value="1/3">One Third</SelectItem>
              <SelectItem value="2/3">Two Thirds</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Label htmlFor="containerBackgroundColor" className="text-xs text-muted-foreground">Background Color</Label>
          <Input
            id="containerBackgroundColor"
            type="text" placeholder="#FFFFFF or theme variable"
            value={currentStyles.containerBackgroundColor || ''}
            onChange={(e) => handleChange('containerBackgroundColor', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Label htmlFor="containerBorderColor" className="text-xs text-muted-foreground">Border Color</Label>
          <Input
            id="containerBorderColor"
            type="text" placeholder="#CCCCCC or theme variable"
            value={currentStyles.containerBorderColor || ''}
            onChange={(e) => handleChange('containerBorderColor', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Label htmlFor="containerPadding" className="text-xs text-muted-foreground">Padding (e.g., 4px, 0.5rem)</Label>
          <Input
            id="containerPadding"
            type="text" placeholder="e.g., 8px"
            value={currentStyles.containerPadding || ''}
            onChange={(e) => handleChange('containerPadding', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Input Element Styling */}
      <div className="space-y-3 p-4 border rounded-lg bg-background/50 shadow-sm">
        <h4 className="text-sm font-semibold tracking-tight text-foreground">Input Area</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Label htmlFor="inputTextColor" className="text-xs text-muted-foreground">Text Color</Label>
            <Input
              id="inputTextColor"
              type="text" placeholder="#000000 or theme variable"
              value={currentStyles.inputTextColor || ''}
              onChange={(e) => handleChange('inputTextColor', e.target.value)}
              className="h-8 text-xs"
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Label htmlFor="inputBackgroundColor" className="text-xs text-muted-foreground">Background Color</Label>
            <Input
              id="inputBackgroundColor"
              type="text" placeholder="#FFFFFF or theme variable"
              value={currentStyles.inputBackgroundColor || ''}
              onChange={(e) => handleChange('inputBackgroundColor', e.target.value)}
              className="h-8 text-xs"
            />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Label htmlFor="inputBorderColor" className="text-xs text-muted-foreground">Border Color</Label>
            <Input
              id="inputBorderColor"
              type="text" placeholder="#CCCCCC or theme variable"
              value={currentStyles.inputBorderColor || ''}
              onChange={(e) => handleChange('inputBorderColor', e.target.value)}
              className="h-8 text-xs"
            />
        </div>
      </div>
    </div>
  );
} 