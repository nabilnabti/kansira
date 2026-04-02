import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TranslationData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

export function Translation({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<TranslationData>) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>(
    data.word_bank ?? []
  )
  const [textInput, setTextInput] = useState('')

  const hasWordBank = data.word_bank && data.word_bank.length > 0

  const addWord = useCallback(
    (word: string, bankIndex: number) => {
      if (disabled) return
      const newSelected = [...selectedWords, word]
      setSelectedWords(newSelected)
      setAvailableWords((prev) => prev.filter((_, i) => i !== bankIndex))
      onAnswer(newSelected.join(' '))
    },
    [disabled, selectedWords, onAnswer]
  )

  const removeWord = useCallback(
    (word: string, selectedIdx: number) => {
      if (disabled) return
      const newSelected = selectedWords.filter((_, i) => i !== selectedIdx)
      setSelectedWords(newSelected)
      setAvailableWords((prev) => [...prev, word])
      onAnswer(newSelected.join(' '))
    },
    [disabled, selectedWords, onAnswer]
  )

  const handleTextChange = (value: string) => {
    setTextInput(value)
    onAnswer(value)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Prompt */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-sm text-dark/50 mb-1">
          Traduire en {data.target_lang}
        </p>
        <h2 className="text-xl font-heading font-bold text-dark">
          {data.prompt}
        </h2>
      </motion.div>

      {hasWordBank ? (
        <>
          {/* Answer area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="min-h-[64px] px-4 py-3 rounded-2xl border-2 border-dashed border-dark/15 bg-white flex flex-wrap gap-2 items-center"
          >
            <AnimatePresence mode="popLayout">
              {selectedWords.length === 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  className="text-dark/40 text-sm"
                >
                  Tapez les mots pour former la phrase...
                </motion.span>
              )}
              {selectedWords.map((word, idx) => (
                <motion.button
                  key={`selected-${idx}-${word}`}
                  layout
                  layoutId={`word-${word}-${idx}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeWord(word, idx)}
                  disabled={disabled}
                  className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary font-medium text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Word bank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <AnimatePresence mode="popLayout">
              {availableWords.map((word, idx) => (
                <motion.button
                  key={`bank-${idx}-${word}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  whileHover={disabled ? undefined : { scale: 1.05 }}
                  whileTap={disabled ? undefined : { scale: 0.92 }}
                  onClick={() => addWord(word, idx)}
                  disabled={disabled}
                  className="px-4 py-2.5 bg-white border-2 border-dark/10 rounded-xl text-dark font-medium text-sm cursor-pointer hover:border-primary/40 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        /* Text input fallback */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={disabled}
            placeholder="Tapez votre traduction..."
            className="w-full px-5 py-4 rounded-2xl border-2 border-dark/10 bg-white text-dark text-base font-medium placeholder:text-dark/30 focus:border-primary focus:outline-none disabled:opacity-50 min-h-[56px]"
          />
        </motion.div>
      )}
    </div>
  )
}
