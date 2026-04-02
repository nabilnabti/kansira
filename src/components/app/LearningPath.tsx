import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Crown, Lock, Check, Play, ChevronRight, Flame, Star, BarChart3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Mascot } from '../ui/Mascot'
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
    icon: '\u{1F44B}',
    title: 'Salutations & Bases',
    description: 'Les salutations essentielles',
    isFree: true,
    lessons: [
      { id: 'l1', title: 'Dire bonjour', emoji: '\u{1F44B}', status: 'available' },
      { id: 'l2', title: 'Se pr\u00e9senter', emoji: '\u{1F64B}', status: 'locked' },
      { id: 'l3', title: 'Comment \u00e7a va ?', emoji: '\u{1F4AC}', status: 'locked' },
      { id: 'l4', title: 'La politesse', emoji: '\u{1F64F}', status: 'locked' },
      { id: 'l5', title: 'Au revoir', emoji: '\u{1F44B}', status: 'locked' },
    ],
  },
  {
    id: 'm2',
    icon: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}',
    title: 'La Famille',
    description: 'Les membres de la famille',
    isFree: false,
    lessons: [
      { id: 'l6', title: 'Les parents', emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}', status: 'premium_locked' },
      { id: 'l7', title: 'Fr\u00e8res et s\u0153urs', emoji: '\u{1F46B}', status: 'premium_locked' },
      { id: 'l8', title: 'Les grands-parents', emoji: '\u{1F474}', status: 'premium_locked' },
      { id: 'l9', title: 'Oncles et tantes', emoji: '\u{1F468}\u200D\u{1F467}', status: 'premium_locked' },
      { id: 'l10', title: 'Ma famille', emoji: '\u{1F3E0}', status: 'premium_locked' },
    ],
  },
  {
    id: 'm3',
    icon: '\u{1F522}',
    title: 'Les Nombres',
    description: 'Compter en Bambara',
    isFree: false,
    lessons: [
      { id: 'l11', title: '1 \u00e0 5', emoji: '1\uFE0F\u20E3', status: 'premium_locked' },
      { id: 'l12', title: '6 \u00e0 10', emoji: '\u{1F51F}', status: 'premium_locked' },
      { id: 'l13', title: '11 \u00e0 20', emoji: '\u{1F522}', status: 'premium_locked' },
      { id: 'l14', title: 'Les dizaines', emoji: '\u{1F4AF}', status: 'premium_locked' },
      { id: 'l15', title: 'Compter', emoji: '\u{1F9EE}', status: 'premium_locked' },
    ],
  },
]

// Serpentine wave positions: each lesson gets an X offset for the wave pattern
const wavePattern = [0, 50, 70, 50, 0, -50, -70, -50]

function SerpentinePath({ lessons, moduleIndex }: { lessons: LessonData[]; moduleIndex: number }) {
  // Build SVG path connecting the nodes
  const nodeSpacing = 100
  const centerX = 160

  const points = lessons.map((_, i) => {
    const offset = wavePattern[(i + moduleIndex * 3) % wavePattern.length]
    return {
      x: centerX + offset,
      y: 40 + i * nodeSpacing,
    }
  })

  // Build a smooth curve through the points
  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midY = (prev.y + curr.y) / 2
    pathD += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
  }

  const totalHeight = 40 + (lessons.length - 1) * nodeSpacing + 40

  return (
    <div className="relative" style={{ height: totalHeight }}>
      {/* SVG curved path line */}
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: totalHeight }}
        viewBox={`0 0 320 ${totalHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d={pathD}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
          strokeDasharray="8 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Lesson nodes */}
      {lessons.map((lesson, i) => {
        const offset = wavePattern[(i + moduleIndex * 3) % wavePattern.length]
        const xPercent = ((centerX + offset) / 320) * 100

        return (
          <div
            key={lesson.id}
            className="absolute"
            style={{
              left: `${xPercent}%`,
              top: 40 + i * nodeSpacing,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <LessonNode lesson={lesson} index={i} />
          </div>
        )
      })}
    </div>
  )
}

function LessonNode({ lesson, index }: { lesson: LessonData; index: number }) {
  const navigate = useNavigate()
  const clickable = lesson.status === 'available' || lesson.status === 'completed'

  const handleClick = () => {
    if (clickable) navigate(`/app/lesson/${lesson.id}`)
  }

  const sizeClass =
    lesson.status === 'available' ? 'w-16 h-16' : 'w-14 h-14'

  const bgClass =
    lesson.status === 'completed'
      ? 'bg-[#2D9F4F] shadow-lg shadow-[#2D9F4F]/25'
      : lesson.status === 'available'
        ? 'bg-[#FF6B00] shadow-xl shadow-[#FF6B00]/30'
        : lesson.status === 'premium_locked'
          ? 'bg-gradient-to-br from-amber-300 to-amber-400 shadow-md shadow-amber-200/30'
          : 'bg-gray-200'

  const labelColor =
    lesson.status === 'available'
      ? 'text-[#131516]'
      : lesson.status === 'completed'
        ? 'text-[#2D9F4F]'
        : lesson.status === 'premium_locked'
          ? 'text-amber-600/70'
          : 'text-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08 * index, type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center"
    >
      <motion.button
        onClick={handleClick}
        disabled={!clickable}
        whileHover={clickable ? { scale: 1.15 } : undefined}
        whileTap={clickable ? { scale: 0.9 } : undefined}
        className={`relative ${sizeClass} rounded-full flex items-center justify-center ${bgClass} ${
          clickable ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Pulsing glow for available */}
        {lesson.status === 'available' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-[#FF6B00]"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-[#FF6B00]"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
          </>
        )}

        {/* Gold ring for completed */}
        {lesson.status === 'completed' && (
          <div className="absolute -inset-[3px] rounded-full border-[3px] border-[#F4A100]" />
        )}

        {/* Icons */}
        {lesson.status === 'completed' && <Check size={26} strokeWidth={3} className="text-white" />}
        {lesson.status === 'available' && <Play size={24} fill="white" className="text-white ml-0.5" />}
        {lesson.status === 'locked' && <Lock size={18} className="text-gray-400" />}
        {lesson.status === 'premium_locked' && <Crown size={18} className="text-amber-700" />}
      </motion.button>

      <span className={`mt-2 text-[11px] font-semibold text-center max-w-[90px] leading-tight ${labelColor}`}>
        {lesson.title}
      </span>
    </motion.div>
  )
}

