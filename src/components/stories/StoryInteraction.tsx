import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import type { StoryInteraction as StoryInteractionType } from '../../types/database'
import { speak } from '../../lib/tts'

interface StoryInteractionProps {
  interaction: StoryInteractionType
  onAnswer: (selectedIndex: number) => void
  disabled?: boolean
}

export function StoryInteraction({ interaction, onAnswer, disabled }: StoryInteractionProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (disabled || selected !== null) return
    setSelected(index)
    onAnswer(index)
  }

  const handleListen = () => {
    if (interaction.sentence) {
      speak({ text: interaction.sentence, lang: 'bm' })
    }
  }

  return (
    <div className="mt-6">
      {/* Question / sentence display */}
      {interaction.type === 'fill_blank' && interaction.sentence && (
        <div className="text-center mb-5">
          <p className="text-xl font-bold text-white leading-relaxed">
            {interaction.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block w-20 border-b-2 border-white/60 mx-1" />
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {interaction.type === 'comprehension' && interaction.question && (
        <div className="text-center mb-5">
          <p className="text-lg font-semibold text-white/90">{interaction.question}</p>
        </div>
      )}

      {interaction.type === 'listen' && (
        <div className="flex justify-center mb-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleListen}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          >
            <Volume2 size={28} className="text-white" />
          </motion.button>
        </div>
      )}

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {interaction.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === interaction.correct_index
          const showResult = disabled && selected !== null

          let bgClass = 'bg-white/15 backdrop-blur-sm border-white/20'
          if (showResult && isSelected && isCorrect) {
            bgClass = 'bg-green-500/30 border-green-400/60'
          } else if (showResult && isSelected && !isCorrect) {
            bgClass = 'bg-red-500/30 border-red-400/60'
          } else if (showResult && isCorrect) {
            bgClass = 'bg-green-500/20 border-green-400/40'
          } else if (isSelected) {
            bgClass = 'bg-white/25 border-white/40'
          }

          return (
            <motion.button
              key={index}
              whileHover={!disabled ? { scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
              onClick={() => handleSelect(index)}
              disabled={disabled || selected !== null}
              className={`
                w-full py-3.5 px-5 rounded-xl border-2 text-left font-semibold text-white
                transition-all duration-200 cursor-pointer disabled:cursor-default
                ${bgClass}
              `}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
