import { useState, useRef, useCallback, useEffect } from 'react';
import { useTechnicalGuides, useMarkGuideReadMutation } from '@/hooks/useTechnicalGuides';
import AppLayout from '@/components/AppLayout';
import { BookOpen, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function WikiPage() {
  const { data: guides, isLoading } = useTechnicalGuides();
  const markRead = useMarkGuideReadMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const selected = guides?.find(g => g.id === selectedId);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const contentRect = content.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // How much of the content has scrolled past the top of the container
    const scrolled = containerRect.top - contentRect.top;
    const totalScrollable = contentRect.height - containerRect.height;

    if (totalScrollable <= 0) {
      setReadProgress(100);
    } else {
      setReadProgress(Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100)));
    }
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setReadProgress(0);
      return;
    }

    // Find the scrollable main element
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    // The scroll container is the parent of main that actually scrolls
    // In AppLayout it's the flex column div
    const scrollEl = mainEl.closest('.min-h-screen') || window;
    const actualScrollEl = scrollEl === window ? document.documentElement : scrollEl as HTMLElement;
    scrollContainerRef.current = actualScrollEl;

    const onScroll = () => handleScroll();

    if (scrollEl === window) {
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      (scrollEl as HTMLElement).addEventListener('scroll', onScroll, { passive: true });
    }

    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      if (scrollEl === window) {
        window.removeEventListener('scroll', onScroll);
      } else {
        (scrollEl as HTMLElement).removeEventListener('scroll', onScroll);
      }
    };
  }, [selectedId, handleScroll]);

  const handleMarkAsRead = async () => {
    if (!selected) return;
    try {
      const result = await markRead.mutateAsync(selected.id);
      if (result.alreadyRead) {
        toast.info('Você já marcou este guia como lido!');
      } else {
        const badgeMsg = result.badgeEarned ? ' 🏆 Badge "Estudioso" desbloqueada!' : '';
        toast.success(`Guia concluído! +${result.xpEarned} XP${badgeMsg}`);
      }
    } catch {
      toast.error('Erro ao marcar como lido');
    }
  };

  // Loading skeleton
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
        {/* Reading progress bar - sticky at top */}
        <div className="sticky top-0 z-10 -mx-4 -mt-6 mb-4">
          <Progress
            value={readProgress}
            className="h-1.5 rounded-none bg-muted"
          />
          <div className="text-[10px] text-muted-foreground text-right px-4 pt-0.5">
            {Math.round(readProgress)}% lido
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="gap-1 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          <div ref={contentRef} className="bg-card rounded-2xl border p-5">
            <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-td:text-foreground/80 prose-th:text-foreground prose-code:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selected.content}
              </ReactMarkdown>
            </article>

            {/* Mark as read button */}
            <div className="mt-8 pt-6 border-t text-center space-y-3">
              {selected.read ? (
                <div className="flex items-center justify-center gap-2 text-finlingo-correct font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  Leitura concluída!
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Terminou de ler? Marque como lido e ganhe XP bônus!
                  </p>
                  <Button
                    onClick={handleMarkAsRead}
                    disabled={markRead.isPending}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    {markRead.isPending ? 'Salvando...' : 'Marcar como Lido (+5 XP)'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Grid view
  const readCount = guides?.filter(g => g.read).length ?? 0;
  const totalCount = guides?.length ?? 0;

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" /> Wiki Técnica
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete as lições para desbloquear os guias técnicos.
        </p>

        {/* Overall reading progress */}
        {totalCount > 0 && (
          <div className="bg-card rounded-2xl border p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-foreground">📚 Progresso de Leitura</span>
              <span className="text-muted-foreground">{readCount}/{totalCount} lidos</span>
            </div>
            <Progress value={(readCount / totalCount) * 100} className="h-2" />
          </div>
        )}

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
                    {guide.read && <CheckCircle2 className="h-4 w-4 text-finlingo-correct shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{guide.summary}</p>
                </div>
              </div>
              {guide.unlocked && !guide.read && (
                <div className="mt-2 text-xs text-primary font-semibold">
                  Toque para ler → +5 XP
                </div>
              )}
            </button>
          ))}
        </div>

        {totalCount === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Nenhum guia disponível ainda.
          </div>
        )}
      </div>
    </AppLayout>
  );
}
