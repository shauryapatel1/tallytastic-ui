
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { FormField } from "./types";
import { FieldEditor } from "./FieldEditor";

interface FormFieldCardProps {
  field: FormField;
  editingField: string | null;
  draggingField: string | null;
  setEditingField: (id: string | null) => void;
  handleDragStart: (id: string) => void;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragEnd: () => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  handleAddOption: (fieldId: string) => void;
  handleUpdateOption: (fieldId: string, index: number, value: string) => void;
  handleRemoveOption: (fieldId: string, index: number) => void;
}

export function FormFieldCard({
  field,
  editingField,
  draggingField,
  setEditingField,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  removeField,
  updateField,
  handleAddOption,
  handleUpdateOption,
  handleRemoveOption
}: FormFieldCardProps) {
  return (
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
          <FieldEditor 
            field={field}
            updateField={updateField}
            handleAddOption={handleAddOption}
            handleUpdateOption={handleUpdateOption}
            handleRemoveOption={handleRemoveOption}
          />
        )}
      </CardContent>
    </Card>
  );
}
