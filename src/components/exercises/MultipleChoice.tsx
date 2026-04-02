import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MultipleChoiceData } from '../../types/database'

export interface ExerciseProps<T = unknown> {
  data: T
  onAnswer: (answer: unknown) => void
  disabled?: boolean
}

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
    <div className="flex flex-col gap-6 w-full">
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
        className="text-xl font-heading font-bold text-dark text-center px-2"
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
              <div className="flex items-center gap-3">
                <span
                  className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0
                    ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-dark/20 text-dark/40'
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
