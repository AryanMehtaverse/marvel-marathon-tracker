import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, Circle, Film, Tv, Star, Search, X, Clock, Calendar } from 'lucide-react'

const TYPE_ICONS = { Movie: Film, Series: Tv, Special: Star }
const TYPE_COLORS = { Movie: '#60A5FA', Series: '#4ADE80', Special: '#C084FC' }
const UNIVERSE_COLORS = {
  MCU: '#E62429', 'Fox X-Men': '#FCD34D', 'Netflix Marvel': '#FC6161',
  'Sony Spider-Man': '#60A5FA', 'Spider-Verse': '#C084FC',
}

// MCU in-universe chronological order (IDs only; non-MCU entries use release year)
const MCU_CHRONO = [
  10,  // Captain America: The First Avenger (1940s)
  4,   // Iron Man (2010 in-universe)
  7,   // Iron Man 2
  5,   // The Incredible Hulk
  8,   // Thor
  11,  // The Avengers
  12,  // Iron Man 3
  14,  // Thor: The Dark World
  15,  // Captain America: The Winter Soldier
  17,  // Guardians of the Galaxy
  30,  // Guardians of the Galaxy Vol. 2 (set just after GotG1)
  19,  // Avengers: Age of Ultron
  20,  // Ant-Man
  24,  // Captain America: Civil War
  52,  // Black Widow (set right after Civil War)
  35,  // Black Panther
  31,  // Spider-Man: Homecoming
  27,  // Doctor Strange
  33,  // Thor: Ragnarok
  37,  // Avengers: Infinity War
  40,  // Ant-Man and the Wasp (concurrent with Infinity War)
  44,  // Avengers: Endgame
  51,  // Loki S1 (branched timeline from 2012)
  49,  // WandaVision (post-Blip 2023)
  50,  // The Falcon and the Winter Soldier
  54,  // Shang-Chi
  55,  // Eternals
  56,  // Hawkeye
  57,  // Spider-Man: No Way Home
  53,  // What If...? S1
  58,  // Moon Knight
  59,  // Doctor Strange in the Multiverse of Madness
  60,  // Ms. Marvel
  61,  // Thor: Love and Thunder
  62,  // I Am Groot
  63,  // She-Hulk: Attorney at Law
  64,  // Werewolf by Night
  65,  // Black Panther: Wakanda Forever
  66,  // Guardians Holiday Special
  67,  // Ant-Man and the Wasp: Quantumania
  68,  // Guardians of the Galaxy Vol. 3
  69,  // Secret Invasion
  70,  // Loki S2 (end of time)
  71,  // The Marvels
  93,  // What If...? S2
  72,  // Echo
  73,  // Deadpool & Wolverine
  74,  // Agatha All Along
  75,  // What If...? S3
  76,  // Captain America: Brave New World
  77,  // Daredevil: Born Again S1
  78,  // Thunderbolts*
  79,  // Ironheart
  80,  // The Fantastic Four: First Steps
  81,  // Daredevil: Born Again S2
  82,  // The Punisher: One Last Kill
  83,  // Spider-Man: Brand New Day
  84,  // Avengers: Doomsday
]

const CHRONO_LABELS = {
  10:  '1940s',
  4:   '2010', 7: '2010–11', 5: '2010–11', 8: '2011',
  11:  '2012',
  12:  '2013', 14: '2013',
  15:  '2014', 17: '2014', 30: '2014',
  19:  '2015', 20: '2015',
  24:  '2016', 52: '2016', 35: '2016–17', 31: '2016–17', 27: '2016–17',
  33:  '2017–18', 37: '2018', 40: '2018',
  44:  '2018–23',
  51:  '2012 (branch)',
  49:  '2023', 50: '2024', 54: '2024', 55: '2024–5000s', 56: '2024',
  57:  '2024', 53: 'Multiverse',
  58:  '2024', 59: '2024', 60: '2025', 61: '2025', 62: '2025',
  63:  '2025', 64: '2025', 65: '2025', 66: '2025',
  67:  '2025', 68: '2025', 69: '2026', 70: 'End of Time',
  71:  '2026', 93: 'Multiverse', 72: '2026', 73: '2024',
  74:  '2026', 75: 'Multiverse', 76: '2025', 77: '2025', 78: '2025',
  79:  '2026', 80: 'Alternate 1960s', 81: '2026', 82: '2026',
  83:  '2026', 84: '2026',
}

