export type FormStep = 'create' | 'build' | 'preview' | 'publish' | 'share' | 'analyze';

export interface StepConfig {
  id: FormStep;
  title: string;
  description: string;
  path: string;
  icon: string;
  isGated?: boolean;
  readinessCheck?: (formData: any) => { isReady: boolean; message?: string };
}

export interface FormNavigationState {
  currentStep: FormStep;
  completedSteps: FormStep[];
  formId: string;
  formStatus: 'draft' | 'published' | 'archived';
}

export const FORM_STEPS: StepConfig[] = [
  {
    id: 'create',
    title: 'Create',
    description: 'Basic form information',
    path: 'create',
    icon: 'Plus',
    readinessCheck: (form) => ({
      isReady: Boolean(form?.title?.trim()),
      message: form?.title?.trim() ? undefined : 'Form title is required'
    })
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Design your form fields',
    path: 'build',
    icon: 'Edit',
    isGated: true,
    readinessCheck: (form) => ({
      isReady: Boolean(form?.sections?.some((s: any) => s.fields?.length > 0)),
      message: form?.sections?.some((s: any) => s.fields?.length > 0) ? undefined : 'Add at least one field'
    })
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Test your form',
    path: 'preview',
    icon: 'Eye',
    isGated: true
  },
  {
    id: 'publish',
    title: 'Publish',
    description: 'Make your form live',
    path: 'publish',
    icon: 'Send',
    isGated: true
  },
  {
    id: 'share',
    title: 'Share',
    description: 'Get your form link',
    path: 'share',
    icon: 'Share2',
    isGated: true,
    readinessCheck: (form) => ({
      isReady: form?.status === 'published',
      message: form?.status === 'published' ? undefined : 'Form must be published first'
    })
  },
  {
    id: 'analyze',
    title: 'Analyze',
    description: 'View responses and insights',
    path: 'analyze',
    icon: 'BarChart3',
    isGated: true,
    readinessCheck: (form) => ({
      isReady: form?.status === 'published',
      message: form?.status === 'published' ? undefined : 'Form must be published to view analytics'
    })
  }
];