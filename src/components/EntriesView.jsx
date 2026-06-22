import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Ghost } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'
import EntryCard from './EntryCard'
import ProgressTracker from './ProgressTracker'

const DEFAULT_FILTERS = { search: '', type: 'All', status: 'All', universe: 'All' }

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

export default function EntriesView({ entries, onToggle }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const watched = entries.filter(e => e.watched).length

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

  return (
    <div className="space-y-6">
      <ProgressTracker watched={watched} total={entries.length} />

      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-xl">All Entries</h2>
        <span className="text-white/30 text-sm">{filtered.length} shown</span>
      </div>

      <SearchAndFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} onToggle={onToggle} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
