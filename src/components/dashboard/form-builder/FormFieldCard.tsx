
import React from "react";
import { FormField } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldEditor } from "./FieldEditor";
import { motion } from "framer-motion";

interface FormFieldCardProps {
  field: FormField;
  editingField: string | null;
  draggingField: string | null;
  isDraggedOver: boolean;
  allFields?: FormField[];
  setEditingField: (id: string | null) => void;
  handleDragStart: (id: string) => void;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragEnd: () => void;
  handleDragLeave: () => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  handleAddOption: (fieldId: string) => void;
  handleUpdateOption: (fieldId: string, index: number, value: string) => void;
  handleRemoveOption: (fieldId: string, index: number) => void;
  handleDuplicateField: (id: string) => void;
}

export function FormFieldCard({
  field,
  editingField,
  draggingField,
  isDraggedOver,
  allFields = [],
  setEditingField,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDragLeave,
  removeField,
  updateField,
  handleAddOption,
  handleUpdateOption,
  handleRemoveOption,
  handleDuplicateField
}: FormFieldCardProps) {
  const isEditing = editingField === field.id;
  const isDragging = draggingField === field.id;
  
  // Simple summary of field type and properties
  const getFieldSummary = () => {
    switch (field.type) {
      case 'text':
        return 'Text input field';
      case 'textarea':
        return 'Multi-line text area';
      case 'email':
        return 'Email address field';
      case 'checkbox':
        return 'Single checkbox';
      case 'select':
        return `Dropdown with ${field.options?.length || 0} options`;
      case 'radio':
        return `Radio group with ${field.options?.length || 0} options`;
      case 'number':
        return 'Numeric input field';
      case 'date':
        return 'Date picker field';
      case 'file':
        return 'File upload field';
      case 'phone':
        return 'Phone number field';
      case 'rating':
        return 'Rating selection field';
      case 'section':
        return 'Section divider';
      default:
        return field.type;
    }
  };

  // Render conditional logic info if present
  const renderConditionalInfo = () => {
    if (!field.conditional?.fieldId) return null;
    
    const conditionField = allFields.find(f => f.id === field.conditional?.fieldId);
    if (!conditionField) return null;
    
    return (
      <div className="bg-blue-50 text-xs p-1 rounded text-blue-600 inline-flex items-center mr-2">
        <span>Conditional</span>
      </div>
    );
  };

  return (
    <motion.div
      layout
      animate={{ 
        scale: isDragging ? 0.95 : 1,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDraggedOver ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
      }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`border ${isDraggedOver ? 'border-blue-400 bg-blue-50' : ''}`}
        draggable
        onDragStart={() => handleDragStart(field.id)}
        onDragOver={(e) => handleDragOver(e, field.id)}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <span className="font-medium">{field.label}</span>
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="text-sm text-gray-500 flex items-center space-x-1">
                {renderConditionalInfo()}
                <span>{getFieldSummary()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingField(isEditing ? null : field.id)}
              >
                {isEditing ? 'Done' : 'Edit'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDuplicateField(field.id)}
              >
                Duplicate
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => removeField(field.id)}
              >
                Remove
              </Button>
            </div>
          </div>
          
          {isEditing && (
            <FieldEditor
              field={field}
              allFields={allFields}
              updateField={updateField}
              handleAddOption={handleAddOption}
              handleUpdateOption={handleUpdateOption}
              handleRemoveOption={handleRemoveOption}
              closeEditor={() => setEditingField(null)}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
