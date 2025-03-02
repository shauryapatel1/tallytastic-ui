
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Pencil, 
  Trash2, 
  GripVertical, 
  Plus, 
  Type, 
  Mail, 
  MessageSquare, 
  Check, 
  List 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const moveField = (fromIndex: number, toIndex: number) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFields(updatedFields);
  };

  const handleSave = () => {
    onSave(fields);
    
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="h-auto py-2 flex flex-col items-center justify-center gap-1"
            onClick={() => addField(fieldType.type)}
          >
            {fieldType.icon}
            <span className="text-xs">{fieldType.label}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-2 border rounded-md p-4 min-h-[200px] bg-muted/30">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Drag and drop fields here</p>
            <p className="text-sm">Or click on a field type above to add it</p>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-30 group-hover:opacity-100">
                  <GripVertical size={16} />
                </div>
                <CardContent className="p-4 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{field.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.type} {field.required ? '(required)' : '(optional)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {editingField === field.id && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div>
                        <Label htmlFor={`label-${field.id}`}>Field Label</Label>
                        <Input
                          id={`label-${field.id}`}
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                        />
                      </div>
                      
                      {field.type !== 'checkbox' && (
                        <div>
                          <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                          <Input
                            id={`placeholder-${field.id}`}
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        />
                        <Label htmlFor={`required-${field.id}`}>Required field</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleSave} disabled={fields.length === 0} className="w-full">
        Save Form
      </Button>
    </div>
  );
}
