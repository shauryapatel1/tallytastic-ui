import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formService } from "@/lib/formService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ContextType {
  formData: any;
  navigationState: any;
}

export default function CreateStep() {
  const { formData } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formValues, setFormValues] = useState({
    title: formData?.title || '',
    description: formData?.description || ''
  });

  const updateFormMutation = useMutation({
    mutationFn: ({ formId, updates }: { formId: string; updates: any }) =>
      formService.updateForm(formId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formData.id] });
      toast({
        title: "Form updated",
        description: "Your form details have been saved."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update form details.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (!formValues.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a form title.",
        variant: "destructive"
      });
      return;
    }

    updateFormMutation.mutate({
      formId: formData.id,
      updates: {
        title: formValues.title,
        description: formValues.description
      }
    });
  };

  const isFormValid = formValues.title.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Form Details
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Give your form a title and description to get started.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Form Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Contact Form, Survey, Registration"
            value={formValues.title}
            onChange={(e) => setFormValues(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe what this form is for..."
            value={formValues.description}
            onChange={(e) => setFormValues(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          {isFormValid ? (
            <span className="text-green-600">✓ Ready to proceed</span>
          ) : (
            <span className="text-amber-600">Title is required to continue</span>
          )}
        </div>

        <Button 
          onClick={handleSave}
          disabled={!isFormValid || updateFormMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {updateFormMutation.isPending ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}