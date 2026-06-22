import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { ENTRIES } from '../data/entries'

const CACHE_KEY = 'marvel-wiki-posters-v4'
const TTL_MS    = 14 * 24 * 60 * 60 * 1000 // 14 days

// MediaWiki pageimages API — returns the infobox/representative image (movie poster)
// origin=* enables CORS · pithumbsize=600 requests a 600px thumbnail
const API = (titles) =>
  `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=600&origin=*&titles=${titles}`

export function useWikiPosters() {
  const [cache, setCache]       = useLocalStorage(CACHE_KEY, null)
  const [loading, setLoading]   = useState(false)
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

    // Build: wikiTitle → [entryId, ...]
    const titleToIds = {}
    for (const e of ENTRIES) {
      if (!e.wikiTitle) continue
      if (!titleToIds[e.wikiTitle]) titleToIds[e.wikiTitle] = []
      titleToIds[e.wikiTitle].push(e.id)
    }

    const uniqueTitles = Object.keys(titleToIds)
    const CHUNK = 50
    let done = 0

    for (let i = 0; i < uniqueTitles.length; i += CHUNK) {
      const batch  = uniqueTitles.slice(i, i + CHUNK)
      const joined = batch.map(encodeURIComponent).join('|')

      try {
        const res  = await fetch(API(joined))
        if (!res.ok) continue
        const data = await res.json()

        // Wikipedia returns a "normalized" array mapping our input → actual title
        // e.g. { from: "Iron_Man_(film)", to: "Iron Man (film)" }
        // Build a reverse lookup: actual Wikipedia title → our original wikiTitle
        const normMap = {}
        for (const b of batch) normMap[b] = b  // identity first
        for (const n of (data?.query?.normalized || [])) {
          // n.from is URL-decoded version of what we sent
          const original = batch.find(t => t === n.from || decodeURIComponent(t) === n.from)
          if (original) normMap[n.to] = original
        }

        const pages = data?.query?.pages || {}
        for (const page of Object.values(pages)) {
          if (!page.thumbnail?.source) continue
          const wikiTitle = normMap[page.title]
          if (!wikiTitle) continue
          // Store URL keyed by wikiTitle
          map[`wiki:${wikiTitle}`] = page.thumbnail.source
        }
      } catch {}

      done += batch.length
      setProgress(Math.round((done / uniqueTitles.length) * 100))
    }

    // Resolve wikiTitle → entry ids
    for (const [wikiTitle, ids] of Object.entries(titleToIds)) {
      const url = map[`wiki:${wikiTitle}`]
      if (url) ids.forEach(id => { map[`e${id}`] = url })
    }

    setCache(map)
    setLoading(false)
    setProgress(100)
  }, [setCache])

  const getPoster = useCallback((id) => cache?.[`e${id}`] || null, [cache])

  return { getPoster, loading, progress, refresh: fetchAll }
}
