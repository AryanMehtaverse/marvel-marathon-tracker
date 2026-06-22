import { motion } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

const TYPES     = ['All', 'Movie', 'Series', 'Special']
const STATUSES  = ['All', 'Watched', 'Unwatched']
const UNIVERSES = ['All', 'MCU', 'Fox X-Men', 'Netflix Marvel']

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  )
}

export default function SearchAndFilters({ filters, setFilters }) {
  const [showFilters, setShowFilters] = useState(false)

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const hasActive = filters.type !== 'All' || filters.status !== 'All' || filters.universe !== 'All'

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search entries..."
            value={filters.search}
            onChange={e => update('search', e.target.value)}
            className="w-full h-10 bg-card border border-white/10 rounded-xl pl-9 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => update('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`h-10 px-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
            hasActive || showFilters
              ? 'bg-primary/20 border-primary/40 text-primary'
              : 'bg-card border-white/10 text-white/50 hover:text-white/80'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:block">Filters</span>
          {hasActive && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="bg-card border border-white/5 rounded-2xl p-4 space-y-3">
          <div>
            <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Type</div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <FilterPill key={t} label={t} active={filters.type === t} onClick={() => update('type', t)} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Status</div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <FilterPill key={s} label={s} active={filters.status === s} onClick={() => update('status', s)} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Universe</div>
            <div className="flex flex-wrap gap-2">
              {UNIVERSES.map(u => (
                <FilterPill key={u} label={u} active={filters.universe === u} onClick={() => update('universe', u)} />
              ))}
            </div>
          </div>
          {hasActive && (
            <button
              onClick={() => setFilters(f => ({ ...f, type: 'All', status: 'All', universe: 'All' }))}
              className="text-xs text-primary hover:text-primary/70 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
