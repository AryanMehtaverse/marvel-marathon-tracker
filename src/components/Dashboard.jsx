import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, CheckCircle2, Star, TrendingUp, Download, Upload } from 'lucide-react'
import { WatchOnTVButton } from './WatchOnTV'
import AnimatedCounter from './AnimatedCounter'
import GoalTracker from './GoalTracker'
import Milestones from './Milestones'
import ProgressTracker from './ProgressTracker'
import GeneratedPoster from './GeneratedPoster'

const UNIVERSE_COLOR = {
  MCU: '#E62429', 'Fox X-Men': '#F59E0B', 'Netflix Marvel': '#EC4899',
  'Sony Spider-Man': '#3B82F6', 'Spider-Verse': '#A855F7',
}

// UTC timestamps for upcoming releases (IST = UTC+5:30, so noon IST = 06:30 UTC)
const RELEASE_DATES = [
  { id: 83, title: 'Spider-Man: Brand New Day',    utc: Date.UTC(2026,  6, 25,  6, 30) }, // Jul 25 2026 noon IST
  { id: 81, title: 'Daredevil: Born Again S2',     utc: Date.UTC(2026,  8, 18,  6, 30) }, // Sep 18 2026 noon IST
  { id: 82, title: 'The Punisher: One Last Kill',  utc: Date.UTC(2026, 10,  6,  6, 30) }, // Nov 06 2026 noon IST
]

function useCountdown(utcMs) {
  const getRemaining = () => {
    const diff = utcMs - Date.now()
    if (diff <= 0) return null
    const days    = Math.floor(diff / 86400000)
    const hours   = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000)  / 60000)
    const seconds = Math.floor((diff % 60000)    / 1000)
    return { days, hours, minutes, seconds }
  }
  const [remaining, setRemaining] = useState(getRemaining)
  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [utcMs])
  return remaining
}

