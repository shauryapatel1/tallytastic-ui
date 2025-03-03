
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pencil, 
  Trash2, 
  GripVertical, 
  Type, 
  Mail, 
  MessageSquare, 
  Check, 
  List,
  MoveVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FieldType = 'text' | 'email' | 'textarea' | 'checkbox' | 'select';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface DragDropFormBuilderProps {
  initialFields?: FormField[];
  onSave: (fields: FormField[]) => void;
}

export function DragDropFormBuilder({ initialFields = [], onSave }: DragDropFormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const { toast } = useToast();

  const fieldTypes: { type: FieldType; icon: JSX.Element; label: string }[] = [
    { type: 'text', icon: <Type size={16} />, label: 'Text' },
    { type: 'email', icon: <Mail size={16} />, label: 'Email' },
    { type: 'textarea', icon: <MessageSquare size={16} />, label: 'Textarea' },
    { type: 'checkbox', icon: <Check size={16} />, label: 'Checkbox' },
    { type: 'select', icon: <List size={16} />, label: 'Dropdown' }
  ];

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      placeholder: type !== 'checkbox' ? 'Enter value...' : undefined,
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    
    setFields([...fields, newField]);
    setEditingField(newField.id);
    
    toast({
      title: "Field added",
      description: `Added new ${type} field to your form.`,
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    setEditingField(null);
    
    toast({
      title: "Field removed",
      description: "The field has been removed from your form.",
    });
  };

  const handleDragStart = (id: string) => {
    setDraggingField(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingField === id) return;

    const dragIndex = fields.findIndex(field => field.id === draggingField);
    const hoverIndex = fields.findIndex(field => field.id === id);
    
    if (dragIndex === -1) return;
    
    // Move field
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(dragIndex, 1);
    updatedFields.splice(hoverIndex, 0, movedField);
    
    setFields(updatedFields);
  };

  const handleDragEnd = () => {
    setDraggingField(null);
    toast({
      title: "Field reordered",
      description: "The field order has been updated.",
    });
  };

  const handleSave = () => {
    onSave(fields);
    
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });
  };

  const handleAddOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === 'select') {
      const options = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
      updateField(fieldId, { options });
    }
  };

  const handleUpdateOption = (fieldId: string, index: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === 'select' && field.options) {
      const options = [...field.options];
      options[index] = value;
      updateField(fieldId, { options });
    }
  };

  const handleRemoveOption = (fieldId: string, index: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.type === 'select' && field.options) {
      const options = field.options.filter((_, i) => i !== index);
      updateField(fieldId, { options });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Add Form Elements</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {fieldTypes.map((fieldType) => (
            <Button
              key={fieldType.type}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50"
              onClick={() => addField(fieldType.type)}
            >
              {fieldType.icon}
              <span className="text-xs">{fieldType.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[300px]">
        <h2 className="text-lg font-medium mb-4">Your Form</h2>
        <div className="space-y-3 min-h-[200px]">
          {fields.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <MoveVertical className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">Drag and drop fields here</p>
              <p className="text-sm text-gray-400">Or click on a field type above to add it</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card 
                  key={field.id}
                  className={`relative transition-all duration-200 ${draggingField === field.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(field.id)}
                  onDragOver={(e) => handleDragOver(e, field.id)}
                  onDragEnd={handleDragEnd}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <GripVertical size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{field.label}</p>
                          <p className="text-xs text-gray-500">
                            {field.type} {field.required ? '(required)' : '(optional)'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Pencil size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    
                    {editingField === field.id && (
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
                                    <Trash2 size={16} />
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
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={fields.length === 0}
          className="px-6"
        >
          Save Form
        </Button>
      </div>
    </div>
  );
}
