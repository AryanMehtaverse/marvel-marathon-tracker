import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Film, Tv, Star, TrendingUp } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

const UNIVERSE_COLORS = {
  MCU: '#E62429', 'Fox X-Men': '#F59E0B', 'Netflix Marvel': '#EC4899', 'Sony Spider-Man': '#3B82F6', 'Spider-Verse': '#A855F7',
}
const PHASE_COLORS = {
  'Pre-MCU': '#6B7280', 'Phase 1': '#3B82F6', 'Phase 2': '#8B5CF6',
  'Phase 3': '#E62429', 'Phase 4': '#10B981', 'Phase 5': '#F59E0B',
  'Phase 6': '#FFD700', 'Netflix': '#E50914',
}
const TYPE_COLORS = { Movie: '#60A5FA', Series: '#4ADE80', Special: '#C084FC' }

function StatBar({ label, watched, total, color, delay = 0 }) {
  const pct = total > 0 ? (watched / total) * 100 : 0
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <div className="w-28 sm:w-36 text-white/60 text-xs font-medium truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: delay + 0.1 }}
        />
      </div>
      <div className="text-white/40 text-xs w-16 text-right flex-shrink-0">
        {watched}/{total} <span className="text-white/20">({Math.round(pct)}%)</span>
      </div>
    </motion.div>
  )
}

function DonutChart({ data, total }) {
  const size = 160
  const cx = size / 2, cy = size / 2
  const r = 56, strokeW = 22
  const circumference = 2 * Math.PI * r

  let offset = 0
  const segments = data.map(d => {
    const pct = total > 0 ? d.count / total : 0
    const dash = pct * circumference
    const seg = { ...d, dashArray: `${dash} ${circumference - dash}`, dashOffset: -offset * circumference }
    offset += pct
    return seg
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW} />
      {segments.map((seg, i) => (
        <motion.circle
          key={seg.label}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeDasharray={`0 ${circumference}`}
          strokeDashoffset={seg.dashOffset}
          animate={{ strokeDasharray: seg.dashArray }}
          transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

function SectionTitle({ children }) {
  return <div className="text-white font-bold text-base mb-4">{children}</div>
}

export default function StatsView({ entries }) {
  const stats = useMemo(() => {
    const watched = entries.filter(e => e.watched)
    const totalRuntime  = entries.reduce((s, e) => s + e.runtime, 0)
    const watchedRuntime = watched.reduce((s, e) => s + e.runtime, 0)

    const byUniverse = {}
    const byPhase    = {}
    const byType     = {}

    for (const e of entries) {
      byUniverse[e.universe] = byUniverse[e.universe] || { total: 0, watched: 0 }
      byUniverse[e.universe].total++
      if (e.watched) byUniverse[e.universe].watched++

      byPhase[e.phase] = byPhase[e.phase] || { total: 0, watched: 0 }
      byPhase[e.phase].total++
      if (e.watched) byPhase[e.phase].watched++

      byType[e.type] = byType[e.type] || { total: 0, watched: 0 }
      byType[e.type].total++
      if (e.watched) byType[e.type].watched++
    }

    const typeDonut = Object.entries(byType).map(([label, v]) => ({
      label, count: v.total, color: TYPE_COLORS[label] || '#fff'
    }))

    return { watched: watched.length, total: entries.length, totalRuntime, watchedRuntime, byUniverse, byPhase, byType, typeDonut }
  }, [entries])

  const pct = stats.total > 0 ? Math.round((stats.watched / stats.total) * 100) : 0
  const watchedHrs = Math.round(stats.watchedRuntime / 60)
  const totalHrs   = Math.round(stats.totalRuntime / 60)
  const remainHrs  = totalHrs - watchedHrs

  return (
    <div className="space-y-8">
      <h2 className="text-white font-bold text-xl">Stats & Analytics</h2>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Watched',        value: stats.watched,  sub: `of ${stats.total} entries`, icon: Film,       color: '#E62429' },
          { label: 'Completion',     value: pct,            sub: 'percent done',              icon: TrendingUp,  color: '#8B5CF6', suffix: '%' },
          { label: 'Hours Watched',  value: watchedHrs,     sub: `${remainHrs}h remaining`,  icon: Clock,       color: '#F59E0B' },
          { label: 'Total Runtime',  value: totalHrs,       sub: `${Math.round(totalHrs / 24)}+ days`,          icon: Clock,       color: '#3B82F6' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-4 border border-white/5"
          >
            <kpi.icon size={18} style={{ color: kpi.color }} className="mb-2" />
            <div className="text-2xl font-black text-white">
              <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ''} />
            </div>
            <div className="text-white/40 text-xs mt-1">{kpi.label}</div>
            <div className="text-white/25 text-xs">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Universe breakdown + type donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Universe */}
        <div className="bg-card rounded-2xl p-5 border border-white/5">
          <SectionTitle>By Universe</SectionTitle>
          <div className="space-y-3">
            {Object.entries(stats.byUniverse).map(([u, v], i) => (
              <StatBar
                key={u} label={u} watched={v.watched} total={v.total}
                color={UNIVERSE_COLORS[u] || '#fff'} delay={i * 0.07}
              />
            ))}
          </div>
        </div>

        {/* Type distribution donut */}
        <div className="bg-card rounded-2xl p-5 border border-white/5">
          <SectionTitle>Content Type</SectionTitle>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <DonutChart data={stats.typeDonut} total={stats.total} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl font-black text-white">{stats.total}</div>
                <div className="text-white/30 text-xs">total</div>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              {Object.entries(stats.byType).map(([type, v], i) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_COLORS[type] }} />
                    <span className="text-white/60 text-sm">{type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold text-sm">{v.total}</span>
                    <span className="text-white/30 text-xs ml-1">({v.watched} watched)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phase breakdown */}
      <div className="bg-card rounded-2xl p-5 border border-white/5">
        <SectionTitle>By Phase</SectionTitle>
        <div className="space-y-3">
          {Object.entries(stats.byPhase)
            .sort((a, b) => {
              const order = ['Pre-MCU','Netflix','Phase 1','Phase 2','Phase 3','Phase 4','Phase 5','Phase 6']
              return order.indexOf(a[0]) - order.indexOf(b[0])
            })
            .map(([phase, v], i) => (
              <StatBar
                key={phase} label={phase} watched={v.watched} total={v.total}
                color={PHASE_COLORS[phase] || '#fff'} delay={i * 0.06}
              />
            ))}
        </div>
      </div>

      {/* Watch time breakdown */}
      <div className="bg-card rounded-2xl p-5 border border-white/5">
        <SectionTitle>Watch Time by Universe (hours)</SectionTitle>
        <div className="space-y-3">
          {Object.entries(
            entries.reduce((acc, e) => {
              if (!acc[e.universe]) acc[e.universe] = { watched: 0, total: 0 }
              acc[e.universe].total += e.runtime
              if (e.watched) acc[e.universe].watched += e.runtime
              return acc
            }, {})
          ).map(([u, v], i) => (
            <motion.div
              key={u}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="w-28 sm:w-36 text-white/60 text-xs font-medium truncate flex-shrink-0">{u}</div>
              <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: UNIVERSE_COLORS[u] || '#fff' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(v.total / (entries.reduce((s, e) => s + e.runtime, 0))) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 + 0.1 }}
                />
              </div>
              <div className="text-white/40 text-xs w-24 text-right flex-shrink-0">
                {Math.round(v.watched / 60)}h / {Math.round(v.total / 60)}h
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
