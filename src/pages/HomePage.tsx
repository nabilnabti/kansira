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

  // Already logged in → go to app
  if (user) return <Navigate to="/app" replace />

  // In PWA mode → onboarding first, then login
  if (isPWA()) {
    if (!isOnboardingDone()) return <Navigate to="/onboarding" replace />
    return <Navigate to="/login" replace />
  }

  // In browser → show landing page
  return <LandingPage />
}
