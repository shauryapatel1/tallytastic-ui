
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "./Layout";
import { DragDropFormBuilder } from "@/components/dashboard/DragDropFormBuilder";
import { FormField } from "@/components/dashboard/form-builder/types";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { Link } from "react-router-dom";

// This would normally fetch from an API
const getFormById = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    title: "Sample Form",
    description: "This is a sample form",
    fields: [] as FormField[],
  };
};

const updateForm = async (id: string, fields: FormField[]) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true };
};

export default function FormBuilder() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: form, isLoading, error } = useQuery({
    queryKey: ["form", id],
    queryFn: () => id ? getFormById(id) : Promise.reject("No form ID provided"),
    enabled: !!id,
  });

  const handleSave = async (fields: FormField[]) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateForm(id, fields);
      toast({
        title: "Form saved",
        description: "Your form has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your form",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !form) {
    return (
      <DashboardLayout>
        <div className="h-96 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading form</h2>
          <p className="text-gray-600 mb-4">There was a problem loading this form</p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{form.title}</h1>
              <p className="text-sm text-gray-500">{form.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/dashboard/forms/${id}/preview`}>Preview</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/dashboard/forms/${id}/publish`}>Publish</Link>
            </Button>
            {isSaving && (
              <Button disabled>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
              </Button>
            )}
          </div>
        </div>

        <DragDropFormBuilder 
          initialFields={form.fields} 
          onSave={handleSave} 
        />
      </motion.div>
    </DashboardLayout>
  );
}
