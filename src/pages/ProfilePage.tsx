import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, BookOpen, Star, TrendingUp } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

const mockStats = {
  totalXP: 0,
  level: 1,
  streak: 0,
  lessonsCompleted: 0,
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function StatCard({
  icon: Icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  bgColor: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`${bgColor} rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[100px] shadow-sm`}
    >
      <Icon size={22} className="text-white/90 mb-1.5" />
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[11px] font-medium text-white/70 mt-0.5">{label}</p>
    </motion.div>
  )
}

export default function ProfilePage() {
  const { languageLabel, activeLanguage } = useLanguage()
  const { profile } = useAuth()
  const displayName = profile?.display_name || 'Utilisateur'
  const email = profile?.id
    ? `${displayName.toLowerCase().replace(' ', '.')}@email.com`
    : 'email@example.com'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const langEmoji = activeLanguage === 'bm' ? '🇲🇱' : '🇲🇱'

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#131516]">Profil</h1>
      </motion.div>

      {/* Avatar + info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center mb-8"
      >
        {/* Avatar with gradient border */}
        <div className="rounded-full p-[3px] bg-gradient-to-br from-[#FF6B00] via-[#F4A100] to-[#2D9F4F] mb-4">
          <div className="w-20 h-20 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-2xl font-extrabold ring-4 ring-white">
            {initials}
          </div>
        </div>

        <h2 className="font-bold text-xl text-[#131516]">{displayName}</h2>
        <p className="text-sm text-[#131516]/50 mt-0.5">{email}</p>

        {/* Language pill */}
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2D9F4F]/10 px-4 py-1.5 text-sm font-semibold text-[#2D9F4F]"
        >
          {langEmoji} {languageLabel}
        </motion.span>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3 mb-8"
      >
        <StatCard
          icon={Star}
          label="XP total"
          value={mockStats.totalXP.toLocaleString()}
          bgColor="bg-[#FF6B00]"

        />
        <StatCard
          icon={TrendingUp}
          label="Niveau"
          value={mockStats.level}
          bgColor="bg-[#2D9F4F]"

        />
        <StatCard
          icon={Flame}
          label="Série (jours)"
          value={mockStats.streak}
          bgColor="bg-[#F4A100]"

        />
        <StatCard
          icon={BookOpen}
          label="Leçons terminées"
          value={mockStats.lessonsCompleted}
          bgColor="bg-[#131516]"

        />
      </motion.div>

      {/* Edit button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => alert('Fonctionnalité bientôt disponible ! (démo)')}
        className="w-full h-14 bg-[#FF6B00] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FF6B00]/25 active:bg-[#e55f00] transition-colors"
      >
        Modifier le profil
      </motion.button>

      {/* Admin link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <Link
          to="/admin"
          className="text-sm font-medium text-[#131516]/40 transition-colors active:text-[#131516]/60"
        >
          Panneau admin &rarr;
        </Link>
      </motion.div>
    </div>
  )
}
