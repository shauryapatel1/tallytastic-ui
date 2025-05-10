export interface Form {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  published: boolean;
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  configured: boolean;
  settings: Record<string, any>;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
  logo?: string;
}

export interface FormSettings {
  notifications: {
    onSubmission: boolean;
    emailAddresses: string[];
  };
  behavior: {
    redirectUrl?: string;
    successMessage?: string;
    allowMultipleSubmissions: boolean;
    captchaEnabled: boolean;
  };
  theme: FormTheme;
  integrations: string[]; // IDs of enabled integrations for this form
}

export interface AIFormPrompt {
  industry?: string;
  purpose?: string;
  formType?: string;
  additionalInfo?: string;
}

export interface AIFormSuggestion {
  title: string;
  description: string;
  fields: FormField[];
}

// New interfaces for Response Intelligence
export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
  data: Record<string, any>;
  metadata: ResponseMetadata;
  analysis?: ResponseAnalysis;
}

export interface ResponseMetadata {
  browser?: string;
  device?: string;
  location?: string;
  referrer?: string;
  timeSpent?: number; // in seconds
  completionRate?: number; // percentage
}

export interface ResponseAnalysis {
  sentiment?: SentimentAnalysis;
  categories?: string[];
  isAnomaly?: boolean;
  anomalyScore?: number;
  keyInsights?: string[];
  tags?: string[];
}

export interface SentimentAnalysis {
  score: number; // -1 to 1, where -1 is negative, 0 is neutral, 1 is positive
  label: 'negative' | 'neutral' | 'positive';
  confidence: number; // 0 to 1
}

export interface ResponseSummary {
  totalResponses: number;
  averageCompletionTime: number;
  completionRate: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  anomalyRate: number;
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
  status: 'active' | 'inactive' | 'draft';
}

export interface WorkflowTrigger {
  type: 'form_submission' | 'form_field_update' | 'scheduled' | 'api_call';
  config: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface WorkflowAction {
  type: 'email' | 'notification' | 'api_call' | 'update_data' | 'generate_document' | 'assign_tag';
  config: Record<string, any>;
}

export interface PredictiveAnalytics {
  submissionTrends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    forecast: number[];
  };
  conversionOptimization: {
    currentRate: number;
    suggestions: string[];
    predictedImprovement: number;
  };
  timingRecommendations: {
    bestDaysToPublish: string[];
    bestTimesToPublish: string[];
  };
  audienceInsights: {
    segments: Array<{
      name: string;
      size: number;
      conversionRate: number;
      averageTimeSpent: number;
    }>;
  };
}
