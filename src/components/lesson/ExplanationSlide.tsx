import { BookOpen } from 'lucide-react';
import type { ContentSlide } from './types';

interface ExplanationSlideProps {
  slide: ContentSlide;
}

export function ExplanationSlide({ slide }: ExplanationSlideProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
          {slide.emoji || <BookOpen className="h-6 w-6 text-primary" />}
        </div>
        <h2 className="text-xl font-black text-foreground">{slide.title}</h2>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        {slide.body.split('\n\n').map((paragraph, i) => (
          <p key={i} className={`text-foreground/90 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
