import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Confetti for perfect scores */}
      {isPerfect &&
        Array.from({ length: 40 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center">
          <Trophy className="w-12 h-12 text-gold" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-heading font-bold text-dark mb-2"
      >
        Leçon terminée !
      </motion.h1>

      {/* Score circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
        className="relative w-32 h-32 mb-6"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-dark/10"
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
          <span className="text-3xl font-heading font-bold text-dark">
            <AnimatedCounter target={score} />
            <span className="text-lg">%</span>
          </span>
        </div>
      </motion.div>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-2 mb-6"
      >
        {[1, 2, 3].map((starIndex) => (
          <motion.div
            key={starIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: starIndex <= stars ? 1 : 0.7,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              delay: 1 + starIndex * 0.15,
            }}
          >
            <Star
              className={`w-10 h-10 ${
                starIndex <= stars
                  ? 'text-gold fill-gold'
                  : 'text-dark/20'
              }`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex gap-8 mb-8"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            <AnimatedCounter target={xpEarned} />
          </div>
          <div className="text-sm text-dark/60">XP gagnés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {correctCount}/{totalExercises}
          </div>
          <div className="text-sm text-dark/60">Bonnes réponses</div>
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/app')}
        className="w-full max-w-xs py-4 rounded-xl bg-primary text-white font-bold text-lg cursor-pointer"
      >
        Continuer
      </motion.button>
    </motion.div>
  )
}
