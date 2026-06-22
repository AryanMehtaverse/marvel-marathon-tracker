import { motion } from 'framer-motion'
import { Lock, CheckCircle } from 'lucide-react'
import { MILESTONES } from '../data/entries'

export default function Milestones({ entries }) {
  return (
    <div>
      <div className="text-white font-bold text-lg mb-4">Milestones</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {MILESTONES.map((ms, i) => {
          const entry = entries.find(e => e.id === ms.entryId)
          const unlocked = entry?.watched ?? false
          return (
            <motion.div
              key={ms.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 ${
                unlocked
                  ? 'border-white/10 bg-card'
                  : 'border-white/5 bg-card/50 opacity-60'
              }`}
              style={unlocked ? { boxShadow: `0 0 20px ${ms.color}15` } : {}}
            >
              {unlocked && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${ms.color}08 0%, transparent 60%)` }}
                />
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl no-select">{ms.icon}</span>
                  {unlocked
                    ? <CheckCircle size={16} style={{ color: ms.color }} />
                    : <Lock size={14} className="text-white/20" />
                  }
                </div>
                <div className={`text-xs font-bold leading-tight ${unlocked ? 'text-white' : 'text-white/40'}`}>
                  {ms.title}
                </div>
                <div className={`text-xs mt-1 ${unlocked ? 'text-white/40' : 'text-white/20'}`}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
