import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Film, Tv, Star } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'

const DEFAULT_FILTERS = { search: '', type: 'All', status: 'All', universe: 'All' }
const TYPE_ICONS = { Movie: Film, Series: Tv, Special: Star }

function PosterCard({ entry, onToggle, index }) {
  const Icon = TYPE_ICONS[entry.type] || Film
  const initials = entry.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.015, 0.4) }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      className="relative group cursor-pointer"
      style={{ zIndex: 1 }}
      onClick={() => onToggle(entry.id)}
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] rounded-xl overflow-hidden border transition-all duration-300"
        style={{
          border: entry.watched ? '2px solid rgba(230,36,41,0.5)' : '1px solid rgba(255,255,255,0.05)',
          background: entry.watched
            ? 'linear-gradient(160deg, #1a0a0a 0%, #2a0f0f 40%, #0a0a1a 100%)'
            : 'linear-gradient(160deg, #111 0%, #1a1a1a 100%)',
          boxShadow: entry.watched ? '0 4px 20px rgba(230,36,41,0.2)' : 'none',
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
          }} />
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: entry.watched ? 'rgba(230,36,41,0.25)' : 'rgba(255,255,255,0.05)' }}
          >
            <Icon size={18} style={{ color: entry.watched ? '#E62429' : '#ffffff30' }} />
          </div>
          <span
            className="text-sm font-black"
            style={{ color: entry.watched ? '#E62429' : '#ffffff15' }}
          >
            {initials}
          </span>
        </div>

        {/* Watch toggle overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          {entry.watched
            ? <CheckCircle size={28} className="text-primary drop-shadow-lg" />
            : <Circle size={28} className="text-white/70 drop-shadow-lg" />
          }
        </div>

        {/* Watched checkmark */}
        {entry.watched && (
          <div className="absolute top-2 right-2">
            <CheckCircle size={16} className="text-primary drop-shadow-lg" />
          </div>
        )}

        {/* Year badge */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs font-semibold text-white/40 bg-black/50 rounded px-1.5 py-0.5">
            {entry.year}
          </span>
        </div>
      </div>

      {/* Title below */}
      <div className="mt-1.5 px-0.5">
        <div className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors leading-tight line-clamp-2">
          {entry.title}
        </div>
      </div>
    </motion.div>
  )
}

export default function PosterWall({ entries, onToggle }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const search = filters.search.trim().toLowerCase()
      if (search && !e.title.toLowerCase().includes(search)) return false
      if (filters.type !== 'All' && e.type !== filters.type) return false
      if (filters.universe !== 'All' && e.universe !== filters.universe) return false
      if (filters.status === 'Watched' && !e.watched) return false
      if (filters.status === 'Unwatched' && e.watched) return false
      return true
    })
  }, [entries, filters])

  const watched = entries.filter(e => e.watched).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">Poster Wall</h2>
        <span className="text-white/30 text-sm">{watched}/{entries.length} watched</span>
      </div>

      <SearchAndFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-white/20 font-semibold">No entries match your filters</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
          {filtered.map((entry, i) => (
            <PosterCard key={entry.id} entry={entry} onToggle={onToggle} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
