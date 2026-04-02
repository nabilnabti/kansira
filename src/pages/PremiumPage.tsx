import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Check, Zap, BookOpen, Headphones, Shield } from 'lucide-react'

const features = [
  { icon: BookOpen, label: 'Tous les modules et lecons', free: false, premium: true },
  { icon: Headphones, label: 'Audio par des natifs', free: false, premium: true },
  { icon: Zap, label: 'Exercices illimites', free: false, premium: true },
  { icon: Shield, label: 'Mode hors-ligne', free: false, premium: true },
  { icon: BookOpen, label: '2 modules gratuits', free: true, premium: true },
  { icon: Zap, label: '5 exercices par jour', free: true, premium: false },
]

const benefits = [
  { icon: '\uD83C\uDF1F', text: 'Acces a toutes les langues et tous les modules' },
  { icon: '\uD83C\uDFA7', text: 'Audio enregistre par des locuteurs natifs' },
  { icon: '\uD83D\uDCF1', text: 'Telechargez les lecons pour apprendre hors-ligne' },
  { icon: '\uD83C\uDFC6', text: 'Badges et defis exclusifs' },
]

export default function PremiumPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-gold rounded-3xl p-8 text-white text-center mb-8 shadow-xl"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Crown size={48} className="mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Kan Sira Premium</h1>
        <p className="text-sm opacity-90 leading-relaxed">
          Debloquez l'experience complete et maitrisez les langues africaines sans limites.
        </p>
      </motion.div>

      {/* Benefits */}
      <div className="space-y-3 mb-8">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <span className="text-2xl">{b.icon}</span>
            <p className="text-sm font-medium text-dark">{b.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Pricing card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-primary mb-8"
      >
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Premium</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-dark">4,99</span>
            <span className="text-lg text-gray-500">EUR/mois</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Annulez a tout moment</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { alert('Premium activé ! (démo)'); navigate('/app') }}
          className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-base shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
        >
          Commencer l'essai gratuit
        </motion.button>
        <p className="text-[10px] text-gray-400 text-center mt-2">7 jours d'essai gratuit</p>
      </motion.div>

      {/* Feature comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500">Fonctionnalite</span>
          <span className="text-xs font-semibold text-gray-500 text-center">Gratuit</span>
          <span className="text-xs font-semibold text-primary text-center">Premium</span>
        </div>
        {features.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center px-4 py-3 border-b border-gray-50 last:border-0"
          >
            <span className="text-xs text-dark">{f.label}</span>
            <div className="flex justify-center">
              {f.free ? (
                <Check size={16} className="text-secondary" />
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </div>
            <div className="flex justify-center">
              {f.premium ? (
                <Check size={16} className="text-primary" />
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
