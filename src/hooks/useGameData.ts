import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRef } from 'react';

// Compute effective hearts client-side for display (server is source of truth)
function computeEffectiveHearts(hearts: number, heartsUpdatedAt: string | null): number {
  if (hearts >= 5) return 5;
  const elapsed = Date.now() - new Date(heartsUpdatedAt ?? Date.now()).getTime();
  return Math.min(5, hearts + Math.floor(elapsed / (30 * 60 * 1000)));
}

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
  hearts_updated_at: string | null;
  fincoins: number;
  league: string;
  xp_boost_until: string | null;
  last_lesson_date: string | null;
  // Computed
  effectiveHearts?: number;
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
      const profile = data as Profile;
      profile.effectiveHearts = computeEffectiveHearts(profile.hearts, profile.hearts_updated_at);
      return profile;
    },
    enabled: !!user,
    refetchInterval: 60000, // Refresh every minute to update heart auto-refill display
  });
}

// Only for safe fields: username, avatar_id, objective, level, daily_goal_minutes
export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Pick<Partial<Profile>, 'username' | 'avatar_id' | 'objective' | 'level' | 'daily_goal_minutes'>) => {
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

// Server-side validated lesson completion
export function useCompleteLessonMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, mistakes }: { lessonId: string; mistakes: number }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('complete-lesson', {
        body: { lessonId, mistakes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as { success: boolean; xpEarned: number; coinsEarned: number; perfect: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['lesson_progress'] });
    },
  });
}

// Server-side validated heart loss
export function useLoseHeartMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.functions.invoke('lose-heart', {
        body: {},
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as { success: boolean; hearts: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Server-side validated shop purchase
export function useShopPurchaseMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemType: string) => {
      if (!user) throw new Error('Not authenticated');
      const idempotencyKey = crypto.randomUUID();
      const { data, error } = await supabase.functions.invoke('shop-purchase', {
        body: { itemType, idempotencyKey },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
