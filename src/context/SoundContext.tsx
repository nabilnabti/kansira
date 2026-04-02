import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playCorrect: () => void
  playIncorrect: () => void
  playComplete: () => void
  speak: (text: string, lang?: string) => void
}

const SoundContext = createContext<SoundContextType | null>(null)

function playAudio(src: string) {
  try {
    const audio = new Audio(src)
    audio.volume = 0.5
    audio.play().catch(() => {})
  } catch {
    // Silently fail if audio not available
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('kan-sira-sound') !== 'false'
  })

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev
      localStorage.setItem('kan-sira-sound', String(next))
      return next
    })
  }, [])

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return
    playAudio('/sounds/correct.mp3')
  }, [soundEnabled])

  const playIncorrect = useCallback(() => {
    if (!soundEnabled) return
    playAudio('/sounds/incorrect.mp3')
  }, [soundEnabled])

  const playComplete = useCallback(() => {
    if (!soundEnabled) return
    playAudio('/sounds/complete.mp3')
  }, [soundEnabled])

  const speak = useCallback(
    (text: string, lang = 'fr') => {
      if (!soundEnabled) return
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = 0.8
        window.speechSynthesis.speak(utterance)
      }
    },
    [soundEnabled]
  )

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playCorrect, playIncorrect, playComplete, speak }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider')
  return context
}
