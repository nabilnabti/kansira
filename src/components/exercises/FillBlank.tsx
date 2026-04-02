import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FillBlankData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

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
        className="text-center px-2"
      >
        <p className="text-sm text-dark/45 mb-4 font-medium">Completez la phrase</p>
        <p className="text-2xl font-heading font-bold text-dark leading-relaxed">
          {beforeBlank}{' '}
          <motion.span
            layout
            className={`inline-block min-w-[90px] px-3 py-1.5 mx-1 border-b-[3px] text-center transition-all duration-200 ${
              filledWord
                ? 'border-primary text-primary bg-primary/10 rounded-xl'
                : 'border-primary/40 text-dark/30 border-dashed'
            }`}
          >
            {filledWord ?? '______'}
          </motion.span>{' '}
          {afterBlank}
        </p>
      </motion.div>

      {/* Options — same style as MultipleChoice */}
      <div className="grid grid-cols-1 gap-3">
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
