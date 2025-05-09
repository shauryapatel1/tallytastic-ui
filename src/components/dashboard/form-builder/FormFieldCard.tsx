
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, GripVertical, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { FormField } from "./types";
import { FieldEditor } from "./FieldEditor";
import { useState } from "react";

interface FormFieldCardProps {
  field: FormField;
  editingField: string | null;
  draggingField: string | null;
  isDraggedOver: boolean;
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
  const [expanded, setExpanded] = useState(false);
  
  // Function to toggle field expansion
  const toggleExpanded = () => {
    if (editingField === field.id) {
      setEditingField(null);
    } else {
      setEditingField(field.id);
    }
    setExpanded(!expanded);
  };

  return (
    <Card 
      key={field.id}
      className={`relative transition-all duration-200 ${
        draggingField === field.id ? 'opacity-50' : ''
      } ${
        isDraggedOver ? 'border-2 border-indigo-500' : ''
      }`}
      draggable
      onDragStart={() => handleDragStart(field.id)}
      onDragOver={(e) => handleDragOver(e, field.id)}
      onDragEnd={handleDragEnd}
      onDragLeave={handleDragLeave}
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
              onClick={() => handleDuplicateField(field.id)}
              className="text-gray-500 hover:text-indigo-700"
            >
              <Copy size={16} />
              <span className="sr-only">Duplicate</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="text-gray-500 hover:text-gray-700"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span className="sr-only">{expanded ? 'Collapse' : 'Expand'}</span>
            </Button>
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
