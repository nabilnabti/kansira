import { motion } from 'framer-motion'

interface XPBarProps {
  level?: number
  currentXP?: number
  nextLevelXP?: number
}

export default function XPBar({ level = 1, currentXP = 0, nextLevelXP = 100 }: XPBarProps) {
  const pct = Math.min((currentXP / nextLevelXP) * 100, 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-dark">Niveau {level}</span>
        <span className="text-xs text-gray-500">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
