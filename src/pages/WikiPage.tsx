import { useState } from 'react';
import { useTechnicalGuides } from '@/hooks/useTechnicalGuides';
import AppLayout from '@/components/AppLayout';
import { BookOpen, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function WikiPage() {
  const { data: guides, isLoading } = useTechnicalGuides();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = guides?.find(g => g.id === selectedId);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Wiki Técnica
          </h1>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-2xl border p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </AppLayout>
    );
  }

  // Detail view
  if (selected && selected.unlocked) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="gap-1 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <div className="bg-card rounded-2xl border p-5">
            <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-td:text-foreground/80 prose-th:text-foreground prose-code:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Grid view
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Wiki Técnica
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete as lições para desbloquear os guias técnicos.
        </p>

        <div className="grid gap-3">
          {guides?.map(guide => (
            <button
              key={guide.id}
              onClick={() => guide.unlocked && setSelectedId(guide.id)}
              disabled={!guide.unlocked}
              className={`w-full text-left bg-card rounded-2xl border p-4 transition-all ${
                guide.unlocked
                  ? 'hover:border-primary hover:shadow-md cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{guide.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground truncate">{guide.title}</h3>
                    {!guide.unlocked && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{guide.summary}</p>
                </div>
              </div>
              {guide.unlocked && (
                <div className="mt-2 text-xs text-primary font-semibold">
                  Toque para ler →
                </div>
              )}
            </button>
          ))}
        </div>

        {guides?.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum guia disponível ainda.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
