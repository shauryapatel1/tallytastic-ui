import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { FieldOption, FormFieldType } from '@/types/forms';
import { cn } from '@/lib/utils'; // Import cn utility

// Helper to generate unique IDs for new options
const generateOptionId = () => `option_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// Helper to suggest a value from a label (basic slugify)
const suggestValueFromLabel = (label: string): string => {
  if (!label) return '';
  return label
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, '') // Remove non-alphanumeric characters except underscore
    .substring(0, 50); // Max length for value
};

export interface ChoiceOptionsEditorProps {
  options: FieldOption[];
  allowMultipleSelection?: boolean;
  allowOther?: boolean;
  fieldType: Extract<FormFieldType, 'select' | 'radio' | 'checkbox'>;
  onConfigChange: (newConfig: {
    options?: FieldOption[];
    allowMultipleSelection?: boolean;
    allowOther?: boolean;
  }) => void;
}

export function ChoiceOptionsEditor({
  options: initialOptions,
  allowMultipleSelection: initialAllowMultiple,
  allowOther: initialAllowOther,
  fieldType,
  onConfigChange,
}: ChoiceOptionsEditorProps) {
  const [currentOptions, setCurrentOptions] = useState<FieldOption[]>([]);
  const [currentAllowMultiple, setCurrentAllowMultiple] = useState(false);
  const [currentAllowOther, setCurrentAllowOther] = useState(false);
  const [duplicateValues, setDuplicateValues] = useState<Record<string, boolean>>({});
  const lastAddedOptionLabelInputRef = useRef<HTMLInputElement>(null); // Changed ref name for clarity

  useEffect(() => {
    setCurrentOptions(initialOptions ? JSON.parse(JSON.stringify(initialOptions)) : []);
  }, [initialOptions]);

  useEffect(() => {
    setCurrentAllowMultiple(initialAllowMultiple || false);
  }, [initialAllowMultiple]);

  useEffect(() => {
    setCurrentAllowOther(initialAllowOther || false);
  }, [initialAllowOther]);

  useEffect(() => {
    const getDuplicateValueFlags = (opts: FieldOption[]): Record<string, boolean> => {
      const valueCounts: Record<string, number> = {};
      opts.forEach(opt => {
        if (opt.value && opt.value.trim() !== '') { // Only consider non-empty values
          valueCounts[opt.value] = (valueCounts[opt.value] || 0) + 1;
        }
      });
      const flags: Record<string, boolean> = {};
      opts.forEach(opt => {
        if (opt.value && opt.value.trim() !== '' && valueCounts[opt.value] > 1) {
          flags[opt.id] = true;
        } else {
          flags[opt.id] = false;
        }
      });
      return flags;
    };
    setDuplicateValues(getDuplicateValueFlags(currentOptions));
  }, [currentOptions]);

  const handleOptionChange = (index: number, field: keyof FieldOption, newValue: string) => {
    const oldOption = currentOptions[index];
    let updatedOptions = [...currentOptions];

    if (field === 'label') {
      const newSuggestedValue = suggestValueFromLabel(newValue);
      if (oldOption.value.trim() === '' || oldOption.value === suggestValueFromLabel(oldOption.label)) {
        updatedOptions[index] = { ...oldOption, label: newValue, value: newSuggestedValue };
      } else {
        updatedOptions[index] = { ...oldOption, label: newValue };
      }
    } else { // field === 'value'
      updatedOptions[index] = { ...oldOption, value: newValue };
    }
    
    setCurrentOptions(updatedOptions);
    onConfigChange({ options: updatedOptions, allowMultipleSelection: currentAllowMultiple, allowOther: currentAllowOther });
  };

  const addOption = () => {
    const newLabel = `Option ${currentOptions.length + 1}`;
    const newValue = suggestValueFromLabel(newLabel);
    const newOption: FieldOption = { id: generateOptionId(), label: newLabel, value: newValue };
    const updatedOptions = [...currentOptions, newOption];
    setCurrentOptions(updatedOptions);
    onConfigChange({ options: updatedOptions, allowMultipleSelection: currentAllowMultiple, allowOther: currentAllowOther });
    
    setTimeout(() => {
      lastAddedOptionLabelInputRef.current?.focus();
    }, 0);
  };

  const deleteOption = (idToDelete: string) => {
    const updatedOptions = currentOptions.filter(opt => opt.id !== idToDelete);
    setCurrentOptions(updatedOptions);
    onConfigChange({ options: updatedOptions, allowMultipleSelection: currentAllowMultiple, allowOther: currentAllowOther });
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentOptions.length - 1)
    ) {
      return; 
    }
    const newOptions = [...currentOptions];
    const optionToMove = newOptions[index];
    newOptions.splice(index, 1);
    if (direction === 'up') {
      newOptions.splice(index - 1, 0, optionToMove);
    } else {
      newOptions.splice(index + 1, 0, optionToMove);
    }
    setCurrentOptions(newOptions);
    onConfigChange({ 
      options: newOptions, 
      allowMultipleSelection: currentAllowMultiple, 
      allowOther: currentAllowOther 
    });
  };

  const handleToggleChange = (
    configKey: 'allowMultipleSelection' | 'allowOther',
    value: boolean
  ) => {
    const newConfig = {
        options: currentOptions,
        allowMultipleSelection: configKey === 'allowMultipleSelection' ? value : currentAllowMultiple,
        allowOther: configKey === 'allowOther' ? value : currentAllowOther,
    };
    if (configKey === 'allowMultipleSelection') setCurrentAllowMultiple(value);
    if (configKey === 'allowOther') setCurrentAllowOther(value);
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Options</h4>
        <Button onClick={addOption} variant="outline" size="sm">
          Add Option
        </Button>
      </div>
      
      <ScrollArea className="max-h-72 w-full pr-3">
        <div className="space-y-3">
          {currentOptions.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No options defined. Click "Add Option" to start.
            </p>
          )}
          {currentOptions.map((option, index) => (
            <div key={option.id} className="p-3 border rounded-md space-y-2 bg-background shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-end space-x-2">
                <div className="flex-grow space-y-1">
                  <Label htmlFor={`option-label-${option.id}`} className="text-xs">Label</Label>
                  <Input
                    id={`option-label-${option.id}`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                    placeholder="Visible Label"
                    className="h-9 text-sm"
                    ref={index === currentOptions.length - 1 ? lastAddedOptionLabelInputRef : null}
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <Label htmlFor={`option-value-${option.id}`} className="text-xs">Value</Label>
                  <Input
                    id={`option-value-${option.id}`}
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                    placeholder="Submission Value (unique)"
                    className={cn("h-9 text-sm", duplicateValues[option.id] && "border-destructive focus-visible:ring-destructive")}
                  />
                   {duplicateValues[option.id] && (
                    <p className="text-xs text-destructive mt-0.5">
                      This value should be unique.
                    </p>
                  )}
                </div>
                {/* Action Buttons Group */}
                <div className="flex items-center shrink-0 self-end">
                  <Button 
                    variant="ghost" size="icon"
                    onClick={() => handleMoveOption(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 text-muted-foreground hover:text-primary disabled:opacity-30"
                    aria-label="Move option up"
                  ><ChevronUp className="h-4 w-4" /></Button>
                  <Button 
                    variant="ghost" size="icon"
                    onClick={() => handleMoveOption(index, 'down')}
                    disabled={index === currentOptions.length - 1}
                    className="h-8 w-8 text-muted-foreground hover:text-primary disabled:opacity-30"
                    aria-label="Move option down"
                  ><ChevronDown className="h-4 w-4" /></Button>
                  <Button 
                    variant="ghost" size="icon"
                    onClick={() => deleteOption(option.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label="Delete option"
                  ><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="space-y-3 pt-4 border-t mt-4">
        {(fieldType === 'select' || fieldType === 'checkbox') && (
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                <div className="space-y-0.5">
                    <Label htmlFor="allowMultipleSelection" className="text-sm font-medium">Allow Multiple Selections</Label>
                    <p className="text-xs text-muted-foreground">
                        User can select more than one option.
                    </p>
                </div>
                <Switch
                    id="allowMultipleSelection"
                    checked={currentAllowMultiple}
                    onCheckedChange={(checked) => handleToggleChange('allowMultipleSelection', checked)}
                />
            </div>
        )}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
            <div className="space-y-0.5">
                <Label htmlFor="allowOther" className="text-sm font-medium">Include an "Other" option</Label>
                 <p className="text-xs text-muted-foreground">
                    User can specify a custom value if their choice isn't listed.
                </p>
            </div>
            <Switch
                id="allowOther"
                checked={currentAllowOther}
                onCheckedChange={(checked) => handleToggleChange('allowOther', checked)}
            />
        </div>
      </div>
    </div>
  );
} 