function EntryRow({ entry, onToggle, index, label }) {
  const Icon = TYPE_ICONS[entry.type] || Film
  const typeColor = TYPE_COLORS[entry.type] || '#60A5FA'
  const univColor = UNIVERSE_COLORS[entry.universe] || '#E62429'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.015 }}
      onClick={() => onToggle(entry.id)}
      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-white/3 ${entry.watched ? 'bg-primary/3' : ''}`}
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
            <span className="flex-shrink-0 text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full border border-yellow-500/30">
              SOON
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium" style={{ color: univColor }}>{entry.universe}</span>
          <span className="text-white/20 text-xs">·</span>
          {label && <span className="text-white/30 text-xs">{label}</span>}
          {label && <span className="text-white/20 text-xs">·</span>}
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
}

// ── Release Order ─────────────────────────────────────────────────────────────
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
              <div className="h-full rounded-full progress-bar transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-white/40 text-xs font-medium">{watchedCount}/{entries.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
              {entries.map((entry, i) => (
                <EntryRow key={entry.id} entry={entry} onToggle={onToggle} index={i} label={entry.phase} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ReleaseTimeline({ entries, onToggle, search }) {
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

  if (byYear.length === 0)
    return <div className="text-center py-16 text-white/30">No entries match your search</div>

  return (
    <div className="space-y-3">
      {byYear.map(([year, yEntries]) => (
        <YearGroup
          key={year}
          year={year}
          entries={yEntries}
          onToggle={onToggle}
          defaultOpen={Number(year) >= currentYear - 1 || !!search}
        />
      ))}
    </div>
  )
}

// ── Chronological Timeline ────────────────────────────────────────────────────
const UNIVERSE_ERA = {
  'Fox X-Men':       'Fox X-Men Universe',
  'Netflix Marvel':  'Netflix / Defenders Saga',
  'Sony Spider-Man': 'Sony Spider-Man',
  'Spider-Verse':    'Spider-Verse',
}

function ChronoGroup({ label, entries, onToggle, defaultOpen, color }) {
  const [open, setOpen] = useState(defaultOpen)
  const watchedCount = entries.filter(e => e.watched).length
  const pct = entries.length > 0 ? Math.round((watchedCount / entries.length) * 100) : 0

  return (
    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <div className="text-left">
            <div className="text-white font-bold text-sm">{label}</div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="text-white/40 text-xs">{watchedCount}/{entries.length}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-white/30" />
        </motion.div>
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
              {entries.map((entry, i) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onToggle={onToggle}
                  index={i}
                  label={CHRONO_LABELS[entry.id]}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ChronoTimeline({ entries, onToggle, search }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? entries.filter(e => e.title.toLowerCase().includes(q)) : entries
  }, [entries, search])

  const { mcuEntries, nonMcuGroups } = useMemo(() => {
    const idToEntry = Object.fromEntries(filtered.map(e => [e.id, e]))

    // MCU: sort by chrono order array
    const mcuInOrder = MCU_CHRONO
      .map(id => idToEntry[id])
      .filter(Boolean)

    // Non-MCU: group by universe, sort by year within each group
    const groups = {}
    filtered.filter(e => e.universe !== 'MCU').forEach(e => {
      const grp = UNIVERSE_ERA[e.universe] || e.universe
      if (!groups[grp]) groups[grp] = { entries: [], color: UNIVERSE_COLORS[e.universe] || '#6B7280' }
      groups[grp].entries.push(e)
    })
    Object.values(groups).forEach(g => g.entries.sort((a, b) => a.year - b.year))

    return { mcuEntries: mcuInOrder, nonMcuGroups: groups }
  }, [filtered])

  if (mcuEntries.length === 0 && Object.keys(nonMcuGroups).length === 0)
    return <div className="text-center py-16 text-white/30">No entries match your search</div>

  return (
    <div className="space-y-3">
      {mcuEntries.length > 0 && (
        <ChronoGroup
          label="MCU — In-Universe Chronological Order"
          entries={mcuEntries}
          onToggle={onToggle}
          defaultOpen
          color="#E62429"
        />
      )}
      {Object.entries(nonMcuGroups).map(([label, { entries: grpEntries, color }]) => (
        <ChronoGroup
          key={label}
          label={label}
          entries={grpEntries}
          onToggle={onToggle}
          defaultOpen={!!search}
          color={color}
        />
      ))}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'release',      label: 'Release Order',        icon: Calendar },
  { id: 'chronological', label: 'Chronological Order', icon: Clock    },
]

export default function TimelineView({ entries, onToggle }) {
  const [activeTab, setActiveTab] = useState('release')
  const [search, setSearch]       = useState('')

  const total   = entries.length
  const watched = entries.filter(e => e.watched).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Timeline</h2>
        <span className="text-white/30 text-sm">{watched}/{total} watched</span>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="timeline-tab-bg"
                  className="absolute inset-0 bg-primary/80 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {activeTab === 'chronological' && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-yellow-500/8 border border-yellow-500/20 rounded-xl">
          <span className="text-yellow-400 text-xs mt-0.5">ℹ</span>
          <p className="text-yellow-400/80 text-xs leading-relaxed">
            MCU entries are sorted by in-universe timeline, not release date. Captain America: TFA (1940s) comes first; Black Widow (released 2021) follows Civil War (2016) as set.
          </p>
        </div>
      )}

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'release'
            ? <ReleaseTimeline entries={entries} onToggle={onToggle} search={search} />
            : <ChronoTimeline  entries={entries} onToggle={onToggle} search={search} />
          }
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
