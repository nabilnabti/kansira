import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Crown, Lock, Check, Play, ChevronRight, ChevronLeft, Flame, Star, BarChart3, Grid3X3 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
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
  lang: 'bm' | 'snk'
  difficulty: 'A1' | 'A2' | 'B1' | 'B2'
  lessons: LessonData[]
}

const allModules: ModuleData[] = [
  // Bambara modules
  {
    id: 'bm-m1',
    icon: '👋',
    title: 'Salutations & Bases',
    description: 'Les salutations essentielles en Bambara',
    isFree: true,
    lang: 'bm',
    difficulty: 'A1',
    lessons: [
      { id: 'l1', title: 'Dire bonjour', emoji: '👋', status: 'available' },
      { id: 'l2', title: 'Se présenter', emoji: '🙋', status: 'locked' },
      { id: 'l3', title: 'Comment ça va ?', emoji: '💬', status: 'locked' },
      { id: 'l4', title: 'La politesse', emoji: '🙏', status: 'locked' },
      { id: 'l5', title: 'Au revoir', emoji: '👋', status: 'locked' },
    ],
  },
  {
    id: 'bm-m2',
    icon: '👨‍👩‍👧‍👦',
    title: 'La Famille',
    description: 'Les membres de la famille',
    isFree: false,
    lang: 'bm',
    difficulty: 'A1',
    lessons: [
      { id: 'l6', title: 'Les parents', emoji: '👨‍👩‍👧', status: 'premium_locked' },
      { id: 'l7', title: 'Frères et sœurs', emoji: '👫', status: 'premium_locked' },
      { id: 'l8', title: 'Les grands-parents', emoji: '👴', status: 'premium_locked' },
      { id: 'l9', title: 'Oncles et tantes', emoji: '👨‍👧', status: 'premium_locked' },
      { id: 'l10', title: 'Ma famille', emoji: '🏠', status: 'premium_locked' },
    ],
  },
  {
    id: 'bm-m3',
    icon: '🔢',
    title: 'Les Nombres',
    description: 'Compter en Bambara',
    isFree: false,
    lang: 'bm',
    difficulty: 'A2',
    lessons: [
      { id: 'l11', title: '1 à 5', emoji: '1️⃣', status: 'premium_locked' },
      { id: 'l12', title: '6 à 10', emoji: '🔟', status: 'premium_locked' },
      { id: 'l13', title: '11 à 20', emoji: '🔢', status: 'premium_locked' },
      { id: 'l14', title: 'Les dizaines', emoji: '💯', status: 'premium_locked' },
      { id: 'l15', title: 'Compter', emoji: '🧮', status: 'premium_locked' },
    ],
  },
  {
    id: 'bm-m4',
    icon: '🍎',
    title: 'Nourriture',
    description: 'Les aliments et les repas',
    isFree: false,
    lang: 'bm',
    difficulty: 'A2',
    lessons: [
      { id: 'l16', title: 'Les fruits', emoji: '🥭', status: 'premium_locked' },
      { id: 'l17', title: 'Les légumes', emoji: '🥬', status: 'premium_locked' },
      { id: 'l18', title: 'Les repas', emoji: '🍽️', status: 'premium_locked' },
      { id: 'l19', title: 'Au marché', emoji: '🏪', status: 'premium_locked' },
      { id: 'l20', title: 'Les boissons', emoji: '🥤', status: 'premium_locked' },
    ],
  },
  {
    id: 'bm-m5',
    icon: '🎨',
    title: 'Les Couleurs',
    description: 'Les couleurs en Bambara',
    isFree: false,
    lang: 'bm',
    difficulty: 'B1',
    lessons: [
      { id: 'l21', title: 'Rouge, bleu, jaune', emoji: '🔴', status: 'premium_locked' },
      { id: 'l22', title: 'Vert, orange, violet', emoji: '🟢', status: 'premium_locked' },
      { id: 'l23', title: 'Noir et blanc', emoji: '⬛', status: 'premium_locked' },
      { id: 'l24', title: 'Décrire les couleurs', emoji: '🌈', status: 'premium_locked' },
    ],
  },
  {
    id: 'bm-m6',
    icon: '🏠',
    title: 'La Maison',
    description: 'Les pièces et objets de la maison',
    isFree: false,
    lang: 'bm',
    difficulty: 'B1',
    lessons: [
      { id: 'l25', title: 'Les pièces', emoji: '🚪', status: 'premium_locked' },
      { id: 'l26', title: 'Les meubles', emoji: '🪑', status: 'premium_locked' },
      { id: 'l27', title: 'La cuisine', emoji: '🍳', status: 'premium_locked' },
      { id: 'l28', title: 'Le jardin', emoji: '🌿', status: 'premium_locked' },
    ],
  },
  // Soninké modules
  {
    id: 'snk-m1',
    icon: '👋',
    title: 'Salutations & Bases',
    description: 'Les salutations essentielles en Soninké',
    isFree: true,
    lang: 'snk',
    difficulty: 'A1',
    lessons: [
      { id: 'sl1', title: 'Dire bonjour', emoji: '👋', status: 'available' },
      { id: 'sl2', title: 'Se présenter', emoji: '🙋', status: 'locked' },
      { id: 'sl3', title: 'Comment ça va ?', emoji: '💬', status: 'locked' },
      { id: 'sl4', title: 'La politesse', emoji: '🙏', status: 'locked' },
      { id: 'sl5', title: 'Au revoir', emoji: '👋', status: 'locked' },
    ],
  },
  {
    id: 'snk-m2',
    icon: '👨‍👩‍👧‍👦',
    title: 'La Famille',
    description: 'Les membres de la famille en Soninké',
    isFree: false,
    lang: 'snk',
    difficulty: 'A1',
    lessons: [
      { id: 'sl6', title: 'Les parents', emoji: '👨‍👩‍👧', status: 'premium_locked' },
      { id: 'sl7', title: 'Frères et sœurs', emoji: '👫', status: 'premium_locked' },
      { id: 'sl8', title: 'Les grands-parents', emoji: '👴', status: 'premium_locked' },
      { id: 'sl9', title: 'Oncles et tantes', emoji: '👨‍👧', status: 'premium_locked' },
      { id: 'sl10', title: 'Ma famille', emoji: '🏠', status: 'premium_locked' },
    ],
  },
  {
    id: 'snk-m3',
    icon: '🔢',
    title: 'Les Nombres',
    description: 'Compter en Soninké',
    isFree: false,
    lang: 'snk',
    difficulty: 'A2',
    lessons: [
      { id: 'sl11', title: '1 à 5', emoji: '1️⃣', status: 'premium_locked' },
      { id: 'sl12', title: '6 à 10', emoji: '🔟', status: 'premium_locked' },
      { id: 'sl13', title: '11 à 20', emoji: '🔢', status: 'premium_locked' },
      { id: 'sl14', title: 'Les dizaines', emoji: '💯', status: 'premium_locked' },
      { id: 'sl15', title: 'Compter', emoji: '🧮', status: 'premium_locked' },
    ],
  },
  {
    id: 'snk-m4',
    icon: '🍎',
    title: 'Nourriture',
    description: 'Les aliments et les repas en Soninké',
    isFree: false,
    lang: 'snk',
    difficulty: 'A2',
    lessons: [
      { id: 'sl16', title: 'Les fruits', emoji: '🥭', status: 'premium_locked' },
      { id: 'sl17', title: 'Les légumes', emoji: '🥬', status: 'premium_locked' },
      { id: 'sl18', title: 'Les repas', emoji: '🍽️', status: 'premium_locked' },
      { id: 'sl19', title: 'Au marché', emoji: '🏪', status: 'premium_locked' },
    ],
  },
  {
    id: 'snk-m5',
    icon: '🐘',
    title: 'Les Animaux',
    description: 'Les animaux en Soninké',
    isFree: false,
    lang: 'snk',
    difficulty: 'B1',
    lessons: [
      { id: 'sl20', title: 'Animaux domestiques', emoji: '🐔', status: 'premium_locked' },
      { id: 'sl21', title: 'Animaux sauvages', emoji: '🦁', status: 'premium_locked' },
      { id: 'sl22', title: 'Animaux de la ferme', emoji: '🐄', status: 'premium_locked' },
      { id: 'sl23', title: 'Insectes', emoji: '🦋', status: 'premium_locked' },
    ],
  },
]

