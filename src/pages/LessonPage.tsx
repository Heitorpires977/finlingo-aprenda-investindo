import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useCompleteLessonMutation, useLoseHeartMutation, useLesson } from '@/hooks/useGameData';
import { toast } from 'sonner';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { LessonFooter } from '@/components/lesson/LessonFooter';
import { ActivityContent } from '@/components/lesson/ActivityContent';
import { LessonSkeleton } from '@/components/lesson/LessonSkeleton';
import { NoHeartsScreen } from '@/components/lesson/NoHeartsScreen';
import type { Activity } from '@/components/lesson/types';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const completeLesson = useCompleteLessonMutation();
  const loseHeart = useLoseHeartMutation();
  const { data: lesson, isLoading: lessonLoading } = useLesson(id);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [matchSelected, setMatchSelected] = useState<{ side: 'left' | 'right'; idx: number } | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [shuffledRight, setShuffledRight] = useState<number[]>([]);

  useEffect(() => {
    if (profile) setHearts(profile.effectiveHearts ?? profile.hearts);
  }, [profile]);

  const currentActivity = lesson?.activity_data[currentIdx];

  useEffect(() => {
    if (lesson && currentActivity?.type === 'match_pairs' && currentActivity.pairs) {
      const indices = currentActivity.pairs.map((_, i) => i);
      setShuffledRight(indices.sort(() => Math.random() - 0.5));
      setMatchedPairs(new Set());
      setMatchSelected(null);
    }
  }, [currentIdx, lesson]);

  if (!lesson || lessonLoading) return <LessonSkeleton />;

  const activities = lesson.activity_data;
  const progressPct = ((currentIdx + (answered ? 1 : 0)) / activities.length) * 100;

  const checkAnswer = (correct: boolean) => {
    setAnswered(true);
    setIsCorrect(correct);
    if (!correct) {
      setMistakes(m => m + 1);
      setHearts(h => Math.max(0, h - 1));
      loseHeart.mutate();
    }
  };

  const handleMultipleChoice = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    checkAnswer(idx === currentActivity!.correct);
  };

  const handleTrueFalse = (val: boolean) => {
    if (answered) return;
    checkAnswer(val === currentActivity!.correct);
  };

  const handleFillBlank = () => {
    if (answered) return;
    const correct = fillAnswer.trim().toLowerCase() === (currentActivity!.answer ?? '').toLowerCase();
    checkAnswer(correct);
  };

  const handleMatchClick = (side: 'left' | 'right', idx: number) => {
    if (!currentActivity!.pairs) return;
    if (matchedPairs.has(idx) && side === 'left') return;

    if (!matchSelected) {
      setMatchSelected({ side, idx });
    } else if (matchSelected.side === side) {
      setMatchSelected({ side, idx });
    } else {
      const leftIdx = side === 'left' ? idx : matchSelected.idx;
      const rightOriginalIdx = side === 'right' ? idx : matchSelected.idx;

      if (shuffledRight[rightOriginalIdx] === leftIdx) {
        const newMatched = new Set(matchedPairs);
        newMatched.add(leftIdx);
        setMatchedPairs(newMatched);
        if (newMatched.size === currentActivity!.pairs!.length) {
          checkAnswer(true);
        }
      }
      setMatchSelected(null);
    }
  };

  const nextActivity = async () => {
    if (currentIdx + 1 >= activities.length) {
      try {
        const oldXp = profile?.xp_total ?? 0;
        const result = await completeLesson.mutateAsync({ lessonId: id!, mistakes });
        await refetchProfile();
        const coinMsg = result.coinsEarned > 0 ? ` e +${result.coinsEarned} 🪙` : '';
        toast.success(`Lição completa! +${result.xpEarned} XP${coinMsg} 🎉`);

        // Check XP milestone bonus (1 FinCoin per 100 XP crossed)
        const milestoneCoins = Math.floor((oldXp + result.xpEarned) / 100) - Math.floor(oldXp / 100);
        if (milestoneCoins > 0) {
          setTimeout(() => {
            toast('🪙 Parabéns! Você acumulou +100 XP e ganhou 1 FinCoin!', {
              duration: 3000,
              style: {
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
              },
            });
          }, 1500);
        }
      } catch {
        toast.error('Erro ao salvar progresso');
      }
      navigate('/learn');
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setFillAnswer('');
    }
  };

  if (hearts <= 0) return <NoHeartsScreen onBack={() => navigate('/learn')} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LessonHeader hearts={hearts} progressPct={progressPct} onClose={() => navigate('/learn')} />

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6">
        <ActivityContent
          activity={currentActivity!}
          answered={answered}
          isCorrect={isCorrect}
          selectedOption={selectedOption}
          fillAnswer={fillAnswer}
          matchSelected={matchSelected}
          matchedPairs={matchedPairs}
          shuffledRight={shuffledRight}
          onMultipleChoice={handleMultipleChoice}
          onTrueFalse={handleTrueFalse}
          onFillChange={setFillAnswer}
          onFillSubmit={handleFillBlank}
          onMatchClick={handleMatchClick}
        />

        <LessonFooter
          answered={answered}
          isCorrect={isCorrect}
          activity={currentActivity!}
          isLastActivity={currentIdx + 1 >= activities.length}
          isPending={completeLesson.isPending}
          onNext={nextActivity}
        />
      </div>
    </div>
  );
}
