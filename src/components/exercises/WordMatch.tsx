import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { WordMatchData } from '../../types/database'
import type { ExerciseProps } from './MultipleChoice'

interface MatchedPair {
  left: string
  right: string
}

export function WordMatch({
  data,
  onAnswer,
  disabled = false,
}: ExerciseProps<WordMatchData>) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([])
  const [shakingRight, setShakingRight] = useState<string | null>(null)

  // Shuffle right column once (stable via data reference)
  const [shuffledRight] = useState(() =>
    [...data.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5)
  )

  const isLeftMatched = (left: string) =>
    matchedPairs.some((p) => p.left === left)
  const isRightMatched = (right: string) =>
    matchedPairs.some((p) => p.right === right)

  const handleLeftTap = (left: string) => {
    if (disabled || isLeftMatched(left)) return
    setSelectedLeft(left)
  }

  const handleRightTap = useCallback(
    (right: string) => {
      if (disabled || !selectedLeft || isRightMatched(right)) return

      // Check if this pair is correct
      const isCorrect = data.pairs.some(
        (p) => p.left === selectedLeft && p.right === right
      )

      if (isCorrect) {
        const newMatched = [...matchedPairs, { left: selectedLeft, right }]
        setMatchedPairs(newMatched)
        setSelectedLeft(null)

        // If all pairs matched, send answer
        if (newMatched.length === data.pairs.length) {
          onAnswer(newMatched)
        }
      } else {
        // Wrong match - shake
        setShakingRight(right)
        setTimeout(() => setShakingRight(null), 500)
      }
    },
    [disabled, selectedLeft, matchedPairs, data.pairs, onAnswer]
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-heading font-bold text-dark text-center"
      >
        Associer les paires
      </motion.h2>

      <div className="flex gap-4">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-3">
          {data.pairs.map((pair, index) => {
            const matched = isLeftMatched(pair.left)
            const isActive = selectedLeft === pair.left

            return (
              <motion.button
                key={`left-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  delay: index * 0.08,
                }}
                whileTap={disabled || matched ? undefined : { scale: 0.95 }}
                onClick={() => handleLeftTap(pair.left)}
                disabled={disabled || matched}
                className={`
                  min-h-[52px] px-4 py-3 rounded-2xl text-sm font-medium text-center
                  border-2 transition-all duration-150 cursor-pointer
                  disabled:cursor-not-allowed
                  ${
                    matched
                      ? 'bg-secondary/10 border-secondary/30 text-secondary opacity-70'
                      : isActive
                        ? 'bg-primary/10 border-primary text-primary shadow-sm'
                        : 'bg-white border-dark/10 text-dark hover:border-dark/25'
                  }
                `}
              >
                {pair.left}
              </motion.button>
            )
          })}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3">
          {shuffledRight.map((right, index) => {
            const matched = isRightMatched(right)
            const isShaking = shakingRight === right

            return (
              <motion.button
                key={`right-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: isShaking ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                }}
                transition={
                  isShaking
                    ? { duration: 0.5 }
                    : {
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        delay: index * 0.08,
                      }
                }
                whileTap={disabled || matched ? undefined : { scale: 0.95 }}
                onClick={() => handleRightTap(right)}
                disabled={disabled || matched}
                className={`
                  min-h-[52px] px-4 py-3 rounded-2xl text-sm font-medium text-center
                  border-2 transition-all duration-150 cursor-pointer
                  disabled:cursor-not-allowed
                  ${
                    matched
                      ? 'bg-secondary/10 border-secondary/30 text-secondary opacity-70'
                      : isShaking
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-white border-dark/10 text-dark hover:border-dark/25'
                  }
                `}
              >
                {right}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
