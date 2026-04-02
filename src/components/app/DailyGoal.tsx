import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

interface DailyGoalProps {
  current?: number
  goal?: number
}

export default function DailyGoal({ current = 15, goal = 30 }: DailyGoalProps) {
  const pct = Math.min((current / goal) * 100, 100)
  const done = current >= goal

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${done ? 'bg-secondary/10' : 'bg-primary/10'}`}>
          <Target className={done ? 'text-secondary' : 'text-primary'} size={20} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-dark">Objectif quotidien</p>
          <p className="text-xs text-gray-500">
            {current} / {goal} XP
          </p>
        </div>
        {done && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-lg"
          >
            &#127942;
          </motion.span>
        )}
      </div>
      <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${done ? 'bg-secondary' : 'bg-secondary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}
