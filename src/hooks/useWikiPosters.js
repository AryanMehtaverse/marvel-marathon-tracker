import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { ENTRIES } from '../data/entries'

const CACHE_KEY = 'marvel-wiki-posters-v1'
const TTL_MS    = 14 * 24 * 60 * 60 * 1000 // 14 days
const API       = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

function upscaleThumb(url) {
  if (!url) return url
  // Replace e.g. "320px-" with "500px-" for higher resolution
  return url.replace(/\/\d+px-/, '/500px-')
}

export function useWikiPosters() {
  const [cache, setCache]     = useLocalStorage(CACHE_KEY, null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const isFresh = cache && cache._ts && (Date.now() - cache._ts) < TTL_MS

  useEffect(() => {
    if (isFresh) return
    fetchAll()
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setProgress(0)
    const map = { _ts: Date.now() }

    // Dedupe: multiple seasons of same show share one wiki page
    const seen  = new Set()
    const tasks = []
    for (const entry of ENTRIES) {
      if (!entry.wikiTitle) continue
      if (seen.has(entry.wikiTitle)) continue
      seen.add(entry.wikiTitle)
      tasks.push(entry)
    }

    const CHUNK = 6
    for (let i = 0; i < tasks.length; i += CHUNK) {
      const chunk = tasks.slice(i, i + CHUNK)
      await Promise.all(chunk.map(async (entry) => {
        try {
          const url = API + encodeURIComponent(entry.wikiTitle)
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
          if (!res.ok) return
          const data = await res.json()
          const img  = data.originalimage?.source || data.thumbnail?.source
          if (img) map[entry.wikiTitle] = upscaleThumb(img)
        } catch {}
      }))
      setProgress(Math.round(((i + CHUNK) / tasks.length) * 100))
    }

    // Map entry id → poster URL (multiple seasons share same show poster)
    for (const entry of ENTRIES) {
      if (entry.wikiTitle && map[entry.wikiTitle]) {
        map[`e${entry.id}`] = map[entry.wikiTitle]
      }
    }

    setCache(map)
    setLoading(false)
    setProgress(100)
  }, [setCache])

  const getPoster = useCallback((id) => cache?.[`e${id}`] || null, [cache])

  return { getPoster, loading, progress, refresh: fetchAll }
}
