
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
