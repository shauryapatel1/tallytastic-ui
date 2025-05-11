
-- Create the form_responses table
CREATE TABLE IF NOT EXISTS public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  response_data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to form_responses
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- Policy to allow form owners to read responses for their forms
CREATE POLICY "form_owners_can_read_responses" ON public.form_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_responses.form_id
      AND forms.user_id = auth.uid()
    )
  );

-- Public can submit responses to published forms
CREATE POLICY "public_can_insert_responses_to_published_forms" ON public.form_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms
      WHERE forms.id = form_responses.form_id
      AND forms.published = true
    )
  );
