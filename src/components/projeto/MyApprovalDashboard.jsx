import React from 'react';
import PremiumHero from './PremiumHero';
import DailyFocus from './DailyFocus';
import SyllabusTree from './SyllabusTree';
import ActivityHeatmap from './ActivityHeatmap';
import CriticalSubjects from './CriticalSubjects';
import { motion } from 'framer-motion';

export default function MyApprovalDashboard({
  subjects = [],
  reviews = [],
  mockExams = [],
  entries = [],
  streak = 0
}) {
  // =====================
  // DATA TRANSFORMATION
  // =====================

  // Transform raw topics into structured subjects for SyllabusTree
  const structuredSubjects = subjects.reduce((acc, topic) => {
    const subjectName = topic.subject || 'Geral';
    if (!acc[subjectName]) {
      acc[subjectName] = {
        name: subjectName,
        level: Math.floor(Math.random() * 10) + 1, // Mock level
        topics: []
      };
    }
    
    acc[subjectName].topics.push({
      id: topic.id,
      name: topic.name,
      status: topic.completed ? 'mastered' : (Math.random() > 0.5 ? 'reviewing' : 'studying'), // Mock status logic
      questionsCount: topic.total_questions || 0,
      accuracy: Math.floor(Math.random() * 40) + 60 // Mock accuracy
    });
    
    return acc;
  }, {});

  const subjectList = Object.values(structuredSubjects);

  // Generate Daily Focus tasks
  const dailyTasks = [
    ...reviews.filter(r => !r.completed).slice(0, 3).map(r => ({
      title: `Revisar ${r.topic_name || 'Tópico'}`,
      subject: r.subject || 'Revisão',
      estimatedTime: '15 min',
      isOverdue: Math.random() > 0.7,
      progress: 0
    })),
    {
      title: 'Simulado Semanal',
      subject: 'Geral',
      estimatedTime: '2h 30min',
      isOverdue: false,
      progress: 0
    }
  ];

  // Critical subjects mock
  const criticalList = subjectList
    .filter(s => s.topics.some(t => t.accuracy < 70))
    .slice(0, 2)
    .map(s => ({
      name: s.name,
      reason: 'Precisão em queda (64%)'
    }));

  // Hero insights mock
  const heroInsights = [
    { type: 'success', text: 'Você avançou 8% no edital esta semana.' },
    { type: 'streak', text: `Melhor sequência dos últimos 30 dias: ${streak} dias.` },
    { type: 'warning', text: 'Português precisa de revisão urgente.' }
  ];

  const totalQuestions = entries.reduce((sum, e) => sum + (e.questions || 0), 0);
  const completedTopics = subjects.filter(s => s.completed).length;
  const editalProgress = subjects.length > 0 ? Math.round((completedTopics / subjects.length) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* 1. HERO SECTION */}
      <PremiumHero 
        editalProgress={editalProgress}
        pendingReviews={reviews.filter(r => !r.completed).length}
        totalQuestions={totalQuestions}
        streak={streak}
        insights={heroInsights}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 2. MAIN COLUMN (LEFT) */}
        <div className="lg:col-span-8 space-y-12">
          {/* DAILY FOCUS */}
          <DailyFocus tasks={dailyTasks} />
          
          {/* SYLLABUS TREE */}
          <SyllabusTree subjects={subjectList} />
        </div>

        {/* 3. SIDE COLUMN (RIGHT) */}
        <div className="lg:col-span-4 space-y-8">
          {/* ACTIVITY HEATMAP */}
          <ActivityHeatmap />
          
          {/* CRITICAL SUBJECTS */}
          <CriticalSubjects subjects={criticalList} />
          
          {/* MINI GAMIFICATION PREVIEW */}
          <div className="p-8 rounded-[2rem] glass-card space-y-4">
            <h3 className="font-black text-lg text-white">Milestones</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 grayscale opacity-40">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">🏆</div>
                <div>
                  <p className="text-sm font-bold text-white">Lendário</p>
                  <p className="text-[10px] text-white/40 uppercase">5000 Questões</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">🔥</div>
                <div>
                  <p className="text-sm font-bold text-white">Constante</p>
                  <p className="text-[10px] text-primary uppercase tracking-widest font-black">7 Dias Seguidos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}