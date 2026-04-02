import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Award, Crown, Settings, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface TabItem {
  to: string
  label: string
  icon: LucideIcon
}

const tabs: TabItem[] = [
  { to: '/app', label: 'Parcours', icon: Home },
  { to: '/app/stories', label: 'Histoires', icon: BookOpen },
  { to: '/app/badges', label: 'Badges', icon: Award },
  { to: '/app/premium', label: 'Premium', icon: Crown },
  { to: '/app/settings', label: 'Réglages', icon: Settings },
]

function TabIcon({ tab, isActive }: { tab: TabItem; isActive: boolean }) {
  const Icon = tab.icon
  return (
    <div className="relative flex flex-col items-center gap-0.5 py-1">
      {/* Active dot indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 w-5 h-1 rounded-full bg-primary"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isActive ? { y: -2 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200
          ${isActive ? 'bg-primary/10' : ''}
        `}>
          <Icon
            size={22}
            strokeWidth={isActive ? 2.5 : 1.5}
            className={isActive ? 'text-primary' : 'text-gray-400'}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {isActive ? (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="text-[10px] font-bold text-primary"
          >
            {tab.label}
          </motion.span>
        ) : (
          <span className="text-[10px] font-medium text-gray-400">
            {tab.label}
          </span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
        className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50"
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/app'}
              className="flex-1 flex items-center justify-center"
            >
              {({ isActive }) => <TabIcon tab={tab} isActive={isActive} />}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </nav>
  )
}
