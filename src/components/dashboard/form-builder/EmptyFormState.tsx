
import { MoveVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyFormState({ onAddFirstField }: { onAddFirstField?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <MoveVertical className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">No fields yet</h3>
      <p className="text-gray-500 mb-3">Start building your form by adding fields</p>
      <p className="text-sm text-gray-400 mb-4">
        Drag and drop fields to reorder them after adding
      </p>
      
      {onAddFirstField && (
        <Button onClick={onAddFirstField} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Add your first field
        </Button>
      )}
      
      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          1. Add fields from above
        </div>
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          2. Edit field properties
        </div>
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          3. Preview and save
        </div>
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          4. Share and collect responses
        </div>
      </div>
    </div>
  );
}
