
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
}
