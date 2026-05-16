import React from 'react';
import { motion } from 'framer-motion';

export default function ActivityHeatmap({ data = [] }) {
  // Generate mock data if none provided for visualization
  const heatmapData = data.length > 0 ? data : generateMockHeatmapData();

  return (
    <div className="p-8 rounded-[2rem] glass-card space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg text-white">Consistência</h3>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span>Menos</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
          </div>
          <span>Mais</span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {heatmapData.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1.5 flex-shrink-0">
            {week.map((day, dayIdx) => (
              <motion.div
                key={`${weekIdx}-${dayIdx}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (weekIdx * 7 + dayIdx) * 0.002 }}
                className={`w-3.5 h-3.5 rounded-sm ${getIntensityClass(day.value)} transition-colors duration-500`}
                title={`${day.date}: ${day.value} atividades`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Atividade nos últimos 4 meses</p>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Recorde: 14 dias seguidos</p>
      </div>
    </div>
  );
}

function getIntensityClass(value) {
  if (value === 0) return 'bg-white/5 hover:bg-white/10';
  if (value <= 2) return 'bg-primary/20 hover:bg-primary/30';
  if (value <= 5) return 'bg-primary/50 hover:bg-primary/60';
  return 'bg-primary hover:bg-primary-hover';
}

function generateMockHeatmapData() {
  const weeks = [];
  for (let i = 0; i < 16; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push({
        date: `2024-W${i}-D${j}`,
        value: Math.floor(Math.random() * 10)
      });
    }
    weeks.push(week);
  }
  return weeks;
}
