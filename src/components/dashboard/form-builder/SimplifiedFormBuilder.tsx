import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FieldPalette } from '@/components/builder/FieldPalette';
import { EnhancedFormFieldCard } from './EnhancedFormFieldCard';
import { SimplifiedPropertyEditor } from './SimplifiedPropertyEditor';
import { useFormBuilderState } from '@/hooks/useFormBuilderState';
import { useAutosave } from '@/hooks/useAutosave';
import { FormFieldDefinition } from '@/types/forms';
import { Undo, Save, Check } from 'lucide-react';

interface SimplifiedFormBuilderProps {
  initialFields?: FormFieldDefinition[];
  onSave?: (fields: FormFieldDefinition[]) => Promise<void>;
}

export function SimplifiedFormBuilder({ 
  initialFields = [], 
  onSave 
}: SimplifiedFormBuilderProps) {
  const {
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
    undo,
    canUndo
  } = useFormBuilderState({ initialFields });

  const autosaveStatus = useAutosave({
    data: fields,
    saveFunction: onSave || (async () => {}),
    enabled: !!onSave,
    delay: 500
  });

  const selectedField = editingField ? fields.find(f => f.id === editingField) : null;

  const getSaveStatusIndicator = () => {
    switch (autosaveStatus.status) {
      case 'saving':
        return (
          <div className="flex items-center text-amber-600 text-sm">
            <div className="animate-spin h-3 w-3 border border-amber-600 rounded-full border-t-transparent mr-1"></div>
            Saving...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center text-green-600 text-sm">
            <Check className="h-3 w-3 mr-1" />
            Saved
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600 text-sm">
            Error saving
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-background">
      {/* Palette Panel */}
      <div className="w-[280px] border-r">
        <FieldPalette onAddFieldIntent={addField} />
      </div>

      {/* Canvas Panel */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Form Canvas</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="flex items-center space-x-1"
            >
              <Undo className="h-3 w-3" />
              <span>Undo</span>
            </Button>
          </div>
          {getSaveStatusIndicator()}
        </div>

        {/* Canvas Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {fields.length === 0 ? (
            <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">No fields yet</p>
                <p className="text-sm text-muted-foreground">
                  Drag a field from the palette to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {fields.map((field) => (
                <EnhancedFormFieldCard
                  key={field.id}
                  field={field}
                  isEditing={editingField === field.id}
                  isDragging={draggingField === field.id}
                  isDraggedOver={dragOver === field.id}
                  onEdit={(id) => setEditingField(editingField === id ? null : id)}
                  onDuplicate={duplicateField}
                  onRemove={removeField}
                  onUpdateField={updateField}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragLeave={handleDragLeave}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-[350px] border-l">
        <SimplifiedPropertyEditor
          field={selectedField}
          allFields={fields}
          onUpdateField={updateField}
          onAddOption={handleAddOption}
          onUpdateOption={handleUpdateOption}
          onRemoveOption={handleRemoveOption}
        />
      </div>
    </div>
  );
}