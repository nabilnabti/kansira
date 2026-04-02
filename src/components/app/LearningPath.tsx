import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Crown, Lock, Check, Play, Star, ChevronRight } from 'lucide-react'
import DailyGoal from './DailyGoal'

type LessonStatus = 'completed' | 'available' | 'locked' | 'premium_locked'

interface LessonData {
  id: string
  title: string
  emoji: string
  status: LessonStatus
}

interface ModuleData {
  id: string
  icon: string
  title: string
  description: string
  isFree: boolean
  lessons: LessonData[]
}

const mockModules: ModuleData[] = [
  {
    id: 'm1',
    icon: '👋',
    title: 'Salutations & Bases',
    description: 'Les salutations essentielles',
    isFree: true,
    lessons: [
      { id: 'l1', title: 'Dire bonjour', emoji: '👋', status: 'available' },
      { id: 'l2', title: 'Se présenter', emoji: '🙋', status: 'locked' },
      { id: 'l3', title: 'Comment ça va ?', emoji: '💬', status: 'locked' },
      { id: 'l4', title: 'La politesse', emoji: '🙏', status: 'locked' },
      { id: 'l5', title: 'Au revoir', emoji: '👋', status: 'locked' },
    ],
  },
  {
    id: 'm2',
    icon: '👨‍👩‍👧‍👦',
    title: 'La Famille',
    description: 'Les membres de la famille',
    isFree: false,
    lessons: [
      { id: 'l6', title: 'Les parents', emoji: '👨‍👩‍👧', status: 'premium_locked' },
      { id: 'l7', title: 'Frères et sœurs', emoji: '👫', status: 'premium_locked' },
      { id: 'l8', title: 'Les grands-parents', emoji: '👴', status: 'premium_locked' },
      { id: 'l9', title: 'Oncles et tantes', emoji: '👨‍👧', status: 'premium_locked' },
      { id: 'l10', title: 'Ma famille', emoji: '🏠', status: 'premium_locked' },
    ],
  },
  {
    id: 'm3',
    icon: '🔢',
    title: 'Les Nombres',
    description: 'Compter en Bambara',
    isFree: false,
    lessons: [
      { id: 'l11', title: '1 à 5', emoji: '1️⃣', status: 'premium_locked' },
      { id: 'l12', title: '6 à 10', emoji: '🔟', status: 'premium_locked' },
      { id: 'l13', title: '11 à 20', emoji: '🔢', status: 'premium_locked' },
      { id: 'l14', title: 'Les dizaines', emoji: '💯', status: 'premium_locked' },
      { id: 'l15', title: 'Compter', emoji: '🧮', status: 'premium_locked' },
    ],
  },
]

// Serpentine offsets for lesson nodes — alternates left/right like Duolingo
const serpentineOffsets = [0, 40, 60, 40, 0, -40, -60, -40]

function LessonNode({
  lesson,
  index,
  moduleIndex,
}: {
  lesson: LessonData
  index: number
  moduleIndex: number
}) {
  const navigate = useNavigate()
  const clickable = lesson.status === 'available' || lesson.status === 'completed'
  const offset = serpentineOffsets[(index + moduleIndex * 3) % serpentineOffsets.length]

  const handleClick = () => {
    if (clickable) navigate(`/app/lesson/${lesson.id}`)
  }

  const nodeSize = lesson.status === 'available' ? 'w-16 h-16' : 'w-14 h-14'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="flex flex-col items-center"
      style={{ marginLeft: offset }}
    >
      <motion.button
        onClick={handleClick}
        disabled={!clickable}
        whileHover={clickable ? { scale: 1.12 } : undefined}
        whileTap={clickable ? { scale: 0.92 } : undefined}
        className={`
          relative ${nodeSize} rounded-full flex items-center justify-center
          transition-all duration-200
          ${clickable ? 'cursor-pointer' : 'cursor-default'}
          ${lesson.status === 'completed' ? 'bg-secondary shadow-lg shadow-secondary/25' : ''}
          ${lesson.status === 'available' ? 'bg-primary shadow-xl shadow-primary/30' : ''}
          ${lesson.status === 'locked' ? 'bg-gray-200' : ''}
          ${lesson.status === 'premium_locked' ? 'bg-gradient-to-br from-amber-200 to-amber-300 shadow-md shadow-amber-200/30' : ''}
        `}
      >
        {/* Pulsing ring for available lesson */}
        {lesson.status === 'available' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-primary"
              animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-primary"
              animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}

        {/* Outer ring for completed */}
        {lesson.status === 'completed' && (
          <div className="absolute -inset-1 rounded-full border-[3px] border-secondary/30" />
        )}

        {/* Icon */}
        {lesson.status === 'completed' && (
          <Check size={26} strokeWidth={3} className="text-white" />
        )}
        {lesson.status === 'available' && (
          <Play size={22} fill="white" className="text-white ml-0.5" />
        )}
        {lesson.status === 'locked' && (
          <Lock size={18} className="text-gray-400" />
        )}
        {lesson.status === 'premium_locked' && (
          <Lock size={18} className="text-amber-600" />
        )}
      </motion.button>

      {/* Label */}
      <span
        className={`mt-2 text-xs font-semibold text-center max-w-[90px] leading-tight ${
          lesson.status === 'available' ? 'text-dark' :
          lesson.status === 'completed' ? 'text-secondary-dark' :
          lesson.status === 'premium_locked' ? 'text-amber-600/70' :
          'text-gray-400'
        }`}
      >
        {lesson.title}
      </span>
    </motion.div>
  )
}

