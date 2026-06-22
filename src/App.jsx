import { useState, useCallback, useRef, useEffect } from 'react'
import { ENTRIES } from './data/entries'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAchievements } from './hooks/useAchievements'
import { useTMDB } from './hooks/useTMDB'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import EntriesView from './components/EntriesView'
import TimelineView from './components/TimelineView'
import PosterWall from './components/PosterWall'
import StatsView from './components/StatsView'
import Achievements from './components/Achievements'
import AchievementNotification from './components/AchievementNotification'
import ConfettiOverlay from './components/ConfettiOverlay'
import TMDBSetupBanner from './components/TMDBSetupBanner'

export default function App() {
  const [watchedIds, setWatchedIds]               = useLocalStorage('marvel-watched', [])
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('marvel-achievements', [])
  const [activeTab, setActiveTab]                 = useState('dashboard')
  const [notifQueue, setNotifQueue]               = useState([])
  const [showConfetti, setShowConfetti]           = useState(false)
  const brandNewDayShown                          = useRef(false)
  const { getPoster, loading: posterLoading, hasKey } = useTMDB()

  const entries = ENTRIES.map(e => ({ ...e, watched: watchedIds.includes(e.id) }))

  const handleToggle = useCallback((id) => {
    setWatchedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <TMDBSetupBanner hasKey={hasKey} loading={posterLoading} />

        {activeTab === 'dashboard'    && <Dashboard entries={entries} unlockedAchievements={unlockedAchievements} />}
        {activeTab === 'entries'      && <EntriesView entries={entries} onToggle={handleToggle} getPoster={getPoster} />}
        {activeTab === 'timeline'     && <TimelineView entries={entries} onToggle={handleToggle} />}
        {activeTab === 'posterwall'   && <PosterWall entries={entries} onToggle={handleToggle} getPoster={getPoster} />}
        {activeTab === 'stats'        && <StatsView entries={entries} />}
        {activeTab === 'achievements' && <Achievements entries={entries} unlockedAchievements={unlockedAchievements} />}
      </main>

      <AchievementNotification queue={notifQueue} onDismiss={dismissNotif} />
      <ConfettiOverlay show={showConfetti} onClose={() => setShowConfetti(false)} />
    </div>
  )
}
