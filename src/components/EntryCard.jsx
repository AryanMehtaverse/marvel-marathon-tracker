import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Film, Tv, Star, ImageOff } from 'lucide-react'

const TYPE_COLORS = {
  Movie:   { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA', border: 'rgba(59,130,246,0.3)'  },
  Series:  { bg: 'rgba(34,197,94,0.15)',   text: '#4ADE80', border: 'rgba(34,197,94,0.3)'   },
  Special: { bg: 'rgba(168,85,247,0.15)',  text: '#C084FC', border: 'rgba(168,85,247,0.3)'  },
}
const UNIVERSE_COLORS = {
  MCU:              { bg: 'rgba(230,36,41,0.15)',  text: '#F87171', border: 'rgba(230,36,41,0.3)'  },
  'Fox X-Men':      { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  'Netflix Marvel': { bg: 'rgba(239,68,68,0.15)',  text: '#FC6161', border: 'rgba(239,68,68,0.3)'  },
}
const PHASE_COLORS = {
  'Pre-MCU': '#6B7280', 'Phase 1': '#3B82F6', 'Phase 2': '#8B5CF6',
  'Phase 3': '#E62429', 'Phase 4': '#10B981', 'Phase 5': '#F59E0B',
  'Phase 6': '#FFD700', 'Netflix': '#E50914',
}

function Badge({ label, colors }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold truncate max-w-full"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {label}
    </span>
  )
}

function PosterImage({ posterUrl, title, type, watched }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const TypeIcon = type === 'Movie' ? Film : type === 'Series' ? Tv : Star
  const initials  = title.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()

  const showReal = posterUrl && !imgError

  return (
    <div
      className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300 ${
        watched ? 'ring-1 ring-primary/40' : ''
      }`}
      style={{
        background: showReal
          ? '#000'
          : watched
            ? 'linear-gradient(135deg, #1a0a0a 0%, #2a0f0f 40%, #0f0f2a 100%)'
            : 'linear-gradient(135deg, #111 0%, #1e1e1e 100%)',
        boxShadow: watched ? '0 4px 24px rgba(230,36,41,0.2)' : 'none',
      }}
    >
      {/* Real poster */}
      {showReal && (
        <>
          {!imgLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <img
            src={posterUrl}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </>
      )}

      {/* Placeholder */}
      {!showReal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: watched ? 'rgba(230,36,41,0.2)' : 'rgba(255,255,255,0.05)' }}
          >
            <TypeIcon size={20} style={{ color: watched ? '#E62429' : '#ffffff25' }} />
          </div>
          <span className="text-base font-black" style={{ color: watched ? '#E62429' : '#ffffff15' }}>
            {initials}
          </span>
        </div>
      )}

      {/* Gradient overlay at bottom (always shown over real poster) */}
      {showReal && imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Watched checkmark */}
      {watched && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <CheckCircle size={14} className="text-white" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EntryCard({ entry, onToggle, posterUrl, index = 0 }) {
  const typeColors    = TYPE_COLORS[entry.type]    || TYPE_COLORS.Movie
  const universeColors = UNIVERSE_COLORS[entry.universe] || UNIVERSE_COLORS.MCU
  const phaseColor    = PHASE_COLORS[entry.phase] || '#6B7280'
  const hours         = (entry.runtime / 60).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.5), duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      className={`relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group ${
        entry.watched ? 'border-primary/25' : 'border-white/5 hover:border-white/15'
      }`}
      onClick={() => onToggle(entry.id)}
    >
      {entry.watched && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-0" />
      )}

      <div className="relative z-10 p-2.5">
        <PosterImage posterUrl={posterUrl} title={entry.title} type={entry.type} watched={entry.watched} />

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <div className="text-white font-bold text-xs leading-tight line-clamp-2 group-hover:text-primary/90 transition-colors">
                {entry.title}
              </div>
              <div className="text-white/35 text-xs mt-0.5">{entry.year} · {hours}h</div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onToggle(entry.id) }}
              className="flex-shrink-0 mt-0.5 transition-transform hover:scale-110 active:scale-95"
            >
              {entry.watched
                ? <CheckCircle size={18} className="text-primary" />
                : <Circle size={18} className="text-white/15 hover:text-white/50 transition-colors" />
              }
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge label={entry.type} colors={typeColors} />
            <Badge label={entry.phase} colors={{ bg: `${phaseColor}20`, text: phaseColor, border: `${phaseColor}40` }} />
          </div>
          <Badge label={entry.universe} colors={universeColors} />
        </div>
      </div>
    </motion.div>
  )
}
