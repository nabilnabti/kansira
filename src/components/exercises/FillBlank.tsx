import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FillBlankData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

export function FillBlank({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<FillBlankData>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (disabled) return
    setSelectedIndex(index)
    onAnswer(index)
  }

  // Split sentence into parts with blank
  const words = data.sentence.split(' ')
  const beforeBlank = words.slice(0, data.blank_index).join(' ')
  const afterBlank = words.slice(data.blank_index + 1).join(' ')
  const filledWord =
    selectedIndex !== null ? data.options[selectedIndex] : null

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Sentence with blank */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <p className="text-sm text-dark/50 mb-3">Complétez la phrase</p>
        <p className="text-xl font-heading font-bold text-dark leading-relaxed">
          {beforeBlank}{' '}
          <motion.span
            layout
            className={`inline-block min-w-[80px] px-3 py-1 mx-1 rounded-xl border-b-[3px] text-center ${
              filledWord
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-dark/20 bg-dark/5 text-dark/30'
            }`}
          >
            {filledWord ?? '______'}
          </motion.span>{' '}
          {afterBlank}
        </p>
      </motion.div>

      {/* Options */}
      <div className="flex flex-wrap gap-3 justify-center">
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
                delay: 0.2 + index * 0.08,
              }}
              whileHover={disabled ? undefined : { scale: 1.05 }}
              whileTap={disabled ? undefined : { scale: 0.93 }}
              onClick={() => handleSelect(index)}
              disabled={disabled}
              className={`
                px-6 py-3.5 rounded-2xl font-medium text-base
                border-2 transition-colors duration-150 cursor-pointer
                disabled:cursor-not-allowed min-h-[52px]
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
