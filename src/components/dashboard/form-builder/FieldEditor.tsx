
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "./types";

interface FieldEditorProps {
  field: FormField;
  updateField: (id: string, updates: Partial<FormField>) => void;
  handleAddOption: (fieldId: string) => void;
  handleUpdateOption: (fieldId: string, index: number, value: string) => void;
  handleRemoveOption: (fieldId: string, index: number) => void;
}

export function FieldEditor({ 
  field, 
  updateField, 
  handleAddOption, 
  handleUpdateOption, 
  handleRemoveOption 
}: FieldEditorProps) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-100 space-y-4">
      <div>
        <Label htmlFor={`label-${field.id}`} className="text-sm font-medium text-gray-700">Field Label</Label>
        <Input
          id={`label-${field.id}`}
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="mt-1"
        />
      </div>
      
      {field.type !== 'checkbox' && (
        <div>
          <Label htmlFor={`placeholder-${field.id}`} className="text-sm font-medium text-gray-700">Placeholder Text</Label>
          <Input
            id={`placeholder-${field.id}`}
            value={field.placeholder || ''}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="mt-1"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`required-${field.id}`}
          checked={field.required}
          onChange={(e) => updateField(field.id, { required: e.target.checked })}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300"
        />
        <Label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700">Required field</Label>
      </div>
      
      {field.type === 'select' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Dropdown Options</Label>
          <div className="space-y-2">
            {field.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleUpdateOption(field.id, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(field.id, optionIndex)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <span className="sr-only">Delete</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddOption(field.id)}
              className="w-full mt-2"
            >
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
