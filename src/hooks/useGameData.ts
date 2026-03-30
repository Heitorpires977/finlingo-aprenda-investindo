import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  username: string | null;
  avatar_id: number | null;
  objective: string | null;
  level: string | null;
  daily_goal_minutes: number | null;
  xp_total: number;
  xp_weekly: number;
  streak_current: number;
  streak_longest: number;
  hearts: number;
  fincoins: number;
  league: string;
  xp_boost_until: string | null;
  last_lesson_date: string | null;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}

export function useLessons(sectionId?: number) {
  return useQuery({
    queryKey: ['lessons', sectionId],
    queryFn: async () => {
      let query = supabase.from('lessons').select('*').order('section_id').order('lesson_number');
      if (sectionId) query = query.eq('section_id', sectionId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useLessonProgress() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lesson_progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCompleteLessonMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, perfect, xpEarned }: { lessonId: string; perfect: boolean; xpEarned: number }) => {
      if (!user) throw new Error('Not authenticated');

      // Upsert lesson progress
      const { error: progressError } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          perfect,
          attempts: 1,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' });
      if (progressError) throw progressError;

      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!profile) throw new Error('Profile not found');

      // Check XP boost
      let multiplier = 1;
      if (profile.xp_boost_until && new Date(profile.xp_boost_until) > new Date()) {
        multiplier = 2;
      }

      const totalXp = xpEarned * multiplier;
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = profile.last_lesson_date !== today;

      const updates: Record<string, unknown> = {
        xp_total: profile.xp_total + totalXp,
        xp_weekly: profile.xp_weekly + totalXp,
        last_lesson_date: today,
      };

      if (isNewDay) {
        updates.streak_current = profile.streak_current + 1;
        if (profile.streak_current + 1 > profile.streak_longest) {
          updates.streak_longest = profile.streak_current + 1;
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['lesson_progress'] });
    },
  });
}

export function useDailyQuests() {
  return useQuery({
    queryKey: ['daily_quests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('daily_quests').select('*');
      if (error) throw error;
      return data;
    },
  });
}

export function useUserBadges() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user_badges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, xp_weekly, league, avatar_id')
        .order('xp_weekly', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}
