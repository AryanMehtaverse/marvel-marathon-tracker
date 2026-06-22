import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { ACHIEVEMENTS_DEF } from '../data/entries'

export default function Achievements({ entries, unlockedAchievements }) {
  const watchedCount = entries.filter(e => e.watched).length
  const total = entries.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Achievements</h2>
        <span className="text-white/30 text-sm">{unlockedAchievements.length}/{ACHIEVEMENTS_DEF.length} unlocked</span>
      </div>

      {/* Progress summary */}
      <div className="bg-card rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">Achievement Progress</span>
          <span className="text-gold font-bold text-sm">
            {unlockedAchievements.length} / {ACHIEVEMENTS_DEF.length}
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS_DEF.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS_DEF.map((ach, i) => {
          const unlocked = unlockedAchievements.includes(ach.id)
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
                unlocked
                  ? 'border-yellow-500/30 bg-card'
                  : 'border-white/5 bg-card/60'
              }`}
              style={unlocked ? {
                boxShadow: '0 0 20px rgba(255,215,0,0.08)',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.04) 0%, #161616 100%)',
              } : {}}
            >
              {unlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              )}
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`text-3xl no-select flex-shrink-0 transition-all duration-300 ${unlocked ? '' : 'grayscale opacity-30'}`}
                >
                  {ach.label.split(' ')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-white/30'}`}>
                    {ach.label.replace(/^[^\s]+\s/, '')}
                  </div>
                  <div className={`text-xs mt-1 ${unlocked ? 'text-white/50' : 'text-white/20'}`}>
                    {ach.description}
                  </div>
                  <div className="mt-2">
                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/20">
                        <Lock size={10} />
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
