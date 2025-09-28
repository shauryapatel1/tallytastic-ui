import React from 'react';
import { FormFieldDefinition } from '@/types/forms';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface SimplifiedPropertyEditorProps {
  field?: FormFieldDefinition;
  allFields: FormFieldDefinition[];
  onUpdateField: (id: string, updates: Partial<FormFieldDefinition>) => void;
  onAddOption: (fieldId: string) => void;
  onUpdateOption: (fieldId: string, index: number, value: string) => void;
  onRemoveOption: (fieldId: string, index: number) => void;
}

export function SimplifiedPropertyEditor({
  field,
  allFields,
  onUpdateField,
  onAddOption,
  onUpdateOption,
  onRemoveOption
}: SimplifiedPropertyEditorProps) {
  if (!field) {
    return (
      <div className="h-full flex items-center justify-center border-l">
        <div className="text-center text-muted-foreground">
          <p className="mb-2">No field selected</p>
          <p className="text-sm">Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<FormFieldDefinition>) => {
    onUpdateField(field.id, updates);
  };

  const hasChoices = field.type === 'select' || field.type === 'radio' || 
    (field.type === 'checkbox' && field.options);

  const hasValidation = field.type !== 'heading' && field.type !== 'paragraph' && field.type !== 'divider';

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <h3 className="font-semibold flex items-center space-x-2">
          <span>Properties</span>
          <Badge variant="outline">{field.type}</Badge>
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['basics', 'choices', 'validation', 'appearance']} className="space-y-2">
            
            {/* Basics */}
            <AccordionItem value="basics">
              <AccordionTrigger className="text-sm font-medium">Basics</AccordionTrigger>
              <AccordionContent className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="field-label" className="text-xs">Field Label</Label>
                  <Input
                    id="field-label"
                    value={field.label}
                    onChange={(e) => updateField({ label: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field-name" className="text-xs">Field Name</Label>
                  <Input
                    id="field-name"
                    value={field.name}
                    onChange={(e) => updateField({ name: e.target.value })}
                    className="h-8 text-sm font-mono"
                  />
                </div>

                {field.type !== 'heading' && field.type !== 'paragraph' && field.type !== 'divider' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="field-placeholder" className="text-xs">Placeholder</Label>
                      <Input
                        id="field-placeholder"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField({ placeholder: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field-description" className="text-xs">Helper Text</Label>
                      <Textarea
                        id="field-description"
                        value={field.description || ''}
                        onChange={(e) => updateField({ description: e.target.value })}
                        className="min-h-[60px] text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="field-required" className="text-xs">Required</Label>
                      <Switch
                        id="field-required"
                        checked={field.isRequired}
                        onCheckedChange={(checked) => updateField({ isRequired: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="field-hidden" className="text-xs">Hidden</Label>
                      <Switch
                        id="field-hidden"
                        checked={field.isHidden || false}
                        onCheckedChange={(checked) => updateField({ isHidden: checked })}
                      />
                    </div>
                  </>
                )}

                {/* Special content fields */}
                {field.type === 'heading' && (
                  <div className="space-y-2">
                    <Label htmlFor="heading-level" className="text-xs">Heading Level</Label>
                    <Select
                      value={field.level?.toString() || '1'}
                      onValueChange={(value) => updateField({ level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                        <SelectItem value="5">H5</SelectItem>
                        <SelectItem value="6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {field.type === 'paragraph' && (
                  <div className="space-y-2">
                    <Label htmlFor="paragraph-content" className="text-xs">Content</Label>
                    <Textarea
                      id="paragraph-content"
                      value={field.content || ''}
                      onChange={(e) => updateField({ content: e.target.value })}
                      className="min-h-[100px] text-sm"
                      rows={4}
                    />
                  </div>
                )}

              </AccordionContent>
            </AccordionItem>

            {/* Choices */}
            {hasChoices && (
              <AccordionItem value="choices">
                <AccordionTrigger className="text-sm font-medium">Choices</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Input
                          value={option.label}
                          onChange={(e) => onUpdateOption(field.id, index, e.target.value)}
                          className="h-8 text-sm flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveOption(field.id, index)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddOption(field.id)}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>

                  {field.type === 'checkbox' && field.options && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-multiple" className="text-xs">Allow Multiple</Label>
                      <Switch
                        id="allow-multiple"
                        checked={field.allowMultipleSelection || false}
                        onCheckedChange={(checked) => updateField({ allowMultipleSelection: checked })}
                      />
                    </div>
                  )}

                </AccordionContent>
              </AccordionItem>
            )}

            {/* Validation */}
            {hasValidation && (
              <AccordionItem value="validation">
                <AccordionTrigger className="text-sm font-medium">Validation</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  
                  {(field.type === 'text' || field.type === 'textarea') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="min-length" className="text-xs">Min Length</Label>
                        <Input
                          id="min-length"
                          type="number"
                          value={field.minLength || ''}
                          onChange={(e) => updateField({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max-length" className="text-xs">Max Length</Label>
                        <Input
                          id="max-length"
                          type="number"
                          value={field.maxLength || ''}
                          onChange={(e) => updateField({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </>
                  )}

                  {field.type === 'number' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="min-value" className="text-xs">Min Value</Label>
                        <Input
                          id="min-value"
                          type="number"
                          value={field.min || ''}
                          onChange={(e) => updateField({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max-value" className="text-xs">Max Value</Label>
                        <Input
                          id="max-value"
                          type="number"
                          value={field.max || ''}
                          onChange={(e) => updateField({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </>
                  )}

                  {field.type === 'file' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="accepted-files" className="text-xs">Accepted File Types</Label>
                        <Input
                          id="accepted-files"
                          value={field.allowedFileTypes?.join(',') || ''}
                          onChange={(e) => updateField({ allowedFileTypes: e.target.value.split(',').map(type => type.trim()) })}
                          placeholder="e.g., image/jpeg,image/png,application/pdf"
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="multiple-files" className="text-xs">Multiple Files</Label>
                        <Switch
                          id="multiple-files"
                          checked={field.allowMultipleSelection || false}
                          onCheckedChange={(checked) => updateField({ allowMultipleSelection: checked })}
                        />
                      </div>
                    </>
                  )}

                  {field.type === 'rating' && (
                    <div className="space-y-2">
                      <Label htmlFor="max-rating" className="text-xs">Max Rating</Label>
                      <Input
                        id="max-rating"
                        type="number"
                        value={field.max || 5}
                        onChange={(e) => updateField({ max: parseInt(e.target.value) || 5 })}
                        className="h-8 text-sm"
                        min="1"
                        max="10"
                      />
                    </div>
                  )}

                </AccordionContent>
              </AccordionItem>
            )}

            {/* Logic */}
            <AccordionItem value="logic">
              <AccordionTrigger className="text-sm font-medium">Logic</AccordionTrigger>
              <AccordionContent>
                <div className="text-xs text-muted-foreground">
                  Conditional logic configuration will be available here.
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Appearance */}
            <AccordionItem value="appearance">
              <AccordionTrigger className="text-sm font-medium">Appearance</AccordionTrigger>
              <AccordionContent className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="field-width" className="text-xs">Width</Label>
                  <Select
                    value={field.styleOptions?.width || 'full'}
                    onValueChange={(value) => updateField({ 
                      styleOptions: { 
                        ...field.styleOptions, 
                        width: value as 'full' | '1/2' | '1/3' | '2/3' | 'auto' 
                      } 
                    })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="1/2">Half Width</SelectItem>
                      <SelectItem value="1/3">Third Width</SelectItem>
                      <SelectItem value="2/3">Two Thirds Width</SelectItem>
                      <SelectItem value="auto">Auto Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {field.type !== 'heading' && field.type !== 'paragraph' && field.type !== 'divider' && (
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-label" className="text-xs">Hide Label</Label>
                    <Switch
                      id="hide-label"
                      checked={!(field.styleOptions?.labelIsVisible ?? true)}
                      onCheckedChange={(checked) => updateField({ 
                        styleOptions: { 
                          ...field.styleOptions, 
                          labelIsVisible: !checked 
                        } 
                      })}
                    />
                  </div>
                )}

              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}