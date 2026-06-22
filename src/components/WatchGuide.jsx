import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Circle, Clock, ChevronRight, Zap, BookOpen, Star, X, Map, List } from 'lucide-react'
import { ENTRIES } from '../data/entries'
import { DEPENDENCIES } from '../data/dependencies'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function sortByRelease(ids) {
  return [...ids].sort((a, b) => {
    const ea = ENTRIES.find(e => e.id === a)
    const eb = ENTRIES.find(e => e.id === b)
    return (ea?.year ?? 0) - (eb?.year ?? 0)
  })
}

function buildFullPath(targetId) {
  // BFS to gather all transitive required deps
  const visited = new Set()
  const queue = [targetId]
  while (queue.length) {
    const id = queue.shift()
    if (visited.has(id)) continue
    visited.add(id)
    const dep = DEPENDENCIES[id]
    if (dep) dep.required.forEach(d => queue.push(d))
  }
  visited.delete(targetId)
  return sortByRelease([...visited])
}

// ── Universe color dots ───────────────────────────────────────────────────────
const UNI_COLOR = {
  MCU: '#E62429', 'Fox X-Men': '#F59E0B', 'Netflix Marvel': '#EC4899',
  'Sony Spider-Man': '#3B82F6', 'Spider-Verse': '#A855F7',
}

// ── Entry row inside a section ────────────────────────────────────────────────
function EntryRow({ entry, tier, index, onToggle }) {
  const tierColor = { required: '#E62429', recommended: '#F59E0B', optional: '#6B7280' }[tier]

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
        entry.watched
          ? 'bg-emerald-500/8 border-emerald-500/20 hover:bg-emerald-500/12'
          : 'bg-white/3 border-white/5 hover:bg-white/6'
      }`}
      onClick={() => onToggle(entry.id)}
    >
      {/* Tier indicator */}
      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: tierColor }} />

      {/* Universe dot */}
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: UNI_COLOR[entry.universe] || '#fff' }} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold leading-tight truncate ${entry.watched ? 'text-white' : 'text-white/70'}`}>
          {entry.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-white/30 text-xs">{entry.year}</span>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white/30 text-xs">{entry.type}</span>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white/30 text-xs">{fmtTime(entry.runtime)}</span>
        </div>
      </div>

      {/* Watch status */}
      <div className="flex-shrink-0">
        {entry.watched
          ? <CheckCircle2 size={18} className="text-emerald-400" />
          : <Circle size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
        }
      </div>
    </motion.div>
  )
}

