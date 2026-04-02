import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface FeedbackOverlayProps {
  visible: boolean
  isCorrect: boolean
  correctAnswer?: string
  onContinue: () => void
}

export function FeedbackOverlay({
  visible,
  isCorrect,
  correctAnswer,
  onContinue,
}: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div
            className={`rounded-t-3xl px-6 pt-6 pb-8 ${
              isCorrect
                ? 'bg-secondary text-white'
                : 'bg-accent text-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 20,
                  delay: 0.1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCorrect ? 'bg-white/20' : 'bg-white/20'
                }`}
              >
                {isCorrect ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <X className="w-6 h-6" />
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-heading font-bold"
              >
                {isCorrect ? 'Correct !' : 'Incorrect'}
              </motion.span>
            </div>

            {!isCorrect && correctAnswer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/90 text-sm mb-4"
              >
                Bonne réponse : <span className="font-bold">{correctAnswer}</span>
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className={`w-full py-3.5 rounded-xl font-bold text-base cursor-pointer ${
                isCorrect
                  ? 'bg-white text-secondary'
                  : 'bg-white text-accent'
              }`}
            >
              Continuer
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
