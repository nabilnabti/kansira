import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type LanguageCode = 'bm' | 'snk'

interface LanguageContextType {
  activeLanguage: LanguageCode
  setActiveLanguage: (lang: LanguageCode) => void
  languageLabel: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'kansira_language'

const labels: Record<LanguageCode, string> = {
  bm: 'Bambara',
  snk: 'Soninké',
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [activeLanguage, setActiveLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'bm' || stored === 'snk') return stored
    } catch {
      // SSR or localStorage unavailable
    }
    return 'bm'
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeLanguage)
    } catch {
      // ignore
    }
  }, [activeLanguage])

  const setActiveLanguage = (lang: LanguageCode) => {
    setActiveLanguageState(lang)
  }

  return (
    <LanguageContext.Provider
      value={{ activeLanguage, setActiveLanguage, languageLabel: labels[activeLanguage] }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