// Serpentine wave positions: each lesson gets an X offset for the wave pattern
const wavePattern = [0, 50, 70, 50, 0, -50, -70, -50]

function SerpentinePath({ lessons, moduleIndex }: { lessons: LessonData[]; moduleIndex: number }) {
  // Build SVG path connecting the nodes — vertical on mobile
  const nodeSpacing = 100
  const centerX = 160

  const points = lessons.map((_, i) => {
    const offset = wavePattern[(i + moduleIndex * 3) % wavePattern.length]
    return {
      x: centerX + offset,
      y: 40 + i * nodeSpacing,
    }
  })

  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midY = (prev.y + curr.y) / 2
    pathD += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
  }

  const totalHeight = 40 + (lessons.length - 1) * nodeSpacing + 40

  return (
    <>
      {/* Mobile: vertical serpentine */}
      <div className="relative md:hidden" style={{ height: totalHeight }}>
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

      {/* Desktop: horizontal path using flexbox for proper centering */}
      <div className="hidden md:flex md:justify-center md:items-center md:py-6">
        <div className="flex items-center gap-4">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="flex items-center">
              <LessonNode lesson={lesson} index={i} />
              {i < lessons.length - 1 && (
                <div className="w-12 lg:w-16 h-[3px] bg-gray-200 rounded-full ml-4" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #E5E7EB 0, #E5E7EB 8px, transparent 8px, transparent 14px)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
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
      className="flex items-center gap-3 mb-1 px-1 md:justify-center"
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
          <span className="inline-flex items-center text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            {mod.difficulty}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {completedCount}/{mod.lessons.length} leçons
        </p>
      </div>
    </motion.div>
  )
}

function PremiumBanner({ compact }: { compact?: boolean } = {}) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`relative overflow-hidden rounded-3xl text-white shadow-xl ${compact ? 'p-4' : 'p-5 my-8 mx-1'}`}
      style={{
        background: 'linear-gradient(135deg, #FF6B00 0%, #E85D00 50%, #D44800 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-2xl bg-white/20 flex items-center justify-center`}>
            <Crown size={compact ? 18 : 22} className="text-white" />
          </div>
          <h3 className={`font-extrabold ${compact ? 'text-base' : 'text-lg'}`}>Kan Sira Premium</h3>
        </div>

        <div className={`space-y-1 ${compact ? 'mb-3' : 'mb-4'} ml-1`}>
          <p className="text-[13px] text-white/80 flex items-center gap-2">
            <Check size={14} strokeWidth={3} /> 100+ leçons interactives
          </p>
          {!compact && (
            <p className="text-[13px] text-white/80 flex items-center gap-2">
              <Check size={14} strokeWidth={3} /> 10 modules complets
            </p>
          )}
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
      className="flex items-center justify-center md:justify-start gap-3 mb-5 md:mb-0"
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

function LanguageSwitcher() {
  const { activeLanguage, setActiveLanguage } = useLanguage()

  const languages = [
    { code: 'bm' as const, label: 'Bambara', flag: '🇲🇱' },
    { code: 'snk' as const, label: 'Soninké', flag: '🇲🇱' },
  ]

  return (
    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
      {languages.map((lang) => {
        const isActive = activeLanguage === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => setActiveLanguage(lang.code)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200
              ${isActive
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xs">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ModuleCarousel({ modules, onShowAll }: { modules: ModuleData[]; onShowAll: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  // Reset to first slide when modules change (language switch)
  useEffect(() => {
    setActiveIndex(0)
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [modules.map((m) => m.id).join()])

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const child = container.children[index] as HTMLElement | undefined
    if (!child) return
    isScrolling.current = true
    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setActiveIndex(index)
    setTimeout(() => { isScrolling.current = false }, 400)
  }, [])

  // Sync active index on scroll (snap detection)
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    let timer: ReturnType<typeof setTimeout>
    const handleScroll = () => {
      if (isScrolling.current) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        const scrollLeft = container.scrollLeft
        const width = container.clientWidth
        const newIndex = Math.round(scrollLeft / width)
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < modules.length) {
          setActiveIndex(newIndex)
        }
      }, 60)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [activeIndex, modules.length])

  const goTo = (index: number) => {
    if (index >= 0 && index < modules.length) scrollToIndex(index)
  }

  // Show max 3 tabs, then "all" button
  const visibleTabs = modules.slice(0, 3)

  return (
    <div className="relative">
      {/* Module tab bar + "Tous" button */}
      <div className="flex items-center gap-2 mb-4 px-1 overflow-x-auto scrollbar-hide md:justify-center">
        {visibleTabs.map((mod, i) => {
          const isActive = i === activeIndex
          return (
            <motion.button
              key={mod.id}
              onClick={() => goTo(i)}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }
                ${!mod.isFree && !isActive ? 'opacity-60' : ''}
              `}
            >
              <span className="text-base">{mod.icon}</span>
              {mod.title}
              {!mod.isFree && <Crown size={12} className={isActive ? 'text-white/80' : 'text-amber-500'} />}
            </motion.button>
          )
        })}
        {/* "Voir tout" button always visible */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onShowAll}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
        >
          <Grid3X3 size={14} />
          Tout voir
        </motion.button>
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Left/right arrows on desktop */}
        {activeIndex > 0 && (
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        )}
        {activeIndex < modules.length - 1 && (
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        )}

        {/* Scrollable slides */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-1"
        >
          {modules.map((mod, mi) => (
            <div
              key={mod.id}
              className="w-full shrink-0 snap-center px-1"
            >
              <div className={!mod.isFree ? 'opacity-70' : ''}>
                <ModuleHeader module={mod} index={mi} />
                <SerpentinePath lessons={mod.lessons} moduleIndex={mi} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-2 mb-2">
        {modules.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`
              rounded-full transition-all duration-300 cursor-pointer
              ${i === activeIndex ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default function LearningPath() {
  const { profile } = useAuth()
  const { activeLanguage } = useLanguage()
  const navigate = useNavigate()
  const firstName = profile?.display_name?.split(' ')[0] || 'Apprenant'

  // Filter modules by active language
  const modules = allModules.filter((m) => m.lang === activeLanguage)

  return (
    <div className="max-w-md mx-auto pb-28 md:max-w-none md:pb-8">
      {/* Desktop top bar: welcome + language switcher + stats */}
      <div className="hidden md:flex items-center justify-between gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
          >
            <Mascot size={64} expression="waving" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#131516]">
              Bonjour {firstName} !
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Prêt pour votre leçon ?
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <StatsPills />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile: welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden flex items-center gap-4 mb-4 px-1"
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
            Prêt pour votre leçon ?
          </motion.p>
        </div>
      </motion.div>

      {/* Mobile: language switcher */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="md:hidden flex justify-center mb-4"
      >
        <LanguageSwitcher />
      </motion.div>

      {/* Mobile: stats pills */}
      <div className="md:hidden">
        <StatsPills />
      </div>

      {/* Desktop: Daily goal + Premium banner side by side */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyGoal current={0} goal={20} />
        </motion.div>
        <PremiumBanner compact />
      </div>

      {/* Mobile: Daily goal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:hidden mb-7 px-1"
      >
        <DailyGoal current={0} goal={20} />
      </motion.div>

      {/* Module carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLanguage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <ModuleCarousel
            modules={modules}
            onShowAll={() => navigate('/app/themes')}
            key={activeLanguage}
          />
        </motion.div>
      </AnimatePresence>

      {/* Mobile: Premium banner */}
      <div className="md:hidden">
        <PremiumBanner />
      </div>

    </div>
  )
}
