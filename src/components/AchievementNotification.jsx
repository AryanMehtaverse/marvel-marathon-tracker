import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function AchievementNotification({ queue, onDismiss }) {
  const current = queue[0] || null

  useEffect(() => {
    if (!current) return
    const timer = setTimeout(() => onDismiss(current.id), 4000)
    return () => clearTimeout(timer)
  }, [current, onDismiss])

  return (
    <div className="fixed top-20 right-3 sm:top-6 sm:right-6 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto"
          >
            <div className="glass rounded-2xl p-4 flex items-center gap-3 w-[min(320px,calc(100vw-1.5rem))] glow-gold border border-yellow-500/30">
              <div className="text-4xl no-select">{current.label.split(' ')[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gold uppercase tracking-widest mb-0.5">Achievement Unlocked!</div>
                <div className="text-white font-bold text-sm leading-tight truncate">{current.label.replace(/^[^\s]+\s/, '')}</div>
                <div className="text-white/50 text-xs mt-0.5">{current.description}</div>
              </div>
              <button
                onClick={() => onDismiss(current.id)}
                className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
