import { useState, useCallback, useMemo } from 'react'
import type { StoryData } from '../types/database'

export type StoryState = 'intro' | 'reading' | 'interaction' | 'feedback' | 'complete'

interface UseStoryReturn {
  state: StoryState
  slideIndex: number
  totalSlides: number
  correctCount: number
  totalInteractions: number
  score: number
  lastAnswerCorrect: boolean | null
  currentSlide: StoryData['slides'][number] | null
  hasInteraction: boolean
  startStory: () => void
  nextSlide: () => void
  submitInteraction: (selectedIndex: number) => void
  continueAfterFeedback: () => void
  resetStory: () => void
}

export function useStory(story: StoryData): UseStoryReturn {
  const [state, setState] = useState<StoryState>('intro')
  const [slideIndex, setSlideIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)

  const totalSlides = story.slides.length

  const totalInteractions = useMemo(
    () => story.slides.filter((s) => s.interaction).length,
    [story.slides]
  )

  const currentSlide = useMemo(
    () => (slideIndex < totalSlides ? story.slides[slideIndex] : null),
    [story.slides, slideIndex, totalSlides]
  )

  const hasInteraction = !!currentSlide?.interaction

  const score = useMemo(() => {
    if (answeredCount === 0) return 0
    return Math.round((correctCount / answeredCount) * 100)
  }, [correctCount, answeredCount])

  const startStory = useCallback(() => {
    setState(story.slides[0]?.interaction ? 'interaction' : 'reading')
  }, [story.slides])

  const nextSlide = useCallback(() => {
    const next = slideIndex + 1
    if (next >= totalSlides) {
      setState('complete')
    } else {
      setSlideIndex(next)
      setLastAnswerCorrect(null)
      const nextHasInteraction = !!story.slides[next]?.interaction
      setState(nextHasInteraction ? 'interaction' : 'reading')
    }
  }, [slideIndex, totalSlides, story.slides])

  const submitInteraction = useCallback(
    (selectedIndex: number) => {
      if (!currentSlide?.interaction) return
      const isCorrect = selectedIndex === currentSlide.interaction.correct_index
      setLastAnswerCorrect(isCorrect)
      setAnsweredCount((c) => c + 1)
      if (isCorrect) setCorrectCount((c) => c + 1)
      setState('feedback')
    },
    [currentSlide]
  )

  const continueAfterFeedback = useCallback(() => {
    nextSlide()
  }, [nextSlide])

  const resetStory = useCallback(() => {
    setState('intro')
    setSlideIndex(0)
    setCorrectCount(0)
    setAnsweredCount(0)
    setLastAnswerCorrect(null)
  }, [])

  return {
    state,
    slideIndex,
    totalSlides,
    correctCount,
    totalInteractions,
    score,
    lastAnswerCorrect,
    currentSlide,
    hasInteraction,
    startStory,
    nextSlide,
    submitInteraction,
    continueAfterFeedback,
    resetStory,
  }
}
