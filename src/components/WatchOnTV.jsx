import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tv, Smartphone, ExternalLink, Loader2, WifiOff } from 'lucide-react'

const TOKEN = import.meta.env.VITE_TMDB_TOKEN

// TMDB provider_id → name, brand color, and URL that opens the app on Android
const enc = encodeURIComponent
const PROVIDERS = {
  8:   { name: 'Netflix',      color: '#E50914', url: t => `https://www.netflix.com/search?q=${enc(t)}` },
  119: { name: 'Prime Video',  color: '#00A8E1', url: t => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${enc(t)}` },
  122: { name: 'JioHotstar',   color: '#1F80E0', url: t => `https://www.hotstar.com/in/search?q=${enc(t)}` },
  237: { name: 'ZEE5',         color: '#7B2FBE', url: t => `https://www.zee5.com/search?q=${enc(t)}` },
  215: { name: 'SonyLIV',      color: '#0057A8', url: t => `https://www.sonyliv.com/search?keyword=${enc(t)}` },
  192: { name: 'YouTube',      color: '#FF0000', url: t => `https://www.youtube.com/results?search_query=${enc(t + ' full movie')}` },
  350: { name: 'Apple TV+',    color: '#555',    url: t => `https://tv.apple.com/search?term=${enc(t)}` },
  2:   { name: 'Apple iTunes', color: '#FC3C44', url: t => `https://tv.apple.com/search?term=${enc(t)}` },
  3:   { name: 'Google TV',    color: '#4285F4', url: t => `https://www.google.com/search?q=${enc(t + ' watch')}` },
  10:  { name: 'Amazon Video', color: '#FF9900', url: t => `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${enc(t)}` },
}

// In-memory cache so we don't re-fetch on every open
const cache = {}

async function fetchProviders(entry) {
  if (cache[entry.id]) return cache[entry.id]
  if (!TOKEN) return null

  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
  const mediaType = entry.type === 'Movie' ? 'movie' : 'tv'
  const cleanTitle = entry.title.replace(/\s+S\d+$/i, '').replace(/\s+Season\s+\d+$/i, '').trim()
  const query = enc(cleanTitle)
  const yearParam = mediaType === 'tv' ? `first_air_date_year=${entry.year}` : `year=${entry.year}`

  try {
    // Step 1: search for TMDB ID
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/${mediaType}?query=${query}&${yearParam}&language=en-US&page=1`,
      { headers }
    )
    const searchData = await searchRes.json()
    const tmdbId = searchData.results?.[0]?.id
    if (!tmdbId) {
      // Try without year if no result
      const retryRes = await fetch(
        `https://api.themoviedb.org/3/search/${mediaType}?query=${query}&language=en-US&page=1`,
        { headers }
      )
      const retryData = await retryRes.json()
      const retryId = retryData.results?.[0]?.id
      if (!retryId) { cache[entry.id] = { providers: [], link: null }; return cache[entry.id] }
      cache[entry.id] = await resolveProviders(retryId, mediaType, headers)
    } else {
      cache[entry.id] = await resolveProviders(tmdbId, mediaType, headers)
    }
  } catch {
    cache[entry.id] = { providers: [], link: null }
  }
  return cache[entry.id]
}

