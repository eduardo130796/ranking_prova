import { motion } from 'framer-motion';

export default function AchievementBadge({ achievement }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      title={achievement.progress ? `Progresso: ${achievement.progress}` : achievement.label}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-default ${
        achievement.unlocked
          ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
          : 'bg-muted/30 text-muted-foreground/40 border-border/40'
      }`}
    >
      <span className={achievement.unlocked ? '' : 'grayscale opacity-50'}>{achievement.icon}</span>
      <span className={achievement.unlocked ? '' : 'line-through'}>{achievement.label}</span>
      {!achievement.unlocked && achievement.progress && (
        <span className="text-[10px] opacity-60">({achievement.progress})</span>
      )}
    </motion.div>
  );
}