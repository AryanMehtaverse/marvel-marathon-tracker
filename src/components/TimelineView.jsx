import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, Circle, Film, Tv, Star } from 'lucide-react'

const TYPE_ICONS = { Movie: Film, Series: Tv, Special: Star }
const TYPE_COLORS = { Movie: '#60A5FA', Series: '#4ADE80', Special: '#C084FC' }
const UNIVERSE_COLORS = { MCU: '#E62429', 'Fox X-Men': '#FCD34D', 'Netflix Marvel': '#FC6161' }

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
                      <div className={`font-semibold text-sm truncate ${entry.watched ? 'text-white' : 'text-white/70'}`}>
                        {entry.title}
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
  const byYear = useMemo(() => {
    const map = {}
    entries.forEach(e => {
      if (!map[e.year]) map[e.year] = []
      map[e.year].push(e)
    })
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b))
  }, [entries])

  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Timeline</h2>
        <span className="text-white/30 text-sm">{byYear.length} years</span>
      </div>
      <div className="space-y-3">
        {byYear.map(([year, yEntries], i) => (
          <YearGroup
            key={year}
            year={year}
            entries={yEntries}
            onToggle={onToggle}
            defaultOpen={Number(year) >= currentYear - 1}
          />
        ))}
      </div>
    </div>
  )
}
