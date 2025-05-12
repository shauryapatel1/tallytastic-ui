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
}
