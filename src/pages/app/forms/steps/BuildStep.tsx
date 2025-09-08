import { useOutletContext } from "react-router-dom";
import { DragDropFormBuilder } from "@/components/dashboard/DragDropFormBuilder";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function BuildStep() {
  const { formData } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Build Your Form
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Add and configure form fields. Drag and drop to reorder.
        </p>
      </div>

      <div className="min-h-[500px]">
        <DragDropFormBuilder onSave={() => {}} />
      </div>
    </div>
  );
}