import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Profile, AgeGroup, LearningGoal, InitialLevel } from '../types/database'

// Minimal mock user type to replace Supabase's User
interface MockUser {
  id: string
  email: string
}

const STORAGE_KEY = 'kansira_demo_session'

interface AuthState {
  user: MockUser | null
  profile: Profile | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, displayName: string, extras?: { age_group: AgeGroup; learning_goal: LearningGoal; initial_level: InitialLevel; selected_languages: string[] }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function buildMockSession(email: string, displayName?: string, extras?: {
  age_group: AgeGroup
  learning_goal: LearningGoal
  initial_level: InitialLevel
  selected_languages: string[]
}) {
  const mockUser: MockUser = {
    id: 'demo-user-001',
    email: email,
  }

  const mockProfile: Profile = {
    id: 'demo-user-001',
    display_name: displayName || email.split('@')[0],
    is_premium: false,
    is_admin: true, // true so they can see admin panel in demo
    preferred_lang: 'bm',
    daily_goal: 20,
    avatar_url: null,
    age_group: extras?.age_group || 'adult',
    learning_goal: extras?.learning_goal || 'culture',
    initial_level: extras?.initial_level || 'beginner',
    selected_languages: extras?.selected_languages || ['bm'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return { user: mockUser, profile: mockProfile }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  // On mount: check localStorage for existing session
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { user, profile } = JSON.parse(stored)
        setState({ user, profile, loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    } catch {
      setState({ user: null, profile: null, loading: false })
    }
  }, [])

  const persistSession = useCallback((user: MockUser, profile: Profile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, profile }))
  }, [])

  const signUp = async (email: string, _password: string, displayName: string, extras?: {
    age_group: AgeGroup
    learning_goal: LearningGoal
    initial_level: InitialLevel
    selected_languages: string[]
  }) => {
    await delay(800)
    const { user, profile } = buildMockSession(email, displayName, extras)
    persistSession(user, profile)
    setState({ user, profile, loading: false })
  }

  const signIn = async (email: string, password: string) => {
    await delay(800)
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    const { user, profile } = buildMockSession(email)
    persistSession(user, profile)
    setState({ user, profile, loading: false })
  }

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, profile: null, loading: false })
  }

  const resetPassword = async (_email: string) => {
    await delay(800)
    // Demo mode: no-op, just resolves successfully
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
