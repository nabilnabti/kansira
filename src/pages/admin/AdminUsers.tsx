import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star, Flame, Calendar, Mail, Shield, Crown, BookOpen, TrendingUp } from 'lucide-react'

interface MockUser {
  id: string
  display_name: string
  email: string
  is_premium: boolean
  is_admin: boolean
  total_xp: number
  level: number
  current_streak: number
  longest_streak: number
  created_at: string
  last_active: string
  lessons_completed: number
  preferred_lang: string
  progress: { module: string; lessons_completed: number; total_lessons: number }[]
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'u1', display_name: 'Amadou Diallo', email: 'amadou@example.com',
    is_premium: true, is_admin: true, total_xp: 4520, level: 8, current_streak: 12, longest_streak: 30,
    created_at: '2025-03-15', last_active: '2026-04-03', lessons_completed: 42, preferred_lang: 'Bambara',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 3, total_lessons: 4 },
      { module: 'Le marché', lessons_completed: 4, total_lessons: 6 },
    ],
  },
  {
    id: 'u2', display_name: 'Fatoumata Traoré', email: 'fatou@example.com',
    is_premium: true, is_admin: false, total_xp: 3210, level: 6, current_streak: 7, longest_streak: 14,
    created_at: '2025-04-20', last_active: '2026-04-02', lessons_completed: 28, preferred_lang: 'Bambara',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 2, total_lessons: 4 },
    ],
  },
  {
    id: 'u3', display_name: 'Moussa Konaté', email: 'moussa@example.com',
    is_premium: false, is_admin: false, total_xp: 1850, level: 4, current_streak: 3, longest_streak: 10,
    created_at: '2025-06-10', last_active: '2026-04-01', lessons_completed: 15, preferred_lang: 'Bambara',
    progress: [{ module: 'Salutations', lessons_completed: 4, total_lessons: 5 }],
  },
  {
    id: 'u4', display_name: 'Aïssata Coulibaly', email: 'aissata@example.com',
    is_premium: false, is_admin: false, total_xp: 920, level: 2, current_streak: 0, longest_streak: 5,
    created_at: '2025-08-01', last_active: '2026-03-20', lessons_completed: 8, preferred_lang: 'Soninké',
    progress: [{ module: 'Salutations', lessons_completed: 2, total_lessons: 5 }],
  },
  {
    id: 'u5', display_name: 'Ibrahim Sangaré', email: 'ibrahim@example.com',
    is_premium: true, is_admin: false, total_xp: 5670, level: 10, current_streak: 21, longest_streak: 45,
    created_at: '2025-02-28', last_active: '2026-04-03', lessons_completed: 56, preferred_lang: 'Bambara',
    progress: [
      { module: 'Salutations', lessons_completed: 5, total_lessons: 5 },
      { module: 'La famille', lessons_completed: 4, total_lessons: 4 },
      { module: 'Le marché', lessons_completed: 2, total_lessons: 6 },
    ],
  },
  {
    id: 'u6', display_name: 'Mariam Keïta', email: 'mariam@example.com',
    is_premium: false, is_admin: false, total_xp: 450, level: 1, current_streak: 1, longest_streak: 3,
    created_at: '2025-11-15', last_active: '2026-03-28', lessons_completed: 3, preferred_lang: 'Soninké',
    progress: [{ module: 'Salutations (Soninké)', lessons_completed: 1, total_lessons: 5 }],
  },
]

function Toggle({ enabled, onChange, color = '#FF6B00' }: { enabled: boolean; onChange: () => void; color?: string }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${enabled ? '' : 'bg-gray-200'}`}
      style={enabled ? { backgroundColor: color } : undefined}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
    </button>
  )
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)

  const filtered = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleField = (userId: string, field: 'is_premium' | 'is_admin') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, [field]: !u[field] } : u)))
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, [field]: !prev[field] } : null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131516]">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} utilisateurs inscrits</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] bg-white"
        />
      </div>

      {/* User list as cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u, i) => {
          const initials = u.display_name.split(' ').map((w) => w[0]).join('').toUpperCase()
          return (
            <motion.button
              key={u.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedUser(u)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#131516] text-sm truncate">{u.display_name}</h3>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {u.is_premium && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                    <Crown size={10} /> Premium
                  </span>
                )}
                {u.is_admin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                    <Shield size={10} /> Admin
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-500">
                  <Star size={10} /> {u.total_xp.toLocaleString()} XP
                </span>
                {u.current_streak > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-50 text-orange-600">
                    <Flame size={10} /> {u.current_streak}j
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">{u.lessons_completed} leçons</span>
                <span className="text-xs text-gray-400">Niv. {u.level}</span>
                <span className="text-xs text-gray-400">{u.preferred_lang}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* User detail slide panel */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-[#131516]">Détail utilisateur</h2>
                <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar + name */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xl font-bold mb-3">
                    {selectedUser.display_name.split(' ').map((w) => w[0]).join('').toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-[#131516]">{selectedUser.display_name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1"><Mail size={13} /> {selectedUser.email}</p>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {selectedUser.is_premium && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                      <Crown size={12} /> Premium
                    </span>
                  )}
                  {selectedUser.is_admin && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                      <Shield size={12} /> Admin
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                    {selectedUser.preferred_lang}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Star size={18} className="text-[#FF6B00] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#131516]">{selectedUser.total_xp.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">XP Total</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <TrendingUp size={18} className="text-[#2D9F4F] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#131516]">{selectedUser.level}</p>
                    <p className="text-xs text-gray-500">Niveau</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <Flame size={18} className="text-[#E63946] mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#131516]">{selectedUser.current_streak}j</p>
                    <p className="text-xs text-gray-500">Série actuelle</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <BookOpen size={18} className="text-blue-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-[#131516]">{selectedUser.lessons_completed}</p>
                    <p className="text-xs text-gray-500">Leçons terminées</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12} /> Inscrit le</span>
                    <span className="text-xs font-medium text-[#131516]">{formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5"><Calendar size={12} /> Dernière activité</span>
                    <span className="text-xs font-medium text-[#131516]">{formatDate(selectedUser.last_active)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5"><Flame size={12} /> Record série</span>
                    <span className="text-xs font-medium text-[#131516]">{selectedUser.longest_streak} jours</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#131516]">Permissions</h4>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <Crown size={16} className="text-amber-500" />
                      <span className="text-sm text-[#131516]">Premium</span>
                    </div>
                    <Toggle enabled={selectedUser.is_premium} onChange={() => toggleField(selectedUser.id, 'is_premium')} color="#FF6B00" />
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-blue-500" />
                      <span className="text-sm text-[#131516]">Administrateur</span>
                    </div>
                    <Toggle enabled={selectedUser.is_admin} onChange={() => toggleField(selectedUser.id, 'is_admin')} color="#2D9F4F" />
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#131516]">Progression par module</h4>
                  {selectedUser.progress.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune progression</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedUser.progress.map((p) => {
                        const pct = Math.round((p.lessons_completed / p.total_lessons) * 100)
                        return (
                          <div key={p.module} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-[#131516]">{p.module}</span>
                              <span className="text-xs font-semibold text-gray-500">{p.lessons_completed}/{p.total_lessons}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="h-full rounded-full"
                                style={{ background: pct === 100 ? '#2D9F4F' : '#FF6B00' }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{pct}% complété</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
