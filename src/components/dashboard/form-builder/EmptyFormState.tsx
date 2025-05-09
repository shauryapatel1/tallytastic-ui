
import { MoveVertical } from "lucide-react";

export function EmptyFormState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <MoveVertical className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">No fields yet</h3>
      <p className="text-gray-500 mb-3">Start building your form by adding fields</p>
      <p className="text-sm text-gray-400">
        Drag and drop fields to reorder them after adding
      </p>
      <div className="flex gap-2 mt-4">
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          1. Add fields from above
        </div>
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          2. Edit field properties
        </div>
        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
          3. Preview and save
        </div>
      </div>
    </div>
  );
}
