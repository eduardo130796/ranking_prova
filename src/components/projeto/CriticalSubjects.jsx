import React from 'react';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CriticalSubjects({ subjects = [] }) {
  if (subjects.length === 0) return null;

  return (
    <div className="p-8 rounded-[2rem] glass-card space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <AlertTriangle className="w-24 h-24 text-destructive" />
      </div>

      <div className="relative z-10 space-y-4">
        <div>
          <h3 className="font-black text-lg text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Matérias Críticas
          </h3>
          <p className="text-xs text-white/40 mt-1">Identificamos queda de desempenho nestas áreas.</p>
        </div>

        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-white">{subject.name}</h4>
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">
                    {subject.reason || 'Precisão abaixo de 60%'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-destructive group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>

        <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
          Ver Relatório Completo
        </button>
      </div>
    </div>
  );
}
