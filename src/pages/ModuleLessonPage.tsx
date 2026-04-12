import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useCompleteLessonMutation, useLoseHeartMutation } from '@/hooks/useGameData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { StepRenderer } from '@/components/lesson/StepRenderer';
import { NoHeartsScreen } from '@/components/lesson/NoHeartsScreen';
import { allModules } from '@/data/lessons';

/* ─── Completion Screen ─── */
function CompletionScreen({ title, xpEarned, onContinue }: { title: string; xpEarned: number; onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative inline-block">
          <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-bounce-in">
            <Trophy className="h-16 w-16 text-primary" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -bottom-1 -left-3 h-6 w-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        <h1 className="text-3xl font-black text-foreground">Módulo Concluído! 🎉</h1>
        <p className="text-lg text-muted-foreground font-semibold">{title}</p>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-2xl font-black text-primary">
            +{xpEarned} XP
          </div>
          <p className="text-sm text-muted-foreground">Continue assim e conquiste seu próximo marco!</p>
        </div>

        <div className="flex justify-center gap-3 text-3xl">
          {['🎊', '🏆', '⭐', '🎊'].map((e, i) => (
            <span key={i} className="animate-bounce-in" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
          ))}
        </div>

        <Button onClick={onContinue} size="lg" className="w-full h-14 text-lg font-bold">
          Continuar Aprendendo
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ModuleLessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const completeLesson = useCompleteLessonMutation();
  const loseHeart = useLoseHeartMutation();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepSolved, setStepSolved] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  // Reset legacy progress on first load
  useEffect(() => {
    const resetKey = 'finlingo-progress-reset-v2';
    if (!localStorage.getItem(resetKey)) {
      localStorage.removeItem('lesson-progress');
      localStorage.removeItem('finlingo-lesson-progress');
      localStorage.setItem(resetKey, 'true');
    }
  }, []);

  // Sync hearts from profile
  useEffect(() => {
    if (profile) {
      setHearts(profile.effectiveHearts ?? profile.hearts ?? 0);
      setProfileLoaded(true);
    }
  }, [profile]);

  // Find lesson across all modules
  const lesson = allModules
    .flatMap(m => m.lessons)
    .find(l => {
      const lessonSlug = l.slug || l.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
      return lessonSlug === slug;
    });

  const handleSolved = useCallback(() => {
    setStepSolved(true);
  }, []);

  const handleAnswered = useCallback(() => {
    setAnswered(true);
  }, []);

  const handleWrong = useCallback(() => {
    setHearts(h => Math.max(0, h - 1));
    loseHeart.mutate();
  }, [loseHeart]);

  const handleNext = async () => {
    if (!lesson) return;
    if (currentIdx + 1 >= lesson.steps.length) {
      const totalSteps = lesson.steps.length;
      const earned = totalSteps * 5;
      
      if (user) {
        try {
          const lessonTitle = lesson.title || '';
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('id')
            .ilike('title', `${lessonTitle}%`)
            .limit(1);
          
          if (lessonsData && lessonsData.length > 0) {
            const result = await completeLesson.mutateAsync({
              lessonId: lessonsData[0].id,
              mistakes: 0
            });
            await refetchProfile();
            setXpEarned(result.xpEarned);
          } else {
            setXpEarned(earned);
          }
        } catch (err) {
          console.error('Error saving progress:', err);
          setXpEarned(earned);
        }
      } else {
        setXpEarned(earned);
      }
      
      setCompleted(true);
      toast.success(`Lição completa! +${xpEarned || earned} XP 🎉`);
      return;
    }
    setSlideDirection('left');
    setCurrentIdx(i => i + 1);
    setStepSolved(false);
    setAnswered(false);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🤷</p>
          <h2 className="text-xl font-bold text-foreground">Lição não encontrada</h2>
          <Button onClick={() => navigate('/learn')}>Voltar</Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <CompletionScreen
        title={lesson.title}
        xpEarned={xpEarned}
        onContinue={() => navigate('/learn')}
      />
    );
  }

  const steps = lesson.steps;
  const totalSteps = steps.length;
  const currentStep = steps[currentIdx];
  const isContent = currentStep.type === 'explanation' || currentStep.type === 'example';
  const canContinue = isContent ? stepSolved : answered;
  const progressPct = ((currentIdx + (canContinue ? 1 : 0)) / totalSteps) * 100;

  // Show loading while profile loads (to check hearts)
  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  // Block if no hearts
  if (hearts <= 0) {
    return <NoHeartsScreen onBack={() => navigate('/learn')} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LessonHeader hearts={hearts} progressPct={progressPct} onClose={() => navigate('/learn')} />

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 overflow-hidden">
        <div key={currentIdx} className={slideDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'}>
          <StepRenderer 
            step={currentStep} 
            onSolved={handleSolved} 
            onWrong={handleWrong}
            onAnswered={handleAnswered}
          />
        </div>

        {canContinue && (
          <Button
            onClick={handleNext}
            className="w-full h-12 animate-fade-in"
            variant={stepSolved ? 'success' : 'default'}
          >
            {currentIdx + 1 >= totalSteps ? 'Finalizar Módulo' : 'Continuar'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
