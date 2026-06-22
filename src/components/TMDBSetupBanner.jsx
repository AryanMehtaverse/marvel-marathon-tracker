import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, X, ExternalLink } from 'lucide-react'

export default function TMDBSetupBanner({ hasKey, loading }) {
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('tmdb-banner-dismissed') === '1'
  )

  const dismiss = () => {
    localStorage.setItem('tmdb-banner-dismissed', '1')
    setDismissed(true)
  }

  if (hasKey || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="bg-[#1a1200] border border-yellow-500/20 rounded-xl px-4 py-3 flex items-center gap-3 text-sm mb-6"
      >
        <ImageIcon size={16} className="text-yellow-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-yellow-200/80">
            Add a free TMDB API key to see real movie posters.{' '}
          </span>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 underline inline-flex items-center gap-1"
          >
            Get key <ExternalLink size={11} />
          </a>
          <span className="text-yellow-200/40 ml-2 text-xs">
            → create <code className="bg-black/30 px-1 rounded">.env</code> → set{' '}
            <code className="bg-black/30 px-1 rounded">VITE_TMDB_API_KEY=yourkey</code> → restart dev server
          </span>
        </div>
        <button onClick={dismiss} className="text-white/20 hover:text-white/60 flex-shrink-0">
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
