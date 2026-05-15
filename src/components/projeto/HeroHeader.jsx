import { motion } from 'framer-motion';
import { getDaysUntilExam, getDaysSinceStart, MOTIVATIONAL_QUOTES, PARTICIPANTS, INITIAL_FUND } from '@/lib/studyUtils';
import { Flame, Trophy, DollarSign, Timer, Zap } from 'lucide-react';
import { useMemo } from 'react';

export default function HeroHeader({ ranking, totalFines }) {
  const daysLeft = getDaysUntilExam();
  const daysSince = getDaysSinceStart();
  const leader = ranking[0];
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length], []);
  const totalFund = (PARTICIPANTS.length * INITIAL_FUND) + totalFines;

  // Urgency color based on days left
  const urgencyColor = daysLeft <= 30 ? 'text-red-400' : daysLeft <= 60 ? 'text-orange-400' : 'text-yellow-400';

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#1a1040] via-card to-[#0f1a2e] p-6 md:p-8"
    >
      {/* Ambient glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl animate-pulse-glow">🔥</span>
              <h1 className="text-3xl md:text-4xl font-space font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
                Projeto Aprovação
              </h1>
            </div>
            <p className="text-muted-foreground text-sm md:text-base italic font-medium max-w-lg">
              "{quote}"
            </p>
          </div>

          {/* Countdown - hero stat */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 min-w-[140px]"
          >
            <Timer className={`w-5 h-5 mb-1 ${urgencyColor}`} />
            <span className={`text-4xl font-space font-black ${urgencyColor}`}>{daysLeft}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">dias p/ prova</span>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Fund */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Fundo Total</div>
              <div className="text-lg font-space font-bold text-emerald-400">R$ {totalFund}</div>
            </div>
          </motion.div>

          {/* Fines */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <Zap className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Em Multas</div>
              <div className="text-lg font-space font-bold text-red-400">R$ {totalFines}</div>
            </div>
          </motion.div>

          {/* Days in challenge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20"
          >
            <Flame className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">No Desafio</div>
              <div className="text-lg font-space font-bold text-orange-400">{daysSince} dias</div>
            </div>
          </motion.div>

          {/* Leader */}
          {leader && leader.totalPoints > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30"
            >
              <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Liderando</div>
                <div className="text-base font-space font-bold text-yellow-400 truncate">👑 {leader.name}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}