function CountdownChip({ title, utc }) {
  const rem = useCountdown(utc)
  if (!rem) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2.5 mt-4"
    >
      <div className="flex flex-col">
        <span className="text-white/40 text-[10px] font-heading uppercase tracking-widest leading-none mb-1">
          Next release · IST
        </span>
        <span className="text-white font-heading font-bold text-sm truncate max-w-[160px]">{title}</span>
      </div>
      <div className="h-6 w-px bg-white/10" />
      <div className="flex items-end gap-2">
        {[
          { v: rem.days,    l: 'd'  },
          { v: rem.hours,   l: 'h'  },
          { v: rem.minutes, l: 'm'  },
          { v: rem.seconds, l: 's'  },
        ].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center leading-none">
            <span className="font-display text-primary text-2xl leading-none tabular-nums">{String(v).padStart(2, '0')}</span>
            <span className="text-white/30 text-[9px] font-heading uppercase tracking-widest mt-0.5">{l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
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

function UniverseBreakdown({ entries }) {
  const universes = [
    { key: 'MCU',             label: 'MCU'          },
    { key: 'Netflix Marvel',  label: 'Netflix'       },
    { key: 'Fox X-Men',       label: 'Fox X-Men'     },
    { key: 'Sony Spider-Man', label: 'Sony'          },
    { key: 'Spider-Verse',    label: 'Spider-Verse'  },
  ]
  return (
    <div className="space-y-3">
      {universes.map(({ key, label }) => {
        const all     = entries.filter(e => e.universe === key)
        const done    = all.filter(e => e.watched).length
        const pct     = all.length > 0 ? Math.round((done / all.length) * 100) : 0
        const color   = UNIVERSE_COLOR[key] || '#6B7280'
        return (
          <div key={key} className="flex items-center gap-3">
            <div className="w-24 text-right text-white/40 text-xs font-medium flex-shrink-0">{label}</div>
            <div className="flex-1 h-2 bg-white/6 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <div className="w-16 text-white/30 text-xs flex-shrink-0">
              {done}/{all.length} <span className="text-white/15">({pct}%)</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RecentlyWatched({ entries, watchedIds, getPoster }) {
  // Last 5 watched in the order they were added (end of watchedIds array = most recent)
  const recent = [...watchedIds]
    .reverse()
    .slice(0, 5)
    .map(id => entries.find(e => e.id === id))
    .filter(Boolean)

  if (recent.length === 0) return (
    <div className="text-white/20 text-sm text-center py-6">Nothing watched yet — start your marathon!</div>
  )

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {recent.map((entry, i) => {
        const posterUrl = getPoster?.(entry.id)
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="flex-shrink-0 flex flex-col gap-1.5"
          >
            <div className="relative w-20 aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-primary/30">
              <RecentPoster entry={entry} posterUrl={posterUrl} />
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 size={9} className="text-white" />
              </div>
            </div>
            <div className="text-white/40 text-[9px] font-medium truncate w-20 text-center leading-tight">{entry.title}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

function RecentPoster({ entry, posterUrl }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const showReal = posterUrl && !imgError
  return (
    <>
      <div className={`absolute inset-0 transition-opacity duration-300 ${showReal && imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <GeneratedPoster entry={entry} watched />
      </div>
      {showReal && (
        <img
          src={posterUrl}
          alt={entry.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
    </>
  )
}

function ContinueWatching({ entries, onToggle }) {
  // Next 3 unwatched, skip upcoming if no non-upcoming available
  const queue = entries.filter(e => !e.watched).slice(0, 3)
  if (queue.length === 0) return null

  return (
    <div className="space-y-2">
      {queue.map((entry, i) => {
        const color = UNIVERSE_COLOR[entry.universe] || '#E62429'
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all group"
          >
            {/* Clicking the number badge marks as watched */}
            <button
              onClick={() => onToggle(entry.id)}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-display text-lg hover:scale-110 transition-transform cursor-pointer"
              style={{ background: `${color}18`, color }}
              title="Mark as watched"
            >
              {i + 1}
            </button>
            {/* Title area — clicking marks watched too */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onToggle(entry.id)}>
              <div className="text-white font-heading font-semibold text-sm uppercase tracking-wide truncate group-hover:text-primary/90 transition-colors">
                {entry.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium" style={{ color }}>{entry.universe}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/30 text-xs">{entry.year}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/30 text-xs">{(entry.runtime / 60).toFixed(1)}h</span>
                {entry.upcoming && (
                  <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/12 px-1.5 py-0.5 rounded border border-yellow-500/20">SOON</span>
                )}
              </div>
            </div>
            {/* Watch on TV — separate, never triggers toggle */}
            <WatchOnTVButton entry={entry} />
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Dashboard({ entries, watchedIds, unlockedAchievements, onExport, onImport, onToggle, getPoster }) {
  const importRef = useRef(null)

  const total          = entries.length
  const watched        = entries.filter(e => e.watched).length
  const pct            = total > 0 ? Math.round((watched / total) * 100) : 0
  const watchedHours   = Math.round(entries.filter(e => e.watched).reduce((s, e) => s + e.runtime, 0) / 60)
  const remainingHours = Math.round(entries.filter(e => !e.watched).reduce((s, e) => s + e.runtime, 0) / 60)

  // Find the next upcoming release still in the future
  const nextRelease = RELEASE_DATES
    .filter(r => r.utc > Date.now())
    .sort((a, b) => a.utc - b.utc)[0] ?? null

  return (
    <div className="space-y-10">

      {/* ── Hero banner ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[360px] flex items-end"
        style={{ background: 'linear-gradient(135deg, #1a0005 0%, #0d0000 40%, #0B0B0B 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary opacity-[0.08] blur-[80px]" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-primary opacity-[0.05] blur-[60px]" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="section-label mb-3">Your Marvel Journey</div>
            <h1 className="font-display text-6xl sm:text-8xl text-white leading-none mb-2">
              MARVEL<span className="text-primary"> MARATHON</span>
            </h1>
            <p className="text-white/40 text-sm max-w-md mb-6 font-sans">
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

            {/* Countdown chip */}
            {nextRelease && (
              <CountdownChip title={nextRelease.title} utc={nextRelease.utc} />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Continue Watching ─────────────────────────────────────── */}
      <div>
        <div className="section-title mb-4">Continue Watching</div>
        <ContinueWatching entries={entries} onToggle={onToggle} />
      </div>

      {/* ── Recently Watched ──────────────────────────────────────── */}
      <div>
        <div className="section-title mb-4">Recently Watched</div>
        <RecentlyWatched entries={entries} watchedIds={watchedIds} getPoster={getPoster} />
      </div>

      {/* ── Stats grid ────────────────────────────────────────────── */}
      <div>
        <div className="section-title mb-5">Overview</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill icon={CheckCircle2} label="Watched"      value={watched}                    color="#22C55E" delay={0.05} />
          <StatPill icon={Clock}        label="Hours In"     value={watchedHours}               color="#F59E0B" delay={0.1}  suffix="h" />
          <StatPill icon={TrendingUp}   label="Remaining"    value={total - watched}            color="#3B82F6" delay={0.15} />
          <StatPill icon={Star}         label="Achievements" value={unlockedAchievements.length} color="#FFD700" delay={0.2} />
        </div>
      </div>

      {/* ── Universe breakdown ────────────────────────────────────── */}
      <div>
        <div className="section-title mb-5">Universe Progress</div>
        <div className="bg-card rounded-2xl border border-white/5 p-5">
          <UniverseBreakdown entries={entries} />
        </div>
      </div>

      {/* ── Phase Progress ────────────────────────────────────────── */}
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
