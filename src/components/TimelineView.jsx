import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, Circle, Film, Tv, Star, Search, X } from 'lucide-react'

const TYPE_ICONS = { Movie: Film, Series: Tv, Special: Star }
const TYPE_COLORS = { Movie: '#60A5FA', Series: '#4ADE80', Special: '#C084FC' }
const UNIVERSE_COLORS = {
  MCU: '#E62429', 'Fox X-Men': '#FCD34D', 'Netflix Marvel': '#FC6161',
  'Sony Spider-Man': '#60A5FA', 'Spider-Verse': '#C084FC',
}

function YearGroup({ year, entries, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const watchedCount = entries.filter(e => e.watched).length
  const pct = entries.length > 0 ? Math.round((watchedCount / entries.length) * 100) : 0

  return (
    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black text-white">{year}</div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full progress-bar transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-white/40 text-xs font-medium">{watchedCount}/{entries.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-white/30" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 divide-y divide-white/5">
              {entries.map((entry, i) => {
                const Icon = TYPE_ICONS[entry.type] || Film
                const typeColor = TYPE_COLORS[entry.type] || '#60A5FA'
                const univColor = UNIVERSE_COLORS[entry.universe] || '#E62429'
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => onToggle(entry.id)}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-white/3 ${
                      entry.watched ? 'bg-primary/3' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Icon size={16} style={{ color: typeColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-semibold text-sm truncate ${entry.watched ? 'text-white' : 'text-white/70'}`}>
                          {entry.title}
                        </span>
                        {entry.upcoming && (
                          <span className="flex-shrink-0 text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/30 tracking-wide">
                            SOON
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium" style={{ color: univColor }}>{entry.universe}</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/30 text-xs">{entry.phase}</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/30 text-xs">{Math.round(entry.runtime / 60 * 10) / 10}h</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onToggle(entry.id) }}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {entry.watched
                        ? <CheckCircle size={18} className="text-primary" />
                        : <Circle size={18} className="text-white/20 hover:text-white/50 transition-colors" />
                      }
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TimelineView({ entries, onToggle }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? entries.filter(e => e.title.toLowerCase().includes(q)) : entries
  }, [entries, search])

  const byYear = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      if (!map[e.year]) map[e.year] = []
      map[e.year].push(e)
    })
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b))
  }, [filtered])

  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Timeline</h2>
        <span className="text-white/30 text-sm">{byYear.length} years</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type="text"
          placeholder="Search timeline..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 bg-card border border-white/10 rounded-xl pl-9 pr-9 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {byYear.length === 0 ? (
          <div className="text-center py-16 text-white/30">No entries match your search</div>
        ) : (
          byYear.map(([year, yEntries]) => (
            <YearGroup
              key={year}
              year={year}
              entries={yEntries}
              onToggle={onToggle}
              defaultOpen={Number(year) >= currentYear - 1 || !!search}
            />
          ))
        )}
      </div>
    </div>
  )
}
