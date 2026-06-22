import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { ENTRIES } from '../data/entries'

const TMDB_IMG  = 'https://image.tmdb.org/t/p/w500'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const CACHE_KEY = 'marvel-poster-cache-v2'
const TTL_MS    = 7 * 24 * 60 * 60 * 1000 // 7 days

export function useTMDB() {
  const [cache, setCache]     = useLocalStorage(CACHE_KEY, null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  const isFresh = cache && cache._ts && (Date.now() - cache._ts) < TTL_MS

  useEffect(() => {
    if (!apiKey || isFresh) return
    fetchAll()
  }, [apiKey])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const map = { _ts: Date.now() }

    // Dedupe by tmdbId+tmdbType so we only fetch each show once
    const seen = new Set()
    const tasks = []
    for (const entry of ENTRIES) {
      if (!entry.tmdbId) continue
      const key = `${entry.tmdbType}-${entry.tmdbId}`
      if (seen.has(key)) continue
      seen.add(key)
      tasks.push({ entry, key })
    }

    try {
      // Batch in chunks of 20 to avoid flooding TMDB
      const CHUNK = 20
      for (let i = 0; i < tasks.length; i += CHUNK) {
        const chunk = tasks.slice(i, i + CHUNK)
        await Promise.all(chunk.map(async ({ entry, key }) => {
          try {
            const url = `${TMDB_BASE}/${entry.tmdbType}/${entry.tmdbId}?api_key=${apiKey}`
            const res = await fetch(url)
            if (!res.ok) return
            const data = await res.json()
            if (data.poster_path) map[key] = `${TMDB_IMG}${data.poster_path}`
          } catch {}
        }))
      }
      // Resolve per-entry: multiple seasons of same show share poster
      for (const entry of ENTRIES) {
        if (!entry.tmdbId) continue
        const key = `${entry.tmdbType}-${entry.tmdbId}`
        if (map[key]) map[`entry-${entry.id}`] = map[key]
      }
      setCache(map)
    } catch (e) {
      setError('Failed to load posters')
    }
    setLoading(false)
  }, [apiKey, setCache])

  const getPoster = useCallback((entryId) => {
    if (!cache) return null
    return cache[`entry-${entryId}`] || null
  }, [cache])

  return { getPoster, loading, hasKey: !!apiKey, error, refresh: fetchAll }
}
