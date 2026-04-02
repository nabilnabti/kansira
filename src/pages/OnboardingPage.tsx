import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Mascot } from '../components/ui/Mascot'

const ONBOARDING_KEY = 'kansira_onboarding_done'

interface Slide {
  mascotExpression: 'happy' | 'excited' | 'thinking' | 'waving'
  emoji: string
  title: string
  description: string
  bgGradient: string
  accentColor: string
}

const slides: Slide[] = [
  {
    mascotExpression: 'waving',
    emoji: '👋',
    title: 'Bienvenue sur Kan Sira !',
    description:
      'Apprenez le Bambara et le Soninké de manière ludique. Des mini-leçons de 5 minutes, parfaites pour votre quotidien.',
    bgGradient: 'from-[#FFF3E0] to-[#FFE0B2]',
    accentColor: '#FF6B00',
  },
  {
    mascotExpression: 'excited',
    emoji: '🎮',
    title: 'Apprenez en jouant',
    description:
      '6 types d\'exercices variés : QCM, traduction, association, remise en ordre... Chaque leçon est une petite aventure !',
    bgGradient: 'from-[#E8F5E9] to-[#C8E6C9]',
    accentColor: '#2D9F4F',
  },
  {
    mascotExpression: 'happy',
    emoji: '🔥',
    title: 'Gagnez des XP et des badges',
    description:
      'Maintenez votre série quotidienne, montez de niveau et collectionnez des badges. Votre progression est récompensée !',
    bgGradient: 'from-[#FFF8E1] to-[#FFECB3]',
    accentColor: '#F4A100',
  },
  {
    mascotExpression: 'excited',
    emoji: '🚀',
    title: 'Prêt à commencer ?',
    description:
      'Créez votre compte gratuitement et commencez votre première leçon de Bambara dès maintenant !',
    bgGradient: 'from-[#FFF3E0] to-[#FFCCBC]',
    accentColor: '#FF6B00',
  },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
}

export function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true')
  } catch { /* noop */ }
}

export function isOnboardingDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  } catch {
    return false
  }
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const slide = slides[current]
  const isLast = current === slides.length - 1

  const goNext = useCallback(() => {
    if (isLast) {
      markOnboardingDone()
      navigate('/signup')
    } else {
      setDirection(1)
      setCurrent((c) => c + 1)
    }
  }, [isLast, navigate])

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((c) => c - 1)
    }
  }, [current])

  const skip = useCallback(() => {
    markOnboardingDone()
    navigate('/signup')
  }, [navigate])

  const goLogin = useCallback(() => {
    markOnboardingDone()
    navigate('/login')
  }, [navigate])

  return (
    <div className={`fixed inset-0 bg-gradient-to-b ${slide.bgGradient} flex flex-col`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+12px)] pb-2">
        {current > 0 ? (
          <button
            onClick={goPrev}
            className="flex items-center gap-1 text-sm font-medium text-dark/50 active:text-dark/80"
          >
            <ChevronLeft size={18} />
            Retour
          </button>
        ) : (
          <div />
        )}
        {!isLast && (
          <button
            onClick={skip}
            className="text-sm font-semibold text-dark/40 active:text-dark/60"
          >
            Passer
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            {/* Mascot + emoji */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 18 }}
              className="relative mb-8"
            >
              <Mascot size={120} expression={slide.mascotExpression} />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 500 }}
                className="absolute -top-2 -right-2 text-4xl"
              >
                {slide.emoji}
              </motion.span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-extrabold text-dark mb-3 font-heading"
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base text-dark/60 leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+20px)]">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? slide.accentColor : '#D1D5DB',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* CTA button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goNext}
          className="w-full h-14 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          style={{
            backgroundColor: slide.accentColor,
            boxShadow: `0 8px 24px ${slide.accentColor}40`,
          }}
        >
          {isLast ? (
            "Créer mon compte"
          ) : (
            <>
              Suivant
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>

        {/* Login link on last slide */}
        {isLast && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={goLogin}
            className="w-full mt-3 h-12 rounded-2xl font-semibold text-dark/50 text-sm flex items-center justify-center cursor-pointer active:bg-dark/5"
          >
            J'ai déjà un compte
          </motion.button>
        )}
      </div>
    </div>
  )
}
