
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

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  user_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  theme?: FormTheme;
  settings?: FormSettings;
}

export interface FormSettings {
  redirectUrl?: string;
  successMessage?: string;
  allowMultipleSubmissions?: boolean;
  captchaEnabled?: boolean;
  notificationEmails?: string[];
}

export interface FormTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  logo?: string;
  customCss?: string;
}

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'textarea' 
  | 'checkbox' 
  | 'select'
  | 'number'
  | 'date'
  | 'phone'
  | 'file'
  | 'rating'
  | 'radio'
  | 'section';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
  defaultValue?: string | string[] | boolean | number;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  style?: {
    width?: string;
    height?: string;
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
  };
  conditional?: {
    fieldId?: string;
    operator?: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value?: string | number | boolean;
  };
}

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
