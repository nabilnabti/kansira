import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MultipleChoiceData } from '../../types/database'

export interface ExerciseProps<T = unknown> {
  data: T
  onAnswer: (answer: unknown) => void
  disabled?: boolean
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

export function MultipleChoice({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<MultipleChoiceData>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (disabled) return
    setSelectedIndex(index)
    onAnswer(index)
  }

  return (
    <div className="flex flex-col gap-7 w-full">
      {/* Optional image */}
      {data.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[200px] mx-auto"
        >
          <img
            src={data.image_url}
            alt=""
            className="w-full h-auto rounded-2xl object-cover"
          />
        </motion.div>
      )}

      {/* Question */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-heading font-bold text-dark text-center px-2 leading-snug"
      >
        {data.question}
      </motion.h2>

      {/* Options */}
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
                delay: 0.15 + index * 0.08,
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
