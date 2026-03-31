
-- Track which guides a user has read
CREATE TABLE public.user_guide_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.technical_guides(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, guide_id)
);

ALTER TABLE public.user_guide_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reads"
  ON public.user_guide_reads FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reads"
  ON public.user_guide_reads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert the 'Estudioso' badge if it doesn't exist
INSERT INTO public.badges (name, description, icon, criteria_type, criteria_value)
VALUES ('Estudioso', 'Leu todos os guias técnicos disponíveis', '📚', 'guides_read', 3)
ON CONFLICT DO NOTHING;
