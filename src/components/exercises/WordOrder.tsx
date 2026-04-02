import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WordOrderData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

export function WordOrder({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<WordOrderData>) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>(
    data.shuffled_words
  )

  const addWord = useCallback(
    (word: string, bankIndex: number) => {
      if (disabled) return
      const newSelected = [...selectedWords, word]
      setSelectedWords(newSelected)
      setAvailableWords((prev) => prev.filter((_, i) => i !== bankIndex))
      onAnswer(newSelected)
    },
    [disabled, selectedWords, onAnswer]
  )

  const removeWord = useCallback(
    (word: string, selectedIdx: number) => {
      if (disabled) return
      const newSelected = selectedWords.filter((_, i) => i !== selectedIdx)
      setSelectedWords(newSelected)
      setAvailableWords((prev) => [...prev, word])
      onAnswer(newSelected)
    },
    [disabled, selectedWords, onAnswer]
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Prompt card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-secondary/8 border border-secondary/15 px-5 py-5 text-center"
      >
        <p className="text-sm text-dark/45 mb-1.5 font-medium">Remettez les mots dans l'ordre</p>
        <h2 className="text-2xl font-heading font-bold text-dark leading-snug">
          {data.prompt}
        </h2>
      </motion.div>

      {/* Answer area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="min-h-[88px] px-4 py-4 rounded-2xl border-2 border-dashed border-dark/12 bg-white flex flex-wrap gap-2.5 items-start content-start"
      >
        <AnimatePresence mode="popLayout">
          {selectedWords.length === 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              className="text-dark/35 text-base italic"
            >
              Tapez les mots dans le bon ordre...
            </motion.span>
          )}
          {selectedWords.map((word, idx) => (
            <motion.button
              key={`selected-${idx}-${word}`}
              layout
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              whileTap={disabled ? undefined : { scale: 0.88 }}
              onClick={() => removeWord(word, idx)}
              disabled={disabled}
              className="px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm cursor-pointer disabled:cursor-not-allowed min-h-[48px] shadow-sm"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Available words */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap gap-2.5 justify-center"
      >
        <AnimatePresence mode="popLayout">
          {availableWords.map((word, idx) => (
            <motion.button
              key={`bank-${idx}-${word}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              whileHover={disabled ? undefined : { scale: 1.06 }}
              whileTap={disabled ? undefined : { scale: 0.9 }}
              onClick={() => addWord(word, idx)}
              disabled={disabled}
              className="px-5 py-3 bg-white border-2 border-dark/10 rounded-2xl text-dark font-semibold text-base cursor-pointer hover:border-secondary/40 hover:bg-secondary/5 disabled:cursor-not-allowed min-h-[48px] shadow-sm transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
