-- =====================================================================
-- Phase 3A.1 — Core product tables for Ingrid (additive migration)
-- =====================================================================
-- Adds: forms, form_versions, form_responses, form_events,
--       submission_events, profiles, subscribers, user_quota_usage
-- Wires: triggers, FKs, RLS, realtime publication.
-- Safe: no existing tables are dropped or renamed.
-- =====================================================================

-- ---------- profiles ----------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create a profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- forms ----------
CREATE TABLE public.forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled form',
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  published_version_id uuid,
  definition_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_success_message text,
  redirect_url text,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_forms_workspace_id ON public.forms(workspace_id);
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_status ON public.forms(status);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Owner-based policies (legacy compat) + workspace-based policies
CREATE POLICY "Users can view their own forms"
  ON public.forms FOR SELECT
  USING (auth.uid() = user_id OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid())));

CREATE POLICY "Users can insert their own forms"
  ON public.forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON public.forms FOR UPDATE
  USING (auth.uid() = user_id OR (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid())));

CREATE POLICY "Users can delete their own forms"
  ON public.forms FOR DELETE
  USING (auth.uid() = user_id OR (workspace_id IS NOT NULL AND public.has_workspace_role(workspace_id, auth.uid(), 'admin')));

-- Public can read published forms (for public form rendering)
CREATE POLICY "Published forms are publicly readable"
  ON public.forms FOR SELECT
  USING (status = 'published');

CREATE TRIGGER forms_set_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ---------- form_versions ----------
CREATE TABLE public.form_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  title text NOT NULL,
  description text,
  definition_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (form_id, version_number)
);

CREATE INDEX idx_form_versions_form_id ON public.form_versions(form_id);

ALTER TABLE public.form_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Form owners can view versions"
  ON public.form_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_versions.form_id
      AND (f.user_id = auth.uid()
        OR (f.workspace_id IS NOT NULL AND public.is_workspace_member(f.workspace_id, auth.uid())))
  ));

CREATE POLICY "Form owners can create versions"
  ON public.form_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_versions.form_id AND f.user_id = auth.uid()
  ));

-- Versions of published forms are publicly readable (for public form rendering)
CREATE POLICY "Published form versions are publicly readable"
  ON public.form_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_versions.form_id AND f.status = 'published'
  ));

-- Add the FK from forms.published_version_id now that form_versions exists
ALTER TABLE public.forms
  ADD CONSTRAINT forms_published_version_fkey
  FOREIGN KEY (published_version_id) REFERENCES public.form_versions(id) ON DELETE SET NULL;

-- ---------- form_responses ----------
CREATE TABLE public.form_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  form_version_id uuid REFERENCES public.form_versions(id) ON DELETE SET NULL,
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_form_responses_form_id ON public.form_responses(form_id);
CREATE INDEX idx_form_responses_workspace_id ON public.form_responses(workspace_id);
CREATE INDEX idx_form_responses_submitted_at ON public.form_responses(submitted_at DESC);

ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- Form owners (and workspace members) can read responses
CREATE POLICY "Form owners can view responses"
  ON public.form_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_responses.form_id
      AND (f.user_id = auth.uid()
        OR (f.workspace_id IS NOT NULL AND public.is_workspace_member(f.workspace_id, auth.uid())))
  ));

CREATE POLICY "Form owners can delete responses"
  ON public.form_responses FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_responses.form_id
      AND (f.user_id = auth.uid()
        OR (f.workspace_id IS NOT NULL AND public.has_workspace_role(f.workspace_id, auth.uid(), 'admin')))
  ));

-- NOTE: anonymous inserts are intentionally NOT allowed here.
-- All public submissions go through the `submit-form` edge function which
-- uses the service role and bypasses RLS.

-- ---------- form_events ----------
CREATE TABLE public.form_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  session_id text,
  event_type text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_form_events_form_id ON public.form_events(form_id);
CREATE INDEX idx_form_events_created_at ON public.form_events(created_at DESC);
CREATE INDEX idx_form_events_event_type ON public.form_events(event_type);

