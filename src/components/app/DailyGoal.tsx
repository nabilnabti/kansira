import { motion } from 'framer-motion'

interface DailyGoalProps {
  current?: number
  goal?: number
}

export default function DailyGoal({ current = 0, goal = 20 }: DailyGoalProps) {
  const pct = Math.min((current / goal) * 100, 100)
  const done = current >= goal

  // SVG circular progress ring
  const radius = 26
  const stroke = 5
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (pct / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
    >
      {/* Animated ring */}
      <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
        <svg width={64} height={64} viewBox="0 0 64 64" className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={32}
            cy={32}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={32}
            cy={32}
            r={radius}
            fill="none"
            stroke={done ? '#2D9F4F' : '#FF6B00'}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-[#131516] leading-none">
            {current}/{goal}
          </span>
          <span className="text-[9px] text-gray-400 font-medium">XP</span>
        </div>
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#131516]">Objectif du jour</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {done ? 'Objectif atteint !' : `Encore ${goal - current} XP pour aujourd'hui`}
        </p>
      </div>

      {done && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-2xl"
        >
          &#127942;
        </motion.span>
      )}
    </motion.div>
  )
}
