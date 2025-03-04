
import { MoveVertical } from "lucide-react";

export function EmptyFormState() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      <MoveVertical className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 font-medium">Drag and drop fields here</p>
      <p className="text-sm text-gray-400">Or click on a field type above to add it</p>
    </div>
  );
}
