import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormStep, FORM_STEPS, FormNavigationState } from "@/types/formNavigation";
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormStepHeaderProps {
  navigationState: FormNavigationState;
  formData?: any;
  onNext?: () => void;
  onPrevious?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  className?: string;
}

export function FormStepHeader({ 
  navigationState, 
  formData, 
  onNext, 
  onPrevious, 
  onSave,
  isSaving = false,
  className 
}: FormStepHeaderProps) {
  const navigate = useNavigate();
  const currentStep = FORM_STEPS.find(s => s.id === navigationState.currentStep);
  const currentIndex = FORM_STEPS.findIndex(s => s.id === navigationState.currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === FORM_STEPS.length - 1;
  
  // Check if current step is ready for next
  const isReadyForNext = () => {
    if (!currentStep?.readinessCheck) return true;
    return currentStep.readinessCheck(formData).isReady;
  };

  const handleNext = () => {
    if (isReadyForNext() && !isLastStep) {
      const nextStep = FORM_STEPS[currentIndex + 1];
      onNext?.();
      navigate(`/app/forms/${navigationState.formId}/${nextStep.path}`);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = FORM_STEPS[currentIndex - 1];
      onPrevious?.();
      navigate(`/app/forms/${navigationState.formId}/${prevStep.path}`);
    }
  };

  const readinessCheck = currentStep?.readinessCheck?.(formData);

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border">
      {/* Step Info */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentStep?.title}
            </h1>
            <Badge variant="outline" className="text-xs">
              Step {currentIndex + 1} of {FORM_STEPS.length}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">{currentStep?.description}</p>
          {readinessCheck && !readinessCheck.isReady && (
            <p className="text-xs text-amber-600 mt-1">
              {readinessCheck.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Save Button */}
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            disabled={isLastStep || !isReadyForNext()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}