
import { useState } from 'react';
import { FormField } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface UseFormFieldsProps {
  initialFields: FormField[];
  onSave?: (fields: FormField[]) => void;
}

export const useFormFields = ({ initialFields, onSave }: UseFormFieldsProps) => {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const { toast } = useToast();

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      placeholder: type !== 'checkbox' && type !== 'file' && type !== 'rating' ? 'Enter value...' : undefined,
      required: false,
      options: (type === 'select' || type === 'radio') ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
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

  const duplicateField = (id: string) => {
    const fieldToDuplicate = fields.find(field => field.id === id);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: crypto.randomUUID(),
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
      const options = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
      updateField(fieldId, { options });
    }
  };

  const handleUpdateOption = (fieldId: string, index: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const options = [...field.options];
      options[index] = value;
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

  const saveFields = () => {
    if (onSave) {
      onSave(fields);
    }
  };

  return {
    fields,
    editingField,
    draggingField,
    dragOver,
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
    saveFields
  };
};
