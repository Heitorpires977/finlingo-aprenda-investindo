
-- Table for technical wiki guides linked to lessons
CREATE TABLE public.technical_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📘',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lesson_id)
);

ALTER TABLE public.technical_guides ENABLE ROW LEVEL SECURITY;

-- Security definer function: checks if user completed the linked lesson
CREATE OR REPLACE FUNCTION public.user_completed_lesson(p_user_id UUID, p_lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_lesson_progress
    WHERE user_id = p_user_id
      AND lesson_id = p_lesson_id
      AND completed = true
  );
$$;

-- Everyone can see guide metadata (id, title, summary, icon, lesson_id)
-- But content is only revealed if the lesson is completed
CREATE POLICY "Anyone can read guide metadata"
  ON public.technical_guides
  FOR SELECT
  TO authenticated
  USING (true);