async function resolveProviders(tmdbId, mediaType, headers) {
  const res = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/watch/providers`,
    { headers }
  )
  const data = await res.json()
  const IN = data.results?.IN
  if (!IN) return { providers: [], link: IN?.link ?? null }

  const seen = new Set()
  const all = [
    ...(IN.flatrate ?? []).map(p => ({ ...p, kind: 'Subscription' })),
    ...(IN.free    ?? []).map(p => ({ ...p, kind: 'Free' })),
    ...(IN.ads     ?? []).map(p => ({ ...p, kind: 'Free with ads' })),
    ...(IN.rent    ?? []).map(p => ({ ...p, kind: 'Rent' })),
    ...(IN.buy     ?? []).map(p => ({ ...p, kind: 'Buy' })),
  ].filter(p => {
    if (seen.has(p.provider_id)) return false
    seen.add(p.provider_id)
    return true
  })

  return { providers: all, link: IN.link ?? null }
}

function qrImageUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${enc(url)}`
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// ── Main button ───────────────────────────────────────────────────────────────
export function WatchOnTVButton({ entry, className = '' }) {
  const [open, setOpen] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(true)
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
        {open && <WatchModal entry={entry} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function WatchModal({ entry, onClose }) {
  const [status, setStatus]       = useState('loading') // loading | done | error
  const [providers, setProviders] = useState([])
  const [justWatchLink, setJwLink] = useState(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    fetchProviders(entry).then(result => {
      if (!result) { setStatus('error'); return }
      setProviders(result.providers)
      setJwLink(result.link)
      setStatus('done')
    })
  }, [entry])

  // On mobile: clicking a provider opens the app directly
  // On desktop: show a QR for that provider's URL
  const [qrUrl, setQrUrl] = useState(null)

  const handleProvider = (p) => {
    const config = PROVIDERS[p.provider_id]
    const url = config?.url(entry.title) ?? justWatchLink
    if (!url) return
    if (isMobile()) {
      window.open(url, '_blank', 'noopener')
    } else {
      setQrUrl(url)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

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

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Tv size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight truncate">{entry.title}</div>
            <div className="text-white/40 text-xs mt-0.5">Where to watch in India</div>
          </div>
        </div>

        {/* QR view (desktop: after picking a provider) */}
        <AnimatePresence mode="wait">
          {qrUrl ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <img src={qrImageUrl(qrUrl)} alt="QR" width={200} height={200} className="rounded-xl block" />
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs text-center">
                <Smartphone size={13} />
                <span>Scan → opens the streaming app on your phone</span>
              </div>
              <button
                onClick={() => setQrUrl(null)}
                className="text-white/30 hover:text-white/60 text-xs underline transition-colors mt-1"
              >
                ← Back to services
              </button>
            </motion.div>
          ) : (
            <motion.div key="providers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Loading */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 size={24} className="text-white/30 animate-spin" />
                  <span className="text-white/30 text-xs">Finding where to watch…</span>
                </div>
              )}

              {/* Error / no token */}
              {status === 'error' && (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <WifiOff size={24} className="text-white/20" />
                  <span className="text-white/30 text-xs">Couldn't load streaming info</span>
                </div>
              )}

              {/* Results */}
              {status === 'done' && (
                <>
                  {providers.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-white/20 text-sm mb-1">Not available to stream in India</div>
                      <div className="text-white/15 text-xs">May be available to rent or buy below</div>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {providers.map((p) => {
                        const config = PROVIDERS[p.provider_id]
                        const logoUrl = `https://image.tmdb.org/t/p/original${p.logo_path}`
                        return (
                          <button
                            key={p.provider_id}
                            onClick={() => handleProvider(p)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 transition-all group text-left"
                          >
                            <img
                              src={logoUrl}
                              alt={p.provider_name}
                              className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-semibold text-sm">{p.provider_name}</div>
                              <div className="text-white/35 text-xs">{p.kind}</div>
                            </div>
                            <div className="flex items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0">
                              {isMobile()
                                ? <span className="text-xs font-medium">Open app</span>
                                : <><span className="text-xs">Scan QR</span><Smartphone size={12} /></>
                              }
                              <ExternalLink size={13} className="ml-1" />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* JustWatch fallback link */}
                  {justWatchLink && (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-white/20 text-xs">more options</span>
                        <div className="flex-1 h-px bg-white/8" />
                      </div>
                      <a
                        href={justWatchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 text-xs font-medium transition-all"
                      >
                        <ExternalLink size={12} />
                        All streaming options on JustWatch
                      </a>
                    </>
                  )}

                  {!isMobile() && providers.length > 0 && (
                    <p className="text-white/15 text-[10px] text-center mt-3">
                      Click a service to get a QR code — scan with phone to open the app
                    </p>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
