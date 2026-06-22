import { motion } from 'framer-motion'

export default function ProgressTracker({ watched, total }) {
  const pct = total > 0 ? (watched / total) * 100 : 0

  return (
    <div className="bg-card rounded-2xl p-5 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-sm font-medium">Overall Progress</span>
        <span className="text-white font-bold text-sm">{watched} / {total}</span>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
        {pct > 0 && (
          <motion.div
            className="absolute top-0 h-full w-8 bg-white/20 blur-sm rounded-full"
            initial={{ left: '-10%' }}
            animate={{ left: `${pct - 2}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-white/30 text-xs">0%</span>
        <motion.span
          className="text-primary font-bold text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {Math.round(pct)}%
        </motion.span>
        <span className="text-white/30 text-xs">100%</span>
      </div>
    </div>
  )
}
