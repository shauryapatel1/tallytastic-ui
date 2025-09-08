import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormStep, FORM_STEPS, FormNavigationState } from "@/types/formNavigation";
import { Check, ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormStepNavigationProps {
  navigationState: FormNavigationState;
  formData?: any;
  onStepChange: (step: FormStep) => void;
  className?: string;
}

export function FormStepNavigation({ 
  navigationState, 
  formData, 
  onStepChange, 
  className 
}: FormStepNavigationProps) {
  const navigate = useNavigate();
  
  const getStepStatus = (stepId: FormStep) => {
    const isCompleted = navigationState.completedSteps.includes(stepId);
    const isCurrent = navigationState.currentStep === stepId;
    const stepIndex = FORM_STEPS.findIndex(s => s.id === stepId);
    const currentIndex = FORM_STEPS.findIndex(s => s.id === navigationState.currentStep);
    
    // Check if step is accessible
    const step = FORM_STEPS.find(s => s.id === stepId);
    let isAccessible = true;
    let gateMMessage = '';
    
    if (step?.isGated && stepIndex > currentIndex) {
      // Check previous step completion
      const prevStep = FORM_STEPS[stepIndex - 1];
      if (prevStep?.readinessCheck) {
        const check = prevStep.readinessCheck(formData);
        if (!check.isReady) {
          isAccessible = false;
          gateMMessage = check.message || 'Complete previous step first';
        }
      }
    }
    
    return {
      isCompleted,
      isCurrent,
      isAccessible,
      gateMMessage
    };
  };

  const handleStepClick = (stepId: FormStep) => {
    const status = getStepStatus(stepId);
    if (status.isAccessible) {
      onStepChange(stepId);
      navigate(`/app/forms/${navigationState.formId}/${FORM_STEPS.find(s => s.id === stepId)?.path}`);
    }
  };

  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-4", className)}>
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Form Workflow</h3>
          <Badge variant={
            navigationState.formStatus === 'published' ? 'default' : 
            navigationState.formStatus === 'archived' ? 'secondary' : 'outline'
          }>
            {navigationState.formStatus === 'published' ? 'Published' :
             navigationState.formStatus === 'archived' ? 'Archived' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {FORM_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <Button
              key={step.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto p-3 text-left relative",
                status.isCurrent && "bg-indigo-50 text-indigo-700 border border-indigo-200",
                status.isCompleted && !status.isCurrent && "text-green-700",
                !status.isAccessible && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleStepClick(step.id)}
              disabled={!status.isAccessible}
            >
              <div className="flex items-center gap-3 w-full">
                {/* Step Icon/Status */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2",
                  status.isCompleted ? "bg-green-100 border-green-500" :
                  status.isCurrent ? "bg-indigo-100 border-indigo-500" :
                  !status.isAccessible ? "bg-gray-100 border-gray-300" :
                  "bg-gray-50 border-gray-300"
                )}>
                  {status.isCompleted ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : !status.isAccessible ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <span className={cn(
                      "text-sm font-medium",
                      status.isCurrent ? "text-indigo-600" : "text-gray-500"
                    )}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                  {!status.isAccessible && status.gateMMessage && (
                    <div className="text-xs text-red-500 mt-1">{status.gateMMessage}</div>
                  )}
                </div>

                {/* Current Step Indicator */}
                {status.isCurrent && (
                  <ChevronRight className="w-4 h-4 text-indigo-500" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}