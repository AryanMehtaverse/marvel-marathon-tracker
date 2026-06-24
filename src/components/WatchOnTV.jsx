import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tv, Smartphone, ExternalLink } from 'lucide-react'

// Build the Google TV search URL for a given title + year
function googleTvUrl(title, year) {
  const q = encodeURIComponent(`${title} ${year}`)
  // tv.google.com URLs are intercepted by the Google TV app on Android
  return `https://tv.google.com/search?q=${q}`
}

// QR code image via Google Charts API (no npm needed, no key needed)
function qrImageUrl(url) {
  const encoded = encodeURIComponent(url)
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encoded}`
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function WatchOnTVButton({ entry, className = '' }) {
  const [open, setOpen] = useState(false)
  const tvUrl = googleTvUrl(entry.title, entry.year)

  const handleClick = (e) => {
    e.stopPropagation()
    if (isMobile()) {
      // On mobile: open Google TV directly
      window.open(tvUrl, '_blank', 'noopener')
    } else {
      // On desktop: show QR modal
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
        {open && (
          <WatchModal entry={entry} tvUrl={tvUrl} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function WatchModal({ entry, tvUrl, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <motion.div
        className="relative bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 0.99, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Tv size={18} className="text-primary" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">{entry.title}</div>
            <div className="text-white/40 text-xs">{entry.year} · Watch on Google TV</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="bg-white p-2 rounded-2xl shadow-lg">
            <img
              src={qrImageUrl(tvUrl)}
              alt="QR code"
              width={220}
              height={220}
              className="rounded-xl block"
            />
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs text-center">
            <Smartphone size={13} />
            <span>Scan with your phone's camera to open Google TV</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Direct link fallback */}
        <a
          href={tvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-sm transition-colors"
        >
          <ExternalLink size={14} />
          Open on this device
        </a>

        <p className="text-white/20 text-[10px] text-center mt-3 leading-relaxed">
          Requires Google TV app installed on your phone.
          Opens the search result directly.
        </p>
      </motion.div>
    </motion.div>
  )
}
