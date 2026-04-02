import { useState, useCallback, useMemo } from 'react'
import type { Exercise } from '../types/database'

export type LessonState = 'intro' | 'exercise' | 'feedback' | 'complete'

interface UseExerciseReturn {
  currentExercise: Exercise | null
  exerciseIndex: number
  state: LessonState
  totalExercises: number
  correctCount: number
  incorrectCount: number
  score: number
  lastAnswerCorrect: boolean | null
  submitAnswer: (isCorrect: boolean) => void
  nextExercise: () => void
  startLesson: () => void
  resetLesson: () => void
}

export function useExercise(exercises: Exercise[]): UseExerciseReturn {
  const [state, setState] = useState<LessonState>('intro')
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)

  const totalExercises = exercises.length

  const currentExercise = useMemo(
    () => (exerciseIndex < exercises.length ? exercises[exerciseIndex] : null),
    [exercises, exerciseIndex]
  )

  const score = useMemo(() => {
    const total = correctCount + incorrectCount
    if (total === 0) return 0
    return Math.round((correctCount / total) * 100)
  }, [correctCount, incorrectCount])

  const submitAnswer = useCallback((isCorrect: boolean) => {
    setLastAnswerCorrect(isCorrect)
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    } else {
      setIncorrectCount((c) => c + 1)
    }
    setState('feedback')
  }, [])

  const nextExercise = useCallback(() => {
    const nextIndex = exerciseIndex + 1
    if (nextIndex >= totalExercises) {
      setState('complete')
    } else {
      setExerciseIndex(nextIndex)
      setLastAnswerCorrect(null)
      setState('exercise')
    }
  }, [exerciseIndex, totalExercises])

  const startLesson = useCallback(() => {
    setState('exercise')
  }, [])

  const resetLesson = useCallback(() => {
    setState('intro')
    setExerciseIndex(0)
    setCorrectCount(0)
    setIncorrectCount(0)
    setLastAnswerCorrect(null)
  }, [])

  return {
    currentExercise,
    exerciseIndex,
    state,
    totalExercises,
    correctCount,
    incorrectCount,
    score,
    lastAnswerCorrect,
    submitAnswer,
    nextExercise,
    startLesson,
    resetLesson,
  }
}
