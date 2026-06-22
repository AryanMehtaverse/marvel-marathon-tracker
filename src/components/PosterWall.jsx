import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'

const DEFAULT_FILTERS = { search: '', type: 'All', status: 'All', universe: 'All' }

function PosterCard({ entry, onToggle, posterUrl, index }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const initials = entry.title.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const showReal = posterUrl && !imgError

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.01, 0.4) }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      className="relative group cursor-pointer"
      style={{ zIndex: 1 }}
      onClick={() => onToggle(entry.id)}
    >
      <div
        className="relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-200"
        style={{
          border: entry.watched ? '2px solid rgba(230,36,41,0.6)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: entry.watched ? '0 4px 24px rgba(230,36,41,0.25)' : 'none',
          background: '#111',
        }}
      >
        {/* Real poster */}
        {showReal && (
          <>
            {!imgLoaded && <div className="absolute inset-0 shimmer" />}
            <img
              src={posterUrl}
              alt={entry.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}

        {/* Placeholder fallback */}
        {!showReal && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: entry.watched
                ? 'linear-gradient(135deg, #1a0a0a 0%, #2a0f0f 50%, #0a0a1a 100%)'
                : 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
            }}
          >
            <span className="text-xl font-black" style={{ color: entry.watched ? '#E62429' : '#ffffff15' }}>
              {initials}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 px-2">
          {entry.watched
            ? <CheckCircle size={24} className="text-primary drop-shadow-lg" />
            : <Circle size={24} className="text-white/80 drop-shadow-lg" />
          }
          <span className="text-white text-xs font-semibold text-center leading-tight line-clamp-3">
            {entry.title}
          </span>
        </div>

        {/* Watched badge */}
        {entry.watched && (
          <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
            <CheckCircle size={11} className="text-white" />
          </div>
        )}

        {/* Year at bottom */}
        {(!showReal || imgLoaded) && (
          <div className="absolute bottom-1.5 left-1.5 z-10">
            <span className="text-xs font-semibold text-white/50 bg-black/60 rounded px-1 py-0.5">
              {entry.year}
            </span>
          </div>
        )}
      </div>

      {/* Title below poster */}
      <div className="mt-1.5 px-0.5">
        <p className="text-xs font-medium text-white/60 group-hover:text-white transition-colors leading-tight line-clamp-2">
          {entry.title}
        </p>
      </div>
    </motion.div>
  )
}

export default function PosterWall({ entries, onToggle, getPoster }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const watched = entries.filter(e => e.watched).length

  const filtered = useMemo(() => entries.filter(e => {
    const s = filters.search.trim().toLowerCase()
    if (s && !e.title.toLowerCase().includes(s)) return false
    if (filters.type !== 'All' && e.type !== filters.type) return false
    if (filters.universe !== 'All' && e.universe !== filters.universe) return false
    if (filters.status === 'Watched' && !e.watched) return false
    if (filters.status === 'Unwatched' && e.watched) return false
    return true
  }), [entries, filters])

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
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-2">
          {filtered.map((entry, i) => (
            <PosterCard
              key={entry.id}
              entry={entry}
              onToggle={onToggle}
              posterUrl={getPoster(entry.id)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
