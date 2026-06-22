import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENTRIES } from './data/entries'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAchievements } from './hooks/useAchievements'
import { useWikiPosters } from './hooks/useWikiPosters'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import EntriesView from './components/EntriesView'
import TimelineView from './components/TimelineView'
import PosterWall from './components/PosterWall'
import StatsView from './components/StatsView'
import Achievements from './components/Achievements'
import AchievementNotification from './components/AchievementNotification'
import ConfettiOverlay from './components/ConfettiOverlay'
import HeroEffect, { getHeroEffect } from './components/HeroEffect'

function PosterLoadingBar({ loading, progress }) {
  if (!loading) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="h-0.5 bg-white/5 w-full">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-center mt-1">
          <span className="text-xs text-white/30 bg-bg px-2 py-0.5 rounded-full">
            Loading posters… {progress}%
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [watchedIds, setWatchedIds]                     = useLocalStorage('marvel-watched', [])
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('marvel-achievements', [])
  const [activeTab, setActiveTab]                       = useState('dashboard')
  const [notifQueue, setNotifQueue]                     = useState([])
  const [showConfetti, setShowConfetti]                 = useState(false)
  const [heroEffect, setHeroEffect]                     = useState(null)   // { type: string }
  const brandNewDayShown                                = useRef(false)

  const { getPoster, loading: posterLoading, progress } = useWikiPosters()

  const entries = useMemo(
    () => ENTRIES.map(e => ({ ...e, watched: watchedIds.includes(e.id) })),
    [watchedIds]
  )

  const handleExport = useCallback(() => {
    const data = { watchedIds, unlockedAchievements, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marvel-marathon-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [watchedIds, unlockedAchievements])

  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (Array.isArray(data.watchedIds)) setWatchedIds(data.watchedIds)
        if (Array.isArray(data.unlockedAchievements)) setUnlockedAchievements(data.unlockedAchievements)
      } catch {
        alert('Invalid backup file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [setWatchedIds, setUnlockedAchievements])

  const handleToggle = useCallback((id) => {
    setWatchedIds(prev => {
      const isWatching = !prev.includes(id)
      const next = isWatching ? [...prev, id] : prev.filter(x => x !== id)

      if (isWatching) {
        const entry = ENTRIES.find(e => e.id === id)
        const effectType = getHeroEffect(entry)
        setHeroEffect({ type: effectType, key: Date.now() })
      }

      if (next.includes(83) && !brandNewDayShown.current) {
        brandNewDayShown.current = true
        setTimeout(() => setShowConfetti(true), 400)
      }
      return next
    })
  }, [setWatchedIds])

  const handleAchievementUnlock = useCallback((ach) => {
    setNotifQueue(q => [...q, ach])
  }, [])

  const dismissNotif = useCallback((id) => {
    setNotifQueue(q => q.filter(a => a.id !== id))
  }, [])

  useAchievements(entries, unlockedAchievements, setUnlockedAchievements, handleAchievementUnlock)

  useEffect(() => {
    if (!watchedIds.includes(83)) brandNewDayShown.current = false
  }, [watchedIds])

  return (
    <div className="min-h-screen bg-bg">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <PosterLoadingBar loading={posterLoading} progress={progress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'dashboard'    && <Dashboard entries={entries} unlockedAchievements={unlockedAchievements} onExport={handleExport} onImport={handleImport} />}
        {activeTab === 'entries'      && <EntriesView entries={entries} onToggle={handleToggle} getPoster={getPoster} />}
        {activeTab === 'timeline'     && <TimelineView entries={entries} onToggle={handleToggle} />}
        {activeTab === 'posterwall'   && <PosterWall entries={entries} onToggle={handleToggle} getPoster={getPoster} />}
        {activeTab === 'stats'        && <StatsView entries={entries} />}
        {activeTab === 'achievements' && <Achievements entries={entries} unlockedAchievements={unlockedAchievements} />}
      </main>

      <AchievementNotification queue={notifQueue} onDismiss={dismissNotif} />
      <ConfettiOverlay show={showConfetti} onClose={() => setShowConfetti(false)} />

      <AnimatePresence>
        {heroEffect && (
          <HeroEffect
            key={heroEffect.key}
            effectType={heroEffect.type}
            onDone={() => setHeroEffect(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
