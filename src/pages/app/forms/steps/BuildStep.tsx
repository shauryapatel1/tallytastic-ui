import { useOutletContext } from "react-router-dom";
import { SimplifiedFormBuilder } from "@/components/dashboard/form-builder/SimplifiedFormBuilder";
import FormsApi from "@/lib/api/forms";
import { FormDefinition } from "@/types/forms";
import { useToast } from "@/hooks/use-toast";

interface ContextType {
  formData: FormDefinition;
  navigationState: any;
}

export default function BuildStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();

  const handleSave = async (fields: any[]) => {
    try {
      // Update the form with the new fields
      await FormsApi.updateForm(formData.id, {
        sections: [
          {
            id: formData.sections?.[0]?.id || 'section-1',
            title: formData.sections?.[0]?.title || 'Main Section',
            description: formData.sections?.[0]?.description,
            fields: fields
          }
        ]
      });
    } catch (error) {
      console.error('Failed to save form:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not save form changes",
        variant: "destructive"
      });
      throw error; // Re-throw so autosave can handle the error
    }
  };

  return (
    <div className="h-full">
      <SimplifiedFormBuilder 
        initialFields={formData?.sections?.[0]?.fields || []}
        onSave={handleSave}
      />
    </div>
  );
}