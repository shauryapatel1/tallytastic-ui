import { useOutletContext } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";
import { FormPreview } from "@/components/dashboard/form-builder/FormPreview";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function PreviewStep() {
  const { formData } = useOutletContext<ContextType>();
  
  const fieldCount = formData?.sections?.reduce((total: number, section: any) => 
    total + (section.fields?.length || 0), 0) || 0;

  const handleOpenPublicPreview = () => {
    window.open(`/public/form/${formData.id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Preview Your Form
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Test your form before publishing. See how users will experience it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {fieldCount} field{fieldCount !== 1 ? 's' : ''}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenPublicPreview}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
        <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
          <FormPreview fields={[]} />
        </div>
      </div>

      <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
        <p><strong>Testing tips:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Try filling out the form as a user would</li>
          <li>Test required field validation</li>
          <li>Check that conditional logic works correctly</li>
          <li>Verify the form layout looks good on different screen sizes</li>
        </ul>
      </div>
    </div>
  );
}