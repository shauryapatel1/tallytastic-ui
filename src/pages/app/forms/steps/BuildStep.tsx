import { useOutletContext } from "react-router-dom";
import { SimplifiedFormBuilder } from "@/components/dashboard/form-builder/SimplifiedFormBuilder";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function BuildStep() {
  const { formData } = useOutletContext<ContextType>();

  const handleSave = async (fields: any[]) => {
    // TODO: Integrate with form API to save fields
    console.log('Saving fields:', fields);
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