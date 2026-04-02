import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

const mockBadges: Badge[] = [
  { id: 'b1', name: 'Premier pas', description: 'Terminer votre premiere lecon', icon: '\uD83D\uDC63', earned: true, earnedDate: '15 mars 2026' },
  { id: 'b2', name: 'Serie de 3', description: '3 jours consecutifs', icon: '\uD83D\uDD25', earned: true, earnedDate: '18 mars 2026' },
  { id: 'b3', name: 'Serie de 7', description: '7 jours consecutifs', icon: '\u2B50', earned: true, earnedDate: '22 mars 2026' },
  { id: 'b4', name: 'Perfectionniste', description: 'Score parfait sur une lecon', icon: '\uD83D\uDC8E', earned: true, earnedDate: '20 mars 2026' },
  { id: 'b5', name: 'Explorateur', description: 'Terminer un module complet', icon: '\uD83C\uDF0D', earned: false },
  { id: 'b6', name: 'Polyglotte', description: 'Etudier 2 langues', icon: '\uD83D\uDDE3\uFE0F', earned: false },
  { id: 'b7', name: 'Serie de 30', description: '30 jours consecutifs', icon: '\uD83C\uDFC6', earned: false },
  { id: 'b8', name: 'Maitre', description: '1000 XP total', icon: '\uD83D\uDC51', earned: false },
  { id: 'b9', name: 'Marathon', description: '10 lecons en un jour', icon: '\uD83C\uDFC3', earned: false },
]

export default function BadgesPage() {
  const earned = mockBadges.filter((b) => b.earned).length

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-dark">Badges</h1>
        <p className="text-sm text-gray-500 mt-1">
          {earned} / {mockBadges.length} obtenus
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {mockBadges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center ${
              !badge.earned ? 'opacity-50 grayscale' : ''
            }`}
          >
            <div className="text-3xl mb-2">
              {badge.earned ? badge.icon : <HelpCircle className="text-gray-400 mx-auto" size={32} />}
            </div>
            <h3 className="text-xs font-bold text-dark leading-tight">{badge.name}</h3>
            {badge.earned && badge.earnedDate && (
              <p className="text-[9px] text-gray-400 mt-1">{badge.earnedDate}</p>
            )}
            {!badge.earned && (
              <p className="text-[9px] text-gray-400 mt-1 line-clamp-2">{badge.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