function ModuleHeader({ module: mod, index }: { module: ModuleData; index: number }) {
  const completedCount = mod.lessons.filter((l) => l.status === 'completed').length

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center gap-3 mb-1 px-1"
    >
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${
          !mod.isFree ? 'bg-amber-50' : completedCount > 0 ? 'bg-[#2D9F4F]/10' : 'bg-[#FF6B00]/10'
        }`}
      >
        {mod.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#131516] text-[15px]">{mod.title}</h3>
          {!mod.isFree && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Crown size={10} /> Premium
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          {completedCount}/{mod.lessons.length} lecons
        </p>
      </div>
    </motion.div>
  )
}

function PremiumBanner() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl p-5 text-white shadow-xl my-8 mx-1"
      style={{
        background: 'linear-gradient(135deg, #FF6B00 0%, #E85D00 50%, #D44800 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-10 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute left-4 -bottom-6 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Crown size={22} className="text-white" />
          </div>
          <h3 className="font-extrabold text-lg">Kan Sira Premium</h3>
        </div>

        <div className="space-y-1.5 mb-4 ml-1">
          <p className="text-[13px] text-white/80 flex items-center gap-2">
            <Check size={14} strokeWidth={3} /> 100+ lecons interactives
          </p>
          <p className="text-[13px] text-white/80 flex items-center gap-2">
            <Check size={14} strokeWidth={3} /> 10 modules complets
          </p>
          <p className="text-[13px] text-white/80 flex items-center gap-2">
            <Check size={14} strokeWidth={3} /> Badges et certifications
          </p>
        </div>

        <motion.button
          onClick={() => navigate('/app/premium')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 bg-white text-[#FF6B00] font-bold text-sm py-2.5 px-5 rounded-2xl shadow-lg cursor-pointer"
        >
          Voir les offres
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}

function StatsPills() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex items-center justify-center gap-3 mb-5"
    >
      <div className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 shadow-sm border border-gray-100">
        <Flame size={16} className="text-[#E63946]" />
        <span className="text-[13px] font-bold text-[#131516]">0</span>
      </div>
      <div className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 shadow-sm border border-gray-100">
        <Star size={16} className="text-[#F4A100]" />
        <span className="text-[13px] font-bold text-[#131516]">0 XP</span>
      </div>
      <div className="flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 shadow-sm border border-gray-100">
        <BarChart3 size={16} className="text-[#2D9F4F]" />
        <span className="text-[13px] font-bold text-[#131516]">Niv. 1</span>
      </div>
    </motion.div>
  )
}

export default function LearningPath() {
  const { profile } = useAuth()
  const firstName = profile?.display_name?.split(' ')[0] || 'Apprenant'
  const freeModules = mockModules.filter((m) => m.isFree)
  const premiumModules = mockModules.filter((m) => !m.isFree)

  return (
    <div className="max-w-md mx-auto pb-28 md:pb-8">
      {/* Welcome section with mascot */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-5 px-1"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
        >
          <Mascot size={72} expression="waving" />
        </motion.div>
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-extrabold text-[#131516]"
          >
            Bonjour {firstName} !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 mt-0.5"
          >
            Pret pour votre lecon ?
          </motion.p>
        </div>
      </motion.div>

      {/* Stats pills */}
      <StatsPills />

      {/* Daily goal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-7 px-1"
      >
        <DailyGoal current={0} goal={20} />
      </motion.div>

      {/* Free modules */}
      {freeModules.map((mod, mi) => (
        <div key={mod.id} className="mb-4">
          <ModuleHeader module={mod} index={mi} />
          <SerpentinePath lessons={mod.lessons} moduleIndex={mi} />
        </div>
      ))}

      {/* Premium banner */}
      <PremiumBanner />

      {/* Premium modules (preview) */}
      {premiumModules.map((mod, mi) => (
        <div key={mod.id} className="mb-4 opacity-70">
          <ModuleHeader module={mod} index={mi + freeModules.length} />
          <SerpentinePath lessons={mod.lessons} moduleIndex={mi + freeModules.length} />
        </div>
      ))}
    </div>
  )
}
