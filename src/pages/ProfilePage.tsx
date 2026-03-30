import AppLayout from '@/components/AppLayout';
import { useProfile, useUserBadges, useLessonProgress } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Flame, Heart, Coins, Zap, Trophy, BookOpen, LogOut, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: badges } = useUserBadges();
  const { data: progress } = useLessonProgress();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const completedLessons = progress?.filter(p => p.completed).length ?? 0;
  const perfectLessons = progress?.filter(p => p.perfect).length ?? 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Avatar & name */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary mx-auto flex items-center justify-center text-3xl font-black text-primary">
            {profile?.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">{profile?.username ?? 'Usuário'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: 'XP Total', value: profile?.xp_total ?? 0, color: 'text-finlingo-xp' },
            { icon: Flame, label: 'Sequência', value: `${profile?.streak_current ?? 0} dias`, color: 'text-finlingo-streak' },
            { icon: Trophy, label: 'Liga', value: profile?.league ?? 'Bronze', color: 'text-accent' },
            { icon: BookOpen, label: 'Lições', value: completedLessons, color: 'text-primary' },
            { icon: Star, label: 'Perfeitas', value: perfectLessons, color: 'text-finlingo-coins' },
            { icon: Heart, label: 'Corações', value: profile?.hearts ?? 5, color: 'text-finlingo-hearts' },
            { icon: Coins, label: 'FinCoins', value: profile?.fincoins ?? 0, color: 'text-finlingo-coins' },
            { icon: Flame, label: 'Maior Seq.', value: `${profile?.streak_longest ?? 0} dias`, color: 'text-finlingo-streak' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl border p-4 text-center space-y-1">
              <Icon className={`h-6 w-6 mx-auto ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-black text-lg text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="bg-card rounded-2xl border p-4 space-y-3">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            🏆 Conquistas
          </h2>
          {badges && badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((ub: { id: string; badges: { icon: string | null; name: string } | null }) => (
                <div key={ub.id} className="bg-muted rounded-xl px-3 py-2 text-center">
                  <span className="text-2xl">{ub.badges?.icon ?? '🏆'}</span>
                  <p className="text-xs font-semibold text-foreground mt-1">{ub.badges?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Complete lições para ganhar conquistas!</p>
          )}
        </div>

        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </AppLayout>
  );
}
