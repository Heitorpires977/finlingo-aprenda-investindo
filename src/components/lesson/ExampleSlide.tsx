import { Lightbulb } from 'lucide-react';
import type { ContentSlide } from './types';

interface ExampleSlideProps {
  slide: ContentSlide;
}

export function ExampleSlide({ slide }: ExampleSlideProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-accent/15 flex items-center justify-center text-2xl">
          {slide.emoji || <Lightbulb className="h-6 w-6 text-accent" />}
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

      {slide.highlight && (
        <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-accent" />
            <span className="font-bold text-accent text-sm uppercase tracking-wide">Destaque</span>
          </div>
          {slide.highlight.split('\n').map((line, i) => (
            <p key={i} className="text-foreground font-semibold leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
