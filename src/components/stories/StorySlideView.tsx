import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye } from 'lucide-react'
import type { StorySlide, StoryBackground } from '../../types/database'
import { speak } from '../../lib/tts'
import { StoryInteraction } from './StoryInteraction'

const backgroundGradients: Record<StoryBackground, string> = {
  morning: 'from-amber-400 via-orange-400 to-yellow-300',
  market: 'from-red-500 via-orange-500 to-amber-400',
  night: 'from-indigo-800 via-purple-700 to-blue-600',
  village: 'from-green-600 via-emerald-500 to-lime-300',
  river: 'from-cyan-500 via-blue-500 to-sky-400',
}

interface StorySlideViewProps {
  slide: StorySlide
  onContinue: () => void
  onInteractionAnswer: (selectedIndex: number) => void
  interactionDisabled?: boolean
  feedbackState: 'none' | 'correct' | 'incorrect'
  onContinueAfterFeedback: () => void
}

export function StorySlideView({
  slide,
  onContinue,
  onInteractionAnswer,
  interactionDisabled,
  feedbackState,
  onContinueAfterFeedback,
}: StorySlideViewProps) {
  const [showTranslation, setShowTranslation] = useState(false)

  // Auto-play TTS on slide mount
  useEffect(() => {
    if (slide.auto_play_tts !== false) {
      const timer = setTimeout(() => {
        speak({ text: slide.text_target, lang: 'bm' })
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [slide.id, slide.text_target, slide.auto_play_tts])

  // Reset translation visibility on new slide
  useEffect(() => {
    setShowTranslation(false)
  }, [slide.id])

  const gradient = backgroundGradients[slide.background] || backgroundGradients.morning
  const hasInteraction = !!slide.interaction

  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex-1 flex flex-col bg-gradient-to-b ${gradient} relative`}
    >
      {/* Illustration area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4">
        {/* Emoji illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl mb-6 select-none"
        >
          {slide.illustration}
        </motion.div>

        {/* Speaker bubble */}
        {slide.speaker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-2"
          >
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
              {slide.speaker}
            </span>
          </motion.div>
        )}

        {/* Target text */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => speak({ text: slide.text_target, lang: 'bm' })}
          className="text-2xl font-bold text-white text-center leading-relaxed cursor-pointer px-4"
        >
          {slide.text_target}
        </motion.button>

        {/* French translation (tap to reveal) */}
        <AnimatePresence>
          {showTranslation ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-base text-white/70 text-center mt-2"
            >
              {slide.text_french}
            </motion.p>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowTranslation(true)}
              className="flex items-center gap-1.5 mt-3 text-sm text-white/50 cursor-pointer hover:text-white/70 transition-colors"
            >
              <Eye size={14} />
              Voir la traduction
            </motion.button>
          )}
        </AnimatePresence>

        {/* Interaction area */}
        {hasInteraction && slide.interaction && (
          <StoryInteraction
            interaction={slide.interaction}
            onAnswer={onInteractionAnswer}
            disabled={interactionDisabled}
          />
        )}
      </div>

      {/* Bottom area */}
      <div className="px-5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}>
        {/* Inline feedback flash */}
        <AnimatePresence>
          {feedbackState !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                text-center py-2.5 rounded-xl mb-3 font-bold text-base
                ${feedbackState === 'correct' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}
              `}
            >
              {feedbackState === 'correct' ? 'Correct !' : 'Pas tout à fait...'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        {(!hasInteraction || feedbackState !== 'none') && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={feedbackState !== 'none' ? onContinueAfterFeedback : onContinue}
            className="w-full py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg cursor-pointer border border-white/20"
          >
            Continuer
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
