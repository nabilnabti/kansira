import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Crown, Star } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

type LessonStatus = 'completed' | 'available' | 'locked' | 'premium_locked'

interface LessonData {
  id: string
  title: string
  emoji: string
  status: LessonStatus
}

interface ModuleData {
  id: string
  icon: string
  title: string
  description: string
  isFree: boolean
  lang: 'bm' | 'snk'
  lessons: LessonData[]
}

// Same data as in LearningPath — ideally this would be in a shared file
const allModules: ModuleData[] = [
  { id: 'bm-m1', icon: '👋', title: 'Salutations & Bases', description: 'Les salutations essentielles en Bambara', isFree: true, lang: 'bm', lessons: [
    { id: 'l1', title: 'Dire bonjour', emoji: '👋', status: 'available' }, { id: 'l2', title: 'Se présenter', emoji: '🙋', status: 'locked' }, { id: 'l3', title: 'Comment ça va ?', emoji: '💬', status: 'locked' }, { id: 'l4', title: 'La politesse', emoji: '🙏', status: 'locked' }, { id: 'l5', title: 'Au revoir', emoji: '👋', status: 'locked' },
  ]},
  { id: 'bm-m2', icon: '👨‍👩‍👧‍👦', title: 'La Famille', description: 'Les membres de la famille', isFree: false, lang: 'bm', lessons: [
    { id: 'l6', title: 'Les parents', emoji: '👨‍👩‍👧', status: 'premium_locked' }, { id: 'l7', title: 'Frères et sœurs', emoji: '👫', status: 'premium_locked' }, { id: 'l8', title: 'Les grands-parents', emoji: '👴', status: 'premium_locked' }, { id: 'l9', title: 'Oncles et tantes', emoji: '👨‍👧', status: 'premium_locked' }, { id: 'l10', title: 'Ma famille', emoji: '🏠', status: 'premium_locked' },
  ]},
  { id: 'bm-m3', icon: '🔢', title: 'Les Nombres', description: 'Compter en Bambara', isFree: false, lang: 'bm', lessons: [
    { id: 'l11', title: '1 à 5', emoji: '1️⃣', status: 'premium_locked' }, { id: 'l12', title: '6 à 10', emoji: '🔟', status: 'premium_locked' }, { id: 'l13', title: '11 à 20', emoji: '🔢', status: 'premium_locked' }, { id: 'l14', title: 'Les dizaines', emoji: '💯', status: 'premium_locked' }, { id: 'l15', title: 'Compter', emoji: '🧮', status: 'premium_locked' },
  ]},
  { id: 'bm-m4', icon: '🍎', title: 'Nourriture', description: 'Les aliments et les repas', isFree: false, lang: 'bm', lessons: [
    { id: 'l16', title: 'Les fruits', emoji: '🥭', status: 'premium_locked' }, { id: 'l17', title: 'Les légumes', emoji: '🥬', status: 'premium_locked' }, { id: 'l18', title: 'Les repas', emoji: '🍽️', status: 'premium_locked' }, { id: 'l19', title: 'Au marché', emoji: '🏪', status: 'premium_locked' }, { id: 'l20', title: 'Les boissons', emoji: '🥤', status: 'premium_locked' },
  ]},
  { id: 'bm-m5', icon: '🎨', title: 'Les Couleurs', description: 'Les couleurs en Bambara', isFree: false, lang: 'bm', lessons: [
    { id: 'l21', title: 'Rouge, bleu, jaune', emoji: '🔴', status: 'premium_locked' }, { id: 'l22', title: 'Vert, orange, violet', emoji: '🟢', status: 'premium_locked' }, { id: 'l23', title: 'Noir et blanc', emoji: '⬛', status: 'premium_locked' }, { id: 'l24', title: 'Décrire les couleurs', emoji: '🌈', status: 'premium_locked' },
  ]},
  { id: 'bm-m6', icon: '🏠', title: 'La Maison', description: 'Les pièces et objets de la maison', isFree: false, lang: 'bm', lessons: [
    { id: 'l25', title: 'Les pièces', emoji: '🚪', status: 'premium_locked' }, { id: 'l26', title: 'Les meubles', emoji: '🪑', status: 'premium_locked' }, { id: 'l27', title: 'La cuisine', emoji: '🍳', status: 'premium_locked' }, { id: 'l28', title: 'Le jardin', emoji: '🌿', status: 'premium_locked' },
  ]},
  { id: 'snk-m1', icon: '👋', title: 'Salutations & Bases', description: 'Les salutations essentielles en Soninké', isFree: true, lang: 'snk', lessons: [
    { id: 'sl1', title: 'Dire bonjour', emoji: '👋', status: 'available' }, { id: 'sl2', title: 'Se présenter', emoji: '🙋', status: 'locked' }, { id: 'sl3', title: 'Comment ça va ?', emoji: '💬', status: 'locked' }, { id: 'sl4', title: 'La politesse', emoji: '🙏', status: 'locked' }, { id: 'sl5', title: 'Au revoir', emoji: '👋', status: 'locked' },
  ]},
  { id: 'snk-m2', icon: '👨‍👩‍👧‍👦', title: 'La Famille', description: 'Les membres de la famille en Soninké', isFree: false, lang: 'snk', lessons: [
    { id: 'sl6', title: 'Les parents', emoji: '👨‍👩‍👧', status: 'premium_locked' }, { id: 'sl7', title: 'Frères et sœurs', emoji: '👫', status: 'premium_locked' }, { id: 'sl8', title: 'Les grands-parents', emoji: '👴', status: 'premium_locked' }, { id: 'sl9', title: 'Oncles et tantes', emoji: '👨‍👧', status: 'premium_locked' }, { id: 'sl10', title: 'Ma famille', emoji: '🏠', status: 'premium_locked' },
  ]},
  { id: 'snk-m3', icon: '🔢', title: 'Les Nombres', description: 'Compter en Soninké', isFree: false, lang: 'snk', lessons: [
    { id: 'sl11', title: '1 à 5', emoji: '1️⃣', status: 'premium_locked' }, { id: 'sl12', title: '6 à 10', emoji: '🔟', status: 'premium_locked' }, { id: 'sl13', title: '11 à 20', emoji: '🔢', status: 'premium_locked' }, { id: 'sl14', title: 'Les dizaines', emoji: '💯', status: 'premium_locked' }, { id: 'sl15', title: 'Compter', emoji: '🧮', status: 'premium_locked' },
  ]},
  { id: 'snk-m4', icon: '🍎', title: 'Nourriture', description: 'Les aliments et les repas en Soninké', isFree: false, lang: 'snk', lessons: [
    { id: 'sl16', title: 'Les fruits', emoji: '🥭', status: 'premium_locked' }, { id: 'sl17', title: 'Les légumes', emoji: '🥬', status: 'premium_locked' }, { id: 'sl18', title: 'Les repas', emoji: '🍽️', status: 'premium_locked' }, { id: 'sl19', title: 'Au marché', emoji: '🏪', status: 'premium_locked' },
  ]},
  { id: 'snk-m5', icon: '🐘', title: 'Les Animaux', description: 'Les animaux en Soninké', isFree: false, lang: 'snk', lessons: [
    { id: 'sl20', title: 'Animaux domestiques', emoji: '🐔', status: 'premium_locked' }, { id: 'sl21', title: 'Animaux sauvages', emoji: '🦁', status: 'premium_locked' }, { id: 'sl22', title: 'Animaux de la ferme', emoji: '🐄', status: 'premium_locked' }, { id: 'sl23', title: 'Insectes', emoji: '🦋', status: 'premium_locked' },
  ]},
]

