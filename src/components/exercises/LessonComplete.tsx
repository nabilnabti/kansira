import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '../ui/Mascot'

interface LessonCompleteProps {
  score: number
  correctCount: number
  totalExercises: number
  xpEarned?: number
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

export function LessonComplete({
  score,
  correctCount,
  totalExercises,
  xpEarned = 25,
}: LessonCompleteProps) {
  const navigate = useNavigate()
  const stars = score >= 100 ? 3 : score >= 70 ? 2 : score >= 40 ? 1 : 0
  const isPerfect = score === 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 overflow-hidden overflow-y-auto"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
    >
      {/* Confetti for good scores */}
      {score >= 70 &&
        Array.from({ length: isPerfect ? 50 : 30 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        className="mb-4"
      >
        <div className="w-28 h-28 bg-gold/20 rounded-full flex items-center justify-center relative">
          <Trophy className="w-14 h-14 text-gold" />
          {/* Gold glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold/10 blur-xl"
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
        Lecon terminee !
      </motion.h1>

      {/* Score circle - bigger on mobile */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
        className="relative w-40 h-40 mb-5"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-dark/8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-secondary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            style={{
              strokeDasharray: `${2 * Math.PI * 42}`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-heading font-bold text-dark">
            <AnimatedCounter target={score} />
            <span className="text-xl">%</span>
          </span>
        </div>
      </motion.div>

      {/* Stars with gold glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-3 mb-5"
      >
        {[1, 2, 3].map((starIndex) => (
          <motion.div
            key={starIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: starIndex <= stars ? 1 : 0.6,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 12,
              delay: 1 + starIndex * 0.2,
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
              className={`w-12 h-12 relative z-10 ${
                starIndex <= stars
                  ? 'text-gold fill-gold drop-shadow-lg'
                  : 'text-dark/15'
              }`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* XP counter — very prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.2 }}
        className="bg-primary/10 border-2 border-primary/20 rounded-2xl px-8 py-4 mb-5"
      >
        <div className="text-3xl font-bold text-primary text-center">
          +<AnimatedCounter target={xpEarned} /> XP
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex gap-8 mb-8"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {correctCount}/{totalExercises}
          </div>
          <div className="text-sm text-dark/50">Bonnes reponses</div>
        </div>
      </motion.div>

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mb-6"
      >
        <Mascot
          size={80}
          expression={isPerfect ? 'excited' : score >= 70 ? 'happy' : 'thinking'}
        />
      </motion.div>

      {/* Continue button — prominent */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/app')}
        className="w-full max-w-sm py-5 rounded-2xl bg-primary text-white font-bold text-xl cursor-pointer shadow-lg shadow-primary/30"
      >
        Continuer
      </motion.button>
    </motion.div>
  )
}
