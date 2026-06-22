import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const CACHE_KEY = 'marvel-tmdb-posters-v4'
const TTL_MS    = 30 * 24 * 60 * 60 * 1000 // 30 days
const IMG_BASE  = 'https://image.tmdb.org/t/p/w500'
const TOKEN     = import.meta.env.VITE_TMDB_TOKEN

// Exact TMDB IDs — movie ids use type:'movie', series use type:'tv'
// This guarantees the correct poster regardless of title ambiguity.
const TMDB_MAP = [
  // ── Fox X-Men ──────────────────────────────────────────────────────────────
  { id: 1,  tmdb: 36657,  type: 'movie' }, // X-Men
  { id: 2,  tmdb: 36668,  type: 'movie' }, // X2
  { id: 3,  tmdb: 36669,  type: 'movie' }, // The Last Stand
  { id: 6,  tmdb: 36662,  type: 'movie' }, // Origins: Wolverine
  { id: 9,  tmdb: 49538,  type: 'movie' }, // First Class
  { id: 13, tmdb: 76170,  type: 'movie' }, // The Wolverine
  { id: 16, tmdb: 127585, type: 'movie' }, // Days of Future Past
  { id: 25, tmdb: 246655, type: 'movie' }, // Apocalypse
  { id: 22, tmdb: 293660, type: 'movie' }, // Deadpool
  { id: 38, tmdb: 383498, type: 'movie' }, // Deadpool 2
  { id: 45, tmdb: 320288, type: 'movie' }, // Dark Phoenix
  { id: 28, tmdb: 329865, type: 'movie' }, // Logan
  { id: 48, tmdb: 430055, type: 'movie' }, // New Mutants

  // ── Sony Spider-Man (Tobey) ────────────────────────────────────────────────
  { id: 85, tmdb: 557,    type: 'movie' }, // Spider-Man
  { id: 86, tmdb: 558,    type: 'movie' }, // Spider-Man 2
  { id: 87, tmdb: 559,    type: 'movie' }, // Spider-Man 3

  // ── Sony Spider-Man (Andrew) ───────────────────────────────────────────────
  { id: 88, tmdb: 70160,  type: 'movie' }, // Amazing Spider-Man
  { id: 89, tmdb: 102382, type: 'movie' }, // Amazing Spider-Man 2

  // ── Spider-Verse ───────────────────────────────────────────────────────────
  { id: 90, tmdb: 324857, type: 'movie' }, // Into the Spider-Verse
  { id: 91, tmdb: 569094, type: 'movie' }, // Across the Spider-Verse
  { id: 92, tmdb: 614930, type: 'movie' }, // Beyond the Spider-Verse

  // ── MCU Phase 1 ────────────────────────────────────────────────────────────
  { id: 4,  tmdb: 1726,   type: 'movie' }, // Iron Man
  { id: 5,  tmdb: 1724,   type: 'movie' }, // Incredible Hulk
  { id: 7,  tmdb: 10138,  type: 'movie' }, // Iron Man 2
  { id: 8,  tmdb: 10195,  type: 'movie' }, // Thor
  { id: 10, tmdb: 1771,   type: 'movie' }, // Captain America: TFA
  { id: 11, tmdb: 24428,  type: 'movie' }, // The Avengers

  // ── MCU Phase 2 ────────────────────────────────────────────────────────────
  { id: 12, tmdb: 68721,  type: 'movie' }, // Iron Man 3
  { id: 14, tmdb: 76338,  type: 'movie' }, // Thor: Dark World
  { id: 15, tmdb: 100402, type: 'movie' }, // Winter Soldier
  { id: 17, tmdb: 118340, type: 'movie' }, // Guardians of the Galaxy
  { id: 19, tmdb: 99861,  type: 'movie' }, // Age of Ultron
  { id: 20, tmdb: 102899, type: 'movie' }, // Ant-Man

  // ── MCU Phase 3 ────────────────────────────────────────────────────────────
  { id: 24, tmdb: 271110, type: 'movie' }, // Civil War
  { id: 27, tmdb: 284052, type: 'movie' }, // Doctor Strange
  { id: 30, tmdb: 283995, type: 'movie' }, // GotG Vol. 2
  { id: 31, tmdb: 315635, type: 'movie' }, // Homecoming
  { id: 33, tmdb: 284053, type: 'movie' }, // Ragnarok
  { id: 35, tmdb: 284054, type: 'movie' }, // Black Panther
  { id: 37, tmdb: 299536, type: 'movie' }, // Infinity War
  { id: 40, tmdb: 363088, type: 'movie' }, // Ant-Man and the Wasp
  { id: 44, tmdb: 299534, type: 'movie' }, // Endgame
  { id: 47, tmdb: 429617, type: 'movie' }, // Far From Home
  { id: 57, tmdb: 566525, type: 'movie' }, // No Way Home

  // ── Netflix Marvel ─────────────────────────────────────────────────────────
  { id: 18, tmdb: 61889,  type: 'tv' }, // Daredevil
  { id: 21, tmdb: 61888,  type: 'tv' }, // Jessica Jones
  { id: 23, tmdb: 61889,  type: 'tv' }, // Daredevil S2 (same show)
  { id: 26, tmdb: 62126,  type: 'tv' }, // Luke Cage
  { id: 29, tmdb: 62127,  type: 'tv' }, // Iron Fist
  { id: 32, tmdb: 67178,  type: 'tv' }, // The Defenders
  { id: 34, tmdb: 67466,  type: 'tv' }, // The Punisher
  { id: 36, tmdb: 61888,  type: 'tv' }, // Jessica Jones S2
  { id: 39, tmdb: 62126,  type: 'tv' }, // Luke Cage S2
  { id: 41, tmdb: 62127,  type: 'tv' }, // Iron Fist S2
  { id: 42, tmdb: 61889,  type: 'tv' }, // Daredevil S3
  { id: 43, tmdb: 67466,  type: 'tv' }, // Punisher S2
  { id: 46, tmdb: 61888,  type: 'tv' }, // Jessica Jones S3

  // ── MCU Phase 4 ────────────────────────────────────────────────────────────
  { id: 49, tmdb: 85271,  type: 'tv'    }, // WandaVision
  { id: 50, tmdb: 88396,  type: 'tv'    }, // Falcon & Winter Soldier
  { id: 51, tmdb: 84958,  type: 'tv'    }, // Loki
  { id: 52, tmdb: 497698, type: 'movie' }, // Black Widow
  { id: 53, tmdb: 117283, type: 'tv'    }, // What If...?
  { id: 54, tmdb: 566762, type: 'movie' }, // Shang-Chi
  { id: 55, tmdb: 524434, type: 'movie' }, // Eternals
  { id: 56, tmdb: 88329,  type: 'tv'    }, // Hawkeye
  { id: 57, tmdb: 566525, type: 'movie' }, // No Way Home (already above, deduped in fetch)
  { id: 58, tmdb: 91363,  type: 'tv'    }, // Moon Knight
  { id: 59, tmdb: 408736, type: 'movie' }, // Doctor Strange MoM
  { id: 60, tmdb: 92782,  type: 'tv'    }, // Ms. Marvel
  { id: 61, tmdb: 616037, type: 'movie' }, // Love and Thunder
  { id: 62, tmdb: 120802, type: 'tv'    }, // I Am Groot
  { id: 63, tmdb: 92783,  type: 'tv'    }, // She-Hulk
  { id: 64, tmdb: 933131, type: 'movie' }, // Werewolf by Night
  { id: 65, tmdb: 315162, type: 'movie' }, // Wakanda Forever
  { id: 66, tmdb: 828340, type: 'movie' }, // GotG Holiday Special

  // ── MCU Phase 5 ────────────────────────────────────────────────────────────
  { id: 67, tmdb: 640146, type: 'movie' }, // Quantumania
  { id: 68, tmdb: 447365, type: 'movie' }, // GotG Vol. 3
  { id: 69, tmdb: 114472, type: 'tv'    }, // Secret Invasion
  { id: 70, tmdb: 84958,  type: 'tv'    }, // Loki S2
  { id: 71, tmdb: 609681, type: 'movie' }, // The Marvels
  { id: 93, tmdb: 117283, type: 'tv'    }, // What If S2
  { id: 72, tmdb: 202555, type: 'tv'    }, // Echo
  { id: 73, tmdb: 567604, type: 'movie' }, // Deadpool & Wolverine
  { id: 74, tmdb: 222766, type: 'tv'    }, // Agatha All Along
  { id: 75, tmdb: 117283, type: 'tv'    }, // What If S3
  { id: 76, tmdb: 822119, type: 'movie' }, // Captain America: Brave New World
  { id: 77, tmdb: 209867, type: 'tv'    }, // Daredevil: Born Again
  { id: 78, tmdb: 986056, type: 'movie' }, // Thunderbolts*
  { id: 79, tmdb: 228164, type: 'tv'    }, // Ironheart
  { id: 80, tmdb: 906126, type: 'movie' }, // Fantastic Four: First Steps

  // ── MCU Phase 6 ────────────────────────────────────────────────────────────
  { id: 81, tmdb: 209867, type: 'tv'    }, // Daredevil: Born Again S2
  { id: 82, tmdb: 67466,  type: 'tv'    }, // Punisher: One Last Kill (using Punisher show)
  { id: 83, tmdb: 634649, type: 'movie' }, // Spider-Man: Brand New Day (placeholder)
  { id: 84, tmdb: 986057, type: 'movie' }, // Avengers: Doomsday (placeholder)
]

