import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Ghost, ArrowUpDown } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'
import EntryCard from './EntryCard'
import ProgressTracker from './ProgressTracker'

const DEFAULT_FILTERS = { search: '', type: 'All', status: 'All', universe: 'All' }
const SORT_OPTIONS = [
  { value: 'order',    label: 'Release Order' },
  { value: 'year',     label: 'Year' },
  { value: 'title',    label: 'Title A–Z' },
  { value: 'runtime',  label: 'Runtime' },
  { value: 'watched',  label: 'Watched First' },
]

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Ghost size={28} className="text-white/20" />
      </div>
      <div className="text-white/40 font-semibold mb-1">No entries found</div>
      <div className="text-white/20 text-sm">Try adjusting your search or filters</div>
    </motion.div>
  )
}

export default function EntriesView({ entries, onToggle, getPoster }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy]   = useState('order')

  const watched = entries.filter(e => e.watched).length

  const sorted = useMemo(() => {
    const list = [...entries]
    if (sortBy === 'title')   list.sort((a, b) => a.title.localeCompare(b.title))
    else if (sortBy === 'year')    list.sort((a, b) => a.year - b.year || a.id - b.id)
    else if (sortBy === 'runtime') list.sort((a, b) => b.runtime - a.runtime)
    else if (sortBy === 'watched') list.sort((a, b) => (b.watched ? 1 : 0) - (a.watched ? 1 : 0))
    // 'order' stays as-is (ENTRIES array order)
    return list
  }, [entries, sortBy])

  const filtered = useMemo(() => {
    return sorted.filter(e => {
      const search = filters.search.trim().toLowerCase()
      if (search && !e.title.toLowerCase().includes(search)) return false
      if (filters.type !== 'All' && e.type !== filters.type) return false
      if (filters.universe !== 'All' && e.universe !== filters.universe) return false
      if (filters.status === 'Watched' && !e.watched) return false
      if (filters.status === 'Unwatched' && e.watched) return false
      return true
    })
  }, [sorted, filters])

  return (
    <div className="space-y-5">
      <ProgressTracker watched={watched} total={entries.length} />

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-white font-bold text-xl">All Entries</h2>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-white/30" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-card border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-primary/50"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="text-white/25 text-xs">{filtered.length} shown</span>
        </div>
      </div>

      <SearchAndFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((entry, i) => (
            <EntryCard
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
