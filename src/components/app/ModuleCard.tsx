import { motion } from 'framer-motion'

interface ModuleCardProps {
  icon: string
  title: string
  description: string
  progress: number // 0-100
  status: 'current' | 'completed' | 'locked'
}

const borderColors = {
  current: 'border-l-primary',
  completed: 'border-l-secondary',
  locked: 'border-l-gray-300',
}

const badgeColors = {
  current: 'bg-primary/10 text-primary',
  completed: 'bg-secondary/10 text-secondary',
  locked: 'bg-gray-100 text-gray-400',
}

export default function ModuleCard({ icon, title, description, progress, status }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 ${borderColors[status]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-dark text-sm truncate">{title}</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColors[status]}`}>
              {status === 'completed' ? 'Termine' : status === 'current' ? 'En cours' : 'Verrouille'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{description}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${status === 'completed' ? 'bg-secondary' : 'bg-primary'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <span className="text-[10px] font-medium text-gray-500">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
