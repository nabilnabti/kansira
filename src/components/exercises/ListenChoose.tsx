import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, RotateCcw } from 'lucide-react'
import type { ListenChooseData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'
import { speak, stopSpeaking } from '../../lib/tts'

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

export function ListenChoose({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<ListenChooseData>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playCount, setPlayCount] = useState(0)

  // Auto-play on mount after a short delay
  useEffect(() => {
    const timer = setTimeout(() => playAudio(), 600)
    return () => {
      clearTimeout(timer)
      stopSpeaking()
    }
  }, [])

  const playAudio = useCallback(() => {
    if (isPlaying) return

    setIsPlaying(true)
    setPlayCount((c) => c + 1)

    // Use our enhanced TTS engine
    speak({
      text: data.transcript,
      lang: 'bm', // Bambara — will use French voice at slower rate
      rate: playCount === 0 ? 0.65 : 0.55, // Even slower on replay
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    })
  }, [data.transcript, isPlaying, playCount])

  const playSlower = useCallback(() => {
    if (isPlaying) return

    setIsPlaying(true)

    speak({
      text: data.transcript,
      lang: 'bm',
      rate: 0.45, // Very slow for careful listening
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    })
  }, [data.transcript, isPlaying])

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
          Écoutez et choisissez la bonne réponse
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
              <motion.div
                initial={{ scale: 1, opacity: 0.1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                className="absolute inset-0 rounded-full bg-primary/10"
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
            className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-xl shadow-primary/30"
          >
            <Volume2 className="w-10 h-10 text-white" />
          </motion.button>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4 mt-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={playAudio}
            className="text-primary text-sm font-bold cursor-pointer flex items-center gap-1.5"
          >
            <Volume2 size={16} />
            Réécouter
          </motion.button>

          <span className="text-dark/20">|</span>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
            onClick={playSlower}
            className="text-dark/50 text-sm font-bold cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            Plus lent
          </motion.button>
        </div>
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
