import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Circle, ChevronRight, X } from 'lucide-react'
import GeneratedPoster from './GeneratedPoster'

// ── Collection definitions ────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    id: 'mcu-timeline',
    label: 'MCU Complete Timeline',
    emoji: '🌌',
    color: '#E62429',
    desc: 'Every MCU entry in chronological release order',
    filter: e => e.universe === 'MCU',
  },
  {
    id: 'infinity-saga',
    label: 'MCU Infinity Saga',
    emoji: '💎',
    color: '#8B5CF6',
    desc: 'The saga that changed cinema — Iron Man to Avengers: Endgame (Phases 1–3)',
    filter: e => e.universe === 'MCU' && ['Phase 1', 'Phase 2', 'Phase 3'].includes(e.phase),
  },
  {
    id: 'multiverse-saga',
    label: 'MCU Multiverse Saga',
    emoji: '🌀',
    color: '#06B6D4',
    desc: 'The new era — Phase 4 through Phase 6',
    filter: e => e.universe === 'MCU' && ['Phase 4', 'Phase 5', 'Phase 6'].includes(e.phase),
  },
  {
    id: 'mcu-series',
    label: 'Marvel Live Action Series & Specials',
    emoji: '📺',
    color: '#F59E0B',
    desc: 'Disney+ originals: all MCU series and specials',
    filter: e => e.universe === 'MCU' && (e.type === 'Series' || e.type === 'Special'),
  },
  {
    id: 'defenders',
    label: 'The Defenders Saga',
    emoji: '🔴',
    color: '#EF4444',
    desc: 'Netflix street-level heroes — Daredevil, Jessica Jones, Luke Cage, Iron Fist, The Punisher',
    filter: e => e.universe === 'Netflix Marvel',
  },
  {
    id: 'legacy',
    label: 'Marvel Legacy Movies',
    emoji: '🦊',
    color: '#F59E0B',
    desc: 'Fox X-Men, Sony Spider-Man and Spider-Verse films pre-MCU merger',
    filter: e => ['Fox X-Men', 'Sony Spider-Man', 'Spider-Verse'].includes(e.universe),
  },
  {
    id: 'spider-verse',
    label: 'Spider-Verse Trilogy',
    emoji: '🕷️',
    color: '#A855F7',
    desc: 'Into, Across & Beyond — Sony Animation\'s animated multiverse masterpiece',
    filter: e => e.universe === 'Spider-Verse',
  },
  {
    id: 'xmen',
    label: 'X-Men Saga',
    emoji: '⚡',
    color: '#FBBF24',
    desc: 'Every Fox X-Men film including Logan and Deadpool',
    filter: e => e.universe === 'Fox X-Men',
  },
  {
    id: 'sony-spidey',
    label: 'Sony Spider-Man Films',
    emoji: '🕸️',
    color: '#3B82F6',
    desc: 'Tobey Maguire and Andrew Garfield\'s Spider-Man trilogies',
    filter: e => e.universe === 'Sony Spider-Man',
  },
  {
    id: 'origin-stories',
    label: 'Marvel Origin Stories',
    emoji: '⭐',
    color: '#22C55E',
    desc: 'The very first film for each Marvel hero',
    filter: e => [4, 5, 8, 10, 17, 20, 22, 27, 35, 52, 54, 55, 58, 60, 1, 85, 88, 90].includes(e.id),
  },
  {
    id: 'phase1',
    label: 'Phase 1 — The Beginning',
    emoji: '🛡️',
    color: '#3B82F6',
    desc: 'Where it all started — Iron Man to The Avengers',
    filter: e => e.phase === 'Phase 1',
  },
  {
    id: 'phase2',
    label: 'Phase 2 — Expanding Universe',
    emoji: '🚀',
    color: '#6366F1',
    desc: 'The universe grows — Iron Man 3 to Ant-Man',
    filter: e => e.phase === 'Phase 2',
  },
  {
    id: 'phase3',
    label: 'Phase 3 — The Infinity War',
    emoji: '💀',
    color: '#DC2626',
    desc: 'Civil War through Endgame — the epic conclusion',
    filter: e => e.phase === 'Phase 3',
  },
  {
    id: 'phase4',
    label: 'Phase 4 — New Beginnings',
    emoji: '🌟',
    color: '#10B981',
    desc: 'A new era after the Blip — WandaVision to Wakanda Forever',
    filter: e => e.phase === 'Phase 4',
  },
  {
    id: 'phase5',
    label: 'Phase 5 — The Multiverse War',
    emoji: '⚡',
    color: '#F59E0B',
    desc: 'Quantumania to Thunderbolts* — the saga accelerates',
    filter: e => e.phase === 'Phase 5',
  },
  {
    id: 'phase6',
    label: 'Phase 6 — Doomsday',
    emoji: '💥',
    color: '#FFD700',
    desc: 'The final phase — Fantastic Four to Avengers: Doomsday',
    filter: e => e.phase === 'Phase 6',
  },
  {
    id: 'upcoming',
    label: 'Coming Soon',
    emoji: '🔮',
    color: '#A78BFA',
    desc: 'Upcoming Marvel releases',
    filter: e => e.upcoming === true,
  },
]

