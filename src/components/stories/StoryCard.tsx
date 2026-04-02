import { motion } from 'framer-motion'
import { Star, Lock } from 'lucide-react'
import type { StoryData } from '../../types/database'

interface StoryCardProps {
  story: StoryData
  completed?: boolean
  locked?: boolean
  onTap: () => void
}

const levelLabels = ['', 'Débutant', 'Intermédiaire', 'Avancé']
const levelColors = ['', 'text-secondary', 'text-primary', 'text-accent']

export function StoryCard({ story, completed, locked, onTap }: StoryCardProps) {
  return (
    <motion.button
      whileHover={locked ? undefined : { scale: 1.03 }}
      whileTap={locked ? undefined : { scale: 0.97 }}
      onClick={locked ? undefined : onTap}
      className={`
        w-full text-left rounded-2xl p-4 border-2 transition-colors cursor-pointer
        ${locked ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : ''}
        ${completed ? 'bg-secondary/5 border-secondary/20' : ''}
        ${!locked && !completed ? 'bg-white border-gray-100 hover:border-primary/30 shadow-sm' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0
            ${locked ? 'bg-gray-100' : completed ? 'bg-secondary/10' : 'bg-primary/10'}
          `}
        >
          {locked ? <Lock size={20} className="text-gray-400" /> : story.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-dark text-base truncate">{story.title}</h3>
          <p className="text-sm text-dark/50 mt-0.5 line-clamp-2">{story.description}</p>

          {/* Level + XP */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: story.level }).map((_, i) => (
                <Star key={i} size={12} className={`${levelColors[story.level]} fill-current`} />
              ))}
              <span className={`text-xs font-medium ml-0.5 ${levelColors[story.level]}`}>
                {levelLabels[story.level]}
              </span>
            </div>
            <span className="text-xs text-dark/40">+{story.xp_reward} XP</span>
          </div>
        </div>

        {completed && (
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  )
}
