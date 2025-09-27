-- Add missing tables for templates, analytics, and quotas

-- 1. Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  definition_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Templates are readable by everyone (public templates)
CREATE POLICY "Templates are viewable by everyone" 
ON public.templates 
FOR SELECT 
USING (true);

-- Add indexes for templates
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_created_at ON public.templates(created_at);

-- 2. Create form_events table for analytics
CREATE TABLE public.form_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL,
  session_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'start', 'complete', 'page_next', 'page_back', 'drop_off')),
  at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  meta JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on form_events
ALTER TABLE public.form_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (for tracking)
CREATE POLICY "Anyone can insert form events" 
ON public.form_events 
FOR INSERT 
WITH CHECK (true);

-- Only form owners can read their form events
CREATE POLICY "Users can view events for their forms" 
ON public.form_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.forms 
  WHERE forms.id = form_events.form_id 
  AND forms.user_id::text = auth.uid()::text
));

-- Add indexes for form_events
CREATE INDEX idx_form_events_form_id ON public.form_events(form_id);
CREATE INDEX idx_form_events_event_type ON public.form_events(event_type);
CREATE INDEX idx_form_events_at ON public.form_events(at);
CREATE INDEX idx_form_events_session_id ON public.form_events(session_id);

-- 3. Create quotas table
CREATE TABLE public.quotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  response_limit INTEGER NOT NULL DEFAULT 100,
  last_reset_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on quotas
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;

-- Users can only access their own quotas
CREATE POLICY "Users can view their own quotas" 
ON public.quotas 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own quotas" 
ON public.quotas 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own quotas" 
ON public.quotas 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Add indexes for quotas
CREATE INDEX idx_quotas_user_id ON public.quotas(user_id);
CREATE INDEX idx_quotas_plan ON public.quotas(plan);

-- 4. Add slug field to forms table (non-breaking)
ALTER TABLE public.forms 
ADD COLUMN slug TEXT;

-- Add unique constraint on slug per user
CREATE UNIQUE INDEX idx_forms_user_slug ON public.forms(user_id, slug) WHERE slug IS NOT NULL;

-- Add index for slug lookups
CREATE INDEX idx_forms_slug ON public.forms(slug) WHERE slug IS NOT NULL;

-- 5. Add additional performance indexes for existing tables
CREATE INDEX IF NOT EXISTS idx_forms_status ON public.forms(status);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON public.forms(created_at);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON public.form_responses(submitted_at);

-- 6. Add triggers for updated_at timestamps
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotas_updated_at
  BEFORE UPDATE ON public.quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();