// ── Small poster card for the row ─────────────────────────────────────────────
function MiniCard({ entry, onToggle, getPoster, index }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const posterUrl = getPoster ? getPoster(entry.id) : null
  const showReal  = posterUrl && !imgError

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      className="relative flex-shrink-0 w-24 sm:w-28 cursor-pointer group"
      style={{ zIndex: 1 }}
      onClick={() => onToggle(entry.id)}
    >
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden"
        style={{
          outline: entry.watched ? '2px solid rgba(230,36,41,0.6)' : 'none',
          boxShadow: entry.watched ? '0 4px 16px rgba(230,36,41,0.25)' : 'none',
        }}
      >
        {/* Generated base always present */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${showReal && imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <GeneratedPoster entry={entry} watched={entry.watched} />
        </div>

        {/* Real poster */}
        {showReal && (
          <img
            src={posterUrl}
            alt={entry.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {entry.watched && (
          <div className="absolute top-1 right-1 z-30 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle size={10} className="text-white" />
          </div>
        )}

        {entry.upcoming && !entry.watched && (
          <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/20 backdrop-blur-sm py-0.5 z-30">
            <span className="text-yellow-300 text-[8px] font-bold block text-center">SOON</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1 px-1 z-20">
          {entry.watched
            ? <CheckCircle size={16} className="text-primary" />
            : <Circle size={16} className="text-white/80" />}
          <span className="text-white text-[9px] font-semibold text-center leading-tight line-clamp-3">
            {entry.title}
          </span>
        </div>
      </div>

      <div className="mt-1 text-white/50 text-[9px] font-medium truncate leading-tight">{entry.title}</div>
      <div className="text-white/25 text-[9px]">{entry.year}</div>
    </motion.div>
  )
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function CollectionModal({ collection, entries, onToggle, getPoster, onClose }) {
  const items = entries.filter(collection.filter)
  const watched = items.filter(e => e.watched).length
  const pct = items.length > 0 ? Math.round((watched / items.length) * 100) : 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        className="relative bg-[#111] rounded-t-3xl sm:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-start justify-between gap-4" style={{ background: `linear-gradient(135deg, ${collection.color}15, transparent)` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{collection.emoji}</span>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">{collection.label}</h2>
              <p className="text-white/40 text-xs mt-0.5">{collection.desc}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-white/50 text-xs">{watched}/{items.length} watched</span>
                <div className="flex-1 max-w-[120px] h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: collection.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span className="text-white/40 text-xs">{pct}%</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors flex-shrink-0 mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {items.map((entry, i) => (
              <MiniCard key={entry.id} entry={entry} onToggle={onToggle} getPoster={getPoster} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Horizontal row ────────────────────────────────────────────────────────────
function CollectionRow({ collection, entries, onToggle, getPoster, onExpand }) {
  const items = useMemo(() => entries.filter(collection.filter), [entries, collection])
  const watched = items.filter(e => e.watched).length
  const pct = items.length > 0 ? Math.round((watched / items.length) * 100) : 0

  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      {/* Row header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{collection.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{collection.label}</span>
              <span className="text-white/25 text-xs">{watched}/{items.length}</span>
              {pct === 100 && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">DONE</span>
              )}
            </div>
            {/* Mini progress bar */}
            <div className="w-32 h-0.5 bg-white/8 rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: collection.color }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => onExpand(collection)}
          className="flex items-center gap-1 text-white/30 hover:text-white/70 text-xs transition-colors"
        >
          See all <ChevronRight size={14} />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((entry, i) => (
          <MiniCard key={entry.id} entry={entry} onToggle={onToggle} getPoster={getPoster} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CollectionsView({ entries, onToggle, getPoster }) {
  const [activeModal, setActiveModal] = useState(null)

  const totalWatched = entries.filter(e => e.watched).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-black text-xl">Collections</h2>
          <p className="text-white/30 text-sm mt-0.5">Browse by saga, universe or phase</p>
        </div>
        <div className="text-white/30 text-sm">{totalWatched}/{entries.length} total watched</div>
      </div>

      {/* Rows */}
      <div className="space-y-7">
        {COLLECTIONS.map(col => (
          <CollectionRow
            key={col.id}
            collection={col}
            entries={entries}
            onToggle={onToggle}
            getPoster={getPoster}
            onExpand={setActiveModal}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <CollectionModal
            collection={activeModal}
            entries={entries}
            onToggle={onToggle}
            getPoster={getPoster}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
