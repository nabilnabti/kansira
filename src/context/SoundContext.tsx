import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { speak as ttsSpeak, stopSpeaking } from '../lib/tts'

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playCorrect: () => void
  playIncorrect: () => void
  playComplete: () => void
  speak: (text: string, lang?: string, onEnd?: () => void) => void
  stopAudio: () => void
}

const SoundContext = createContext<SoundContextType | null>(null)

// Simple tone generator for feedback sounds (no external MP3 needed)
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // AudioContext not available
  }
}

function playCorrectSound() {
  // Pleasant ascending two-note chime
  playTone(523, 0.15, 'sine', 0.25) // C5
  setTimeout(() => playTone(659, 0.3, 'sine', 0.25), 100) // E5
}

function playIncorrectSound() {
  // Soft descending buzz
  playTone(330, 0.15, 'triangle', 0.2) // E4
  setTimeout(() => playTone(262, 0.25, 'triangle', 0.2), 100) // C4
}

function playCompleteSound() {
  // Triumphant three-note fanfare
  playTone(523, 0.15, 'sine', 0.2) // C5
  setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 120) // E5
  setTimeout(() => playTone(784, 0.4, 'sine', 0.25), 240) // G5
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
    playCorrectSound()
  }, [soundEnabled])

  const playIncorrect = useCallback(() => {
    if (!soundEnabled) return
    playIncorrectSound()
  }, [soundEnabled])

  const playComplete = useCallback(() => {
    if (!soundEnabled) return
    playCompleteSound()
  }, [soundEnabled])

  const speak = useCallback(
    (text: string, lang = 'fr', onEnd?: () => void) => {
      if (!soundEnabled) {
        onEnd?.()
        return
      }
      ttsSpeak({
        text,
        lang,
        onEnd,
        onError: onEnd,
      })
    },
    [soundEnabled]
  )

  const stopAudio = useCallback(() => {
    stopSpeaking()
  }, [])

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playCorrect,
        playIncorrect,
        playComplete,
        speak,
        stopAudio,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound must be used within SoundProvider')
  return context
}
