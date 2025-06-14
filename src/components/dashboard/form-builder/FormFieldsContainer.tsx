
import { FormFieldDefinition } from "@/types/forms";
import { FormFieldCard } from "./FormFieldCard";
import { EmptyFormState } from "./EmptyFormState";
import { motion } from "framer-motion";

interface FormFieldsContainerProps {
  fields: FormFieldDefinition[];
  editingField: string | null;
  draggingField: string | null;
  dragOver: string | null;
  setEditingField: (id: string | null) => void;
  handleDragStart: (id: string) => void;
  handleDragOver: (e: React.DragEvent, id: string) => void;
  handleDragEnd: () => void;
  handleDragLeave: () => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormFieldDefinition>) => void;
  handleAddOption: (fieldId: string) => void;
  handleUpdateOption: (fieldId: string, index: number, value: string) => void;
  handleRemoveOption: (fieldId: string, index: number) => void;
  handleDuplicateField: (id: string) => void;
}

export function FormFieldsContainer({
  fields,
  editingField,
  draggingField,
  dragOver,
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
}: FormFieldsContainerProps) {
  if (fields.length === 0) {
    return <EmptyFormState />;
  }

  return (
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
            allFields={fields}
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
  );
}
