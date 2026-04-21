-- ============================================================================
-- Phase 0: Developer/Agency Form Backend Foundation
-- ============================================================================

-- Workspace role enum
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member');

-- Webhook delivery status enum
CREATE TYPE public.webhook_delivery_status AS ENUM ('pending', 'success', 'failed', 'retrying', 'dead');

-- Submission status enum (inbox)
CREATE TYPE public.submission_status AS ENUM ('new', 'in_progress', 'done', 'archived', 'spam');

-- ============================================================================
-- WORKSPACES
-- ============================================================================
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- WORKSPACE MEMBERS
-- ============================================================================
CREATE TABLE public.workspace_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role public.workspace_role NOT NULL DEFAULT 'member',
  invited_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECURITY DEFINER: workspace membership check (avoids recursive RLS)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = _workspace_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(_workspace_id UUID, _user_id UUID, _role public.workspace_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = _workspace_id
      AND user_id = _user_id
      AND (
        role = _role
        OR (_role = 'member' AND role IN ('admin', 'owner'))
        OR (_role = 'admin' AND role = 'owner')
      )
  );
$$;

-- Workspace policies
CREATE POLICY "Members can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id, auth.uid()));

CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update workspaces"
  ON public.workspaces FOR UPDATE
  USING (public.has_workspace_role(id, auth.uid(), 'admin'));

CREATE POLICY "Owners can delete workspaces"
  ON public.workspaces FOR DELETE
  USING (public.has_workspace_role(id, auth.uid(), 'owner'));

-- Workspace members policies
CREATE POLICY "Members can view their workspace memberships"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Admins can add members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

CREATE POLICY "Admins can update member roles"
  ON public.workspace_members FOR UPDATE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

CREATE POLICY "Admins can remove members"
  ON public.workspace_members FOR DELETE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

-- Auto-add owner as workspace member on workspace creation
CREATE OR REPLACE FUNCTION public.add_workspace_owner_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_workspace_owner_member
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.add_workspace_owner_as_member();

-- ============================================================================
-- WEBHOOK ENDPOINTS
-- ============================================================================
CREATE TABLE public.webhook_endpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  form_id UUID NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_endpoints_form ON public.webhook_endpoints(form_id);
CREATE INDEX idx_webhook_endpoints_workspace ON public.webhook_endpoints(workspace_id);

ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view webhook endpoints"
  ON public.webhook_endpoints FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can create webhook endpoints"
  ON public.webhook_endpoints FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()) AND auth.uid() = created_by);

CREATE POLICY "Members can update webhook endpoints"
  ON public.webhook_endpoints FOR UPDATE
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Admins can delete webhook endpoints"
  ON public.webhook_endpoints FOR DELETE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

-- ============================================================================
-- WEBHOOK DELIVERIES
-- ============================================================================
CREATE TABLE public.webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint_id UUID NOT NULL REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL,
  status public.webhook_delivery_status NOT NULL DEFAULT 'pending',
  attempt INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  response_code INTEGER,
  response_body TEXT,
  request_payload JSONB NOT NULL,
  error_message TEXT,
  next_retry_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_deliveries_endpoint ON public.webhook_deliveries(endpoint_id);
CREATE INDEX idx_webhook_deliveries_submission ON public.webhook_deliveries(submission_id);
CREATE INDEX idx_webhook_deliveries_status ON public.webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_retry ON public.webhook_deliveries(next_retry_at) WHERE status IN ('pending', 'retrying');

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view webhook deliveries"
  ON public.webhook_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.webhook_endpoints we
      WHERE we.id = endpoint_id
        AND public.is_workspace_member(we.workspace_id, auth.uid())
    )
  );

-- ============================================================================
-- ROUTING RULES
-- ============================================================================
CREATE TABLE public.routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  form_id UUID NOT NULL,
  name TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '[]'::JSONB,
  actions JSONB NOT NULL DEFAULT '[]'::JSONB,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_routing_rules_form ON public.routing_rules(form_id);
CREATE INDEX idx_routing_rules_workspace ON public.routing_rules(workspace_id);

ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view routing rules"
  ON public.routing_rules FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can create routing rules"
  ON public.routing_rules FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()) AND auth.uid() = created_by);

CREATE POLICY "Members can update routing rules"
  ON public.routing_rules FOR UPDATE
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Admins can delete routing rules"
  ON public.routing_rules FOR DELETE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

-- ============================================================================
-- SUBMISSION METADATA (inbox)
-- ============================================================================
CREATE TABLE public.submission_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  form_response_id UUID NOT NULL UNIQUE,
  status public.submission_status NOT NULL DEFAULT 'new',
  assigned_to UUID,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submission_metadata_workspace ON public.submission_metadata(workspace_id);
CREATE INDEX idx_submission_metadata_status ON public.submission_metadata(status);
CREATE INDEX idx_submission_metadata_assigned ON public.submission_metadata(assigned_to);
CREATE INDEX idx_submission_metadata_tags ON public.submission_metadata USING GIN(tags);

ALTER TABLE public.submission_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view submission metadata"
  ON public.submission_metadata FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can create submission metadata"
  ON public.submission_metadata FOR INSERT
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can update submission metadata"
  ON public.submission_metadata FOR UPDATE
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Admins can delete submission metadata"
  ON public.submission_metadata FOR DELETE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

-- ============================================================================
-- API TOKENS
-- ============================================================================
CREATE TABLE public.api_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_prefix TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT ARRAY['submissions:write']::TEXT[],
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_tokens_workspace ON public.api_tokens(workspace_id);
CREATE INDEX idx_api_tokens_hash ON public.api_tokens(token_hash);

ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view api tokens"
  ON public.api_tokens FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Admins can create api tokens"
  ON public.api_tokens FOR INSERT
  WITH CHECK (public.has_workspace_role(workspace_id, auth.uid(), 'admin') AND auth.uid() = created_by);

CREATE POLICY "Admins can update api tokens"
  ON public.api_tokens FOR UPDATE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

CREATE POLICY "Admins can delete api tokens"
  ON public.api_tokens FOR DELETE
  USING (public.has_workspace_role(workspace_id, auth.uid(), 'admin'));

-- ============================================================================
-- TIMESTAMP TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_webhook_endpoints_updated_at BEFORE UPDATE ON public.webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_webhook_deliveries_updated_at BEFORE UPDATE ON public.webhook_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_routing_rules_updated_at BEFORE UPDATE ON public.routing_rules
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_submission_metadata_updated_at BEFORE UPDATE ON public.submission_metadata
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();