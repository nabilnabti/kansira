import { motion } from 'framer-motion'
import { Flame, BookOpen, Star, TrendingUp, Edit2 } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

// Fresh user stats
const mockStats = {
  totalXP: 0,
  level: 1,
  streak: 0,
  lessonsCompleted: 0,
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
    >
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-lg font-bold text-dark">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </motion.div>
  )
}

export default function ProfilePage() {
  const { languageLabel } = useLanguage()
  const { profile } = useAuth()
  const displayName = profile?.display_name || 'Utilisateur'
  const email = profile?.id ? `${displayName.toLowerCase().replace(' ', '.')}@email.com` : 'email@example.com'
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-dark">Profil</h1>
      </motion.div>

      {/* Avatar + info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-dark truncate">{displayName}</h2>
            <p className="text-sm text-gray-500 truncate">{email}</p>
            <p className="text-xs text-primary font-medium mt-1">
              {languageLabel}
            </p>
          </div>
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
            <Edit2 size={18} />
          </button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Star}
          label="XP total"
          value={mockStats.totalXP.toLocaleString()}
          color="bg-primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Niveau"
          value={mockStats.level}
          color="bg-secondary"
        />
        <StatCard
          icon={Flame}
          label="Serie"
          value={`${mockStats.streak} jours`}
          color="bg-gold"
        />
        <StatCard
          icon={BookOpen}
          label="Lecons terminees"
          value={mockStats.lessonsCompleted}
          color="bg-dark"
        />
      </div>

      {/* Edit button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => alert('Fonctionnalité bientôt disponible ! (démo)')}
        className="mt-6 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
      >
        Modifier le profil
      </motion.button>

    </div>
  )
}
