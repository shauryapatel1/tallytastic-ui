import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formService } from "@/lib/formService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Lock, Settings } from "lucide-react";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function PublishStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isPublished, setIsPublished] = useState(formData?.status === 'published');

  const updateStatusMutation = useMutation({
    mutationFn: ({ formId, status }: { formId: string; status: "draft" | "published" | "archived" }) =>
      formService.updateForm(formId, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form', formData.id] });
      toast({
        title: variables.status === 'published' ? "Form published!" : "Form unpublished",
        description: variables.status === 'published' 
          ? "Your form is now live and accepting responses."
          : "Your form has been taken offline."
      });
      setIsPublished(variables.status === 'published');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update form status.",
        variant: "destructive"
      });
    }
  });

  const handleTogglePublish = () => {
    const newStatus = (isPublished ? 'draft' : 'published') as "draft" | "published";
    updateStatusMutation.mutate({
      formId: formData.id,
      status: newStatus
    });
  };

  const fieldCount = formData?.sections?.reduce((total: number, section: any) => 
    total + (section.fields?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Publish Your Form
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Make your form live and start collecting responses.
        </p>
      </div>

      {/* Form Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Form Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Title:</span>
            <p className="font-medium">{formData?.title}</p>
          </div>
          <div>
            <span className="text-gray-500">Fields:</span>
            <p className="font-medium">{fieldCount} field{fieldCount !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <p className="font-medium">{new Date(formData?.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <Badge variant={isPublished ? "default" : "secondary"} className="ml-2">
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Publishing Controls */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublished ? (
              <Globe className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <Label htmlFor="publish-toggle" className="text-base font-medium">
                {isPublished ? "Form is Live" : "Form is Draft"}
              </Label>
              <p className="text-sm text-gray-500">
                {isPublished 
                  ? "Your form is accepting responses from users"
                  : "Your form is not yet visible to users"
                }
              </p>
            </div>
          </div>
          
          <Switch
            id="publish-toggle"
            checked={isPublished}
            onCheckedChange={handleTogglePublish}
            disabled={updateStatusMutation.isPending}
          />
        </div>

        {fieldCount === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Form needs at least one field before publishing
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Publishing Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Publishing Options</h3>
        
        <div className="grid gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Response Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Multiple submissions:</span>
                <span>Allowed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data collection:</span>
                <span>Enabled</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Access Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Visibility:</span>
                <span>Public with link</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Search indexing:</span>
                <span>Disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          {isPublished ? (
            <span className="text-green-600">✓ Form is published and live</span>
          ) : fieldCount > 0 ? (
            <span className="text-amber-600">Ready to publish</span>
          ) : (
            <span className="text-red-600">Add fields before publishing</span>
          )}
        </div>

        <Button 
          onClick={handleTogglePublish}
          disabled={fieldCount === 0 || updateStatusMutation.isPending}
          className={isPublished ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        >
          {updateStatusMutation.isPending 
            ? "Updating..." 
            : isPublished 
            ? "Unpublish Form" 
            : "Publish Form"
          }
        </Button>
      </div>
    </div>
  );
}