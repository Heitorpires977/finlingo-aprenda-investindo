import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, TrendingUp, Shield, Zap, Heart } from 'lucide-react';
import { useEffect } from 'react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/learn');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="max-w-lg mx-auto px-6 pt-16 pb-12 text-center relative">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-6xl">💰</span>
          </div>
          <h1 className="text-5xl font-black text-foreground leading-tight mb-4">
            Fin<span className="text-primary">Lingo</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Aprenda a investir de forma <span className="font-bold text-foreground">divertida e gamificada</span>.
            Do zero ao mercado financeiro!
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-14 text-lg" onClick={() => navigate('/auth')}>
              Começar Agora — É Grátis!
            </Button>
            <Button variant="outline" size="lg" className="h-12" onClick={() => navigate('/auth')}>
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-lg mx-auto px-6 py-12 space-y-8">
        <h2 className="text-2xl font-black text-center text-foreground">
          Por que FinLingo?
        </h2>
        <div className="grid gap-4">
          {[
            { icon: BookOpen, title: 'Lições Interativas', desc: 'Atividades variadas como quiz, preencher lacunas e simulações', color: 'text-primary' },
            { icon: Trophy, title: 'Ligas e Ranking', desc: '12 ligas para competir com outros investidores', color: 'text-accent' },
            { icon: Heart, title: 'Sistema de Corações', desc: 'Aprenda com cuidado! Corações se refazem ao longo do tempo', color: 'text-finlingo-hearts' },
            { icon: Zap, title: 'XP e Sequência', desc: 'Ganhe XP, mantenha sua sequência e suba de liga', color: 'text-finlingo-xp' },
            { icon: TrendingUp, title: 'Dados Reais', desc: 'Simulações com dados reais do mercado financeiro', color: 'text-finlingo-correct' },
            { icon: Shield, title: 'Conteúdo em PT-BR', desc: 'Todo conteúdo em português brasileiro', color: 'text-secondary' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-4 bg-card rounded-2xl border p-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Button size="lg" className="h-14 text-lg" onClick={() => navigate('/auth')}>
            Criar Conta Grátis 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
