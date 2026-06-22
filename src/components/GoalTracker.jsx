import { motion } from 'framer-motion'
import { Target, Sparkles } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

export default function GoalTracker({ entries }) {
  const goalId = 83 // Spider-Man: Brand New Day
  const goalIndex = entries.findIndex(e => e.id === goalId)
  const entriesUpToGoal = entries.slice(0, goalIndex + 1)
  const watchedUpToGoal = entriesUpToGoal.filter(e => e.watched).length
  const totalUpToGoal = entriesUpToGoal.length
  const remaining = totalUpToGoal - watchedUpToGoal
  const pct = totalUpToGoal > 0 ? Math.round((watchedUpToGoal / totalUpToGoal) * 100) : 0
  const isComplete = remaining === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-500 ${
        isComplete
          ? 'border-gold/40 animate-glow-gold'
          : 'border-yellow-500/20'
      }`}
      style={{
        background: isComplete
          ? 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(22,22,22,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255,215,0,0.04) 0%, rgba(22,22,22,0.95) 100%)',
        boxShadow: isComplete
          ? '0 0 30px rgba(255,215,0,0.2), 0 0 60px rgba(255,215,0,0.08)'
          : '0 0 20px rgba(255,215,0,0.05)',
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              {isComplete ? <Sparkles size={20} className="text-gold" /> : <Target size={20} className="text-gold" />}
            </div>
            <div>
              <div className="text-xs font-semibold text-gold uppercase tracking-widest">Primary Goal</div>
              <div className="text-white font-bold text-lg">Spider-Man: Brand New Day</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-gradient-gold">
              <AnimatedCounter value={pct} suffix="%" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-gold/60 text-xs font-medium mb-1">Entries Remaining</div>
            <div className="text-white font-black text-2xl">
              <AnimatedCounter value={remaining} />
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="text-gold/60 text-xs font-medium mb-1">Watched</div>
            <div className="text-white font-black text-2xl">
              <AnimatedCounter value={watchedUpToGoal} />
              <span className="text-white/30 text-sm font-normal"> / {totalUpToGoal}</span>
            </div>
          </div>
        </div>

        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center"
          >
            <div className="text-gold font-bold text-sm">🌅 Goal Achieved! Brand New Day has arrived!</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
