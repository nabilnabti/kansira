import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Mascot } from '../components/ui/Mascot'
import type { AgeGroup, LearningGoal, InitialLevel } from '../types/database'

const TOTAL_STEPS = 7

const mascotExpressions: Record<number, 'waving' | 'thinking' | 'excited'> = {
  1: 'waving',
  2: 'thinking',
  3: 'thinking',
  4: 'excited',
  5: 'excited',
  6: 'thinking',
  7: 'excited',
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)

  // Step 1
  const [displayName, setDisplayName] = useState('')
  // Step 2
  const [email, setEmail] = useState('')
  // Step 3
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Step 4
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('')
  // Step 5
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  // Step 6
  const [level, setLevel] = useState<InitialLevel | ''>('')
  // Step 7
  const [goal, setGoal] = useState<LearningGoal | ''>('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return displayName.trim().length > 0
      case 2:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      case 3:
        return password.length >= 6 && password === confirmPassword
      case 4:
        return ageGroup !== ''
      case 5:
        return selectedLanguages.length > 0
      case 6:
        return level !== ''
      case 7:
        return goal !== ''
      default:
        return false
    }
  }

  const goNext = () => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  const handleSubmit = async () => {
    if (step < TOTAL_STEPS) {
      goNext()
      return
    }

    setError('')
    setLoading(true)

    try {
      await signUp(email, password, displayName, {
        age_group: ageGroup as AgeGroup,
        learning_goal: goal as LearningGoal,
        initial_level: level as InitialLevel,
        selected_languages: selectedLanguages,
      })
      navigate('/app')
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  const cardClass = (selected: boolean) =>
    `flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
      selected
        ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-md'
        : 'border-[#131516]/8 bg-white hover:border-[#FF6B00]/40'
    }`

  const inputClass =
    'h-14 w-full rounded-2xl border-2 border-[#131516]/8 bg-white px-4 text-base text-[#131516] placeholder-[#131516]/25 outline-none transition-all focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10'

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFF3E0] px-5 pt-8 pb-10">
      {/* Top bar: back button + progress */}
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-colors active:bg-[#131516]/5"
            >
              <ChevronLeft className="h-5 w-5 text-[#131516]/70" />
            </button>
          ) : (
            <div className="h-10 w-10 shrink-0" />
          )}

          {/* Progress bar */}
          <div className="flex flex-1 gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? 'bg-[#FF6B00]' : 'bg-[#FF6B00]/15'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mascot */}
      <motion.div
        key={`mascot-${step}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="mb-4"
      >
        <Mascot size={90} expression={mascotExpressions[step]} />
      </motion.div>

      {/* Step content */}
      <div className="relative w-full max-w-md flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <div className="rounded-3xl bg-white p-7 shadow-xl shadow-[#FF6B00]/8">
              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-5 rounded-2xl bg-[#E63946]/10 px-4 py-3.5 text-sm font-medium text-[#E63946]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- Step 1: Prénom ---- */}
              {step === 1 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Comment tu t'appelles ?
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Choisis un prénom pour ton aventure
                  </p>
                  <input
                    type="text"
                    autoFocus
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ton prénom"
                    className={inputClass}
                    onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleSubmit()}
                  />
                </div>
              )}

              {/* ---- Step 2: Email ---- */}
              {step === 2 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Ton adresse e-mail
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Pour sécuriser ton compte
                  </p>
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className={inputClass}
                    onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleSubmit()}
                  />
                </div>
              )}

              {/* ---- Step 3: Mot de passe ---- */}
              {step === 3 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Crée ton mot de passe
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Minimum 6 caractères
                  </p>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className={`${inputClass} pr-14`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-1 text-[#131516]/30 transition-colors active:bg-[#131516]/5"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      className={inputClass}
                      onKeyDown={(e) => e.key === 'Enter' && isStepValid() && handleSubmit()}
                    />
                    {password.length > 0 && password.length < 6 && (
                      <p className="text-xs text-[#E63946]">
                        Le mot de passe doit contenir au moins 6 caractères
                      </p>
                    )}
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                      <p className="text-xs text-[#E63946]">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ---- Step 4: Tranche d'âge ---- */}
              {step === 4 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Quel âge as-tu ?
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Pour adapter ton expérience
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { emoji: '👶', label: '3-6 ans', value: 'child' },
                      { emoji: '🧒', label: '7-12 ans', value: 'junior' },
                      { emoji: '🧑', label: '13-17 ans', value: 'teen' },
                      { emoji: '🧑\u200D🦱', label: '18+ ans', value: 'adult' },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setAgeGroup(item.value)}
                        className={cardClass(ageGroup === item.value)}
                      >
                        <span className="text-4xl">{item.emoji}</span>
                        <span className="mt-2 text-sm font-semibold text-[#131516]">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- Step 5: Langues ---- */}
              {step === 5 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Quelle(s) langue(s) ?
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Tu peux en choisir plusieurs
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { emoji: '🇲🇱', label: 'Bambara', value: 'bm' },
                      { emoji: '🇲🇱', label: 'Soninké', value: 'snk' },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => toggleLanguage(item.value)}
                        className={cardClass(selectedLanguages.includes(item.value))}
                      >
                        <span className="text-4xl">{item.emoji}</span>
                        <span className="mt-2 text-sm font-semibold text-[#131516]">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- Step 6: Niveau ---- */}
              {step === 6 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Ton niveau actuel ?
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Pas de souci, on s'adapte !
                  </p>
                  <div className="flex flex-col gap-3">
                    {([
                      { label: 'Débutant complet', value: 'beginner' },
                      { label: "J'ai des bases", value: 'elementary' },
                      { label: 'Intermédiaire', value: 'intermediate' },
                      { label: 'Avancé', value: 'advanced' },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setLevel(item.value)}
                        className={`flex cursor-pointer items-center rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                          level === item.value
                            ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-md'
                            : 'border-[#131516]/8 bg-white hover:border-[#FF6B00]/40'
                        }`}
                      >
                        <span className="text-sm font-semibold text-[#131516]">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- Step 7: Objectif ---- */}
              {step === 7 && (
                <div>
                  <h2 className="mb-1 text-2xl font-extrabold text-[#131516]">
                    Ton objectif ?
                  </h2>
                  <p className="mb-6 text-sm text-[#131516]/50">
                    Qu'est-ce qui te motive ?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { emoji: '🏠', label: 'Parler en famille', value: 'family' },
                      { emoji: '✈️', label: 'Voyager au Mali', value: 'travel' },
                      { emoji: '📚', label: 'Découvrir la culture', value: 'culture' },
                      { emoji: '💼', label: 'Pour le travail', value: 'work' },
                    ] as const).map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setGoal(item.value)}
                        className={cardClass(goal === item.value)}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="mt-2 text-center text-sm font-semibold text-[#131516]">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area */}
      <div className="mt-6 w-full max-w-md">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          disabled={!isStepValid() || loading}
          onClick={handleSubmit}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B00] text-base font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-colors active:bg-[#e55f00] disabled:opacity-40 disabled:shadow-none"
        >
          {loading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-3 border-white/30 border-t-white" />
          ) : step === TOTAL_STEPS ? (
            "Commencer l'aventure !"
          ) : (
            'Continuer'
          )}
        </motion.button>

        <p className="mt-5 text-center text-sm text-[#131516]/50">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-bold text-[#2D9F4F] transition-colors active:text-[#2D9F4F]/70"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
