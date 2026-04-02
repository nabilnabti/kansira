import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import type { ListenChooseData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

export function ListenChoose({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<ListenChooseData>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = useCallback(() => {
    if (isPlaying) return

    setIsPlaying(true)

    // Try HTML5 Audio first, fallback to SpeechSynthesis
    if (data.audio_url) {
      const audio = new Audio(data.audio_url)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        // Fallback to SpeechSynthesis
        speakText(data.transcript)
      }
      audio.play().catch(() => speakText(data.transcript))
    } else {
      speakText(data.transcript)
    }
  }, [data.audio_url, data.transcript, isPlaying])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.85
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setIsPlaying(false)
    }
  }

  const handleSelect = (index: number) => {
    if (disabled) return
    setSelectedIndex(index)
    onAnswer(index)
  }

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      {/* Speaker area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col items-center"
      >
        <p className="text-sm text-dark/45 mb-5 text-center font-medium">
          Que dit cette phrase ?
        </p>

        {/* Large speaker button with sound waves */}
        <div className="relative">
          {/* Animated sound wave rings */}
          {isPlaying && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-primary/20"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.2 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-primary/15"
              />
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isPlaying
                ? {
                    scale: [1, 1.06, 1],
                    transition: { repeat: Infinity, duration: 0.8 },
                  }
                : {}
            }
            onClick={playAudio}
            className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-xl shadow-primary/30"
          >
            <Volume2 className="w-9 h-9 text-white" />
          </motion.button>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={playAudio}
          className="mt-3 text-primary text-sm font-bold cursor-pointer"
        >
          Ecouter
        </motion.button>
      </motion.div>

      {/* Options — same style as MultipleChoice */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {data.options.map((option, index) => {
          const isSelected = selectedIndex === index

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0.3 + index * 0.08,
              }}
              whileHover={disabled ? undefined : { scale: 1.02 }}
              whileTap={disabled ? undefined : { scale: 0.96 }}
              onClick={() => handleSelect(index)}
              disabled={disabled}
              className={`
                w-full min-h-[60px] px-5 py-4 rounded-2xl text-left font-semibold text-base
                border-2 transition-all duration-150 cursor-pointer
                disabled:cursor-not-allowed
                ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-dark/10 bg-white text-dark hover:border-primary/30 hover:bg-primary/5'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-150
                    ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-primary/10 text-primary'
                    }
                  `}
                >
                  {letters[index]}
                </span>
                <span className="leading-snug">{option}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
