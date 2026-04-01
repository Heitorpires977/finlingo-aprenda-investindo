import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Activity } from './types';

interface LessonFooterProps {
  answered: boolean;
  isCorrect: boolean;
  activity: Activity;
  isLastActivity: boolean;
  isPending: boolean;
  onNext: () => void;
}

export function LessonFooter({ answered, isCorrect, activity, isLastActivity, isPending, onNext }: LessonFooterProps) {
  if (!answered) return null;

  return (
    <>
      {/* Feedback */}
      <div
        className={`p-4 rounded-2xl animate-fade-in ${
          isCorrect ? 'bg-finlingo-correct/10' : 'bg-finlingo-wrong/10 animate-shake'
        }`}
      >
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
        {activity.explanation && (
          <p className="text-sm text-muted-foreground mt-1">{activity.explanation}</p>
        )}
      </div>

      {/* Next button */}
      <Button
        onClick={onNext}
        disabled={isPending}
        className="w-full h-12 animate-bounce-in"
        variant={isCorrect ? 'success' : 'default'}
      >
        {isPending ? 'Salvando...' : isLastActivity ? 'Finalizar Lição' : 'Continuar'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
}
