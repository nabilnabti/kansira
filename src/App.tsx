import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ChildModeProvider } from './context/ChildModeContext'
import { LanguageProvider } from './context/LanguageContext'
import { SoundProvider } from './context/SoundContext'
import { ToastProvider } from './components/ui/Toast'
import { PWAInstallBanner } from './components/ui/PWAInstallBanner'
import AuthGuard from './components/auth/AuthGuard'
import AdminGuard from './components/auth/AdminGuard'

// Pages
import HomePage from './pages/HomePage'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import { LessonPage } from './pages/LessonPage'
import ProfilePage from './pages/ProfilePage'
import BadgesPage from './pages/BadgesPage'
import SettingsPage from './pages/SettingsPage'
import PremiumPage from './pages/PremiumPage'
import StoriesPage from './pages/StoriesPage'
import AllThemesPage from './pages/AllThemesPage'
import StoryReaderPage from './pages/StoryReaderPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminModules from './pages/admin/AdminModules'
import AdminLessons from './pages/admin/AdminLessons'
import AdminExercises from './pages/admin/AdminExercises'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStories from './pages/admin/AdminStories'

// Layouts
import AppShell from './components/layout/AppShell'
import AdminLayout from './components/layout/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
      <ChildModeProvider>
        <LanguageProvider>
          <SoundProvider>
            <ToastProvider>
              <PWAInstallBanner />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Smart home: landing (browser) or onboarding (PWA) */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
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
                      <Route path="stories" element={<StoriesPage />} />
                      <Route path="themes" element={<AllThemesPage />} />
                    </Route>
                    <Route path="lesson/:id" element={<LessonPage />} />
                    <Route path="story/:id" element={<StoryReaderPage />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminGuard />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="modules" element={<AdminModules />} />
                      <Route path="lessons" element={<AdminLessons />} />
                      <Route path="exercises/:id" element={<AdminExercises />} />
                      <Route path="stories" element={<AdminStories />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>
                  </Route>
                </Routes>
              </AnimatePresence>
            </ToastProvider>
          </SoundProvider>
        </LanguageProvider>
      </ChildModeProvider>
    </AuthProvider>
  )
}
