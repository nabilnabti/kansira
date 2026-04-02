import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStory } from '../hooks/useStory'
import { StorySlideView } from '../components/stories/StorySlideView'
import { StoryComplete } from '../components/stories/StoryComplete'
import { Mascot } from '../components/ui/Mascot'
import { mockStories } from '../data/mockStories'

export default function StoryReaderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const story = useMemo(
    () => mockStories.find((s) => s.id === id) ?? mockStories[0],
    [id]
  )

  const {
    state,
    slideIndex,
    totalSlides,
    correctCount,
    totalInteractions,
    score,
    lastAnswerCorrect,
    currentSlide,
    startStory,
    nextSlide,
    submitInteraction,
    continueAfterFeedback,
  } = useStory(story)

  const handleClose = () => navigate('/app/stories')

  // Feedback state for slide
  const feedbackState =
    state === 'feedback'
      ? lastAnswerCorrect
        ? 'correct'
        : 'incorrect'
      : 'none'

  // Intro screen
  if (state === 'intro') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-[10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-primary/5"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center z-10"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-6"
          >
            <Mascot size={120} expression="excited" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-4"
          >
            {story.icon}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-heading font-bold text-dark mb-2"
          >
            {story.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-dark/50 text-base mb-2"
          >
            {story.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-dark/40 text-sm mb-10"
          >
            {totalSlides} slides · {totalInteractions} interactions · +{story.xp_reward} XP
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={startStory}
            className="px-14 py-5 rounded-2xl bg-primary text-white font-bold text-xl cursor-pointer shadow-lg shadow-primary/30"
          >
            Commencer
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleClose}
            className="block mx-auto mt-4 text-dark/40 text-sm cursor-pointer hover:text-dark/60 transition-colors"
          >
            Retour
          </motion.button>
        </motion.div>
      </div>
    )
  }

  // Complete screen
  if (state === 'complete') {
    return (
      <StoryComplete
        score={score}
        correctCount={correctCount}
        totalInteractions={totalInteractions}
        xpEarned={story.xp_reward}
        storyTitle={story.title}
      />
    )
  }

  // Reading / interaction / feedback
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 pb-2 bg-black/20"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center cursor-pointer shrink-0"
        >
          <X className="w-4 h-4 text-white/70" />
        </motion.button>

        {/* Segmented progress bar */}
        <div className="flex-1 flex gap-1">
          {story.slides.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/15">
              <motion.div
                initial={false}
                animate={{ width: i < slideIndex ? '100%' : i === slideIndex ? '50%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full bg-white/80 rounded-full"
              />
            </div>
          ))}
        </div>

        <span className="text-xs text-white/50 font-bold shrink-0 tabular-nums">
          {slideIndex + 1}/{totalSlides}
        </span>
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        {currentSlide && (
          <StorySlideView
            key={currentSlide.id}
            slide={currentSlide}
            onContinue={nextSlide}
            onInteractionAnswer={submitInteraction}
            interactionDisabled={state === 'feedback'}
            feedbackState={feedbackState as 'none' | 'correct' | 'incorrect'}
            onContinueAfterFeedback={continueAfterFeedback}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
