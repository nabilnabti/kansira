import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Globe, Volume2, Bell, LogOut, Settings, Flame, BookOpen, Star, TrendingUp } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { resetOnboarding } from './OnboardingPage'

const goalOptions = [10, 20, 30, 50]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${
        enabled ? 'bg-[#2D9F4F]' : 'bg-[#131516]/15'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm ${
          enabled ? 'left-[30px]' : 'left-1'
        }`}
      />
    </button>
  )
}

const mockStats = {
  totalXP: 0,
  level: 1,
  streak: 0,
  lessonsCompleted: 0,
}

function MiniStat({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string | number; label: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-3 flex flex-col items-center justify-center text-center`}>
      <Icon size={16} className="text-white/90 mb-1" />
      <p className="text-lg font-extrabold text-white">{value}</p>
      <p className="text-[10px] font-medium text-white/70">{label}</p>
    </div>
  )
}

export default function SettingsPage() {
  const { activeLanguage, setActiveLanguage, languageLabel } = useLanguage()
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const [dailyGoal, setDailyGoal] = useState(20)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const displayName = profile?.display_name || 'Utilisateur'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-lg mx-auto pb-28 md:max-w-2xl md:pb-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <Settings size={24} className="text-[#FF6B00]" />
        <h1 className="text-2xl font-bold text-[#131516]">Paramètres</h1>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Profile card — visible on mobile, hidden on desktop (has its own page) */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#131516]/5 md:hidden"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="rounded-full p-[2px] bg-gradient-to-br from-[#FF6B00] via-[#F4A100] to-[#2D9F4F]">
              <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-lg font-extrabold ring-2 ring-white">
                {initials}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-[#131516] truncate">{displayName}</h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D9F4F] bg-[#2D9F4F]/10 px-2.5 py-0.5 rounded-full mt-1">
                🇲🇱 {languageLabel}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <MiniStat icon={Star} value={mockStats.totalXP} label="XP" color="bg-[#FF6B00]" />
            <MiniStat icon={TrendingUp} value={mockStats.level} label="Niveau" color="bg-[#2D9F4F]" />
            <MiniStat icon={Flame} value={mockStats.streak} label="Série" color="bg-[#F4A100]" />
            <MiniStat icon={BookOpen} value={mockStats.lessonsCompleted} label="Leçons" color="bg-[#131516]" />
          </div>
        </motion.div>
        {/* Daily goal */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#131516]/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <Target size={18} className="text-[#FF6B00]" />
            </div>
            <h2 className="font-semibold text-[#131516] text-sm">Objectif quotidien</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {goalOptions.map((g) => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDailyGoal(g)}
                className={`py-3 rounded-2xl text-sm font-bold transition-all ${
                  dailyGoal === g
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20'
                    : 'bg-[#FFF3E0]/60 text-[#131516]/60 active:bg-[#FFF3E0]'
                }`}
              >
                {g} XP
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#131516]/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#2D9F4F]/10 flex items-center justify-center">
              <Globe size={18} className="text-[#2D9F4F]" />
            </div>
            <h2 className="font-semibold text-[#131516] text-sm">Langue d'apprentissage</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['bm', 'snk'] as const).map((code) => (
              <motion.button
                key={code}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveLanguage(code)}
                className={`py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeLanguage === code
                    ? 'bg-[#2D9F4F] text-white shadow-md shadow-[#2D9F4F]/20'
                    : 'bg-[#FFF3E0]/60 text-[#131516]/60 active:bg-[#FFF3E0]'
                }`}
              >
                {code === 'bm' ? '🇲🇱 Bambara' : '🇲🇱 Soninké'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Sound */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#131516]/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F4A100]/10 flex items-center justify-center">
                <Volume2 size={18} className="text-[#F4A100]" />
              </div>
              <h2 className="font-semibold text-[#131516] text-sm">Sons</h2>
            </div>
            <Toggle enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#131516]/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#131516]/8 flex items-center justify-center">
                <Bell size={18} className="text-[#131516]/60" />
              </div>
              <h2 className="font-semibold text-[#131516] text-sm">Notifications</h2>
            </div>
            <Toggle
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={fadeUp} className="pt-4 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              resetOnboarding()
              await signOut()
              navigate('/')
            }}
            className="w-full flex items-center justify-center gap-2.5 h-14 bg-[#E63946]/10 rounded-2xl text-[#E63946] font-bold text-sm active:bg-[#E63946]/15 transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </motion.button>

          <div className="text-center">
            <Link
              to="/app/admin"
              className="text-xs font-medium text-[#131516]/30 transition-colors active:text-[#131516]/50"
            >
              Panneau admin
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
