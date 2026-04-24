DROP POLICY IF EXISTS "Anyone can insert form events" ON public.form_events;

CREATE POLICY "Anyone can insert events for existing forms"
  ON public.form_events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.forms f WHERE f.id = form_events.form_id));