import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface ChildModeContextValue {
  isChildMode: boolean
}

const ChildModeContext = createContext<ChildModeContextValue>({ isChildMode: false })

export function ChildModeProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const isChildMode = profile?.age_group === 'child'

  return (
    <ChildModeContext.Provider value={{ isChildMode }}>
      {children}
    </ChildModeContext.Provider>
  )
}

export function useChildMode(): ChildModeContextValue {
  return useContext(ChildModeContext)
}
