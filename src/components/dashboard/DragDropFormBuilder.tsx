
import { Button } from "@/components/ui/button";
import { DragDropFormBuilderProps } from "./form-builder/types";
import { FieldTypeButtons } from "./form-builder/FieldTypeButtons";
import { FormPreview } from "./form-builder/FormPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormFieldsContainer } from "./form-builder/FormFieldsContainer";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { saveFormDefinition, updateFormDefinition } from "@/services/formDefinitionService";
import { toast } from "@/hooks/use-toast";

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
    handleSave // still available if needed
  } = useFormBuilder({ initialFields, onSave });
  const { user } = useSupabaseUser();

  const handleSaveToSupabase = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save forms.",
        variant: "destructive"
      });
      return;
    }
    const formDef = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: "Untitled Form",
      sections: [
        {
          id: crypto.randomUUID(),
          title: "Section 1",
          description: "",
          fields: fields
        }
      ],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft"
    };
    try {
      await saveFormDefinition(formDef, user.id);
      toast({
        title: "Form saved successfully!",
        description: "Your form has been saved to your account."
      });
      if (onSave) onSave(fields);
    } catch (err: any) {
      toast({
        title: "Save failed",
        description: err.message || "Could not save form. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          onClick={handleSaveToSupabase} 
          disabled={fields.length === 0}
          className="px-6"
        >
          Save Form
        </Button>
      </div>
    </div>
  );
}
