import { motion } from 'framer-motion';
import { AVATARS, getPlayerStats, getAchievements } from '@/lib/studyUtils';
import { Flame, Target, BookOpen, Trophy, CheckCircle, XCircle, AlertTriangle, DollarSign, Star } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

const medals = ['🥇', '🥈', '🥉'];

export default function PlayerColumn({
    player,
    achievements,
    rankPosition,
    delay = 0,
  }) {
  const stats = player;


  const participant =
    player.name;
  const isLeader = rankPosition === 0;
  const hasNotStudied = !stats.studiedToday;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
        isLeader
          ? 'border-yellow-500/40 glow-gold bg-gradient-to-b from-[#1c1508] via-card to-card'
          : hasNotStudied
          ? 'border-red-500/20 bg-gradient-to-b from-red-950/30 via-card to-card opacity-90'
          : 'border-border bg-card hover:border-primary/20'
      }`}
    >
      {/* Alert: not studied */}
      {hasNotStudied && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/15 border-b border-red-500/20 text-xs text-red-400 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          ⚠ Ainda não registrou hoje
        </div>
      )}

      {/* Leader glow strip */}
      {isLeader && (
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600" />
      )}

      {/* Header */}
      <div className={`p-5 ${isLeader ? 'bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent' : ''}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`
              w-14 h-14 rounded-2xl
              bg-gradient-to-br
              ${AVATARS[participant]}
              flex items-center
              justify-center
              text-white
              font-black
              text-2xl
              shrink-0
              ${
                isLeader
                  ? 'drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : ''
              }
            `}
          >
            {participant[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-space font-black text-xl ${isLeader ? 'text-yellow-300' : ''}`}>
                {participant}
              </span>
              <span className="text-base">{medals[rankPosition] || ''}</span>
              {isLeader && <span className="text-yellow-400 animate-pulse-glow">👑</span>}
            </div>

            {/* Level badge */}
            <div className={`inline-flex items-center gap-1 mt-1 text-xs px-2.5 py-1 rounded-full border font-semibold ${stats.level.bg} ${stats.level.color} ${stats.level.border}`}>
              {stats.level.icon} {stats.level.name}
            </div>
          </div>

          {/* Points */}
          <div className="text-right shrink-0">
            <div className={`text-3xl font-space font-black ${isLeader ? 'text-yellow-400' : 'text-primary'}`}>
              {stats.totalPoints}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">pontos</div>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{stats.level.name}</span>
            <span>{stats.level.nextLevel ? `${stats.level.progress}% → ${stats.level.nextLevel.name}` : 'Máximo!'}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.level.progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${isLeader ? 'from-yellow-400 to-amber-500' : 'from-primary to-purple-400'}`}
            />
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-4 gap-1.5 mt-4">
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground">Questões</div>
            <div className="font-bold font-space text-sm">{stats.totalQuestions}</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground">Precisão</div>
            <div className="font-bold font-space text-sm">{stats.avgAccuracy}%</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <Flame className="w-2.5 h-2.5 text-orange-400" />
              Streak
            </div>
            <div className="font-bold font-space text-sm text-orange-400">{stats.streak}d</div>
          </div>
          <div className="bg-muted/50 rounded-xl px-2 py-2 text-center">
            <div className="text-[10px] text-muted-foreground">Multa</div>
            <div className="font-bold font-space text-sm text-red-400">R${stats.fines}</div>
          </div>
        </div>
      </div>

      {/* Today's Status */}
      <div className="px-5 py-4 border-t border-border/60">
        <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 font-bold flex items-center gap-1.5">
          <Star className="w-3 h-3" /> Status de Hoje
        </h4>

        {/* Daily progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Meta diária (30q)</span>
            <span className="font-semibold text-primary">{stats.dailyProgress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.dailyProgress}%` }}
              transition={{ duration: 0.8, delay: delay + 0.4 }}
              className={`h-full rounded-full ${
                stats.metDailyGoal
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                  : stats.dailyProgress > 60
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  : 'bg-gradient-to-r from-primary to-purple-400'
              }`}
            />
            {stats.metDailyGoal && (
              <div className="absolute right-1 top-0 h-full flex items-center">
                <span className="text-[8px] text-emerald-900 font-black">✓</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>{stats.todayQuestions}/{30} questões</span>
            {stats.metDailyGoal ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Meta cumprida!
              </span>
            ) : (
              <span className="text-muted-foreground">Faltam {Math.max(0, 30 - stats.todayQuestions)}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Target className="w-3 h-3" /> Acertos
            </span>
            <span className="font-semibold text-xs">{stats.todayAccuracy}%</span>
          </div>
          <div className="flex justify-between bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Pontos
            </span>
            <span className="font-semibold text-xs text-primary">+{stats.todayPoints}</span>
          </div>
        </div>

        {stats.todaySubjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {stats.todaySubjects.map(s => (
              <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-medium">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="px-5 py-4 border-t border-border/60">
        <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 font-bold">Meta Semanal</h4>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">{stats.weekQuestions}/350 questões</span>
            <span className={`font-bold ${stats.weeklyGoalMet ? 'text-emerald-400' : 'text-primary'}`}>
              {stats.weeklyProgress}%
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.weeklyProgress}%` }}
              transition={{ duration: 1, delay: delay + 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full flex items-center justify-end pr-1 ${
                stats.weeklyGoalMet
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                  : 'bg-gradient-to-r from-primary via-purple-400 to-blue-400'
              }`}
            >
              {stats.weeklyProgress > 20 && (
                <span className="text-[8px] font-black text-white/80">{stats.weeklyProgress}%</span>
              )}
            </motion.div>
          </div>
          {stats.weeklyGoalMet && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
              <span>🎁</span>
              <span>Dia Livre Conquistado!</span>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 py-4 border-t border-border/60">
        <h4 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 font-bold">Conquistas</h4>
        <div className="flex flex-wrap gap-1.5">
          {achievements.map((a, i) => (
            <AchievementBadge key={i} achievement={a} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}