function ModuleHeader({ module, index }: { module: ModuleData; index: number }) {
  const completedCount = module.lessons.filter(l => l.status === 'completed').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="flex items-center gap-3 mb-2"
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center text-lg
        ${!module.isFree ? 'bg-amber-50' : completedCount > 0 ? 'bg-secondary/10' : 'bg-primary/10'}
      `}>
        {module.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-dark text-sm">{module.title}</h3>
          {!module.isFree && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Crown size={10} /> Premium
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">{module.description}</p>
      </div>
      <span className="text-xs font-medium text-gray-400">
        {completedCount}/{module.lessons.length}
      </span>
    </motion.div>
  )
}

function PremiumBanner() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl p-5 text-white shadow-lg my-8"
    >
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Crown size={20} />
          <h3 className="font-bold text-base">Débloquez tout le contenu</h3>
        </div>
        <p className="text-xs text-white/70 mb-3">
          Accédez aux 100 leçons, 10 modules et badges exclusifs
        </p>
        <button
          onClick={() => navigate('/app/premium')}
          className="flex items-center gap-1 bg-white text-primary font-bold text-sm py-2 px-4 rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
        >
          Voir les offres
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  )
}

function WelcomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl p-5 border border-primary/10 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">🎉</div>
        <div>
          <h2 className="font-bold text-dark text-sm">Bienvenue sur Kan Sira !</h2>
          <p className="text-xs text-dark/50 mt-0.5">
            Commencez votre première leçon de Bambara. C'est parti !
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Star size={14} className="text-gold" />
        <span className="text-xs text-dark/60">Terminez votre première leçon pour gagner 10 XP</span>
      </div>
    </motion.div>
  )
}

export default function LearningPath() {
  const freeModules = mockModules.filter(m => m.isFree)
  const premiumModules = mockModules.filter(m => !m.isFree)

  return (
    <div className="max-w-md mx-auto pb-28 md:pb-8">
      {/* Welcome card for new users */}
      <WelcomeCard />

      {/* Daily goal */}
      <div className="mb-6">
        <DailyGoal current={0} goal={20} />
      </div>

      {/* Free modules */}
      {freeModules.map((mod, mi) => (
        <div key={mod.id} className="mb-4">
          <ModuleHeader module={mod} index={mi} />

          {/* Lessons serpentine path */}
          <div className="flex flex-col items-center gap-5 py-4">
            {mod.lessons.map((lesson, li) => (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                index={li}
                moduleIndex={mi}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Premium banner */}
      <PremiumBanner />

      {/* Premium modules (preview) */}
      {premiumModules.map((mod, mi) => (
        <div key={mod.id} className="mb-4 opacity-75">
          <ModuleHeader module={mod} index={mi + freeModules.length} />

          <div className="flex flex-col items-center gap-5 py-4">
            {mod.lessons.map((lesson, li) => (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                index={li}
                moduleIndex={mi + freeModules.length}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
