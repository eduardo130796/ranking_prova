import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumHero({ 
  editalProgress = 0, 
  pendingReviews = 0, 
  totalQuestions = 0,
  streak = 0,
  insights = []
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] glass-premium p-8 lg:p-12 premium-shadow group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px]" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Side: Messaging & Insights */}
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-white/70 uppercase">Central de Comando</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black gradient-text leading-[1.1]"
          >
            Sua aprovação <br />
            <span className="text-primary">está em construção.</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="flex items-center gap-3 text-white/60">
                  {insight.type === 'success' && <TrendingUp className="w-5 h-5 text-emerald-400" />}
                  {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400" />}
                  {insight.type === 'streak' && <Zap className="w-5 h-5 text-orange-400" />}
                  <span className="text-sm font-medium">{insight.text}</span>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm max-w-md">
                Continue mantendo a consistência. Cada tópico dominado é um passo mais perto do seu objetivo final.
              </p>
            )}
          </motion.div>
        </div>

        {/* Right Side: Visual Progress Radial/Stats */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto min-w-[320px]">
          <StatCard 
            label="Edital" 
            value={`${editalProgress}%`} 
            color="text-primary"
            subValue="Concluído"
            delay={0.3}
          />
          <StatCard 
            label="Revisões" 
            value={pendingReviews} 
            color="text-yellow-400"
            subValue="Pendentes"
            delay={0.4}
          />
          <StatCard 
            label="Questões" 
            value={totalQuestions} 
            color="text-emerald-400"
            subValue="Realizadas"
            delay={0.5}
          />
          <StatCard 
            label="Streak" 
            value={`${streak}d`} 
            color="text-orange-500"
            subValue="Fogo Ativo"
            delay={0.6}
            isFire
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, subValue, delay, isFire }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-6 rounded-3xl glass-card flex flex-col justify-between aspect-square relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-white/[0.02] shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</span>
      <div className="space-y-1">
        <div className={`text-4xl font-black ${color} flex items-baseline gap-1`}>
          {value}
          {isFire && <Zap className="w-5 h-5 fill-current" />}
        </div>
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{subValue}</div>
      </div>
    </motion.div>
  );
}
