import { useQuery } from '@tanstack/react-query';
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
}

export function useTechnicalGuides() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['technical_guides', user?.id],
    queryFn: async () => {
      // Fetch all guides (metadata always visible via RLS)
      const { data: guides, error } = await supabase
        .from('technical_guides')
        .select('*')
        .order('created_at');
      if (error) throw error;

      // Fetch user's completed lessons to determine unlock status
      let completedLessonIds = new Set<string>();
      if (user) {
        const { data: progress } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('completed', true);
        completedLessonIds = new Set(progress?.map(p => p.lesson_id) ?? []);
      }

      return (guides as TechnicalGuide[]).map(g => ({
        ...g,
        unlocked: completedLessonIds.has(g.lesson_id),
      }));
    },
    enabled: !!user,
  });
}
