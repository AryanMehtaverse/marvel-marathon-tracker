import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { ENTRIES } from '../data/entries'

const CACHE_KEY = 'marvel-wiki-posters-v3'
const TTL_MS    = 14 * 24 * 60 * 60 * 1000 // 14 days
// MediaWiki API with prop=pageimages returns the infobox/representative poster image
// origin=* enables CORS from browser, pithumbsize=600 requests 600px wide thumbnail
const API_BASE  = 'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=600&origin=*&titles='

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

    // Dedupe wikiTitles — multiple seasons share the same page
    const titleToIds = {}
    for (const entry of ENTRIES) {
      if (!entry.wikiTitle) continue
      if (!titleToIds[entry.wikiTitle]) titleToIds[entry.wikiTitle] = []
      titleToIds[entry.wikiTitle].push(entry.id)
    }

    const uniqueTitles = Object.keys(titleToIds)
    // MediaWiki API allows up to 50 titles per request
    const CHUNK = 50
    let done = 0

    for (let i = 0; i < uniqueTitles.length; i += CHUNK) {
      const batch  = uniqueTitles.slice(i, i + CHUNK)
      const joined = batch.map(t => encodeURIComponent(t)).join('|')
      try {
        const res  = await fetch(API_BASE + joined)
        const data = await res.json()
        const pages = data?.query?.pages || {}
        for (const page of Object.values(pages)) {
          const src = page?.thumbnail?.source
          if (!src) continue
          // Match page title back to wikiTitle (Wikipedia may normalise the title slightly)
          const matched = batch.find(
            t => t.toLowerCase() === (page.title || '').toLowerCase()
          ) || batch.find(
            t => decodeURIComponent(t).toLowerCase() === (page.title || '').toLowerCase()
          )
          if (matched) {
            map[`wiki:${matched}`] = src
          }
        }
      } catch {}
      done += batch.length
      setProgress(Math.round((done / uniqueTitles.length) * 100))
    }

    // Resolve entry id → URL
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
