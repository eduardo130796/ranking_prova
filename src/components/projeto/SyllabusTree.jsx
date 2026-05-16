import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Circle, PlayCircle, BookOpen, CheckCircle2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_ICONS = {
  'not-started': { icon: Circle, class: 'status-not-started', label: 'Não iniciado' },
  'studying': { icon: PlayCircle, class: 'status-studying', label: 'Estudando' },
  'reviewing': { icon: BookOpen, class: 'status-reviewing', label: 'Revisando' },
  'mastered': { icon: CheckCircle2, class: 'status-mastered', label: 'Dominado' },
};

export default function SyllabusTree({ subjects = [] }) {
  return (
    <div className="space-y-6">
      <div className="px-2">
        <h2 className="text-2xl font-black text-white leading-tight">Mapa do Edital</h2>
        <p className="text-sm text-white/40">Sua jornada rumo ao domínio completo.</p>
      </div>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <SubjectNode key={subject.name || index} subject={subject} />
        ))}
      </div>
    </div>
  );
}

function SubjectNode({ subject }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = subject.topics?.filter(t => t.status === 'mastered').length || 0;
  const totalCount = subject.topics?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-[2rem] glass-card overflow-hidden">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-lg text-white group-hover:text-primary transition-colors">{subject.name}</h3>
              {subject.level && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                  <Award className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase">Nível {subject.level}</span>
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {completedCount} de {totalCount} tópicos dominados
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`text-2xl font-black ${progress === 100 ? 'text-emerald-400' : 'text-primary'}`}>
            {progress}%
          </span>
          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'gradient-primary'}`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-white/[0.01]"
          >
            <div className="p-4 space-y-2">
              {subject.topics?.map((topic, i) => (
                <TopicRow key={topic.id || i} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopicRow({ topic }) {
  const StatusIcon = STATUS_ICONS[topic.status || 'not-started'].icon;
  const statusConfig = STATUS_ICONS[topic.status || 'not-started'];

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusConfig.class} bg-current/10 border border-current/20`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-white/80 group-hover:text-white transition-colors">{topic.name}</h4>
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-tighter">
            <span>{topic.questionsCount || 0} Questões</span>
            <span>•</span>
            <span>{topic.accuracy || 0}% Precisão</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${statusConfig.class}`}>
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
}
