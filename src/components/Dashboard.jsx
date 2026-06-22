import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle2, Flame, Star, TrendingUp, Download, Upload, ChevronRight, Zap } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import GoalTracker from './GoalTracker'
import Milestones from './Milestones'
import ProgressTracker from './ProgressTracker'

const UNIVERSE_COLOR = {
  MCU: '#E62429', 'Fox X-Men': '#F59E0B', 'Netflix Marvel': '#EC4899',
  'Sony Spider-Man': '#3B82F6', 'Spider-Verse': '#A855F7',
}

function StatPill({ icon: Icon, label, value, color, suffix = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex flex-col gap-1.5 p-5 rounded-2xl border border-white/6 bg-white/3 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-white/40 text-xs font-heading uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-display text-white leading-none mt-1">
        <AnimatedCounter value={typeof value === 'number' ? value : 0} suffix={suffix} />
        {typeof value === 'string' && value}
      </div>
    </motion.div>
  )
}

export default function Dashboard({ entries, unlockedAchievements, onExport, onImport }) {
  const importRef = useRef(null)

  const total          = entries.length
  const watched        = entries.filter(e => e.watched).length
  const pct            = total > 0 ? Math.round((watched / total) * 100) : 0
  const watchedHours   = Math.round(entries.filter(e => e.watched).reduce((s, e) => s + e.runtime, 0) / 60)
  const remainingHours = Math.round(entries.filter(e => !e.watched).reduce((s, e) => s + e.runtime, 0) / 60)
  const nextEntry      = entries.find(e => !e.watched)

  let streak = 0, leadStreak = 0
  for (let i = entries.length - 1; i >= 0; i--) { if (entries[i].watched) streak++; else break }
  for (const e of entries) { if (e.watched) leadStreak++; else break }
  streak = Math.max(streak, leadStreak)

  return (
    <div className="space-y-10">

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[360px] flex items-end"
        style={{
          background: 'linear-gradient(135deg, #1a0005 0%, #0d0000 40%, #0B0B0B 100%)',
        }}
      >
        {/* Background art */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary opacity-[0.08] blur-[80px]" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-primary opacity-[0.05] blur-[60px]" />

          {/* Red accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="section-label mb-3">Your Marvel Journey</div>
            <h1 className="font-display text-6xl sm:text-8xl text-white leading-none mb-2">
              MARVEL
              <span className="text-primary"> MARATHON</span>
            </h1>
            <p className="text-white/40 text-sm max-w-md mb-8 font-sans">
              Tracking every Marvel story — from X-Men (2000) to Avengers: Doomsday (2026) and beyond.
            </p>

            {/* Big completion stat */}
            <div className="flex items-end gap-6 flex-wrap">
              <div>
                <div className="font-display text-7xl sm:text-9xl leading-none" style={{ color: pct === 100 ? '#FFD700' : '#E62429' }}>
                  <AnimatedCounter value={pct} suffix="%" />
                </div>
                <div className="text-white/30 text-sm font-heading uppercase tracking-widest mt-1">
                  {watched} of {total} titles watched
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1 min-w-[160px] mb-3">
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-white/25 text-xs">{watchedHours}h watched</span>
                  <span className="text-white/25 text-xs">{remainingHours}h remaining</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Up Next card ─────────────────────────────────────────── */}
      {nextEntry && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-5 p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/5 transition-all group"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${UNIVERSE_COLOR[nextEntry.universe] || '#E62429'}20` }}
          >
            <Play size={20} style={{ color: UNIVERSE_COLOR[nextEntry.universe] || '#E62429' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="section-label mb-0.5">Up Next</div>
            <div className="text-white font-heading font-bold text-lg uppercase tracking-wide truncate">{nextEntry.title}</div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-white/35 text-xs">{nextEntry.year}</span>
              <span className="text-white/35 text-xs">{nextEntry.type}</span>
              <span className="text-white/35 text-xs">{nextEntry.phase}</span>
              <span className="text-white/35 text-xs">{(nextEntry.runtime / 60).toFixed(1)}h</span>
              {nextEntry.upcoming && (
                <span className="text-xs font-bold text-yellow-400 bg-yellow-500/12 px-2 py-0.5 rounded border border-yellow-500/25">Coming Soon</span>
              )}
            </div>
          </div>
          <ChevronRight size={18} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
        </motion.div>
      )}

      {/* ── Stats grid ────────────────────────────────────────────── */}
      <div>
        <div className="section-title mb-5">Overview</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatPill icon={CheckCircle2} label="Watched"    value={watched}        color="#22C55E" delay={0.05} />
          <StatPill icon={Clock}        label="Hours In"   value={watchedHours}   color="#F59E0B" delay={0.1}  suffix="h" />
          <StatPill icon={TrendingUp}   label="Complete"   value={pct}            color="#E62429" delay={0.15} suffix="%" />
          <StatPill icon={Flame}        label="Streak"     value={streak}         color="#EF4444" delay={0.2} />
          <StatPill icon={Clock}        label="Remaining"  value={remainingHours} color="#3B82F6" delay={0.25} suffix="h" />
          <StatPill icon={Star}         label="Achievements" value={unlockedAchievements.length} color="#FFD700" delay={0.3} />
          <StatPill icon={Zap}          label="Total"      value={total}          color="#8B5CF6" delay={0.35} />
          <StatPill icon={TrendingUp}   label="Remaining"  value={total - watched} color="#6B7280" delay={0.4} />
        </div>
      </div>

      {/* ── Progress tracker ─────────────────────────────────────── */}
      <div>
        <div className="section-title mb-5">Phase Progress</div>
        <ProgressTracker watched={watched} total={total} />
      </div>

      {/* ── Goal + Milestones ─────────────────────────────────────── */}
      <div>
        <div className="section-title mb-5">Goals</div>
        <GoalTracker entries={entries} />
      </div>

      <div>
        <div className="section-title mb-5">Milestones</div>
        <Milestones entries={entries} />
      </div>

      {/* ── Export / Import ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/6 bg-white/2">
        <div>
          <div className="section-label mb-0.5">Progress Data</div>
          <div className="text-white/30 text-xs">Backup or restore your watch history</div>
        </div>
        <div className="flex gap-3">
          <button onClick={onExport} className="btn-ghost flex items-center gap-2 text-xs">
            <Download size={13} /> Export
          </button>
          <button onClick={() => importRef.current?.click()} className="btn-ghost flex items-center gap-2 text-xs">
            <Upload size={13} /> Import
          </button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={onImport} />
        </div>
      </div>

    </div>
  )
}
