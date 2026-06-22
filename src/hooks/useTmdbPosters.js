import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { ENTRIES } from '../data/entries'

const CACHE_KEY = 'marvel-tmdb-posters-v6'
const TTL_MS    = 30 * 24 * 60 * 60 * 1000
const IMG_BASE  = 'https://image.tmdb.org/t/p/w500'
const TOKEN     = import.meta.env.VITE_TMDB_TOKEN

const HEADERS = { Authorization: `Bearer ${TOKEN}` }

// Strip season suffixes so "Daredevil S1" → "Daredevil" for search
function cleanTitle(title) {
  return title
    .replace(/\s+S\d+$/i, '')          // "Daredevil S1" → "Daredevil"
    .replace(/\s+Season\s+\d+$/i, '')  // "... Season 2" → ...
    .replace(/\s*:\s*Born Again.*$/i, ': Born Again') // keep show name
    .trim()
}

async function searchTmdb(entry) {
  const query = encodeURIComponent(cleanTitle(entry.title))
  const year  = entry.year

  // Decide whether to search movie or tv
  const isTV = entry.type === 'Series' || entry.type === 'Special' && entry.universe === 'MCU'

  // Try the primary type first, then fall back to the other
  const types = isTV ? ['tv', 'movie'] : ['movie', 'tv']

  for (const mediaType of types) {
    const yearParam = mediaType === 'tv'
      ? `first_air_date_year=${year}`
      : `year=${year}`

    const url = `https://api.themoviedb.org/3/search/${mediaType}?query=${query}&${yearParam}&language=en-US&page=1`

    try {
      const res = await fetch(url, { headers: HEADERS })
      if (!res.ok) continue

      const data = await res.json()
      const results = data.results || []

      // Pick the first result that has a poster
      const hit = results.find(r => r.poster_path) || results[0]
      if (hit?.poster_path) {
        return `${IMG_BASE}${hit.poster_path}`
      }
    } catch {}
  }

  // Last resort: search without year constraint
  try {
    const primaryType = isTV ? 'tv' : 'movie'
    const url = `https://api.themoviedb.org/3/search/${primaryType}?query=${query}&language=en-US&page=1`
    const res = await fetch(url, { headers: HEADERS })
    if (res.ok) {
      const data = await res.json()
      const hit = (data.results || []).find(r => r.poster_path)
      if (hit?.poster_path) return `${IMG_BASE}${hit.poster_path}`
    }
  } catch {}

  return null
}

export function useTmdbPosters() {
  const [cache, setCache]       = useLocalStorage(CACHE_KEY, null)
  const [loading, setLoading]   = useState(false)
  const [progress, setProgress] = useState(0)

  const isFresh = cache && cache._ts && (Date.now() - cache._ts) < TTL_MS

  const fetchAll = useCallback(async () => {
    if (!TOKEN) {
      console.error('[TMDB] VITE_TMDB_TOKEN is not set!')
      return
    }
    console.log('[TMDB] Starting search-based poster fetch…')
    setLoading(true)
    setProgress(0)

    const map = { _ts: Date.now() }
    let fetched = 0

    for (let i = 0; i < ENTRIES.length; i++) {
      const entry = ENTRIES[i]
      if (!entry.upcoming) { // skip entries with no poster yet
        try {
          const url = await searchTmdb(entry)
          if (url) {
            map[`e${entry.id}`] = url
            fetched++
          } else {
            console.warn(`[TMDB] No poster found for: ${entry.title} (${entry.year})`)
          }
        } catch (e) {
          console.warn(`[TMDB] Error for ${entry.title}:`, e)
        }
      }

      setProgress(Math.round(((i + 1) / ENTRIES.length) * 100))

      // Small delay every 10 requests to avoid rate limiting
      if ((i + 1) % 10 === 0) await new Promise(r => setTimeout(r, 250))
    }

    console.log(`[TMDB] Done — ${fetched}/${ENTRIES.filter(e => !e.upcoming).length} posters fetched`)
    setCache(map)
    setLoading(false)
    setProgress(100)
  }, [setCache])

  useEffect(() => {
    if (isFresh) {
      console.log('[TMDB] Using cached posters')
      return
    }
    fetchAll()
  }, [fetchAll])

  const getPoster = useCallback((id) => cache?.[`e${id}`] || null, [cache])

  return { getPoster, loading, progress, refresh: fetchAll }
}
