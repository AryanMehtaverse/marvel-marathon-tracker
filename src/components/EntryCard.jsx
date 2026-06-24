import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import GeneratedPoster from './GeneratedPoster'
import { WatchOnTVButton } from './WatchOnTV'

const UNIVERSE_COLORS = {
  MCU:               '#E62429',
  'Fox X-Men':       '#F59E0B',
  'Netflix Marvel':  '#EC4899',
  'Sony Spider-Man': '#3B82F6',
  'Spider-Verse':    '#A855F7',
}

const PHASE_COLORS = {
  'Pre-MCU': '#6B7280', 'Phase 1': '#3B82F6', 'Phase 2': '#8B5CF6',
  'Phase 3': '#E62429', 'Phase 4': '#10B981', 'Phase 5': '#F59E0B',
  'Phase 6': '#FFD700', 'Netflix': '#E50914',
}

function PosterArea({ entry, posterUrl }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const showReal = !!posterUrl && !imgError

  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl">
      {/* Generated base */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${showReal && imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <GeneratedPoster entry={entry} watched={entry.watched} />
      </div>

      {/* Real poster */}
      {showReal && (
        <img
          src={posterUrl}
          alt={entry.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Watched overlay tint */}
      {entry.watched && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}

      {/* Checkmark badge */}
      {entry.watched && (
        <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-primary shadow-lg flex items-center justify-center">
          <CheckCircle size={13} className="text-white" />
        </div>
      )}

      {/* Coming Soon ribbon */}
      {entry.upcoming && !entry.watched && (
        <div className="absolute bottom-0 left-0 right-0 z-20 py-1 text-center"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
          <span className="text-yellow-400 text-[9px] font-heading font-bold tracking-widest uppercase">Coming Soon</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center z-10">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-2">
          {entry.watched
            ? <CheckCircle size={28} className="text-primary drop-shadow-lg" />
            : <Circle size={28} className="text-white/80 drop-shadow-lg" />
          }
          <span className="text-white text-xs font-heading font-semibold uppercase tracking-wide text-center px-3 leading-tight line-clamp-2">
            {entry.watched ? 'Watched' : 'Mark Watched'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function EntryCard({ entry, onToggle, posterUrl, index = 0 }) {
  const uniColor   = UNIVERSE_COLORS[entry.universe] || '#E62429'
  const phaseColor = PHASE_COLORS[entry.phase]       || '#6B7280'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.45), duration: 0.3 }}
      className="relative group cursor-pointer"
      onClick={() => onToggle(entry.id)}
    >
      <div className={`relative rounded-xl overflow-hidden transition-all duration-250 ${
        entry.watched
          ? 'ring-1 ring-primary/40 shadow-[0_8px_30px_rgba(230,36,41,0.2)]'
          : 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}>
        <PosterArea entry={entry} posterUrl={posterUrl} />
      </div>

      {/* Info below poster */}
      <div className="mt-2.5 px-0.5">
        <div className="text-white text-xs font-heading font-semibold uppercase tracking-wide leading-tight line-clamp-2 group-hover:text-primary/90 transition-colors">
          {entry.title}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {/* Universe dot */}
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: uniColor }} />
          <span className="text-white/30 text-[10px]">{entry.year}</span>
          <span className="text-white/15 text-[10px]">·</span>
          {/* Phase chip */}
          <span
            className="text-[9px] font-heading font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
            style={{ color: phaseColor, background: `${phaseColor}18` }}
          >
            {entry.phase}
          </span>
        </div>
        {/* Watch on TV — shown on hover */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <WatchOnTVButton entry={entry} />
        </div>
      </div>
    </motion.div>
  )
}
