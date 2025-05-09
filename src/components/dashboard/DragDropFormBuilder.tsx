
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormField, DragDropFormBuilderProps } from "./form-builder/types";
import { FieldTypeButtons } from "./form-builder/FieldTypeButtons";
import { FormFieldCard } from "./form-builder/FormFieldCard";
import { EmptyFormState } from "./form-builder/EmptyFormState";
import { FormPreview } from "./form-builder/FormPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function DragDropFormBuilder({ initialFields = [], onSave }: DragDropFormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
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

  const handleSave = () => {
    onSave(fields);
    
    toast({
      title: "Form saved",
      description: "Your form has been saved successfully.",
    });
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

  const handleDuplicateField = (id: string) => {
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

  return (
    <div className="space-y-6 w-full mx-auto">
      <Tabs defaultValue="build" className="w-full" onValueChange={(value) => setActiveTab(value as "build" | "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="build">Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="build" className="space-y-6 mt-6">
          <FieldTypeButtons onAddField={addField} />

          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-medium mb-4">Your Form</h2>
            <div 
              className="space-y-3 min-h-[200px] pb-4"
              onDragOver={(e) => e.preventDefault()}
            >
              {fields.length === 0 ? (
                <EmptyFormState />
              ) : (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FormFieldCard
                        field={field}
                        editingField={editingField}
                        draggingField={draggingField}
                        isDraggedOver={dragOver === field.id}
                        setEditingField={setEditingField}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragEnd={handleDragEnd}
                        handleDragLeave={handleDragLeave}
                        removeField={removeField}
                        updateField={updateField}
                        handleAddOption={handleAddOption}
                        handleUpdateOption={handleUpdateOption}
                        handleRemoveOption={handleRemoveOption}
                        handleDuplicateField={handleDuplicateField}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-6">
          <FormPreview fields={fields} />
        </TabsContent>
      </Tabs>

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
