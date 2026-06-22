import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ExternalLink } from 'lucide-react'

export default function TMDBSetupBanner({ hasKey }) {
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('tmdb-banner-dismissed') === '1'
  )

  const dismiss = () => {
    localStorage.setItem('tmdb-banner-dismissed', '1')
    setDismissed(true)
  }

  // Hide banner if key is already set or dismissed
  if (hasKey || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 text-sm mb-6 bg-white/3"
      >
        <Sparkles size={15} className="text-white/30 flex-shrink-0" />
        <div className="flex-1 min-w-0 text-white/40 text-xs">
          Posters are auto-generated. Optionally add a free{' '}
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white underline inline-flex items-center gap-0.5"
          >
            TMDB API key <ExternalLink size={10} />
          </a>
          {' '}to show real movie posters — set <code className="bg-black/30 px-1 rounded">VITE_TMDB_API_KEY</code> in a <code className="bg-black/30 px-1 rounded">.env</code> file.
        </div>
        <button onClick={dismiss} className="text-white/20 hover:text-white/50 flex-shrink-0">
          <X size={13} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
