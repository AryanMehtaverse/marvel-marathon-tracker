import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tv, Smartphone } from 'lucide-react'

// Explicit MAIN/LAUNCHER action — required to actually open the app vs showing Play Store
const GOOGLE_TV_INTENT = 'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=com.google.android.videos;end'

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function WatchOnTVButton({ entry, className = '' }) {
  const [open, setOpen] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    if (isMobile()) {
      window.location.href = GOOGLE_TV_INTENT
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${className}`}
      >
        <Tv size={12} />
        Watch on TV
      </button>

      <AnimatePresence>
        {open && <DesktopModal entry={entry} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

// Desktop just tells the user to tap on their phone
function DesktopModal({ entry, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      <motion.div
        className="relative bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center"
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors">
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <Smartphone size={26} className="text-primary" />
        </div>

        <h3 className="text-white font-bold text-base mb-1">{entry.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">
          Open this site on your phone and tap <span className="text-white/70 font-semibold">Watch on TV</span> — it'll launch Google TV directly.
        </p>
      </motion.div>
    </motion.div>
  )
}
