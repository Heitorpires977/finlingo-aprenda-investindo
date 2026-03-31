import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TechnicalGuide {
  id: string;
  lesson_id: string;
  title: string;
  summary: string;
  content: string;
  icon: string;
  created_at: string;
  unlocked: boolean;
  read: boolean;
}

export function useTechnicalGuides() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['technical_guides', user?.id],
    queryFn: async () => {
      const { data: guides, error } = await supabase
        .from('technical_guides')
        .select('*')
        .order('created_at');
      if (error) throw error;

      let completedLessonIds = new Set<string>();
      let readGuideIds = new Set<string>();

      if (user) {
        const [progressRes, readsRes] = await Promise.all([
          supabase.from('user_lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true),
          supabase.from('user_guide_reads').select('guide_id').eq('user_id', user.id),
        ]);
        completedLessonIds = new Set(progressRes.data?.map(p => p.lesson_id) ?? []);
        readGuideIds = new Set(readsRes.data?.map(r => r.guide_id) ?? []);
      }

      return (guides as TechnicalGuide[]).map(g => ({
        ...g,
        unlocked: completedLessonIds.has(g.lesson_id),
        read: readGuideIds.has(g.id),
      }));
    },
    enabled: !!user,
  });
}

export function useMarkGuideReadMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guideId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.functions.invoke('mark-guide-read', {
        body: { guideId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as { success: boolean; xpEarned: number; badgeEarned: boolean; alreadyRead?: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical_guides'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user_badges'] });
    },
  });
}
