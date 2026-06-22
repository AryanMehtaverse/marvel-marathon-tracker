import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'
import GeneratedPoster from './GeneratedPoster'

const UNIVERSE_COLORS = {
  MCU: '#E62429', 'Fox X-Men': '#F59E0B', 'Netflix Marvel': '#EC4899', 'Sony Spider-Man': '#3B82F6', 'Spider-Verse': '#A855F7',
}
const DEFAULT_FILTERS = { search: '', type: 'All', status: 'All', universe: 'All', phase: 'All' }

function PosterCard({ entry, onToggle, posterUrl, index }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const showReal = posterUrl && !imgError

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.008, 0.35) }}
      whileHover={{ scale: 1.08, zIndex: 20 }}
      className="relative group cursor-pointer"
      style={{ zIndex: 1 }}
      onClick={() => onToggle(entry.id)}
    >
      <div
        className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-200"
        style={{
          boxShadow: entry.watched ? '0 4px 20px rgba(230,36,41,0.3)' : 'none',
          outline: entry.watched ? '2px solid rgba(230,36,41,0.5)' : 'none',
        }}
      >
        {/* Generated poster (always present as base) */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${showReal && imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <GeneratedPoster entry={entry} watched={entry.watched} />
        </div>

        {/* Real poster overlay */}
        {showReal && (
          <>
            {!imgLoaded && <div className="absolute inset-0 shimmer z-10" />}
            <img
              src={posterUrl}
              alt={entry.title}
              className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}

        {/* Watched indicator always visible */}
        {entry.watched && (
          <div className="absolute top-1 right-1 z-40 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
            <CheckCircle size={11} className="text-white" />
          </div>
        )}

        {/* Title always shown on mobile (sm and below), hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-4 pb-1 px-1 z-30 sm:hidden">
          <span className="text-white text-[9px] font-semibold leading-tight line-clamp-2 block">{entry.title}</span>
        </div>

        {/* Hover overlay (desktop only) */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 px-2 z-30 hidden sm:flex">
          {entry.watched
            ? <CheckCircle size={20} className="text-primary drop-shadow-lg" />
            : <Circle size={20} className="text-white/80 drop-shadow-lg" />
          }
          <span className="text-white text-xs font-semibold text-center leading-tight line-clamp-3">
            {entry.title}
          </span>
          <span className="text-white/40 text-xs">{entry.year}</span>
        </div>
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
    if (filters.phase   !== 'All' && e.phase   !== filters.phase)   return false
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
          {filtered.map((entry, i) => (
            <PosterCard
              key={entry.id}
              entry={entry}
              onToggle={onToggle}
              posterUrl={getPoster ? getPoster(entry.id) : null}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
