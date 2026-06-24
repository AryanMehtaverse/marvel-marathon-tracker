import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tv, Smartphone, ExternalLink } from 'lucide-react'

function searchUrl(title, year) {
  const q = encodeURIComponent(`${title} ${year} watch`)
  return `https://www.google.com/search?q=${q}`
}

function qrImageUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(url)}`
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function WatchOnTVButton({ entry, className = '' }) {
  const [open, setOpen] = useState(false)
  const url = searchUrl(entry.title, entry.year)

  const handleClick = (e) => {
    e.stopPropagation()
    if (isMobile()) {
      window.open(url, '_blank', 'noopener')
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
        {open && <WatchModal entry={entry} url={url} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function WatchModal({ entry, url, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Tv size={18} className="text-primary" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">{entry.title}</div>
            <div className="text-white/40 text-xs">{entry.year} · Watch on your TV</div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="bg-white p-2 rounded-2xl shadow-lg">
            <img src={qrImageUrl(url)} alt="QR code" width={220} height={220} className="rounded-xl block" />
          </div>
          <div className="flex items-start gap-2 text-white/40 text-xs text-center px-2">
            <Smartphone size={13} className="flex-shrink-0 mt-0.5" />
            <span>Scan → Google shows all streaming services → tap <strong className="text-white/60">Watch</strong> on any service → tap <strong className="text-white/60">TV nearby</strong> to cast</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs">or open on this device</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-sm transition-colors"
        >
          <ExternalLink size={14} />
          Open Google Search
        </a>
      </motion.div>
    </motion.div>
  )
}
