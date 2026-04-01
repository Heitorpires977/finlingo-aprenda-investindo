import { Heart, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LessonHeaderProps {
  hearts: number;
  progressPct: number;
  onClose: () => void;
}

export function LessonHeader({ hearts, progressPct, onClose }: LessonHeaderProps) {
  return (
    <div className="sticky top-0 bg-card border-b px-4 py-3 space-y-2 z-40">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-1 text-finlingo-hearts">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={`h-5 w-5 transition-all duration-300 ${
                i < hearts
                  ? 'fill-current scale-100'
                  : 'opacity-30 scale-90'
              }`}
            />
          ))}
        </div>
      </div>
      <Progress value={progressPct} className="h-3 rounded-full" />
    </div>
  );
}
