import { motion } from 'framer-motion'
import { LayoutDashboard, Film, Clock, Grid3X3, Trophy } from 'lucide-react'

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'entries',    label: 'Entries',     icon: Film },
  { id: 'timeline',   label: 'Timeline',    icon: Clock },
  { id: 'posterwall', label: 'Poster Wall', icon: Grid3X3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
]

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="text-white font-black text-lg hidden sm:block">
              Marvel <span className="text-primary">Marathon</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 no-select">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                    ${active ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/20 rounded-lg border border-primary/30"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10" />
                  <span className="relative z-10 hidden sm:block">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
