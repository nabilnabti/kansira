import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, BookOpen, GraduationCap, Users, ArrowLeft, Menu, X, BookMarked } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mascot } from '../ui/Mascot'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/modules', icon: BookOpen, label: 'Modules', end: false },
  { to: '/admin/lessons', icon: GraduationCap, label: 'Leçons', end: false },
  { to: '/admin/stories', icon: BookMarked, label: 'Histoires', end: false },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs', end: false },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarContent = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <Mascot size={36} expression="happy" />
        <div>
          <h1 className="text-base font-bold text-white leading-tight">Kan Sira</h1>
          <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Admin</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 border-t border-white/10" />

      {/* Nav links */}
      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Back to app */}
      <div className="px-3 pb-5">
        <NavLink
          to="/app"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-white/8 hover:text-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'app
        </NavLink>
      </div>
    </nav>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-[250px] flex-shrink-0 flex-col"
        style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[250px] z-50 lg:hidden shadow-2xl"
              style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)' }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="flex items-center gap-3 px-4 md:px-8 py-4 bg-white border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#131516] lg:hidden">Kan Sira Admin</h1>
          </div>
          {/* Breadcrumb placeholder on desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span>Administration</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
