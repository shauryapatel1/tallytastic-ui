
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { FormField, DragDropFormBuilderProps } from "./form-builder/types";
import { FieldTypeButtons } from "./form-builder/FieldTypeButtons";
import { FormFieldCard } from "./form-builder/FormFieldCard";
import { EmptyFormState } from "./form-builder/EmptyFormState";

export function DragDropFormBuilder({ initialFields = [], onSave }: DragDropFormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const { toast } = useToast();

  const addField = (type: FormField['type']) => {
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
      <FieldTypeButtons onAddField={addField} />

      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[300px]">
        <h2 className="text-lg font-medium mb-4">Your Form</h2>
        <div className="space-y-3 min-h-[200px]">
          {fields.length === 0 ? (
            <EmptyFormState />
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <FormFieldCard
                  key={field.id}
                  field={field}
                  editingField={editingField}
                  draggingField={draggingField}
                  setEditingField={setEditingField}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                  removeField={removeField}
                  updateField={updateField}
                  handleAddOption={handleAddOption}
                  handleUpdateOption={handleUpdateOption}
                  handleRemoveOption={handleRemoveOption}
                />
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
