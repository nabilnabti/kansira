import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Exercise, ExerciseData } from '../../types/database'
import { useExercise } from '../../hooks/useExercise'
import { validators } from '../../lib/exercise-engine/validator'
import { ProgressBar } from '../ui/ProgressBar'
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
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-dark mb-2">
            Prêt à apprendre ?
          </h1>
          <p className="text-dark/60 mb-8">
            {totalExercises} exercices dans cette leçon
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startLesson}
            className="px-10 py-4 rounded-xl bg-primary text-white font-bold text-lg cursor-pointer"
          >
            Commencer
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
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 safe-top">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-dark/5 flex items-center justify-center cursor-pointer shrink-0"
        >
          <X className="w-5 h-5 text-dark/60" />
        </motion.button>
        <div className="flex-1">
          <ProgressBar value={progress} color="primary" size="sm" />
        </div>
        <span className="text-sm text-dark/50 font-medium shrink-0">
          {exerciseIndex + 1}/{totalExercises}
        </span>
      </div>

      {/* Exercise content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          {currentExercise && (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
        <div className="px-5 pb-6 pt-3 safe-bottom">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hasAnswered ? { scale: 1.02 } : undefined}
            whileTap={hasAnswered ? { scale: 0.97 } : undefined}
            onClick={handleCheck}
            disabled={!hasAnswered}
            className={`
              w-full py-4 rounded-xl font-bold text-lg cursor-pointer transition-colors
              disabled:cursor-not-allowed
              ${
                hasAnswered
                  ? 'bg-primary text-white'
                  : 'bg-dark/10 text-dark/30'
              }
            `}
          >
            Vérifier
          </motion.button>
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
