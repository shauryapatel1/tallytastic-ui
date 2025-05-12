
import { FormField } from "@/lib/types";

interface SectionFieldProps {
  field: FormField;
}

export function SectionField({ field }: SectionFieldProps) {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <h3 className="text-lg font-medium">{field.label}</h3>
      {field.description && (
        <p className="text-sm text-gray-600 mt-1">{field.description}</p>
      )}
    </div>
  );
}
