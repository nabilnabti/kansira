import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Globe, Volume2, LogOut } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

const goalOptions = [10, 20, 30, 50]

export default function SettingsPage() {
  const { activeLanguage, setActiveLanguage } = useLanguage()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [dailyGoal, setDailyGoal] = useState(20)
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-dark">Parametres</h1>
      </motion.div>

      <div className="space-y-4">
        {/* Daily goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target size={20} className="text-primary" />
            <h2 className="font-semibold text-dark text-sm">Objectif quotidien</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {goalOptions.map((g) => (
              <button
                key={g}
                onClick={() => setDailyGoal(g)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  dailyGoal === g
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {g} XP
              </button>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-primary" />
            <h2 className="font-semibold text-dark text-sm">Langue d'apprentissage</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['bm', 'snk'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setActiveLanguage(code)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeLanguage === code
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {code === 'bm' ? 'Bambara' : 'Soninke'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sound */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-primary" />
              <h2 className="font-semibold text-dark text-sm">Sons</h2>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                soundEnabled ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  soundEnabled ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={async () => { await signOut(); navigate('/') }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-accent font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Se deconnecter
        </motion.button>
      </div>
    </div>
  )
}
