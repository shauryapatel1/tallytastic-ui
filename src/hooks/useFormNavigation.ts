import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormStep, FormNavigationState, FORM_STEPS } from '@/types/formNavigation';
import { useToast } from '@/hooks/use-toast';

interface UseFormNavigationProps {
  formData?: any;
  onStepChange?: (step: FormStep) => void;
}

export function useFormNavigation({ formData, onStepChange }: UseFormNavigationProps = {}) {
  const { formId, step: currentStepParam } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const getCurrentStep = (): FormStep => {
    const step = FORM_STEPS.find(s => s.path === currentStepParam);
    return step?.id || 'create';
  };

  const [navigationState, setNavigationState] = useState<FormNavigationState>({
    currentStep: getCurrentStep(),
    completedSteps: [],
    formId: formId || '',
    formStatus: formData?.status || 'draft'
  });

  const updateNavigationState = useCallback((updates: Partial<FormNavigationState>) => {
    setNavigationState(prev => ({ ...prev, ...updates }));
  }, []);

  const navigateToStep = useCallback((stepId: FormStep) => {
    const step = FORM_STEPS.find(s => s.id === stepId);
    if (!step) return;

    // Check if step is gated and validate readiness
    if (step.isGated) {
      const currentStepIndex = FORM_STEPS.findIndex(s => s.id === navigationState.currentStep);
      const targetStepIndex = FORM_STEPS.findIndex(s => s.id === stepId);
      
      // Check if trying to skip ahead
      if (targetStepIndex > currentStepIndex + 1) {
        // Validate all steps in between
        for (let i = currentStepIndex; i < targetStepIndex; i++) {
          const checkStep = FORM_STEPS[i];
          if (checkStep.readinessCheck) {
            const result = checkStep.readinessCheck(formData);
            if (!result.isReady) {
              toast({
                title: "Step not ready",
                description: result.message || `Complete ${checkStep.title} first`,
                variant: "destructive"
              });
              return;
            }
          }
        }
      }
    }

    // Update state and navigate
    updateNavigationState({ 
      currentStep: stepId,
      completedSteps: [...new Set([...navigationState.completedSteps, navigationState.currentStep])]
    });
    
    onStepChange?.(stepId);
    navigate(`/app/forms/${formId}/${step.path}`);
  }, [navigationState, formData, formId, navigate, toast, onStepChange, updateNavigationState]);

  const markStepCompleted = useCallback((stepId: FormStep) => {
    updateNavigationState({
      completedSteps: [...new Set([...navigationState.completedSteps, stepId])]
    });
  }, [navigationState.completedSteps, updateNavigationState]);

  const validateCurrentStep = useCallback(() => {
    const currentStep = FORM_STEPS.find(s => s.id === navigationState.currentStep);
    if (!currentStep?.readinessCheck) return { isReady: true };
    
    return currentStep.readinessCheck(formData);
  }, [navigationState.currentStep, formData]);

  const canProceedToNext = useCallback(() => {
    const validation = validateCurrentStep();
    return validation.isReady;
  }, [validateCurrentStep]);

  const getNextStep = useCallback(() => {
    const currentIndex = FORM_STEPS.findIndex(s => s.id === navigationState.currentStep);
    return currentIndex < FORM_STEPS.length - 1 ? FORM_STEPS[currentIndex + 1].id : null;
  }, [navigationState.currentStep]);

  const getPreviousStep = useCallback(() => {
    const currentIndex = FORM_STEPS.findIndex(s => s.id === navigationState.currentStep);
    return currentIndex > 0 ? FORM_STEPS[currentIndex - 1].id : null;
  }, [navigationState.currentStep]);

  return {
    navigationState,
    navigateToStep,
    markStepCompleted,
    validateCurrentStep,
    canProceedToNext,
    getNextStep,
    getPreviousStep,
    updateNavigationState
  };
}