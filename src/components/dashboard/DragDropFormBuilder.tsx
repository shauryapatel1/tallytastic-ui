
import { Button } from "@/components/ui/button";
import { DragDropFormBuilderProps } from "./form-builder/types";
import { FieldTypeButtons } from "./form-builder/FieldTypeButtons";
import { FormPreview } from "./form-builder/FormPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFieldsContainer } from "./form-builder/FormFieldsContainer";
import { useFormBuilder } from "@/hooks/useFormBuilder";

export function DragDropFormBuilder({ initialFields = [], onSave }: DragDropFormBuilderProps) {
  const {
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
  } = useFormBuilder({ initialFields, onSave });

  return (
    <div className="space-y-6 w-full mx-auto">
      <Tabs 
        defaultValue="build" 
        className="w-full" 
        onValueChange={(value) => setActiveTab(value as "build" | "preview")}
      >
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
              <FormFieldsContainer 
                fields={fields}
                editingField={editingField}
                draggingField={draggingField}
                dragOver={dragOver}
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
                handleDuplicateField={duplicateField}
              />
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
