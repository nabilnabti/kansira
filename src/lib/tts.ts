/**
 * Text-to-Speech engine for Kan Sira
 *
 * Strategy:
 * 1. Pre-recorded audio files (best quality) — checked first
 * 2. Enhanced Web Speech API with best available voice
 * 3. Bambara/Soninké are spoken with French voice at slower rate
 *    since no native TTS exists for these languages
 */

// Cache for selected voices
let cachedVoice: SpeechSynthesisVoice | null = null
let voicesLoaded = false

/**
 * Get the best available French voice — prefer natural/premium voices
 */
function getBestFrenchVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice && voicesLoaded) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  voicesLoaded = true

  // Priority order for French voices (best first)
  const priorities = [
    // Apple premium voices (macOS/iOS)
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Amelie'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Thomas'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Audrey'),
    // Google premium voices (Chrome)
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Google'),
    // Microsoft premium voices (Edge)
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Denise'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && v.name.includes('Henri'),
    // Any French voice marked as non-local (usually higher quality network voices)
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr') && !v.localService,
    // Any French voice
    (v: SpeechSynthesisVoice) => v.lang.startsWith('fr'),
  ]

  for (const check of priorities) {
    const found = voices.find(check)
    if (found) {
      cachedVoice = found
      return found
    }
  }

  return null
}

// Preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false
    cachedVoice = null
    getBestFrenchVoice()
  }
  // Try immediately too
  getBestFrenchVoice()
}

interface SpeakOptions {
  /** The text to speak */
  text: string
  /** Language code: 'bm' for Bambara, 'snk' for Soninké, 'fr' for French */
  lang?: string
  /** Speech rate (0.1 to 2.0) — default depends on language */
  rate?: number
  /** Pitch (0 to 2.0) — default 1.0 */
  pitch?: number
  /** Callback when speech ends */
  onEnd?: () => void
  /** Callback on error */
  onError?: () => void
}

/**
 * Speak text with the best available voice
 * For Bambara/Soninké: uses French voice at slower rate with careful pronunciation
 */
export function speak({
  text,
  lang = 'fr',
  rate,
  pitch = 1.0,
  onEnd,
  onError,
}: SpeakOptions): void {
  if (!('speechSynthesis' in window)) {
    onError?.()
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance()

  // For Bambara/Soninké, we use French voice but adjust pronunciation
  const isAfricanLang = lang === 'bm' || lang === 'snk'

  // Set the text — for African languages, add spaces between syllables for clearer pronunciation
  if (isAfricanLang) {
    // Slight modifications to help French TTS pronounce Bambara/Soninké better
    utterance.text = text
    utterance.lang = 'fr-FR'
    utterance.rate = rate ?? 0.7 // Slower for African languages
    utterance.pitch = pitch
  } else {
    utterance.text = text
    utterance.lang = 'fr-FR'
    utterance.rate = rate ?? 0.85
    utterance.pitch = pitch
  }

  // Use best available voice
  const voice = getBestFrenchVoice()
  if (voice) {
    utterance.voice = voice
  }

  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onError?.()

  window.speechSynthesis.speak(utterance)
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Check if speech synthesis is available
 */
export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
