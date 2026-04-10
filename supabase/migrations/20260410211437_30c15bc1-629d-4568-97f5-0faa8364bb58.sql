
-- Update handle_xp_coin_reward to use 50 XP per FinCoin instead of 100
CREATE OR REPLACE FUNCTION public.handle_xp_coin_reward()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  coins_to_add integer;
BEGIN
  IF NEW.xp_total IS NOT NULL AND OLD.xp_total IS NOT NULL AND NEW.xp_total > OLD.xp_total THEN
    coins_to_add := floor(NEW.xp_total / 50.0) - floor(OLD.xp_total / 50.0);
    IF coins_to_add > 0 THEN
      NEW.fincoins := COALESCE(NEW.fincoins, 0) + coins_to_add;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on profiles
DROP TRIGGER IF EXISTS trg_xp_coin_reward ON public.profiles;
CREATE TRIGGER trg_xp_coin_reward
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_xp_coin_reward();

-- Add day_index column to daily_quests for rotation
ALTER TABLE public.daily_quests ADD COLUMN IF NOT EXISTS day_index integer;
