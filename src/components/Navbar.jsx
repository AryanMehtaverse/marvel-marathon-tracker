import { motion } from 'framer-motion'
import { LayoutDashboard, Film, Clock, Grid3X3, Trophy, BarChart3, Layers, HelpCircle } from 'lucide-react'

const TABS = [
  { id: 'dashboard',    label: 'Home',         icon: LayoutDashboard },
  { id: 'collections',  label: 'Collections',  icon: Layers },
  { id: 'entries',      label: 'All Titles',   icon: Film },
  { id: 'timeline',     label: 'Timeline',     icon: Clock },
  { id: 'posterwall',   label: 'Poster Wall',  icon: Grid3X3 },
  { id: 'stats',        label: 'Stats',        icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'watchguide',   label: 'Watch Guide',  icon: HelpCircle },
]

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="sticky top-0 z-40 glass">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8">
        <div className="flex items-center h-[60px] gap-6">

          {/* Marvel wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex-shrink-0 flex items-center"
          >
            <div className="bg-primary px-2.5 py-1 rounded-sm">
              <span
                className="text-white text-sm font-black tracking-wider"
                style={{ fontFamily: 'Arial Black, Impact, sans-serif', letterSpacing: '0.06em' }}
              >
                MARVEL
              </span>
            </div>
            <span className="ml-2.5 text-white/40 text-xs font-heading uppercase tracking-widest hidden sm:block">
              Marathon
            </span>
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10 flex-shrink-0" />

          {/* Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto flex-1 scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-150 ${
                    active ? 'text-white' : 'text-white/35 hover:text-white/65'
                  }`}
                >
                  <Icon size={13} className="flex-shrink-0" />
                  <span className="hidden sm:block">{tab.label}</span>

                  {/* Active underline */}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
