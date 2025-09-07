
import { FormField } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Check } from "lucide-react";
import { ConditionalLogicBuilder } from "./ConditionalLogicBuilder";

interface FieldEditorProps {
  field: FormField;
  allFields: FormField[];
  updateField: (id: string, updates: Partial<FormField>) => void;
  handleAddOption: (fieldId: string) => void;
  handleUpdateOption: (fieldId: string, index: number, value: string) => void;
  handleRemoveOption: (fieldId: string, index: number) => void;
  closeEditor: () => void;
}

export function FieldEditor({ 
  field, 
  allFields,
  updateField, 
  handleAddOption,
  handleUpdateOption,
  handleRemoveOption,
  closeEditor 
}: FieldEditorProps) {
  return (
    <div className="p-4 space-y-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Edit Field</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={closeEditor}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`field-${field.id}-label`}>Field Label</Label>
            <Input
              id={`field-${field.id}-label`}
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor={`field-${field.id}-type`}>Field Type</Label>
            <Input
              id={`field-${field.id}-type`}
              value={field.type}
              disabled
            />
          </div>
        </div>
        
        {field.type !== 'checkbox' && field.type !== 'file' && field.type !== 'rating' && (
          <div>
            <Label htmlFor={`field-${field.id}-placeholder`}>Placeholder</Label>
            <Input
              id={`field-${field.id}-placeholder`}
              value={field.placeholder || ''}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            />
          </div>
        )}
        
        <div>
          <Label htmlFor={`field-${field.id}-description`}>Description (Optional)</Label>
          <Textarea
            id={`field-${field.id}-description`}
            value={field.description || ''}
            onChange={(e) => updateField(field.id, { description: e.target.value })}
            placeholder="Add a description to help users understand this field"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id={`field-${field.id}-required`}
            checked={field.isRequired}
            onCheckedChange={(checked) => updateField(field.id, { isRequired: checked })}
          />
          <Label htmlFor={`field-${field.id}-required`}>Required field</Label>
        </div>
        
        {(field.type === 'select' || field.type === 'radio') && field.options && (
          <div className="space-y-2">
            <Label>Options</Label>
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleUpdateOption(field.id, index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(field.id, index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddOption(field.id)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>
        )}

        {/* Add the conditional logic builder */}
        <ConditionalLogicBuilder 
          field={field} 
          allFields={allFields} 
          onChange={(conditional) => updateField(field.id, { conditional })} 
        />
      </div>
    </div>
  );
}
