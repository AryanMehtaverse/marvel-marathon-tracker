import { useEffect, useRef } from 'react'
import { ACHIEVEMENTS_DEF } from '../data/entries'

export function useAchievements(entries, unlockedAchievements, setUnlockedAchievements, onUnlock) {
  const watchedCount = entries.filter(e => e.watched).length
  const total = entries.length
  const prevUnlocked = useRef(new Set(unlockedAchievements))

  useEffect(() => {
    const newlyUnlocked = []
    for (const ach of ACHIEVEMENTS_DEF) {
      if (!prevUnlocked.current.has(ach.id) && ach.check(watchedCount, total, entries)) {
        newlyUnlocked.push(ach)
      }
    }
    if (newlyUnlocked.length > 0) {
      const ids = newlyUnlocked.map(a => a.id)
      setUnlockedAchievements(prev => [...new Set([...prev, ...ids])])
      newlyUnlocked.forEach(ach => onUnlock(ach))
      ids.forEach(id => prevUnlocked.current.add(id))
    }
  }, [entries, watchedCount, total, setUnlockedAchievements, onUnlock])
}
