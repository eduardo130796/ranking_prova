import { motion } from 'framer-motion';
import { AVATARS } from '@/lib/studyUtils';
import { Flame, Target, BookOpen, TrendingUp } from 'lucide-react';

const medals = ['🥇', '🥈', '🥉'];
const rankLabels = ['1º lugar', '2º lugar', '3º lugar'];

export default function RankingBar({ ranking }) {
  const maxPoints = Math.max(...ranking.map(p => p.totalPoints), 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-3xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-border/50">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="font-space font-bold text-lg">Ranking Ao Vivo</h2>
        <span className="ml-auto text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          Atualizado agora
        </span>
      </div>

      <div className="p-4 space-y-3">
        {ranking.map((player, index) => {
          const barWidth = maxPoints > 0 ? Math.round((player.totalPoints / maxPoints) * 100) : 0;
          const isLeader = index === 0;

          return (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              className={`relative rounded-2xl p-4 overflow-hidden transition-all ${
                isLeader
                  ? 'bg-gradient-to-r from-yellow-500/15 via-amber-500/8 to-transparent border border-yellow-500/30 glow-gold'
                  : 'bg-secondary/40 border border-border hover:border-primary/20'
              }`}
            >
              {isLeader && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent pointer-events-none" />
              )}

              <div className="relative z-10 flex items-center gap-4">
                {/* Medal + Avatar */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-2xl">{medals[index]}</span>
                  <div
                    className={`
                      w-12 h-12 rounded-xl
                      bg-gradient-to-br
                      ${AVATARS[player.name]}
                      flex items-center
                      justify-center
                      text-white
                      font-black
                      text-lg
                      shrink-0
                      ${
                        isLeader
                          ? 'drop-shadow-lg'
                          : ''
                      }
                    `}
                  >
                    {player.name[0]}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-space font-bold text-lg ${isLeader ? 'text-yellow-300' : ''}`}>
                      {player.name}
                    </span>
                    {isLeader && <span className="text-yellow-400 text-sm animate-pulse-glow">👑</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${player.level.bg} ${player.level.color} ${player.level.border} border ml-1`}>
                      {player.level.icon} {player.level.name}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isLeader
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                          : index === 1
                          ? 'bg-gradient-to-r from-slate-300 to-slate-400'
                          : 'bg-gradient-to-r from-orange-400 to-amber-600'
                      }`}
                    />
                  </div>

                  {/* Mini stats */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {player.streak} streak
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {player.totalQuestions} questões
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {player.avgAccuracy}% acertos
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="shrink-0 text-right">
                  <div className={`text-3xl font-space font-black ${isLeader ? 'text-yellow-400' : 'text-foreground'}`}>
                    {player.totalPoints}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">pontos</div>
                  {!player.studiedToday && (
                    <div className="mt-1 text-[10px] text-red-400 font-medium">⚠ Sem estudo</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}