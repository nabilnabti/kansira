import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakDisplayProps {
  streak?: number
}

export default function StreakDisplay({ streak = 0 }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={
          streak > 0
            ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }
            : undefined
        }
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <Flame
          className={streak > 0 ? 'text-primary' : 'text-gray-300'}
          size={22}
          fill={streak > 0 ? 'currentColor' : 'none'}
        />
      </motion.div>
      <span className={`text-sm font-semibold ${streak > 0 ? 'text-dark' : 'text-gray-400'}`}>
        {streak > 0 ? `${streak} jour${streak !== 1 ? 's' : ''}` : 'Pas de série'}
      </span>
    </div>
  )
}
