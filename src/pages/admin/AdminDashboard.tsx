import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Users, Activity, BookCheck, Percent, BookOpen, GraduationCap, BookMarked, TrendingUp, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: 'Utilisateurs', value: '1 234', change: '+12%', icon: Users, color: '#FF6B00', bg: 'from-orange-500 to-amber-400' },
  { label: 'Actifs 7j', value: '456', change: '+8%', icon: Activity, color: '#2D9F4F', bg: 'from-emerald-500 to-green-400' },
  { label: 'Leçons complétées', value: '8 901', change: '+23%', icon: BookCheck, color: '#3B82F6', bg: 'from-blue-500 to-cyan-400' },
  { label: 'Taux complétion', value: '67%', change: '+5%', icon: Percent, color: '#8B5CF6', bg: 'from-violet-500 to-purple-400' },
]

const monthlySignups = [
  { month: 'Sep', value: 65 },
  { month: 'Oct', value: 80 },
  { month: 'Nov', value: 72 },
  { month: 'Déc', value: 90 },
  { month: 'Jan', value: 110 },
  { month: 'Fév', value: 95 },
  { month: 'Mar', value: 130 },
]

const maxSignup = Math.max(...monthlySignups.map((m) => m.value))

const quickActions = [
  { label: 'Gérer les modules', icon: BookOpen, to: '/admin/modules', color: '#FF6B00' },
  { label: 'Gérer les leçons', icon: GraduationCap, to: '/admin/lessons', color: '#2D9F4F' },
  { label: 'Gérer les histoires', icon: BookMarked, to: '/admin/stories', color: '#3B82F6' },
  { label: 'Voir les utilisateurs', icon: Users, to: '/admin/users', color: '#8B5CF6' },
]

const recentActivity = [
  { text: 'Nouveau module "Les Couleurs" créé', time: 'Il y a 2h', color: '#FF6B00' },
  { text: '15 nouveaux utilisateurs inscrits', time: 'Il y a 5h', color: '#2D9F4F' },
  { text: 'Histoire "Moussa au marché" publiée', time: 'Hier', color: '#3B82F6' },
  { text: 'Module "Salutations" mis à jour', time: 'Hier', color: '#8B5CF6' },
  { text: '42 leçons complétées aujourd\'hui', time: 'Aujourd\'hui', color: '#F59E0B' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#131516]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de Kan Sira</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${stat.bg}`}
          >
            {/* Decorative circle */}
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-white/70 mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#131516]">Inscriptions par mois</h2>
              <p className="text-xs text-gray-400 mt-0.5">7 derniers mois</p>
            </div>
            <span className="text-sm font-bold text-[#FF6B00]">+34% ce mois</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthlySignups.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">{m.value}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.value / maxSignup) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 * i }}
                  className="w-full rounded-lg"
                  style={{
                    background: i === monthlySignups.length - 1
                      ? 'linear-gradient(180deg, #FF6B00, #F59E0B)'
                      : 'linear-gradient(180deg, #FF6B0040, #FF6B0015)',
                  }}
                />
                <span className="text-xs text-gray-500 font-medium">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-base font-semibold text-[#131516] mb-4">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#131516] leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-base font-semibold text-[#131516] mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.to)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer text-left"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium text-[#131516] flex-1">{action.label}</span>
              <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
