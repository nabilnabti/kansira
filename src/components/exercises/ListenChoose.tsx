import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import type { ListenChooseData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

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
      {/* Speaker button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <p className="text-sm text-dark/50 mb-4 text-center">
          Que dit cette phrase ?
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          animate={
            isPlaying
              ? {
                  scale: [1, 1.08, 1],
                  transition: { repeat: Infinity, duration: 0.8 },
                }
              : {}
          }
          onClick={playAudio}
          className="w-24 h-24 mx-auto rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg"
        >
          <Volume2 className="w-10 h-10 text-white" />
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={playAudio}
          className="mt-3 text-primary text-sm font-medium cursor-pointer mx-auto block"
        >
          Réécouter
        </motion.button>
      </motion.div>

      {/* Options */}
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
              whileTap={disabled ? undefined : { scale: 0.97 }}
              onClick={() => handleSelect(index)}
              disabled={disabled}
              className={`
                w-full min-h-[56px] px-5 py-4 rounded-2xl text-left font-medium text-base
                border-2 transition-colors duration-150 cursor-pointer
                disabled:cursor-not-allowed
                ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-dark/10 bg-white text-dark hover:border-dark/25'
                }
              `}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
