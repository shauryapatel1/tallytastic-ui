import type { FormFieldDefinition, FormSectionDefinition, FormSettings, FormFieldType } from '@/types/forms';

export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
  data: Record<string, any>;
  metadata?: {
    browser?: string;
    os?: string;
    device?: string;
    location?: string;
    referrer?: string;
    completionRate?: number;
    timeSpent?: number;
  };
  analysis?: {
    sentiment?: SentimentAnalysis;
    categories?: string[];
    tags?: string[];
    isAnomaly?: boolean;
    anomalyScore?: number;
  };
}

export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export interface ResponseAnalysis {
  sentiment: SentimentAnalysis;
  categories: string[];
  tags: string[];
  isAnomaly: boolean;
  anomalyScore?: number;
}

// Export FormField and FormTheme for backward compatibility
export type FormField = FormFieldDefinition;
export type FieldType = FormFieldType;

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
}

// The main Form interface, aligned with FormDefinition
export interface Form {
  id: string;
  title: string;
  description?: string;
  sections: FormSectionDefinition[]; // Aligned with FormDefinition
  user_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived'; // Aligned with FormDefinition
  version: number;
  theme?: FormTheme;
  settings?: FormSettings;
}

// Note: The original 'Form' interface had 'fields' and 'published', which are now replaced by 'sections' and 'status'.
// The original 'FormField' and 'FieldType' are removed to avoid duplication with 'src/types/forms.ts'.

export interface AIFormPrompt {
  industry: string;
  purpose: string;
  formType: string;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  form_id: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'draft' | 'paused';
}

export interface WorkflowTrigger {
  type: 'form_submission' | 'scheduled' | 'api_call';
  config: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isTrue' | 'isFalse';
  value: string | number | boolean;
}

export interface WorkflowAction {
  type: 'email' | 'notification' | 'webhook' | 'database' | 'integration' | 'api_call' | 'update_data';
  config: Record<string, any>;
}

export interface PredictiveAnalytics {
  conversionRate: number;
  projectedResponses: number[];
  topPerformingFields: string[];
  dropOffPoints: string[];
  recommendedChanges: string[];
  // Additional fields needed by the PredictiveAnalytics component
  submissionTrends?: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    forecast: number[];
  };
  conversionOptimization?: {
    currentRate: number;
    suggestions: string[];
    predictedImprovement: number;
  };
  timingRecommendations?: {
    bestDaysToPublish: string[];
    bestTimesToPublish: string[];
  };
  audienceInsights?: {
    segments: Array<{
      name: string;
      size: number;
      conversionRate: number;
      averageTimeSpent: number;
    }>;
  };
}

// Form validation types
export interface FormValidationError {
  fieldId: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// Form response analytics for visualization
export interface FormAnalytics {
  totalResponses: number;
  responsesByDate: Record<string, number>;
  browsers: Record<string, number>;
  avgCompletionRate: number | null;
  lastSubmission: string | null;
}

// Form payment integration
export interface PaymentConfig {
  enabled: boolean;
  provider: 'stripe' | 'paypal';
  amount?: number;
  currency?: string;
  productName?: string;
  isSubscription?: boolean;
  recurringInterval?: 'day' | 'week' | 'month' | 'year';
}
