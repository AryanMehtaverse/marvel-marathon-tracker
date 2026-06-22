import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Film, CheckCircle2, Clock, Flame, Target, Star, Zap, TrendingUp, Download, Upload } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import GoalTracker from './GoalTracker'
import Milestones from './Milestones'
import ProgressTracker from './ProgressTracker'

function StatCard({ icon: Icon, label, value, sub, color = '#E62429', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card rounded-2xl p-5 border border-white/5 card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-black text-white mb-1">
        <AnimatedCounter value={typeof value === 'number' ? value : 0} />
        {typeof value === 'string' && value}
      </div>
      <div className="text-white/50 text-sm font-medium">{label}</div>
      {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
    </motion.div>
  )
}

export default function Dashboard({ entries, unlockedAchievements, onExport, onImport }) {
  const importRef = useRef(null)

  const total            = entries.length
  const watched          = entries.filter(e => e.watched).length
  const remaining        = total - watched
  const pct              = total > 0 ? Math.round((watched / total) * 100) : 0
  const watchedRuntime   = entries.filter(e => e.watched).reduce((s, e) => s + e.runtime, 0)
  const remainingRuntime = entries.filter(e => !e.watched).reduce((s, e) => s + e.runtime, 0)
  const watchedHours     = Math.round(watchedRuntime / 60)
  const remainingHours   = Math.round(remainingRuntime / 60)

  const nextEntry = entries.find(e => !e.watched)

  // Streak: count trailing consecutive watched entries from the end of watched entries
  let streak = 0
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].watched) streak++
    else break
  }
  // Also compute leading streak (from beginning), use whichever is higher
  let leadStreak = 0
  for (const e of entries) {
    if (e.watched) leadStreak++
    else break
  }
  streak = Math.max(streak, leadStreak)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-card border border-white/5 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Your Marvel Journey</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Marvel <span className="text-gradient">Marathon</span>
          </h1>
          <p className="text-white/50 text-base max-w-lg">
            Tracking the ultimate superhero saga — from X-Men (2000) to Avengers: Doomsday (2026) and beyond.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="text-5xl font-black text-gradient">
              <AnimatedCounter value={pct} suffix="%" />
            </div>
            <div>
              <div className="text-white font-semibold">Complete</div>
              <div className="text-white/40 text-sm">{watched} of {total} entries watched</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <ProgressTracker watched={watched} total={total} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard icon={Film}         label="Total Entries"   value={total}          color="#E62429" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Watched"         value={watched}        color="#22C55E" delay={0.1} />
        <StatCard icon={Clock}        label="Remaining"       value={remaining}      color="#3B82F6" delay={0.15} />
        <StatCard icon={TrendingUp}   label="Completion"      value={pct}            color="#8B5CF6" delay={0.2}  sub="percent" />
        <StatCard icon={Zap}          label="Hours Watched"   value={watchedHours}   color="#F59E0B" delay={0.25} sub="estimated" />
        <StatCard icon={Clock}        label="Hours Remaining" value={remainingHours} color="#EC4899" delay={0.3}  sub="estimated" />
        <StatCard icon={Flame}        label="Current Streak"  value={streak}         color="#EF4444" delay={0.35} sub="consecutive" />
        <StatCard icon={Star}         label="Achievements"    value={unlockedAchievements.length} color="#FFD700" delay={0.4} sub="unlocked" />
      </div>

      {/* Next up */}
      {nextEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-2xl p-5 border border-primary/20 flex items-center gap-5"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target size={24} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Up Next</div>
            <div className="text-white font-bold text-lg truncate">{nextEntry.title}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-white/40 text-xs">{nextEntry.year}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-white/50">{nextEntry.type}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary/80">{nextEntry.phase}</span>
              <span className="text-white/40 text-xs">{(nextEntry.runtime / 60).toFixed(1)}h</span>
              {nextEntry.upcoming && (
                <span className="text-xs font-bold text-yellow-400 bg-yellow-500/15 px-2 py-0.5 rounded-full border border-yellow-500/30">Coming Soon</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <div className="text-white/25 text-xs">{nextEntry.universe}</div>
          </div>
        </motion.div>
      )}

      {/* Goal Tracker */}
      <GoalTracker entries={entries} />

      {/* Milestones */}
      <Milestones entries={entries} />

      {/* Data Export / Import */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-5 border border-white/5"
      >
        <div className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Progress Data</div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            <Download size={14} />
            Export Progress
          </button>
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            <Upload size={14} />
            Import Progress
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={onImport}
          />
        </div>
        <div className="text-white/20 text-xs mt-2">Save a backup or restore progress on a new device.</div>
      </motion.div>
    </div>
  )
}
