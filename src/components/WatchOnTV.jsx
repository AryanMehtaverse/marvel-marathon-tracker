import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tv, Smartphone, ExternalLink } from 'lucide-react'

// Android Intent URL — opens Google TV app (com.google.android.videos) to search.
// Falls back to tv.google.com if intent isn't handled.
function intentUrl(title, year) {
  const q   = encodeURIComponent(`${title} ${year}`)
  const web = encodeURIComponent(`https://tv.google.com/search?q=${q}`)
  return `intent://search?q=${q}#Intent;scheme=googletv;package=com.google.android.videos;S.browser_fallback_url=${web};end`
}

// QR code encodes the tv.google.com URL — intent:// doesn't scan well with cameras.
// Android intercepts tv.google.com and opens the Google TV app.
function webUrl(title, year) {
  const q = encodeURIComponent(`${title} ${year}`)
  return `https://tv.google.com/search?q=${q}`
}

function qrImageUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(url)}`
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function WatchOnTVButton({ entry, className = '' }) {
  const [open, setOpen] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    if (isMobile()) {
      // Intent URL directly opens Google TV app search on Android
      window.location.href = intentUrl(entry.title, entry.year)
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
        {open && (
          <WatchModal entry={entry} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function WatchModal({ entry, onClose }) {
  const qrUrl  = webUrl(entry.title, entry.year)      // for QR — camera-friendly
  const tapUrl = intentUrl(entry.title, entry.year)   // for "Open on this device"

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
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
          <X size={18} />
        </button>

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
              src={qrImageUrl(qrUrl)}
              alt="QR code"
              width={220}
              height={220}
              className="rounded-xl block"
            />
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs text-center">
            <Smartphone size={13} />
            <span>Scan with phone camera → opens Google TV app</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/20 text-xs">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Opens Google TV app via intent on Android */}
        <a
          href={tapUrl}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-bold text-sm transition-colors"
        >
          <ExternalLink size={14} />
          Open on this device
        </a>

        <p className="text-white/20 text-[10px] text-center mt-3 leading-relaxed">
          Opens Google TV app search directly on Android.
        </p>
      </motion.div>
    </motion.div>
  )
}
