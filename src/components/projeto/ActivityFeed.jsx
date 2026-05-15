import { motion, AnimatePresence } from 'framer-motion';
import { generateActivityFeed, AVATARS } from '@/lib/studyUtils';
import moment from 'moment';
import 'moment/locale/pt-br';
import { Activity } from 'lucide-react';

moment.locale('pt-br');

export default function ActivityFeed({ entries }) {
  const feed = generateActivityFeed(entries);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-3xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-space font-bold text-lg">Feed de Atividades</h3>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium">ao vivo</span>
      </div>

      {feed.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-sm">Nenhuma atividade ainda. Vamos estudar!</p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 max-h-[420px] overflow-y-auto">
          <AnimatePresence>
            {feed.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors ${
                  item.highlight ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className={`shrink-0 text-xl w-9 h-9 rounded-xl flex items-center justify-center ${
                  item.highlight ? 'bg-primary/20' : 'bg-muted/60'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed">
                      <span className="font-bold text-foreground">{AVATARS[item.participant]} {item.participant}</span>
                      <span className="text-muted-foreground"> fez </span>
                      <span className="font-semibold text-foreground">{item.questions} questões</span>
                      <span className="text-muted-foreground"> em </span>
                      <span className="text-primary font-medium">{item.subject}</span>
                      {item.accuracy >= 80 && (
                        <span className="ml-1 text-xs bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded-full">
                          🎯 {item.accuracy}%
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {moment(item.date).fromNow()}
                    </span>
                    {item.points > 0 && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.points >= 5
                          ? 'bg-yellow-400/15 text-yellow-400'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        +{item.points} pts
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}