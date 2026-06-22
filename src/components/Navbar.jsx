import { motion } from 'framer-motion'
import { LayoutDashboard, Film, Clock, Grid3X3, Trophy, BarChart3, Layers } from 'lucide-react'
import MarvelLogo from './MarvelLogo'

const TABS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'collections',  label: 'Collections',  icon: Layers },
  { id: 'entries',      label: 'Entries',      icon: Film },
  { id: 'timeline',     label: 'Timeline',     icon: Clock },
  { id: 'posterwall',   label: 'Poster Wall',  icon: Grid3X3 },
  { id: 'stats',        label: 'Stats',        icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
]

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <MarvelLogo size="md" />
            <div className="hidden md:block">
              <div className="text-white font-black text-sm leading-none">Marathon</div>
              <div className="text-white/30 text-xs leading-none mt-0.5">Tracker</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-white/10 flex-shrink-0" />

          {/* Tabs */}
          <div className="flex items-center gap-0.5 overflow-x-auto flex-1 no-select scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/25"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <Icon size={14} className="relative z-10 flex-shrink-0" />
                  <span className="relative z-10 text-xs sm:text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
