-- Create form_versions table to store immutable published form snapshots
CREATE TABLE public.form_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  definition_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  title text NOT NULL,
  description text,
  custom_success_message text,
  redirect_url text,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Ensure unique version numbers per form
  UNIQUE (form_id, version_number)
);

-- Enable RLS on form_versions
ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view versions of their own forms
CREATE POLICY "Users can view their own form versions"
  ON public.form_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_versions.form_id
      AND forms.user_id::text = auth.uid()::text
    )
  );

-- Policy: Published form versions are publicly viewable (for public form rendering)
CREATE POLICY "Published form versions are publicly viewable"
  ON public.form_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_versions.form_id
      AND forms.status = 'published'
    )
  );

-- Policy: Users can create versions for their own forms (handled by edge function/service)
CREATE POLICY "Users can create versions for their own forms"
  ON public.form_versions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_versions.form_id
      AND forms.user_id::text = auth.uid()::text
    )
  );

-- Add published_version_id to forms table to track current published version
ALTER TABLE public.forms 
ADD COLUMN published_version_id uuid REFERENCES public.form_versions(id);

-- Add form_version_id to form_responses to track which version was used for submission
ALTER TABLE public.form_responses 
ADD COLUMN form_version_id uuid REFERENCES public.form_versions(id);

-- Create index for efficient lookups
CREATE INDEX idx_form_versions_form_id ON public.form_versions(form_id);
CREATE INDEX idx_form_versions_form_version ON public.form_versions(form_id, version_number);
CREATE INDEX idx_form_responses_version ON public.form_responses(form_version_id);