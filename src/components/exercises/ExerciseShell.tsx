import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Exercise, ExerciseData } from '../../types/database'
import { useExercise } from '../../hooks/useExercise'
import { validators } from '../../lib/exercise-engine/validator'
import { ProgressBar } from '../ui/ProgressBar'
import { Mascot } from '../ui/Mascot'
import { ExerciseRouter } from './ExerciseRouter'
import { FeedbackOverlay } from './FeedbackOverlay'
import { LessonComplete } from './LessonComplete'

interface ExerciseShellProps {
  exercises: Exercise[]
  xpReward?: number
}

function getCorrectAnswer(data: ExerciseData): string {
  switch (data.type) {
    case 'multiple_choice':
      return data.options[data.correct_index]
    case 'translation':
      return data.correct_answer
    case 'fill_blank':
      return data.options[data.correct_index]
    case 'listen_choose':
      return data.options[data.correct_index]
    case 'word_order':
      return data.correct_order.join(' ')
    case 'word_match':
      return data.pairs.map((p) => `${p.left} = ${p.right}`).join(', ')
    default:
      return ''
  }
}

export function ExerciseShell({ exercises, xpReward = 25 }: ExerciseShellProps) {
  const navigate = useNavigate()
  const {
    currentExercise,
    exerciseIndex,
    state,
    totalExercises,
    correctCount,
    score,
    lastAnswerCorrect,
    submitAnswer,
    nextExercise,
    startLesson,
  } = useExercise(exercises)

  const [currentAnswer, setCurrentAnswer] = useState<unknown>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleAnswer = useCallback((answer: unknown) => {
    setCurrentAnswer(answer)
    setHasAnswered(true)
  }, [])

  const handleCheck = useCallback(() => {
    if (!currentExercise || currentAnswer === null) return

    const validator = validators[currentExercise.data.type]
    const isCorrect = validator(currentExercise.data, currentAnswer)
    submitAnswer(isCorrect)
  }, [currentExercise, currentAnswer, submitAnswer])

  const handleContinue = useCallback(() => {
    setCurrentAnswer(null)
    setHasAnswered(false)
    nextExercise()
  }, [nextExercise])

  const handleClose = () => {
    navigate(-1)
  }

  const progress = totalExercises > 0
    ? ((exerciseIndex + (state === 'feedback' ? 1 : 0)) / totalExercises) * 100
    : 0

  // Intro state
  if (state === 'intro') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 pt-safe pb-safe overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 via-background to-background" />
        {/* Decorative circles */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-primary/5"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="absolute bottom-[15%] left-[-15%] w-[250px] h-[250px] rounded-full bg-secondary/5"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center z-10"
        >
          {/* Mascot with bounce */}
          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
            className="mx-auto mb-6"
          >
            <Mascot size={120} expression="excited" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-heading font-bold text-dark mb-2"
          >
            Pret a apprendre ?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-dark/50 text-lg mb-10"
          >
            {totalExercises} exercices
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={startLesson}
            className="px-14 py-5 rounded-2xl bg-primary text-white font-bold text-xl cursor-pointer shadow-lg shadow-primary/30"
          >
            C'est parti !
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Complete state
  if (state === 'complete') {
    return (
      <LessonComplete
        score={score}
        correctCount={correctCount}
        totalExercises={totalExercises}
        xpEarned={xpReward}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-safe pb-2">
        <div className="pt-3 flex items-center gap-3 w-full">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleClose}
            className="w-11 h-11 rounded-full bg-dark/5 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5 text-dark/50" />
          </motion.button>
          <div className="flex-1">
            <ProgressBar value={progress} color="primary" size="md" />
          </div>
          <span className="text-sm text-dark/50 font-bold shrink-0 tabular-nums">
            {exerciseIndex + 1}/{totalExercises}
          </span>
        </div>
      </div>

      {/* Exercise content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          {currentExercise && (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            >
              <ExerciseRouter
                data={currentExercise.data}
                onAnswer={handleAnswer}
                disabled={state === 'feedback'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom check button */}
      {state === 'exercise' && (
        <div className="px-5 pb-safe">
          <div className="pb-5 pt-3">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={hasAnswered ? { scale: 1.02 } : undefined}
              whileTap={hasAnswered ? { scale: 0.95 } : undefined}
              onClick={handleCheck}
              disabled={!hasAnswered}
              className={`
                w-full py-4.5 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-200
                disabled:cursor-not-allowed min-h-[56px]
                ${
                  hasAnswered
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-dark/8 text-dark/25'
                }
              `}
            >
              Verifier
            </motion.button>
          </div>
        </div>
      )}

      {/* Feedback overlay */}
      <FeedbackOverlay
        visible={state === 'feedback'}
        isCorrect={lastAnswerCorrect === true}
        correctAnswer={
          currentExercise && !lastAnswerCorrect
            ? getCorrectAnswer(currentExercise.data)
            : undefined
        }
        onContinue={handleContinue}
      />
    </div>
  )
}
