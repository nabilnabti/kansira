import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface FeedbackOverlayProps {
  visible: boolean
  isCorrect: boolean
  correctAnswer?: string
  onContinue: () => void
}

const correctPhrases = ['Bravo !', 'Excellent !', 'Parfait !', 'Super !', 'Bien joue !']
const incorrectPhrases = ['Pas tout a fait...', 'Presque !', 'Essaie encore...']

function ConfettiDot({ index }: { index: number }) {
  const colors = ['#FF6B00', '#2D9F4F', '#F4A100', '#E63946', '#FF8A33', '#FFD54F']
  const color = colors[index % colors.length]
  const x = (Math.random() - 0.5) * 280
  const delay = Math.random() * 0.3

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
      animate={{
        y: [0, -60 - Math.random() * 40, 120 + Math.random() * 60],
        x: [0, x * 0.4, x],
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
        rotate: [0, 180 + Math.random() * 360],
      }}
      transition={{ duration: 1.8, delay, ease: 'easeOut' }}
      className="absolute top-0 left-1/2 pointer-events-none"
      style={{
        width: Math.random() * 6 + 3,
        height: Math.random() * 6 + 3,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  )
}

export function FeedbackOverlay({
  visible,
  isCorrect,
  correctAnswer,
  onContinue,
}: FeedbackOverlayProps) {
  const phrase = useMemo(() => {
    const pool = isCorrect ? correctPhrases : incorrectPhrases
    return pool[Math.floor(Math.random() * pool.length)]
  }, [visible, isCorrect])

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
            className={`rounded-t-3xl px-6 pt-6 overflow-hidden relative ${
              isCorrect
                ? 'bg-secondary text-white'
                : 'bg-accent text-white'
            }`}
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
          >
            <div className="pb-7">
              {/* Confetti for correct */}
              {isCorrect && (
                <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <ConfettiDot key={i} index={i} />
                  ))}
                </div>
              )}

              <motion.div
                animate={!isCorrect ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 18,
                      delay: 0.1,
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center bg-white/20"
                  >
                    {isCorrect ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                  </motion.div>
                  <div className="flex items-center gap-3">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-2xl font-heading font-bold"
                    >
                      {phrase}
                    </motion.span>
                    {/* XP badge for correct */}
                    {isCorrect && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.3 }}
                        className="px-2.5 py-1 bg-white/25 rounded-full text-sm font-bold"
                      >
                        +5 XP
                      </motion.span>
                    )}
                  </div>
                </div>

                {!isCorrect && correctAnswer && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-white/85 text-sm mb-3 ml-14"
                  >
                    Bonne réponse : <span className="font-bold">{correctAnswer}</span>
                  </motion.p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 25 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className={`w-full py-4 rounded-2xl font-bold text-lg cursor-pointer mt-2 ${
                  isCorrect
                    ? 'bg-white text-secondary'
                    : 'bg-white text-accent'
                }`}
              >
                Continuer
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
