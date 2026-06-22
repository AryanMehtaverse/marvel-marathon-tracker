import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import GeneratedPoster from './GeneratedPoster'

const TYPE_COLORS = {
  Movie:   { bg: 'rgba(59,130,246,0.15)',  text: '#60A5FA', border: 'rgba(59,130,246,0.3)'  },
  Series:  { bg: 'rgba(34,197,94,0.15)',   text: '#4ADE80', border: 'rgba(34,197,94,0.3)'   },
  Special: { bg: 'rgba(168,85,247,0.15)',  text: '#C084FC', border: 'rgba(168,85,247,0.3)'  },
}
const UNIVERSE_COLORS = {
  MCU:               { bg: 'rgba(230,36,41,0.15)',  text: '#F87171', border: 'rgba(230,36,41,0.3)'  },
  'Fox X-Men':       { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D', border: 'rgba(245,158,11,0.3)' },
  'Netflix Marvel':  { bg: 'rgba(239,68,68,0.15)',  text: '#FC6161', border: 'rgba(239,68,68,0.3)'  },
  'Sony Spider-Man': { bg: 'rgba(59,130,246,0.15)', text: '#93C5FD', border: 'rgba(59,130,246,0.3)' },
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

function PosterArea({ entry, posterUrl }) {
  const [imgError,  setImgError]  = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const showReal = !!posterUrl && !imgError

  return (
    <div
      className={`relative w-full aspect-[2/3] rounded-xl overflow-hidden ${
        entry.watched ? 'ring-1 ring-primary/40' : ''
      }`}
      style={{ boxShadow: entry.watched ? '0 4px 24px rgba(230,36,41,0.18)' : 'none' }}
    >
      {/* Generated poster — always the base layer */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${showReal && imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <GeneratedPoster entry={entry} watched={entry.watched} />
      </div>

      {/* Real poster fades in on top */}
      {showReal && (
        <img
          src={posterUrl}
          alt={entry.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Watched checkmark (over everything) */}
      {entry.watched && imgLoaded && (
        <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <CheckCircle size={14} className="text-white" />
        </div>
      )}
    </div>
  )
}

export default function EntryCard({ entry, onToggle, posterUrl, index = 0 }) {
  const typeColors     = TYPE_COLORS[entry.type]         || TYPE_COLORS.Movie
  const universeColors = UNIVERSE_COLORS[entry.universe] || UNIVERSE_COLORS.MCU
  const phaseColor     = PHASE_COLORS[entry.phase]       || '#6B7280'
  const hours          = (entry.runtime / 60).toFixed(1)

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
        <PosterArea entry={entry} posterUrl={posterUrl} />

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
            <Badge label={entry.type}  colors={typeColors} />
            <Badge label={entry.phase} colors={{ bg: `${phaseColor}20`, text: phaseColor, border: `${phaseColor}40` }} />
          </div>
          <Badge label={entry.universe} colors={universeColors} />
        </div>
      </div>
    </motion.div>
  )
}
