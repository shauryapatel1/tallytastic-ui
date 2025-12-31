import { useState, useCallback } from 'react';
import { FormFieldDefinition, FieldOption } from "@/types/forms";
import { useToast } from "@/hooks/use-toast";
import { useUndoRedo } from './useUndoRedo';

interface UseFormBuilderStateProps {
  initialFields: FormFieldDefinition[];
}

export function useFormBuilderState({ initialFields }: UseFormBuilderStateProps) {
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const {
    currentState: fields,
    pushState: setFields,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo({ initialState: initialFields });

  const addField = useCallback((type: FormFieldDefinition['type']) => {
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
    
    const newFields = [...fields, newField];
    setFields(newFields);
    setEditingField(newField.id);
    
    toast({
      title: "Field added",
      description: `Added new ${type} field to your form.`,
    });
  }, [fields, setFields, toast]);

  const updateField = useCallback((id: string, updates: Partial<FormFieldDefinition>) => {
    const newFields = fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    setFields(newFields);
  }, [fields, setFields]);

  const removeField = useCallback((id: string) => {
    const newFields = fields.filter(field => field.id !== id);
    setFields(newFields);
    setEditingField(null);
    
    toast({
      title: "Field removed",
      description: "The field has been removed from your form.",
    });
  }, [fields, setFields, toast]);

  const duplicateField = useCallback((id: string) => {
    const fieldToDuplicate = fields.find(field => field.id === id);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: crypto.randomUUID(),
        name: `${fieldToDuplicate.name}_copy`,
        label: `${fieldToDuplicate.label} (Copy)`
      };
      
      const newFields = [...fields, duplicatedField];
      setFields(newFields);
      
      toast({
        title: "Field duplicated",
        description: "The field has been duplicated.",
      });
    }
  }, [fields, setFields, toast]);

  const handleDragStart = useCallback((id: string) => {
    setDraggingField(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingField === id) return;
    setDragOver(id);
  }, [draggingField]);

  const handleDragEnd = useCallback(() => {
    if (dragOver && draggingField) {
      const dragIndex = fields.findIndex(field => field.id === draggingField);
      const hoverIndex = fields.findIndex(field => field.id === dragOver);
      
      if (dragIndex === -1) return;
      
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
  }, [dragOver, draggingField, fields, setFields, toast]);

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  const handleAddOption = useCallback((fieldId: string) => {
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
  }, [fields, updateField]);

  const handleUpdateOption = useCallback((fieldId: string, index: number, newLabel: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const options = [...field.options];
      options[index] = { ...options[index], label: newLabel, value: newLabel.toLowerCase().replace(/\s+/g, '_') };
      updateField(fieldId, { options });
    }
  }, [fields, updateField]);

  const handleRemoveOption = useCallback((fieldId: string, index: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (field && field.options) {
      const options = field.options.filter((_, i) => i !== index);
      updateField(fieldId, { options });
    }
  }, [fields, updateField]);

  const replaceAllFields = useCallback((newFields: FormFieldDefinition[]) => {
    setFields(newFields);
    setEditingField(null);
  }, [setFields]);

  const mergeFields = useCallback((newFields: FormFieldDefinition[]) => {
    const mergedFields = [...fields, ...newFields];
    setFields(mergedFields);
    setEditingField(null);
  }, [fields, setFields]);

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
    replaceAllFields,
    mergeFields,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    handleAddOption,
    handleUpdateOption,
    handleRemoveOption,
    undo,
    redo,
    canUndo,
    canRedo
  };
}