import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import type { Step } from '@/data/lessons';

const STEP_HEADERS: Record<Step['type'], { icon: string; label: string }> = {
  explanation: { icon: '📖', label: 'Hora de Aprender' },
  example: { icon: '💡', label: 'Na Prática' },
  activity: { icon: '🧠', label: 'Teste seu Conhecimento' },
  true_false: { icon: '⚖️', label: 'Verdadeiro ou Falso?' },
  match_pairs: { icon: '🔗', label: 'Jogo de Conexão' },
};

function StepHeader({ type }: { type: Step['type'] }) {
  const header = STEP_HEADERS[type];
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-lg">{header.icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{header.label}</span>
    </div>
  );
}

/* ─── Explanation Slide ─── */
function ExplanationStep({ step }: { step: Step }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <StepHeader type="explanation" />
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
          {step.emoji || <BookOpen className="h-6 w-6 text-primary" />}
        </div>
        <h2 className="text-xl font-black text-foreground">{step.title}</h2>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        {step.body?.split('\n\n').map((p, i) => (
          <p key={i} className={`text-foreground/90 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/* ─── Example Slide ─── */
function ExampleStep({ step }: { step: Step }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <StepHeader type="example" />
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-accent/15 flex items-center justify-center text-2xl">
          {step.emoji || <Lightbulb className="h-6 w-6 text-accent" />}
        </div>
        <h2 className="text-xl font-black text-foreground">{step.title}</h2>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        {step.body?.split('\n\n').map((p, i) => (
          <p key={i} className={`text-foreground/90 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>{p}</p>
        ))}
      </div>
      {step.highlight && (
        <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-accent" />
            <span className="font-bold text-accent text-sm uppercase tracking-wide">Destaque</span>
          </div>
          {step.highlight.split('\n').map((line, i) => (
            <p key={i} className="text-foreground font-semibold leading-relaxed">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Multiple Choice Activity ─── */
function ActivityStep({ step, onSolved, onWrong, onAnswered }: { step: Step; onSolved: () => void; onWrong: () => void; onAnswered: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const isCorrect = selected === step.correct;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    onAnswered();
    if (idx === step.correct) {
      onSolved();
    } else {
      onWrong();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader type="activity" />
      <h2 className="text-xl font-black text-foreground">{step.question}</h2>
      <div className="space-y-3">
        {step.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={answered}
            className={`w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
              answered && i === step.correct
                ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                : answered && i === selected && !isCorrect
                ? 'bg-finlingo-wrong/10 border-finlingo-wrong text-foreground animate-shake'
                : selected === i
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border hover:border-primary/50 bg-card text-foreground active:scale-[0.98]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {answered && (
        <div className={`p-4 rounded-2xl animate-fade-in ${isCorrect ? 'bg-finlingo-correct/10' : 'bg-finlingo-wrong/10'}`}>
          <div className="flex items-center gap-2 font-bold">
            {isCorrect ? (
              <><CheckCircle className="h-5 w-5 text-finlingo-correct" /><span className="text-finlingo-correct">Correto! 🎉</span></>
            ) : (
              <><XCircle className="h-5 w-5 text-finlingo-wrong" /><span className="text-finlingo-wrong">Incorreto 😔</span></>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── True / False ─── */
function TrueFalseStep({ step, onSolved, onWrong, onAnswered }: { step: Step; onSolved: () => void; onWrong: () => void; onAnswered: () => void }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const correctVal = step.correct as number;

  const handleSelect = (val: number) => {
    if (answered) return;
    setSelected(val);
    setAnswered(true);
    onAnswered();
    if (val === correctVal) {
      onSolved();
    } else {
      onWrong();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader type="true_false" />
      <h2 className="text-xl font-black text-foreground">{step.statement}</h2>
      <div className="flex gap-4">
        {([{ label: 'Verdadeiro', value: 1 }, { label: 'Falso', value: 0 }] as const).map(({ label, value }) => (
          <button
            key={label}
            onClick={() => handleSelect(value)}
            disabled={answered}
            className={`flex-1 p-4 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${
              answered && value === correctVal
                ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                : answered && value === selected && value !== correctVal
                ? 'bg-finlingo-wrong/10 border-finlingo-wrong text-foreground'
                : 'border-border hover:border-primary/50 bg-card text-foreground active:scale-[0.98]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {answered && (
        <div className={`p-4 rounded-2xl animate-fade-in ${selected === correctVal ? 'bg-finlingo-correct/10' : 'bg-finlingo-wrong/10'}`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {selected === correctVal ? (
              <><CheckCircle className="h-5 w-5 text-finlingo-correct" /><span className="text-finlingo-correct">Correto! 🎉</span></>
            ) : (
              <><XCircle className="h-5 w-5 text-finlingo-wrong" /><span className="text-finlingo-wrong">Incorreto 😔</span></>
            )}
          </div>
          {step.explanation && selected !== correctVal && (
            <p className="text-sm text-muted-foreground mt-1">{step.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Match Pairs ─── */
function MatchPairsStep({ step, onSolved, onWrong, onAnswered }: { step: Step; onSolved: () => void; onWrong: () => void; onAnswered: () => void }) {
  const pairs = step.pairs!;
  const shuffledRight = useMemo(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{left: number; right: number} | null>(null);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const rightOrigIdx = shuffledRight[selectedRight];
      if (rightOrigIdx === selectedLeft) {
        const newMatched = new Set(matched);
        newMatched.add(selectedLeft);
        setMatched(newMatched);
        if (newMatched.size === pairs.length) {
          onSolved();
          onAnswered();
        }
      } else {
        setWrongPair({ left: selectedLeft, right: selectedRight });
        onWrong();
        onAnswered();
        setTimeout(() => setWrongPair(null), 800);
      }
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 300);
    }
  }, [selectedLeft, selectedRight, shuffledRight, matched, pairs.length, onSolved, onWrong, onAnswered]);

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader type="match_pairs" />
      <h2 className="text-xl font-black text-foreground">Conecte os termos às definições</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={`l-${i}`}
              onClick={() => !matched.has(i) && setSelectedLeft(i)}
              disabled={matched.has(i)}
              className={`w-full p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                matched.has(i)
                  ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                  : selectedLeft === i
                  ? 'border-primary bg-primary/10 text-foreground'
                  : wrongPair && wrongPair.left === i
                  ? 'border-red-500 bg-red-500/20 text-foreground animate-pulse'
                  : 'border-border bg-card text-foreground hover:border-primary/50'
              }`}
            >
              {p.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {shuffledRight.map((origIdx, displayIdx) => (
            <button
              key={`r-${displayIdx}`}
              onClick={() => !matched.has(origIdx) && setSelectedRight(displayIdx)}
              disabled={matched.has(origIdx)}
              className={`w-full p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                matched.has(origIdx)
                  ? 'bg-finlingo-correct/10 border-finlingo-correct text-foreground'
                  : selectedRight === displayIdx
                  ? 'border-secondary bg-secondary/10 text-foreground'
                  : wrongPair && wrongPair.right === displayIdx
                  ? 'border-red-500 bg-red-500/20 text-foreground animate-pulse'
                  : 'border-border bg-card text-foreground hover:border-secondary/50'
              }`}
            >
              {pairs[origIdx].definition}
            </button>
          ))}
        </div>
      </div>
      {matched.size === pairs.length && (
        <div className="p-4 rounded-2xl bg-finlingo-correct/10 animate-fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle className="h-5 w-5 text-finlingo-correct" />
            <span className="text-finlingo-correct">Todos conectados! 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main StepRenderer ─── */
interface StepRendererProps {
  step: Step;
  onSolved: () => void;
  onWrong: () => void;
  onAnswered: () => void;
}

export function StepRenderer({ step, onSolved, onWrong, onAnswered }: StepRendererProps) {
  useEffect(() => {
    if (step.type === 'explanation' || step.type === 'example') {
      onSolved();
    }
  }, [step]);

  switch (step.type) {
    case 'explanation':
      return <ExplanationStep step={step} />;
    case 'example':
      return <ExampleStep step={step} />;
    case 'activity':
      return <ActivityStep step={step} onSolved={onSolved} onWrong={onWrong} onAnswered={onAnswered} />;
    case 'true_false':
      return <TrueFalseStep step={step} onSolved={onSolved} onWrong={onWrong} onAnswered={onAnswered} />;
    case 'match_pairs':
      return <MatchPairsStep step={step} onSolved={onSolved} onWrong={onWrong} onAnswered={onAnswered} />;
    default:
      return null;
  }
}
