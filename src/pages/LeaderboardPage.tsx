import AppLayout from '@/components/AppLayout';
import { useLeaderboard, useProfile } from '@/hooks/useGameData';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';

const LEAGUE_COLORS: Record<string, string> = {
  Bronze: 'from-amber-700 to-amber-500',
  Silver: 'from-gray-400 to-gray-300',
  Gold: 'from-yellow-500 to-yellow-300',
  Sapphire: 'from-blue-600 to-blue-400',
  Ruby: 'from-red-600 to-red-400',
  Emerald: 'from-emerald-600 to-emerald-400',
  Diamond: 'from-cyan-400 to-cyan-200',
  Obsidian: 'from-gray-800 to-gray-600',
  Pearl: 'from-pink-200 to-white',
  Amethyst: 'from-purple-600 to-purple-400',
  Topaz: 'from-orange-500 to-orange-300',
  Onyx: 'from-gray-900 to-gray-700',
};

const RANK_ICONS = [Crown, Medal, Medal];

const BADGE_MAP: Record<string, { text: string; class: string }> = {
  'MITO': { text: 'MITO', class: 'bg-yellow-500 text-black' },
  'NÃO MITO': { text: 'NÃO MITO', class: 'bg-red-600 text-white' },
  'PFTO': { text: 'PFTO', class: 'bg-blue-500 text-white' },
  'Espresso': { text: '☕', class: 'bg-amber-700 text-white' },
  'Master': { text: 'Master', class: 'bg-purple-600 text-white' },
  'CIBED': { text: 'CIBED', class: 'bg-green-600 text-white' },
  'Island': { text: 'Islaicedi', class: 'bg-cyan-500 text-white' },
  'Empreg': { text: 'Emergente', class: 'bg-gray-600 text-white' },
  'Pulta': { text: 'Pulta MEO🎯', class: 'bg-pink-500 text-white' },
  'Condado': { text: 'Condado', class: 'bg-red-400 text-white' },
};

function BadgeTag({ badge }: { badge: string }) {
  const info = BADGE_MAP[badge];
  if (!info) return null;
  return <span className={`ml-1 text-xs px-1 rounded ${info.class}`}>({info.text})</span>;
}

export default function LeaderboardPage() {
  const { data: profile } = useProfile();
  const { data: leaderboard, isLoading } = useLeaderboard();

  const league = profile?.league ?? 'Bronze';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className={`bg-gradient-to-br ${LEAGUE_COLORS[league] ?? LEAGUE_COLORS.Bronze} rounded-2xl p-6 text-center space-y-2`}>
          <Trophy className="h-12 w-12 mx-auto text-primary-foreground drop-shadow" />
          <h1 className="text-2xl font-black text-primary-foreground">Liga {league}</h1>
          <p className="text-primary-foreground/80 text-sm">Top 5 sobem · Últimos 3 descem</p>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Ranking Semanal</span>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : (
            <div className="divide-y">
              {leaderboard?.map((player, idx) => {
                const isUser = player.id === profile?.id;
                const RankIcon = RANK_ICONS[idx];

                return (
                  <div key={player.id} className={`flex items-center gap-3 px-4 py-3 ${isUser ? 'bg-primary/5' : ''}`}>
                    <div className="w-8 text-center font-black text-lg">
                      {idx < 3 && RankIcon ? (
                        <RankIcon className={`h-6 w-6 mx-auto ${idx === 0 ? 'text-finlingo-coins' : idx === 1 ? 'text-gray-400' : 'text-amber-700'}`} />
                      ) : (
                        <span className="text-muted-foreground">{idx + 1}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                      {player.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${isUser ? 'text-primary' : 'text-foreground'}`}>
                        {player.username ?? 'Anônimo'} {isUser && '(você)'}
                        {player.badges?.includes('MITO') && <BadgeTag badge="MITO" />}
                        {player.badges?.includes('NÃO MITO') && <BadgeTag badge="NÃO MITO" />}
                        {player.badges?.includes('PFTO') && <BadgeTag badge="PFTO" />}
                        {player.badges?.includes('Espresso') && <BadgeTag badge="Espresso" />}
                        {player.badges?.includes('Master') && <BadgeTag badge="Master" />}
                        {player.badges?.includes('CIBED') && <BadgeTag badge="CIBED" />}
                        {player.badges?.includes('Island') && <BadgeTag badge="Island" />}
                        {player.badges?.includes('Empreg') && <BadgeTag badge="Empreg" />}
                        {player.badges?.includes('Pulta') && <BadgeTag badge="Pulta" />}
                        {player.badges?.includes('Condado') && <BadgeTag badge="Condado" />}
                      </p>
                    </div>
                    <span className="font-black text-finlingo-xp">{player.xp_weekly} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
