import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Check, Zap, BookOpen, Headphones, Shield, Sparkles } from 'lucide-react'
import { Mascot } from '../components/ui/Mascot'

const features = [
  { icon: BookOpen, label: 'Tous les modules et leçons', free: false, premium: true },
  { icon: Headphones, label: 'Audio par des natifs', free: false, premium: true },
  { icon: Zap, label: 'Exercices illimités', free: false, premium: true },
  { icon: Shield, label: 'Mode hors-ligne', free: false, premium: true },
  { icon: BookOpen, label: '2 modules gratuits', free: true, premium: true },
  { icon: Zap, label: '5 exercices par jour', free: true, premium: false },
]

const benefits = [
  { icon: '🌟', text: 'Accès à toutes les langues et tous les modules' },
  { icon: '🎧', text: 'Audio enregistré par des locuteurs natifs' },
  { icon: '📱', text: 'Téléchargez les leçons pour apprendre hors-ligne' },
  { icon: '🏆', text: 'Badges et défis exclusifs' },
  { icon: '🚀', text: 'Progressez 3x plus vite' },
]

export default function PremiumPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8 px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#FF6B00] via-[#F4A100] to-[#FF6B00] rounded-3xl p-8 text-white text-center mb-8 shadow-xl"
      >
        {/* Sparkle decorations */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-8 -right-8 opacity-10"
        >
          <Sparkles size={120} />
        </motion.div>

        {/* Mascot with crown */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
          className="relative inline-block mb-4"
        >
          <Mascot size={90} expression="excited" />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <Crown size={28} className="text-yellow-200 drop-shadow-lg" fill="currentColor" />
          </motion.div>
        </motion.div>

        <h1
          className="text-2xl font-extrabold mb-2"
          style={{
            background: 'linear-gradient(to right, #fff, #FFE0B2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Kan Sira Premium
        </h1>
        <p className="text-sm opacity-90 leading-relaxed max-w-[280px] mx-auto">
          Débloquez l'expérience complète et maîtrisez les langues africaines sans limites.
        </p>
      </motion.div>

      {/* Benefits */}
      <div className="space-y-3 mb-8">
        {benefits.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="flex items-center gap-3.5 bg-white rounded-2xl p-4 shadow-sm border border-[#131516]/5"
          >
            <span className="text-2xl shrink-0">{b.icon}</span>
            <p className="text-sm font-medium text-[#131516]">{b.text}</p>
            <Check size={18} className="text-[#2D9F4F] ml-auto shrink-0" />
          </motion.div>
        ))}
      </div>

      {/* Pricing card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#FF6B00] mb-8 relative overflow-hidden"
      >
        {/* Free trial badge */}
        <div className="absolute top-0 right-0 bg-[#2D9F4F] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl">
          7 jours gratuits
        </div>

        <div className="text-center mb-6 pt-2">
          <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">
            Premium
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-extrabold text-[#131516]">4,99</span>
            <span className="text-lg font-medium text-[#131516]/40">€/mois</span>
          </div>
          <p className="text-xs text-[#131516]/40 mt-1.5">Annulez à tout moment</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            alert('Premium activé ! (démo)')
            navigate('/app')
          }}
          className="w-full h-14 bg-[#FF6B00] text-white font-bold text-base rounded-2xl shadow-lg shadow-[#FF6B00]/30 active:bg-[#e55f00] transition-colors"
        >
          Commencer l'essai gratuit
        </motion.button>
      </motion.div>

      {/* Feature comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#131516]/5"
      >
        <div className="grid grid-cols-3 bg-[#FFF3E0]/50 px-4 py-3.5 border-b border-[#131516]/5">
          <span className="text-xs font-bold text-[#131516]/50">Fonctionnalité</span>
          <span className="text-xs font-bold text-[#131516]/50 text-center">Gratuit</span>
          <span className="text-xs font-bold text-[#FF6B00] text-center">Premium</span>
        </div>
        {features.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center px-4 py-3.5 border-b border-[#131516]/5 last:border-0"
          >
            <span className="text-xs font-medium text-[#131516]">{f.label}</span>
            <div className="flex justify-center">
              {f.free ? (
                <Check size={16} className="text-[#2D9F4F]" />
              ) : (
                <span className="text-[#131516]/15 text-sm">—</span>
              )}
            </div>
            <div className="flex justify-center">
              {f.premium ? (
                <Check size={16} className="text-[#FF6B00]" />
              ) : (
                <span className="text-[#131516]/15 text-sm">—</span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
