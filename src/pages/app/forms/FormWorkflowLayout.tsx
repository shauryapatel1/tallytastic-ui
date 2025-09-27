import { Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FormsApi from "@/lib/api/forms";
import { FormStepNavigation } from "@/components/dashboard/form-workflow/FormStepNavigation";
import { FormStepHeader } from "@/components/dashboard/form-workflow/FormStepHeader";
import { useFormNavigation } from "@/hooks/useFormNavigation";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/pages/dashboard/Layout";

export default function FormWorkflowLayout() {
  const { formId } = useParams();
  
  const { data: formData, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => FormsApi.getForm(formId!),
    enabled: !!formId
  });

  const { navigationState, navigateToStep } = useFormNavigation({
    formData,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Form not found</h2>
          <p className="text-gray-500 mt-2">The form you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Step Header */}
        <FormStepHeader 
          navigationState={navigationState}
          formData={formData}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <FormStepNavigation
              navigationState={navigationState}
              formData={formData}
              onStepChange={navigateToStep}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6">
              <Outlet context={{ formData, navigationState }} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}