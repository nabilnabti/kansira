import { NavLink } from 'react-router-dom'
import { Home, User, Award, Settings, ChevronDown, Crown } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Mascot } from '../ui/Mascot'
import StreakDisplay from '../app/StreakDisplay'
import XPBar from '../app/XPBar'

const navItems = [
  { to: '/app', label: 'Parcours', icon: Home },
  { to: '/app/profile', label: 'Profil', icon: User },
  { to: '/app/badges', label: 'Badges', icon: Award },
  { to: '/app/premium', label: 'Premium', icon: Crown },
  { to: '/app/settings', label: 'Paramètres', icon: Settings },
]

const languageOptions = [
  { code: 'bm' as const, label: 'Bambara' },
  { code: 'snk' as const, label: 'Soninké' },
]

export default function Sidebar() {
  const { activeLanguage, setActiveLanguage } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)

  const activeLangLabel = languageOptions.find((l) => l.code === activeLanguage)?.label

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-2">
        <Mascot size={40} expression="happy" />
        <h1 className="text-primary font-bold text-xl tracking-tight">Kan Sira</h1>
      </div>

      {/* Language picker */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setLangOpen(!langOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-background text-sm font-medium text-dark hover:bg-primary/5 transition-colors"
        >
          <span>{activeLangLabel}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${langOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {langOpen && (
          <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setActiveLanguage(lang.code)
                  setLangOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeLanguage === lang.code
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-gray-50 text-dark'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-5 pb-6 space-y-4">
        <StreakDisplay />
        <XPBar />
      </div>
    </aside>
  )
}
