
-- Drop the existing permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a restrictive UPDATE policy that only allows updating safe fields
-- Game state fields (xp_total, xp_weekly, hearts, fincoins, streak_current, streak_longest, 
-- league, xp_boost_until, last_lesson_date) can ONLY be modified by service_role (edge functions)
CREATE POLICY "Users can update own safe fields"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND xp_total IS NOT DISTINCT FROM (SELECT xp_total FROM public.profiles WHERE id = auth.uid())
  AND xp_weekly IS NOT DISTINCT FROM (SELECT xp_weekly FROM public.profiles WHERE id = auth.uid())
  AND hearts IS NOT DISTINCT FROM (SELECT hearts FROM public.profiles WHERE id = auth.uid())
  AND fincoins IS NOT DISTINCT FROM (SELECT fincoins FROM public.profiles WHERE id = auth.uid())
  AND streak_current IS NOT DISTINCT FROM (SELECT streak_current FROM public.profiles WHERE id = auth.uid())
  AND streak_longest IS NOT DISTINCT FROM (SELECT streak_longest FROM public.profiles WHERE id = auth.uid())
  AND league IS NOT DISTINCT FROM (SELECT league FROM public.profiles WHERE id = auth.uid())
  AND xp_boost_until IS NOT DISTINCT FROM (SELECT xp_boost_until FROM public.profiles WHERE id = auth.uid())
  AND last_lesson_date IS NOT DISTINCT FROM (SELECT last_lesson_date FROM public.profiles WHERE id = auth.uid())
);
