import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

const mockBadges: Badge[] = [
  { id: 'b1', name: 'Premier pas', description: 'Terminer votre premi\u00e8re le\u00e7on', icon: '\uD83D\uDC63', earned: true, earnedDate: '15 mars 2026' },
  { id: 'b2', name: 'S\u00e9rie de 3', description: '3 jours cons\u00e9cutifs', icon: '\uD83D\uDD25', earned: true, earnedDate: '18 mars 2026' },
  { id: 'b3', name: 'S\u00e9rie de 7', description: '7 jours cons\u00e9cutifs', icon: '\u2B50', earned: true, earnedDate: '22 mars 2026' },
  { id: 'b4', name: 'Perfectionniste', description: 'Score parfait sur une le\u00e7on', icon: '\uD83D\uDC8E', earned: true, earnedDate: '20 mars 2026' },
  { id: 'b5', name: 'Explorateur', description: 'Terminer un module complet', icon: '\uD83C\uDF0D', earned: false },
  { id: 'b6', name: 'Polyglotte', description: '\u00c9tudier 2 langues', icon: '\uD83D\uDDE3\uFE0F', earned: false },
  { id: 'b7', name: 'S\u00e9rie de 30', description: '30 jours cons\u00e9cutifs', icon: '\uD83C\uDFC6', earned: false },
  { id: 'b8', name: 'Ma\u00eetre', description: '1000 XP total', icon: '\uD83D\uDC51', earned: false },
  { id: 'b9', name: 'Marathon', description: '10 le\u00e7ons en un jour', icon: '\uD83C\uDFC3', earned: false },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
}

export default function BadgesPage() {
  const earned = mockBadges.filter((b) => b.earned).length
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  return (
    <div className="max-w-lg mx-auto pb-28 md:pb-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#131516]">Badges</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-2.5 rounded-full bg-[#131516]/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earned / mockBadges.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#F4A100]"
            />
          </div>
          <span className="text-sm font-bold text-[#131516]/60 whitespace-nowrap">
            {earned}/{mockBadges.length} badges
          </span>
        </div>
      </motion.div>

      {/* Badge grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3"
      >
        {mockBadges.map((badge) => (
          <motion.button
            key={badge.id}
            variants={cardVariant}
            whileTap={badge.earned ? { scale: 0.95 } : undefined}
            onClick={() => badge.earned && setSelectedBadge(badge)}
            className={`relative rounded-2xl p-4 flex flex-col items-center text-center transition-all ${
              badge.earned
                ? 'bg-white shadow-md shadow-[#FF6B00]/10 border border-[#FF6B00]/10 active:shadow-lg'
                : 'bg-[#131516]/5 border border-[#131516]/5'
            }`}
          >
            {/* Glow for earned */}
            {badge.earned && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#FF6B00]/5 to-transparent pointer-events-none" />
            )}

            <div className={`text-3xl mb-2 ${!badge.earned ? 'grayscale opacity-40' : ''}`}>
              {badge.earned ? (
                badge.icon
              ) : (
                <HelpCircle className="text-[#131516]/30 mx-auto" size={32} />
              )}
            </div>
            <h3
              className={`text-xs font-bold leading-tight ${
                badge.earned ? 'text-[#131516]' : 'text-[#131516]/40'
              }`}
            >
              {badge.name}
            </h3>
            {badge.earned && badge.earnedDate && (
              <p className="text-[9px] text-[#131516]/40 mt-1">{badge.earnedDate}</p>
            )}
            {!badge.earned && (
              <p className="text-[9px] text-[#131516]/30 mt-1 line-clamp-2">
                {badge.description}
              </p>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Badge detail bottom sheet */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 pb-10 max-w-lg mx-auto"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-[#131516]/30 active:bg-[#131516]/5"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <span className="text-6xl mb-3">{selectedBadge.icon}</span>
                <h3 className="text-xl font-bold text-[#131516] mb-1">
                  {selectedBadge.name}
                </h3>
                <p className="text-sm text-[#131516]/50 mb-3">
                  {selectedBadge.description}
                </p>
                {selectedBadge.earnedDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2D9F4F]/10 px-4 py-1.5 text-sm font-semibold text-[#2D9F4F]">
                    Obtenu le {selectedBadge.earnedDate}
                  </span>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
