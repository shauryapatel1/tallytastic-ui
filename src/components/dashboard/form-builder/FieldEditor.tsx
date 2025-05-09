
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 gap-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor={`label-${field.id}`} className="text-sm font-medium text-gray-700">Field Label</Label>
            <Input
              id={`label-${field.id}`}
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              className="mt-1"
            />
          </div>
          
          {field.type !== 'checkbox' && field.type !== 'section' && field.type !== 'file' && (
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
          
          <div>
            <Label htmlFor={`description-${field.id}`} className="text-sm font-medium text-gray-700">Field Description</Label>
            <Textarea
              id={`description-${field.id}`}
              value={field.description || ''}
              onChange={(e) => updateField(field.id, { description: e.target.value })}
              className="mt-1"
              rows={2}
              placeholder="Help text that appears below the field"
            />
          </div>
          
          {(field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'phone') && (
            <div>
              <Label htmlFor={`default-${field.id}`} className="text-sm font-medium text-gray-700">Default Value</Label>
              <Input
                id={`default-${field.id}`}
                value={field.defaultValue as string || ''}
                onChange={(e) => updateField(field.id, { defaultValue: e.target.value })}
                className="mt-1"
                type={field.type === 'number' ? 'number' : 'text'}
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
          
          {(field.type === 'select' || field.type === 'radio') && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Options</Label>
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
        </TabsContent>
        
        <TabsContent value="validation" className="space-y-4">
          {field.type === 'text' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`min-length-${field.id}`} className="text-sm font-medium text-gray-700">Min Length</Label>
                  <Input
                    id={`min-length-${field.id}`}
                    type="number"
                    min="0"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => updateField(field.id, { 
                      validation: { 
                        ...field.validation,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                      } 
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`max-length-${field.id}`} className="text-sm font-medium text-gray-700">Max Length</Label>
                  <Input
                    id={`max-length-${field.id}`}
                    type="number"
                    min="0"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => updateField(field.id, { 
                      validation: { 
                        ...field.validation,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                      } 
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`pattern-${field.id}`} className="text-sm font-medium text-gray-700">Regex Pattern</Label>
                <Input
                  id={`pattern-${field.id}`}
                  value={field.validation?.pattern || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { 
                      ...field.validation,
                      pattern: e.target.value || undefined
                    } 
                  })}
                  className="mt-1"
                  placeholder="e.g. [A-Za-z]+"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Regular expression to validate input
                </p>
              </div>
            </>
          )}
          
          {field.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`min-${field.id}`} className="text-sm font-medium text-gray-700">Min Value</Label>
                <Input
                  id={`min-${field.id}`}
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { 
                      ...field.validation,
                      min: e.target.value ? parseInt(e.target.value) : undefined
                    } 
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`max-${field.id}`} className="text-sm font-medium text-gray-700">Max Value</Label>
                <Input
                  id={`max-${field.id}`}
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => updateField(field.id, { 
                    validation: { 
                      ...field.validation,
                      max: e.target.value ? parseInt(e.target.value) : undefined
                    } 
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {(field.type !== 'text' && field.type !== 'number' && field.type !== 'email') && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No validation options available for this field type
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Field Width</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Button
                type="button"
                variant={field.style?.width === '33%' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, width: '33%' } })}
              >
                33%
              </Button>
              <Button
                type="button"
                variant={field.style?.width === '50%' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, width: '50%' } })}
              >
                50%
              </Button>
              <Button
                type="button"
                variant={!field.style?.width || field.style?.width === '100%' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, width: '100%' } })}
              >
                100%
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Font Size</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Button
                type="button"
                variant={field.style?.fontSize === 'small' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, fontSize: 'small' } })}
              >
                Small
              </Button>
              <Button
                type="button"
                variant={!field.style?.fontSize || field.style?.fontSize === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, fontSize: 'medium' } })}
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={field.style?.fontSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateField(field.id, { style: { ...field.style, fontSize: 'large' } })}
              >
                Large
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