ALTER TABLE public.form_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (these are anonymous interaction events from public forms)
CREATE POLICY "Anyone can insert form events"
  ON public.form_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Form owners can view events"
  ON public.form_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.forms f
    WHERE f.id = form_events.form_id
      AND (f.user_id = auth.uid()
        OR (f.workspace_id IS NOT NULL AND public.is_workspace_member(f.workspace_id, auth.uid())))
  ));

-- ---------- submission_events (inbox audit log) ----------
CREATE TABLE public.submission_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_response_id uuid NOT NULL REFERENCES public.form_responses(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id uuid,
  event_type text NOT NULL, -- received | status_changed | note_added | tag_added | assigned | webhook_resent | routing_fired
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_submission_events_response_id ON public.submission_events(form_response_id);
CREATE INDEX idx_submission_events_workspace_id ON public.submission_events(workspace_id);
CREATE INDEX idx_submission_events_created_at ON public.submission_events(created_at DESC);

ALTER TABLE public.submission_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view submission events"
  ON public.submission_events FOR SELECT
  USING (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert submission events"
  ON public.submission_events FOR INSERT
  WITH CHECK (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()));

-- ---------- subscribers (Stripe) ----------
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  stripe_customer_id text,
  subscribed boolean NOT NULL DEFAULT false,
  subscription_tier text,
  subscription_end timestamptz,
  product_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX idx_subscribers_stripe_customer_id ON public.subscribers(stripe_customer_id);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscribers FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/UPDATE only via service role (edge functions). No client policies.

CREATE TRIGGER subscribers_set_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ---------- user_quota_usage ----------
CREATE TABLE public.user_quota_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL DEFAULT 'free',
  response_limit integer NOT NULL DEFAULT 100,
  responses_used integer NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL DEFAULT date_trunc('month', now()),
  period_end timestamptz NOT NULL DEFAULT (date_trunc('month', now()) + interval '1 month'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_start)
);

CREATE INDEX idx_user_quota_user_id ON public.user_quota_usage(user_id);

ALTER TABLE public.user_quota_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quota"
  ON public.user_quota_usage FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/UPDATE handled by service role (edge functions).

CREATE TRIGGER user_quota_set_updated_at
  BEFORE UPDATE ON public.user_quota_usage
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ---------- Wire submission_metadata + webhook_deliveries to form_responses ----------
ALTER TABLE public.submission_metadata
  ADD CONSTRAINT submission_metadata_form_response_fkey
  FOREIGN KEY (form_response_id) REFERENCES public.form_responses(id) ON DELETE CASCADE;

ALTER TABLE public.webhook_deliveries
  ADD CONSTRAINT webhook_deliveries_submission_fkey
  FOREIGN KEY (submission_id) REFERENCES public.form_responses(id) ON DELETE CASCADE;

-- ---------- Trigger: auto-create submission_metadata + 'received' event ----------
CREATE OR REPLACE FUNCTION public.handle_new_form_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id uuid;
BEGIN
  -- Resolve workspace_id from the parent form if not already set
  IF NEW.workspace_id IS NULL THEN
    SELECT workspace_id INTO v_workspace_id FROM public.forms WHERE id = NEW.form_id;
    NEW.workspace_id := v_workspace_id;
  ELSE
    v_workspace_id := NEW.workspace_id;
  END IF;

  -- Only create inbox metadata for workspace-scoped forms
  IF v_workspace_id IS NOT NULL THEN
    INSERT INTO public.submission_metadata (form_response_id, workspace_id, status)
    VALUES (NEW.id, v_workspace_id, 'new')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.submission_events (form_response_id, workspace_id, event_type, payload)
    VALUES (NEW.id, v_workspace_id, 'received', jsonb_build_object('form_id', NEW.form_id));
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER form_responses_after_insert
  BEFORE INSERT ON public.form_responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_form_response();

-- ---------- Realtime publication ----------
ALTER TABLE public.form_responses REPLICA IDENTITY FULL;
ALTER TABLE public.submission_metadata REPLICA IDENTITY FULL;
ALTER TABLE public.submission_events REPLICA IDENTITY FULL;
ALTER TABLE public.webhook_deliveries REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.form_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submission_metadata;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submission_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.webhook_deliveries;