import { useLessons, useLessonProgress, useProfile } from '@/hooks/useGameData';
import { useNavigate } from 'react-router-dom';
import { useDailyQuests } from '@/hooks/useGameData';
import { CheckCircle, Lock, Star, Zap, Target, Play } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { allModules } from '@/data/lessons';
import { useMemo, useRef } from 'react';

const SECTION_COLORS = ['bg-primary', 'bg-secondary'];
const SECTION_ICONS = ['💰', '📊'];

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function LearnPage() {
  const { data: lessons, isLoading } = useLessons();
  const { data: progress } = useLessonProgress();
  const { data: profile } = useProfile();
  const { data: quests } = useDailyQuests();
  const navigate = useNavigate();

  const firstIncompleteSectionRef = useRef<HTMLDivElement>(null);
  
  const scrollToCurrentMission = () => {
    firstIncompleteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const todayQuest = useMemo(() => {
    if (!quests || quests.length === 0) return null;
    const dayIndex = getDayOfYear() % quests.length;
    const sorted = [...quests].sort((a, b) => ((a as any).day_index ?? 0) - ((b as any).day_index ?? 0));
    return sorted[dayIndex] || quests[0];
  }, [quests]);

  const moduleSlugMap = useMemo(() => {
    const map = new Map<string, string>();
    allModules.forEach(m => {
      m.lessons.forEach(l => {
        const match = l.title.match(/^(\d+\.\d+)/);
        if (match) map.set(match[1], l.slug);
      });
    });
    return map;
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  const completedIds = new Set(progress?.filter(p => p.completed).map(p => p.lesson_id) ?? []);
  
  const sections = new Map<number, { title: string; lessons: typeof lessons }>();

  lessons?.forEach(l => {
    if (!sections.has(l.section_id)) {
      sections.set(l.section_id, { title: l.section_title, lessons: [] });
    }
    sections.get(l.section_id)!.lessons!.push(l);
  });

  const isLessonUnlocked = (sectionId: number, lessonNumber: number) => {
    if (sectionId === 1 && lessonNumber === 1) return true;
    const sectionLessons = lessons?.filter(l => l.section_id === sectionId) ?? [];
    const prevLesson = sectionLessons.find(l => l.lesson_number === lessonNumber - 1);
    if (prevLesson && completedIds.has(prevLesson.id)) return true;
    if (lessonNumber === 1 && sectionId > 1) {
      const prevSectionLessons = lessons?.filter(l => l.section_id === sectionId - 1) ?? [];
      const lastLesson = prevSectionLessons[prevSectionLessons.length - 1];
      if (lastLesson && completedIds.has(lastLesson.id)) return true;
    }
    return false;
  };

  const getLessonSlug = (title: string): string | null => {
    const match = title.match(/^(\d+\.\d+)/);
    if (match) return moduleSlugMap.get(match[1]) ?? null;
    return null;
  };

  const handleLessonClick = (lesson: any, unlocked: boolean) => {
    if (!unlocked) return;
    const slug = getLessonSlug(lesson.title);
    if (slug) {
      navigate(`/modulo/${slug}`);
    } else {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const isQuestCompleted = todayQuest && profile ? (() => {
    const q = todayQuest as any;
    switch (q.requirement_type) {
      case 'lessons_completed': return (completedIds.size >= q.requirement_value);
      case 'xp_earned': return ((profile.xp_total ?? 0) >= q.requirement_value);
      case 'streak_maintain': return ((profile.streak_current ?? 0) >= q.requirement_value);
      default: return false;
    }
  })() : false;

  return (
    <AppLayout>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={scrollToCurrentMission}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse"
        >
          <Play className="h-5 w-5" />
          <span>Continuar</span>
        </button>
      </div>
      
      <div className="space-y-8">
        {todayQuest && (
          <div className={`bg-card rounded-2xl border p-4 space-y-3 transition-all ${
            isQuestCompleted ? 'animate-quest-complete border-finlingo-coins' : ''
          }`}>
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Target className="h-5 w-5 text-accent" />
              Missão Diária
            </div>
            <div className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
              isQuestCompleted ? 'bg-finlingo-coins/10' : 'bg-muted'
            }`}>
              <span>{(todayQuest as any).description}</span>
              {isQuestCompleted ? (
                <span className="font-bold text-finlingo-coins animate-fade-in">✅ Completa!</span>
              ) : (
                <span className="font-bold text-finlingo-xp">+{(todayQuest as any).xp_reward} XP</span>
              )}
            </div>
          </div>
        )}

        {profile && (
          <div className="bg-card rounded-2xl border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-finlingo-xp" />
                XP Total
              </span>
              <span className="font-black text-finlingo-xp text-xl">{profile.xp_total}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Liga: {profile.league}</span>
              <span>XP Semanal: {profile.xp_weekly}</span>
            </div>
          </div>
        )}

        {Array.from(sections.entries()).map(([sectionId, section], idx) => {
          const firstIncomplete = section.lessons?.find(l => !completedIds.has(l.id));
          const isUnlocked = firstIncomplete ? isLessonUnlocked(sectionId, firstIncomplete.lesson_number) : false;
          const shouldRef = firstIncomplete && isUnlocked && !firstIncompleteSectionRef.current;

          return (
            <div
              key={sectionId}
              className="space-y-4"
              ref={shouldRef ? firstIncompleteSectionRef : undefined}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${SECTION_COLORS[idx % 2]} flex items-center justify-center text-2xl shadow-md`}>
                  {SECTION_ICONS[idx % 2]}
                </div>
                <div>
                  <h2 className="font-black text-lg text-foreground">Seção {sectionId}</h2>
                  <p className="text-sm text-muted-foreground">{section.title}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                {section.lessons?.map((lesson) => {
                  const completed = completedIds.has(lesson.id);
                  const unlocked = isLessonUnlocked(sectionId, lesson.lesson_number);
                  const perfect = progress?.find(p => p.lesson_id === lesson.id)?.perfect;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson, unlocked)}
                      disabled={!unlocked}
                      className={`w-full max-w-sm flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        completed
                          ? 'bg-finlingo-correct/10 border-finlingo-correct shadow-sm'
                          : unlocked
                          ? 'bg-card border-primary/30 hover:border-primary hover:shadow-md cursor-pointer animate-pulse-glow'
                          : 'bg-muted/50 border-border opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
                        completed
                          ? 'bg-finlingo-correct text-primary-foreground'
                          : unlocked
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {completed ? <CheckCircle className="h-6 w-6" /> : unlocked ? lesson.lesson_number : <Lock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm text-foreground">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.is_quiz ? '📝 Quiz' : `📖 ${((lesson.activity_data as unknown[]) || []).length} atividades`} · +{lesson.xp_reward} XP
                        </p>
                      </div>
                      {perfect && <Star className="h-5 w-5 text-finlingo-coins fill-current" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