export default function AllThemesPage() {
  const navigate = useNavigate()
  const { activeLanguage, languageLabel } = useLanguage()

  const modules = allModules.filter((m) => m.lang === activeLanguage)

  return (
    <div className="pb-28 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/app')}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-[#131516]">Tous les thèmes</h1>
          <p className="text-xs text-gray-400">{modules.length} thèmes en {languageLabel}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {modules.map((mod, i) => {
          const completedCount = mod.lessons.filter((l) => l.status === 'completed').length
          const totalCount = mod.lessons.length
          const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

          return (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/app')}
              className={`
                flex flex-col items-center gap-2.5 p-5 rounded-2xl border-2 cursor-pointer transition-colors text-center
                ${!mod.isFree ? 'border-amber-200/60 bg-amber-50/30' : 'border-gray-100 bg-white hover:border-primary/30 shadow-sm'}
              `}
            >
              <span className="text-4xl">{mod.icon}</span>
              <span className="text-sm font-bold text-dark leading-tight">{mod.title}</span>
              <p className="text-xs text-gray-400 leading-snug line-clamp-2">{mod.description}</p>

              <div className="flex items-center gap-1 mt-1">
                {!mod.isFree && <Crown size={11} className="text-amber-500" />}
                <span className="text-xs text-gray-400 font-medium">
                  {completedCount}/{totalCount} leçons
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3].map((s) => (
                  <Star key={s} size={10} className={completedCount >= s ? 'text-gold fill-gold' : 'text-gray-200'} />
                ))}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
