
import { useState } from 'react';
import { FormFieldDefinition, FieldOption } from "@/types/forms";
import { useToast } from "@/hooks/use-toast";

interface UseFormBuilderProps {
  initialFields: FormFieldDefinition[];
  onSave?: (fields: FormFieldDefinition[]) => void;
}

export function useFormBuilder({ initialFields, onSave }: UseFormBuilderProps) {
  const [fields, setFields] = useState<FormFieldDefinition[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
  const { toast } = useToast();

  const addField = (type: FormFieldDefinition['type']) => {
    const newField: FormFieldDefinition = {
      id: crypto.randomUUID(),
      type,
      name: `${type.toLowerCase()}_${crypto.randomUUID().substring(0, 4)}`,
      label: `New ${type} field`,
      isRequired: false,
      placeholder: type !== 'checkbox' && type !== 'file' && type !== 'rating' ? 'Enter value...' : undefined,
      options: (type === 'select' || type === 'radio') 
        ? [{id: crypto.randomUUID(), label: 'Option 1', value: 'option_1'}, {id: crypto.randomUUID(), label: 'Option 2', value: 'option_2'}] satisfies FieldOption[]
        : undefined,
      description: '',
      defaultValue: type === 'rating' ? 0 : undefined
    };
    
    setFields([...fields, newField]);
    setEditingField(newField.id);
    
    toast({
      title: "Field added",
      description: `Added new ${type} field to your form.`,
    });
  };

  const updateField = (id: string, updates: Partial<FormFieldDefinition>) => {
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

  const duplicateField = (id: string) => {
    const fieldToDuplicate = fields.find(field => field.id === id);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: crypto.randomUUID(),
        name: `${fieldToDuplicate.name}_copy`,
        label: `${fieldToDuplicate.label} (Copy)`
      };
      
      setFields([...fields, duplicatedField]);
      
      toast({
        title: "Field duplicated",
        description: "The field has been duplicated.",
      });
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingField(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingField === id) return;
    setDragOver(id);
  };

  const handleDragEnd = () => {
    if (dragOver && draggingField) {
      const dragIndex = fields.findIndex(field => field.id === draggingField);
      const hoverIndex = fields.findIndex(field => field.id === dragOver);
      
      if (dragIndex === -1) return;
      
      // Move field
      const updatedFields = [...fields];
      const [movedField] = updatedFields.splice(dragIndex, 1);
      updatedFields.splice(hoverIndex, 0, movedField);
      
      setFields(updatedFields);
      
      toast({
        title: "Field reordered",
        description: "The field order has been updated.",
      });
    }
    
    setDraggingField(null);
    setDragOver(null);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleAddOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && (field.type === 'select' || field.type === 'radio')) {
      const newOption: FieldOption = {
        id: crypto.randomUUID(),
        label: `Option ${(field.options?.length || 0) + 1}`,
        value: `option_${(field.options?.length || 0) + 1}`
      };
      const options = [...(field.options || []), newOption];
      updateField(fieldId, { options });
    }
  };

  const handleUpdateOption = (fieldId: string, index: number, newLabel: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const options = [...field.options];
      options[index] = { ...options[index], label: newLabel, value: newLabel.toLowerCase().replace(/\s+/g, '_') };
      updateField(fieldId, { options });
    }
  };

  const handleRemoveOption = (fieldId: string, index: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const options = field.options.filter((_, i) => i !== index);
      updateField(fieldId, { options });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(fields);
    }
    
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });
  };

  return {
    fields,
    editingField,
    draggingField,
    dragOver,
    activeTab,
    setActiveTab,
    setEditingField,
    addField,
    updateField,
    removeField,
    duplicateField,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    handleAddOption,
    handleUpdateOption,
    handleRemoveOption,
    handleSave
  };
}
