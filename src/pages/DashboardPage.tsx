import { motion } from 'framer-motion'
import LearningPath from '../components/app/LearningPath'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { languageLabel } = useLanguage()
  const { profile } = useAuth()
  const firstName = profile?.display_name?.split(' ')[0] || 'Apprenant'

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-dark">
          Bonjour {firstName} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Apprendre le {languageLabel} pas à pas
        </p>
      </motion.div>
      <LearningPath />
    </div>
  )
}