async function fetchPoster(tmdbId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?language=en-US`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) {
    console.warn(`[TMDB] ${res.status} for ${mediaType}/${tmdbId}`)
    return null
  }
  const data = await res.json()
  return data.poster_path ? `${IMG_BASE}${data.poster_path}` : null
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
    console.log('[TMDB] Starting poster fetch…')
    setLoading(true)
    setProgress(0)
    const map = { _ts: Date.now() }

    // Dedupe by tmdb id+type so multi-season shows only fetch once
    const seen = new Set()
    const unique = TMDB_MAP.filter(({ tmdb, type }) => {
      const key = `${type}:${tmdb}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    let fetched = 0
    for (let i = 0; i < unique.length; i++) {
      const { tmdb, type } = unique[i]
      try {
        const url = await fetchPoster(tmdb, type)
        if (url) { map[`${type}:${tmdb}`] = url; fetched++ }
      } catch (e) {
        console.warn(`[TMDB] fetch error for ${type}/${tmdb}:`, e)
      }
      setProgress(Math.round(((i + 1) / unique.length) * 100))
    }

    // Map entry ids → poster url
    for (const { id, tmdb, type } of TMDB_MAP) {
      const url = map[`${type}:${tmdb}`]
      if (url) map[`e${id}`] = url
    }

    console.log(`[TMDB] Done — ${fetched}/${unique.length} posters fetched`)
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
