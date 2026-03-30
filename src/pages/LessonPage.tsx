import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useCompleteLessonMutation, useLoseHeartMutation } from '@/hooks/useGameData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Heart, X, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  type: string;
  question: string;
  options?: string[];
  correct?: number | boolean;
  answer?: string;
  explanation?: string;
  pairs?: { left: string; right: string }[];
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const completeLesson = useCompleteLessonMutation();

  const [lesson, setLesson] = useState<{ title: string; xp_reward: number; activity_data: Activity[]; is_quiz: boolean } | null>(null);
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
    if (!id) return;
    supabase.from('lessons').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setLesson({
          title: data.title,
          xp_reward: data.xp_reward ?? 10,
          activity_data: data.activity_data as unknown as Activity[],
          is_quiz: data.is_quiz ?? false,
        });
      }
    });
  }, [id]);

  useEffect(() => {
    if (profile) setHearts(profile.hearts);
  }, [profile]);

  useEffect(() => {
    if (lesson && currentActivity?.type === 'match_pairs' && currentActivity.pairs) {
      const indices = currentActivity.pairs.map((_, i) => i);
      setShuffledRight(indices.sort(() => Math.random() - 0.5));
      setMatchedPairs(new Set());
      setMatchSelected(null);
    }
  }, [currentIdx, lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando lição...</div>
      </div>
    );
  }

  const activities = lesson.activity_data;
  const currentActivity = activities[currentIdx];
  const progressPct = ((currentIdx + (answered ? 1 : 0)) / activities.length) * 100;

  const loseHeart = useLoseHeartMutation();

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
    checkAnswer(idx === currentActivity.correct);
  };

  const handleTrueFalse = (val: boolean) => {
    if (answered) return;
    checkAnswer(val === currentActivity.correct);
  };

  const handleFillBlank = () => {
    if (answered) return;
    const correct = fillAnswer.trim().toLowerCase() === (currentActivity.answer ?? '').toLowerCase();
    checkAnswer(correct);
  };

  const handleMatchClick = (side: 'left' | 'right', idx: number) => {
    if (!currentActivity.pairs) return;
    if (matchedPairs.has(idx) && side === 'left') return;

    if (!matchSelected) {
      setMatchSelected({ side, idx });
    } else if (matchSelected.side === side) {
      setMatchSelected({ side, idx });
    } else {
      // Check if pair matches
      const leftIdx = side === 'left' ? idx : matchSelected.idx;
      const rightOriginalIdx = side === 'right' ? idx : matchSelected.idx;

      if (shuffledRight[rightOriginalIdx] === leftIdx) {
        const newMatched = new Set(matchedPairs);
        newMatched.add(leftIdx);
        setMatchedPairs(newMatched);
        if (newMatched.size === currentActivity.pairs.length) {
          checkAnswer(true);
        }
      }
      setMatchSelected(null);
    }
  };

  const nextActivity = async () => {
    if (currentIdx + 1 >= activities.length) {
      try {
        const result = await completeLesson.mutateAsync({ lessonId: id!, mistakes });
        await refetchProfile();
        toast.success(`Lição completa! +${result.xpEarned} XP 🎉`);
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

  if (hearts <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-6">
        <Heart className="h-20 w-20 text-finlingo-hearts" />
        <h2 className="text-2xl font-black text-foreground">Sem corações!</h2>
        <p className="text-muted-foreground">Aguarde a recarga automática ou use FinCoins na loja.</p>
        <Button onClick={() => navigate('/learn')}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b px-4 py-3 space-y-2 z-40">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/learn')} className="text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-1 text-finlingo-hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} className={`h-5 w-5 ${i < hearts ? 'fill-current' : 'opacity-30'}`} />
            ))}
          </div>
        </div>
        <Progress value={progressPct} className="h-3 rounded-full" />
      </div>

      {/* Activity */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6">
        <h2 className="text-xl font-black text-foreground animate-slide-up">{currentActivity.question}</h2>

        {/* Multiple Choice */}
        {currentActivity.type === 'multiple_choice' && currentActivity.options && (
          <div className="space-y-3">
            {currentActivity.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMultipleChoice(i)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all ${
                  answered && i === currentActivity.correct
                    ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                    : answered && i === selectedOption && !isCorrect
                    ? 'bg-finlingo-wrong/10 border-finlingo-wrong text-foreground'
                    : selectedOption === i
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border hover:border-primary/50 bg-card text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* True/False */}
        {currentActivity.type === 'true_false' && (
          <div className="flex gap-4">
            {[
              { label: 'Verdadeiro', value: true },
              { label: 'Falso', value: false },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleTrueFalse(value)}
                disabled={answered}
                className={`flex-1 p-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                  answered && value === currentActivity.correct
                    ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                    : answered && value !== currentActivity.correct
                    ? 'bg-finlingo-wrong/10 border-finlingo-wrong text-foreground opacity-50'
                    : 'border-border hover:border-primary/50 bg-card text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentActivity.type === 'fill_blank' && (
          <div className="space-y-4">
            <Input
              value={fillAnswer}
              onChange={e => setFillAnswer(e.target.value)}
              placeholder="Digite sua resposta..."
              disabled={answered}
              onKeyDown={e => e.key === 'Enter' && handleFillBlank()}
              className="text-lg h-14"
            />
            {!answered && (
              <Button onClick={handleFillBlank} className="w-full h-12" disabled={!fillAnswer.trim()}>
                Verificar
              </Button>
            )}
          </div>
        )}

        {/* Match Pairs */}
        {currentActivity.type === 'match_pairs' && currentActivity.pairs && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {currentActivity.pairs.map((p, i) => (
                <button
                  key={`l-${i}`}
                  onClick={() => handleMatchClick('left', i)}
                  disabled={matchedPairs.has(i) || answered}
                  className={`w-full p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    matchedPairs.has(i)
                      ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                      : matchSelected?.side === 'left' && matchSelected.idx === i
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/50'
                  }`}
                >
                  {p.left}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {shuffledRight.map((origIdx, displayIdx) => (
                <button
                  key={`r-${displayIdx}`}
                  onClick={() => handleMatchClick('right', displayIdx)}
                  disabled={matchedPairs.has(origIdx) || answered}
                  className={`w-full p-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    matchedPairs.has(origIdx)
                      ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                      : matchSelected?.side === 'right' && matchSelected.idx === displayIdx
                      ? 'border-secondary bg-secondary/10 text-foreground'
                      : 'border-border bg-card text-foreground hover:border-secondary/50'
                  }`}
                >
                  {currentActivity.pairs![origIdx].right}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {answered && (
          <div className={`p-4 rounded-2xl animate-slide-up ${isCorrect ? 'bg-finlingo-correct/10' : 'bg-finlingo-wrong/10'}`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-finlingo-correct" />
                  <span className="text-finlingo-correct">Correto! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-finlingo-wrong" />
                  <span className="text-finlingo-wrong">Incorreto 😔</span>
                </>
              )}
            </div>
            {currentActivity.explanation && (
              <p className="text-sm text-muted-foreground">{currentActivity.explanation}</p>
            )}
          </div>
        )}

        {/* Next button */}
        {answered && (
          <Button onClick={nextActivity} className="w-full h-12 animate-bounce-in" variant={isCorrect ? 'success' : 'default'}>
            {currentIdx + 1 >= activities.length ? 'Finalizar Lição' : 'Continuar'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
