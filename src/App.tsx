import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { SoundProvider } from './context/SoundContext'
import { ToastProvider } from './components/ui/Toast'
import { PWAInstallBanner } from './components/ui/PWAInstallBanner'
import AuthGuard from './components/auth/AuthGuard'
import AdminGuard from './components/auth/AdminGuard'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import { LessonPage } from './pages/LessonPage'
import ProfilePage from './pages/ProfilePage'
import BadgesPage from './pages/BadgesPage'
import SettingsPage from './pages/SettingsPage'
import PremiumPage from './pages/PremiumPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminModules from './pages/admin/AdminModules'
import AdminLessons from './pages/admin/AdminLessons'
import AdminExercises from './pages/admin/AdminExercises'
import AdminUsers from './pages/admin/AdminUsers'

// Layouts
import AppShell from './components/layout/AppShell'
import AdminLayout from './components/layout/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SoundProvider>
          <ToastProvider>
            <PWAInstallBanner />
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected app routes */}
                <Route path="/app" element={<AuthGuard />}>
                  <Route element={<AppShell />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="badges" element={<BadgesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="premium" element={<PremiumPage />} />
                  </Route>
                  <Route path="lesson/:id" element={<LessonPage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="modules" element={<AdminModules />} />
                    <Route path="lessons" element={<AdminLessons />} />
                    <Route path="exercises/:id" element={<AdminExercises />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </ToastProvider>
        </SoundProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
