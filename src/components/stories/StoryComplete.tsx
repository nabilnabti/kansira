import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../ui/Mascot'

interface StoryCompleteProps {
  score: number
  correctCount: number
  totalInteractions: number
  xpEarned: number
  storyTitle: string
}

function AnimatedCounter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [target, duration])

  return <span>{count}</span>
}

function ConfettiParticle({ index }: { index: number }) {
  const colors = ['#FF6B00', '#2D9F4F', '#F4A100', '#E63946', '#FF8A33']
  const color = colors[index % colors.length]
  const x = Math.random() * 300 - 150
  const delay = Math.random() * 0.5

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, -80, 400],
        x: [0, x * 0.5, x],
        opacity: [1, 1, 0],
        rotate: [0, 180, 360 + Math.random() * 360],
        scale: [0, 1, 0.5],
      }}
      transition={{ duration: 2.5, delay, ease: 'easeOut' }}
      className="absolute top-1/4 left-1/2 pointer-events-none"
      style={{
        width: Math.random() * 8 + 4,
        height: Math.random() * 8 + 4,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  )
}

export function StoryComplete({
  score,
  correctCount,
  totalInteractions,
  xpEarned,
  storyTitle,
}: StoryCompleteProps) {
  const navigate = useNavigate()
  const isPerfect = score === 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 overflow-hidden overflow-y-auto"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      }}
    >
      {/* Confetti */}
      {score >= 50 &&
        Array.from({ length: isPerfect ? 50 : 30 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}

      {/* Book icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        className="mb-4"
      >
        <div className="w-24 h-24 bg-primary/15 rounded-full flex items-center justify-center relative">
          <BookOpen className="w-12 h-12 text-primary" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-heading font-bold text-dark mb-1"
      >
        Histoire terminée !
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-dark/50 text-base mb-6"
      >
        {storyTitle}
      </motion.p>

      {/* Stars */}
      {totalInteractions > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 mb-5"
        >
          {[1, 2, 3].map((starIndex) => {
            const stars = score >= 100 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: starIndex <= stars ? 1 : 0.6, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 12,
                  delay: 0.8 + starIndex * 0.2,
                }}
                className="relative"
              >
                {starIndex <= stars && (
                  <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: starIndex * 0.2 }}
                    className="absolute inset-[-8px] rounded-full bg-gold/20 blur-md"
                  />
                )}
                <Star
                  className={`w-10 h-10 relative z-10 ${
                    starIndex <= stars ? 'text-gold fill-gold drop-shadow-lg' : 'text-dark/15'
                  }`}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* XP counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1 }}
        className="bg-primary/10 border-2 border-primary/20 rounded-2xl px-8 py-4 mb-5"
      >
        <div className="text-3xl font-bold text-primary text-center">
          +<AnimatedCounter target={xpEarned} /> XP
        </div>
      </motion.div>

      {/* Stats */}
      {totalInteractions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-8 mb-6"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {correctCount}/{totalInteractions}
            </div>
            <div className="text-sm text-dark/50">Bonnes réponses</div>
          </div>
        </motion.div>
      )}

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-6"
      >
        <Mascot
          size={80}
          expression={isPerfect ? 'excited' : score >= 50 ? 'happy' : 'thinking'}
        />
      </motion.div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, type: 'spring', stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/app/stories')}
        className="w-full max-w-sm py-5 rounded-2xl bg-primary text-white font-bold text-xl cursor-pointer shadow-lg shadow-primary/30"
      >
        Continuer
      </motion.button>
    </motion.div>
  )
}
