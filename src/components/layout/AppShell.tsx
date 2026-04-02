import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="md:ml-[260px] px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
