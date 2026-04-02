
CREATE OR REPLACE FUNCTION public.handle_xp_coin_reward()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  coins_to_add integer;
BEGIN
  IF NEW.xp_total IS NOT NULL AND OLD.xp_total IS NOT NULL AND NEW.xp_total > OLD.xp_total THEN
    coins_to_add := floor(NEW.xp_total / 100.0) - floor(OLD.xp_total / 100.0);
    IF coins_to_add > 0 THEN
      NEW.fincoins := COALESCE(NEW.fincoins, 0) + coins_to_add;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_xp_coin_reward
BEFORE UPDATE ON public.profiles
FOR EACH ROW
WHEN (NEW.xp_total IS DISTINCT FROM OLD.xp_total)
EXECUTE FUNCTION public.handle_xp_coin_reward();
