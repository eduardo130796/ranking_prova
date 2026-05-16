import React from 'react';
import { CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DailyFocus({ tasks = [] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-white leading-tight">Foco de Hoje</h2>
          <p className="text-sm text-white/40">Suas prioridades estratégicas para agora.</p>
        </div>
        <div className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          {tasks.length} {tasks.length === 1 ? 'Tarefa' : 'Tarefas'}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex items-center justify-between p-5 rounded-3xl glass-card premium-shadow cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  task.isOverdue ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                }`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{task.title}</h3>
                    {task.isOverdue && (
                      <span className="text-[10px] font-black bg-destructive/20 text-destructive px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        Atrasado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.estimatedTime}</span>
                    </div>
                    {task.subject && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.subject}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              {/* Progress indicator for the task if applicable */}
              <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-white/5 overflow-hidden rounded-full">
                <div 
                  className="h-full gradient-primary" 
                  style={{ width: `${task.progress || 0}%` }}
                />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white/20" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white/60">Tudo em dia!</p>
              <p className="text-sm text-white/40">Você não tem tarefas urgentes para hoje.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
