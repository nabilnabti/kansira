import { NavLink } from 'react-router-dom'
import { Home, User, Award, Settings, Crown } from 'lucide-react'

const tabs = [
  { to: '/app', label: 'Parcours', icon: Home },
  { to: '/app/badges', label: 'Badges', icon: Award },
  { to: '/app/premium', label: 'Premium', icon: Crown },
  { to: '/app/settings', label: 'Paramètres', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`
            }
          >
            <tab.icon size={22} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
