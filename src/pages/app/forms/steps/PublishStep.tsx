import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FormsApi from "@/lib/api/forms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Lock, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { checkFormReadiness } from "@/lib/formReadinessCheck";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function PublishStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isPublished, setIsPublished] = useState(formData?.status === 'published');

  // Check form readiness
  const readinessCheck = useMemo(() => {
    if (!formData) return { isReady: false, issues: [] };
    return checkFormReadiness(formData);
  }, [formData]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ formId, status }: { formId: string; status: "draft" | "published" | "archived" }) =>
      FormsApi.updateForm(formId, { status }),
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
    // Prevent publishing if form has readiness issues
    if (!isPublished && !readinessCheck.isReady) {
      toast({
        title: "Cannot publish form",
        description: "Please fix the issues listed below before publishing.",
        variant: "destructive"
      });
      return;
    }

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

      </div>

      {/* Readiness Checks */}
      {!isPublished && readinessCheck.issues.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Readiness Checks</h3>
          {readinessCheck.issues.map((issue, idx) => (
            <Alert key={idx} variant={issue.type === 'error' ? 'destructive' : 'default'}>
              {issue.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              <AlertTitle>{issue.type === 'error' ? 'Error' : 'Warning'}</AlertTitle>
              <AlertDescription>{issue.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Success indicator */}
      {!isPublished && readinessCheck.isReady && fieldCount > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Ready to publish</AlertTitle>
          <AlertDescription>
            Your form has passed all readiness checks and is ready to go live.
          </AlertDescription>
        </Alert>
      )}

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
        <div className="text-sm">
          {isPublished ? (
            <span className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Form is published and live
            </span>
          ) : readinessCheck.isReady && fieldCount > 0 ? (
            <span className="text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ready to publish
            </span>
          ) : (
            <span className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {readinessCheck.issues.filter(i => i.type === 'error').length} issue(s) to fix
            </span>
          )}
        </div>

        <Button 
          onClick={handleTogglePublish}
          disabled={(!isPublished && !readinessCheck.isReady) || updateStatusMutation.isPending}
          className={isPublished ? "bg-destructive hover:bg-destructive/90" : ""}
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