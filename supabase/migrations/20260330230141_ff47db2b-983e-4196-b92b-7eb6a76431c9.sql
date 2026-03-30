
-- Add timestamp to track when hearts were last modified
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hearts_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Function to compute effective hearts with auto-refill (1 per 30 min, max 5)
CREATE OR REPLACE FUNCTION public.get_effective_hearts(p_hearts INTEGER, p_hearts_updated_at TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT LEAST(5, p_hearts + FLOOR(EXTRACT(EPOCH FROM (NOW() - COALESCE(p_hearts_updated_at, NOW()))) / 1800)::INTEGER);
$$;
