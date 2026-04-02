import { Outlet } from 'react-router-dom'
import { Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { Mascot } from '../ui/Mascot'

function MobileHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100"
    >
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <Mascot size={32} expression="happy" />
          <h1 className="text-primary font-extrabold text-lg tracking-tight">
            Kan Sira
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background rounded-full px-2.5 py-1">
            <Flame size={14} className="text-accent" />
            <span className="text-xs font-bold text-dark">0</span>
          </div>
          <div className="flex items-center gap-1 bg-background rounded-full px-2.5 py-1">
            <Star size={14} className="text-gold" />
            <span className="text-xs font-bold text-dark">0</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background/30">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile header */}
      <MobileHeader />

      {/* Main content — extra bottom padding for floating nav */}
      <main className="md:ml-[260px] px-4 pt-2 pb-28 md:px-8 md:py-8 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile floating bottom nav */}
      <BottomNav />
    </div>
  )
}
