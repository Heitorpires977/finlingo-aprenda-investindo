
CREATE OR REPLACE FUNCTION public.get_effective_hearts(p_hearts INTEGER, p_hearts_updated_at TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT LEAST(5, p_hearts + FLOOR(EXTRACT(EPOCH FROM (NOW() - COALESCE(p_hearts_updated_at, NOW()))) / 1800)::INTEGER);
$$;
