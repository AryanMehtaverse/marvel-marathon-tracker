import { motion } from 'framer-motion'
import { Lock, Trophy } from 'lucide-react'
import { ACHIEVEMENTS_DEF } from '../data/entries'

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0
  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white/25 text-xs">{current} / {total}</span>
        <span className="text-white/25 text-xs">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-white/20"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function Achievements({ entries, unlockedAchievements, onReset }) {
  // Sort: unlocked first, then locked
  const sorted = [...ACHIEVEMENTS_DEF].sort((a, b) => {
    const au = unlockedAchievements.includes(a.id)
    const bu = unlockedAchievements.includes(b.id)
    if (au && !bu) return -1
    if (!au && bu) return  1
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Achievements</h2>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">{unlockedAchievements.length}/{ACHIEVEMENTS_DEF.length} unlocked</span>
          <button
            onClick={() => { if (window.confirm('Reset all achievements? This cannot be undone.')) onReset() }}
            className="text-white/20 hover:text-red-400 text-xs transition-colors border border-white/10 hover:border-red-500/30 px-2 py-1 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-card rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-gold" />
            <span className="text-white/60 text-sm font-medium">Achievement Progress</span>
          </div>
          <span className="text-gold font-bold text-sm">
            {unlockedAchievements.length} / {ACHIEVEMENTS_DEF.length}
          </span>
        </div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS_DEF.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-white/20 text-xs">Keep watching to unlock more</span>
          <span className="text-white/20 text-xs">{ACHIEVEMENTS_DEF.length - unlockedAchievements.length} remaining</span>
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((ach, i) => {
          const unlocked = unlockedAchievements.includes(ach.id)
          const prog     = !unlocked && ach.progress ? ach.progress(entries) : null

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5) }}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ${
                unlocked
                  ? 'border-yellow-500/30 bg-card'
                  : 'border-white/5 bg-card/60'
              }`}
              style={unlocked ? {
                boxShadow: '0 0 20px rgba(255,215,0,0.08)',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, #161616 100%)',
              } : {}}
            >
              {unlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="relative z-10 flex items-start gap-4">
                <div className={`text-3xl no-select flex-shrink-0 transition-all duration-300 ${unlocked ? '' : 'grayscale opacity-25'}`}>
                  {ach.label.split(' ')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm leading-snug ${unlocked ? 'text-white' : 'text-white/35'}`}>
                    {ach.label.replace(/^[^\s]+\s/, '')}
                  </div>

                  {/* Show description on unlocked; hide on locked */}
                  <div className={`text-xs mt-1 leading-relaxed ${unlocked ? 'text-white/55' : 'text-white/20'}`}>
                    {unlocked ? ach.description : '???'}
                  </div>

                  {/* Unlock status or progress */}
                  {unlocked ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      Unlocked
                    </span>
                  ) : prog ? (
                    <ProgressBar current={prog.current} total={prog.total} />
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/20">
                      <Lock size={10} />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