// ── Path summary card ─────────────────────────────────────────────────────────
function PathCard({ label, emoji, color, ids, entries, desc }) {
  const list = ids.map(id => entries.find(e => e.id === id)).filter(Boolean)
  const watched = list.filter(e => e.watched).length
  const runtime = list.reduce((s, e) => s + e.runtime, 0)
  const pct = list.length > 0 ? Math.round((watched / list.length) * 100) : 0

  return (
    <div className="bg-card rounded-2xl p-4 border border-white/5 flex flex-col gap-3" style={{ borderColor: `${color}25` }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <div>
          <div className="text-white font-bold text-sm">{label}</div>
          <div className="text-white/35 text-xs">{desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-white/50">
          <Clock size={11} />
          {fmtTime(runtime)}
        </div>
        <div className="flex items-center gap-1 text-white/50">
          <CheckCircle2 size={11} />
          {watched}/{list.length} watched
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <div className="text-white/20 text-xs">{pct}% complete</div>
    </div>
  )
}

// ── Visual roadmap graph ──────────────────────────────────────────────────────
function RoadmapView({ requiredIds, recommendedIds, optionalIds, entries }) {
  const tierOf = id => {
    if (requiredIds.includes(id))    return 'required'
    if (recommendedIds.includes(id)) return 'recommended'
    return 'optional'
  }

  const all = sortByRelease([...new Set([...requiredIds, ...recommendedIds, ...optionalIds])])
  const colors = { required: '#E62429', recommended: '#F59E0B', optional: '#4B5563' }
  const labels = { required: 'Required', recommended: 'Recommended', optional: 'Optional' }

  return (
    <div className="space-y-2">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {['required', 'recommended', 'optional'].map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: colors[t] }} />
            <span className="text-white/40 text-xs">{labels[t]}</span>
          </div>
        ))}
      </div>

      {/* Timeline nodes */}
      <div className="relative pl-8">
        {all.map((id, i) => {
          const entry = entries.find(e => e.id === id)
          if (!entry) return null
          const tier  = tierOf(id)
          const color = colors[tier]
          const last  = i === all.length - 1

          return (
            <div key={id} className="relative">
              {/* Connector line */}
              {!last && (
                <div
                  className="absolute left-[-20px] top-[22px] w-0.5 h-[calc(100%+4px)]"
                  style={{ background: `${color}40` }}
                />
              )}

              {/* Node dot */}
              <div
                className="absolute left-[-24px] top-[14px] w-3 h-3 rounded-full border-2 flex-shrink-0"
                style={{ background: entry.watched ? color : '#111', borderColor: color }}
              />

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.035 }}
                className={`mb-3 p-3 rounded-xl border ${
                  entry.watched ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/2'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: UNI_COLOR[entry.universe] }} />
                    <span className={`text-sm font-medium truncate ${entry.watched ? 'text-white' : 'text-white/55'}`}>
                      {entry.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/25 text-xs">{entry.year}</span>
                    {entry.watched && <CheckCircle2 size={13} className="text-emerald-400" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color, background: `${color}18` }}
                  >
                    {labels[tier]}
                  </span>
                  <span className="text-white/20 text-xs">{fmtTime(entry.runtime)}</span>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Search box ────────────────────────────────────────────────────────────────
function SearchBox({ value, onChange, results, onSelect }) {
  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search any Marvel title…"
          className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-72 overflow-y-auto"
          >
            {results.map(entry => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: UNI_COLOR[entry.universe] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{entry.title}</div>
                  <div className="text-white/30 text-xs">{entry.year} · {entry.type} · {entry.universe}</div>
                </div>
                {entry.watched && <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Suggested entry chips ─────────────────────────────────────────────────────
const SUGGESTED = [83, 84, 57, 44, 37, 77, 73, 68, 92]

function SuggestedChips({ entries, onSelect }) {
  return (
    <div className="space-y-3">
      <div className="text-white/30 text-xs font-semibold uppercase tracking-widest">Popular picks</div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED.map(id => {
          const e = entries.find(x => x.id === id)
          if (!e) return null
          return (
            <button
              key={id}
              onClick={() => onSelect(e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-white/60 hover:text-white text-xs font-medium transition-all"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: UNI_COLOR[e.universe] }} />
              {e.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WatchGuide({ entries, onToggle }) {
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState(null)
  const [view,     setView]     = useState('list') // 'list' | 'roadmap'

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return entries.filter(e => e.title.toLowerCase().includes(q)).slice(0, 10)
  }, [query, entries])

  const guide = useMemo(() => {
    if (!selected) return null
    const dep = DEPENDENCIES[selected.id]
    if (!dep) return null

    const req  = sortByRelease(dep.required)
    const rec  = sortByRelease(dep.recommended)
    const opt  = sortByRelease(dep.optional)

    // Minimum path = transitive required deps (all ancestors)
    const minPath = buildFullPath(selected.id)

    // Full context path = minPath + direct recommended
    const fullSet = new Set([...minPath, ...req, ...rec])
    const fullPath = sortByRelease([...fullSet])

    return { req, rec, opt, minPath, fullPath }
  }, [selected])

  function handleSelect(entry) {
    setSelected(entry)
    setQuery('')
    setView('list')
  }

  const sections = guide ? [
    { key: 'required',    label: 'Required Viewing',    emoji: '🔴', color: '#E62429', ids: guide.req,  desc: 'You must watch these first or the story won\'t make sense.' },
    { key: 'recommended', label: 'Highly Recommended',  emoji: '🟡', color: '#F59E0B', ids: guide.rec,  desc: 'Adds important context and payoff. Strongly advised.' },
    { key: 'optional',    label: 'Optional Context',    emoji: '⚪', color: '#6B7280', ids: guide.opt,  desc: 'Fun callbacks and easter eggs — not essential.' },
  ] : []

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-white font-black text-xl">What Do I Need To Watch?</h2>
        <p className="text-white/30 text-sm mt-1">
          Select any title and get a spoiler-free prerequisite guide.
        </p>
      </div>

      {/* Search */}
      <SearchBox
        value={query}
        onChange={setQuery}
        results={results}
        onSelect={handleSelect}
      />

      {/* No selection state */}
      {!selected && (
        <SuggestedChips entries={entries} onSelect={handleSelect} />
      )}

      {/* Selected entry guide */}
      <AnimatePresence mode="wait">
        {selected && guide && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Entry hero card */}
            <div
              className="rounded-2xl p-5 border flex items-start justify-between gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(230,36,41,0.1) 0%, #161616 60%)', borderColor: 'rgba(230,36,41,0.2)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: UNI_COLOR[selected.universe] }} />
                  <span className="text-white/40 text-xs">{selected.universe} · {selected.phase}</span>
                </div>
                <h3 className="text-white font-black text-xl leading-tight">{selected.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-white/40 text-sm">{selected.year}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/40 text-sm">{selected.type}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/40 text-sm">{fmtTime(selected.runtime)}</span>
                  {selected.watched && (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={12} /> Watched
                    </span>
                  )}
                  {selected.upcoming && (
                    <span className="text-yellow-400 text-xs font-bold bg-yellow-500/15 px-2 py-0.5 rounded-full">Coming Soon</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/25 hover:text-white transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* No deps message */}
            {guide.req.length === 0 && guide.rec.length === 0 && guide.opt.length === 0 && (
              <div className="bg-card rounded-2xl p-6 border border-white/5 text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-white font-bold">No prerequisites!</div>
                <div className="text-white/40 text-sm mt-1">This is a great starting point — dive right in.</div>
              </div>
            )}

            {/* Path summary cards */}
            {(guide.req.length > 0 || guide.rec.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PathCard
                  label="Minimum Watch Path"
                  emoji="⚡"
                  color="#E62429"
                  ids={guide.minPath.length > 0 ? guide.minPath : guide.req}
                  entries={entries}
                  desc="Only the essentials to follow the story"
                />
                <PathCard
                  label="Full Context Path"
                  emoji="📚"
                  color="#F59E0B"
                  ids={guide.fullPath}
                  entries={entries}
                  desc="Required + recommended for maximum payoff"
                />
              </div>
            )}

            {/* View toggle */}
            {(guide.req.length + guide.rec.length + guide.opt.length) > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === 'list' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <List size={13} /> List View
                </button>
                <button
                  onClick={() => setView('roadmap')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    view === 'roadmap' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <Map size={13} /> Roadmap View
                </button>
              </div>
            )}

            {/* List view */}
            {view === 'list' && sections.map(section => {
              if (section.ids.length === 0) return null
              const sectionEntries = section.ids.map(id => entries.find(e => e.id === id)).filter(Boolean)
              const watched = sectionEntries.filter(e => e.watched).length
              const runtime = sectionEntries.reduce((s, e) => s + e.runtime, 0)

              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{section.emoji}</span>
                      <div>
                        <div className="text-white font-bold text-sm">{section.label}</div>
                        <div className="text-white/30 text-xs">{section.desc}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white/40 text-xs">{watched}/{sectionEntries.length} watched</div>
                      <div className="text-white/25 text-xs flex items-center gap-1 justify-end">
                        <Clock size={10} />{fmtTime(runtime)}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: section.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${sectionEntries.length > 0 ? (watched / sectionEntries.length) * 100 : 0}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>

                  {/* Entry rows */}
                  <div className="space-y-1.5">
                    {sectionEntries.map((entry, i) => (
                      <EntryRow
                        key={entry.id}
                        entry={entry}
                        tier={section.key}
                        index={i}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}

            {/* Roadmap view */}
            {view === 'roadmap' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl p-5 border border-white/5"
              >
                <div className="text-white font-bold text-sm mb-4">Watch Order Roadmap</div>
                <RoadmapView
                  requiredIds={guide.req}
                  recommendedIds={guide.rec}
                  optionalIds={guide.opt}
                  entries={entries}
                />
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-white font-black text-sm">{selected.title}</span>
                  <span className="text-white/30 text-xs ml-1">← your target</span>
                </div>
              </motion.div>
            )}

            {/* Quick tip */}
            <div className="bg-white/2 rounded-xl p-4 border border-white/5 flex gap-3">
              <Zap size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-white/35 text-xs leading-relaxed">
                <span className="text-white/55 font-semibold">Tip:</span> Click any entry to toggle its watched status.
                The path progress bars update in real time as you check things off.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
