import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type LessonStatus = 'completed' | 'available' | 'locked' | 'premium_locked'

interface LessonNodeProps {
  id: string
  title: string
  status: LessonStatus
  isLast?: boolean
}

const circleStyles: Record<LessonStatus, string> = {
  completed: 'bg-secondary text-white',
  available: 'bg-primary text-white',
  locked: 'bg-gray-300 text-gray-500',
  premium_locked: 'bg-gold text-white',
}

export default function LessonNode({ id, title, status, isLast = false }: LessonNodeProps) {
  const navigate = useNavigate()
  const clickable = status === 'available' || status === 'completed'

  const handleClick = () => {
    if (clickable) navigate(`/app/lesson/${id}`)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Vertical connecting line above */}
      <div className="w-0.5 h-6 bg-gray-200" />

      {/* Circle node */}
      <motion.button
        onClick={handleClick}
        disabled={!clickable}
        whileHover={clickable ? { scale: 1.1 } : undefined}
        whileTap={clickable ? { scale: 0.95 } : undefined}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-shadow ${circleStyles[status]} ${
          clickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
        }`}
      >
        {/* Pulsing ring for available */}
        {status === 'available' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {status === 'completed' && <Check size={24} strokeWidth={3} />}
        {status === 'available' && (
          <span className="text-lg font-bold">&#9654;</span>
        )}
        {(status === 'locked' || status === 'premium_locked') && <Lock size={20} />}
      </motion.button>

      {/* Title */}
      <span
        className={`mt-1.5 text-xs font-medium text-center max-w-[80px] leading-tight ${
          status === 'locked' ? 'text-gray-400' : 'text-dark'
        }`}
      >
        {title}
      </span>

      {/* Vertical connecting line below */}
      {!isLast && <div className="w-0.5 h-6 bg-gray-200" />}
    </div>
  )
}
