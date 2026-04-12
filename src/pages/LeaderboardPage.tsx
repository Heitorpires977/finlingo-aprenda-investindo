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

export default function LeaderboardPage() {
  const { data: profile } = useProfile();
  const { data: leaderboard, isLoading } = useLeaderboard();

  const league = profile?.league ?? 'Bronze';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* League header */}
        <div className={`bg-gradient-to-br ${LEAGUE_COLORS[league] ?? LEAGUE_COLORS.Bronze} rounded-2xl p-6 text-center space-y-2`}>
          <Trophy className="h-12 w-12 mx-auto text-primary-foreground drop-shadow" />
          <h1 className="text-2xl font-black text-primary-foreground">Liga {league}</h1>
          <p className="text-primary-foreground/80 text-sm">
            Top 5 sobem · Últimos 3 descem
          </p>
        </div>

        {/* Rankings */}
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
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 px-4 py-3 ${isUser ? 'bg-primary/5' : ''}`}
                  >
                    <div className="w-8 text-center font-black text-lg">
                      {idx < 3 && RankIcon ? (
                        <RankIcon className={`h-6 w-6 mx-auto ${
                          idx === 0 ? 'text-finlingo-coins' : idx === 1 ? 'text-gray-400' : 'text-amber-700'
                        }`} />
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
                        {player.badges?.includes('MITO') && <span className="ml-1 text-xs bg-yellow-500 text-black px-1 rounded">(MITO)</span>}
                        {player.badges?.includes('NÃO MITO') && <span className="ml-1 text-xs bg-red-600 text-white px-1 rounded">(NÃO MITO)</span>}
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
