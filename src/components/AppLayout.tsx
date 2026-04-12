import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useGameData';
import { NavLink } from 'react-router-dom';
import { BookOpen, Trophy, ShoppingBag, User, Flame, Heart, Coins, GraduationCap } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading } = useProfile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <span className="font-black text-primary text-xl">💰 FinLingo</span>
          <div className="flex items-center gap-3 text-sm font-bold">
            <div className="flex items-center gap-1 text-finlingo-streak">
              <Flame className="h-4 w-4" />
              <span>{isLoading ? '...' : (profile?.streak_current ?? 0)}</span>
            </div>
            <div className="flex items-center gap-1 text-finlingo-hearts">
              <Heart className="h-4 w-4 fill-current" />
              <span>{isLoading ? '...' : (profile?.effectiveHearts ?? profile?.hearts ?? 5)}</span>
            </div>
            <div className="flex items-center gap-1 text-finlingo-coins">
              <Coins className="h-4 w-4" />
              <span>{isLoading ? '...' : (profile?.fincoins ?? 0)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-card border-t shadow-lg">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {[
            { to: '/learn', icon: BookOpen, label: 'Aprender' },
            { to: '/wiki', icon: GraduationCap, label: 'Wiki' },
            { to: '/leaderboard', icon: Trophy, label: 'Liga' },
            { to: '/shop', icon: ShoppingBag, label: 'Loja' },
            { to: '/profile', icon: User, label: 'Perfil' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
