-- The previous trigger ran BEFORE INSERT and tried to write child rows
-- (submission_metadata + submission_events) that FK back to form_responses.
-- That caused a chicken-and-egg FK violation. Switch to a two-step approach:
--   1. BEFORE INSERT: just resolve workspace_id from the parent form.
--   2. AFTER INSERT: create the inbox metadata + 'received' event.

DROP TRIGGER IF EXISTS form_responses_after_insert ON public.form_responses;
DROP FUNCTION IF EXISTS public.handle_new_form_response();

-- Step 1: resolve workspace_id before insert
CREATE OR REPLACE FUNCTION public.resolve_form_response_workspace()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.workspace_id IS NULL THEN
    SELECT workspace_id INTO NEW.workspace_id
    FROM public.forms WHERE id = NEW.form_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER form_responses_resolve_workspace
  BEFORE INSERT ON public.form_responses
  FOR EACH ROW EXECUTE FUNCTION public.resolve_form_response_workspace();

-- Step 2: create inbox metadata + received event after insert
CREATE OR REPLACE FUNCTION public.create_inbox_records()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.workspace_id IS NOT NULL THEN
    INSERT INTO public.submission_metadata (form_response_id, workspace_id, status)
    VALUES (NEW.id, NEW.workspace_id, 'new')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.submission_events (form_response_id, workspace_id, event_type, payload)
    VALUES (NEW.id, NEW.workspace_id, 'received', jsonb_build_object('form_id', NEW.form_id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER form_responses_create_inbox
  AFTER INSERT ON public.form_responses
  FOR EACH ROW EXECUTE FUNCTION public.create_inbox_records();