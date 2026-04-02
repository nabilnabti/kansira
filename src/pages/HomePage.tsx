import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isOnboardingDone } from './OnboardingPage'
import LandingPage from './LandingPage'

function isPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) return null

  // Logged in but hasn't seen onboarding → show it
  if (user && !isOnboardingDone()) {
    return <Navigate to="/onboarding" replace />
  }

  // Logged in and onboarding done → go to app
  if (user) return <Navigate to="/app" replace />

  // PWA mode, not logged in → onboarding then login
  if (isPWA()) {
    if (!isOnboardingDone()) return <Navigate to="/onboarding" replace />
    return <Navigate to="/login" replace />
  }

  // Browser, not logged in → landing page
  return <LandingPage />
}
