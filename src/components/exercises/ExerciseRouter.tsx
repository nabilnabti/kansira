import type { ComponentType } from 'react'
import type { ExerciseType, ExerciseData } from '../../types/database'
import { MultipleChoice, type ExerciseProps } from './MultipleChoice'
import { Translation } from './Translation'
import { WordMatch } from './WordMatch'
import { FillBlank } from './FillBlank'
import { ListenChoose } from './ListenChoose'
import { WordOrder } from './WordOrder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exerciseRegistry: Record<ExerciseType, ComponentType<ExerciseProps<any>>> = {
  multiple_choice: MultipleChoice,
  translation: Translation,
  word_match: WordMatch,
  fill_blank: FillBlank,
  listen_choose: ListenChoose,
  word_order: WordOrder,
}

interface ExerciseRouterProps {
  data: ExerciseData
  onAnswer: (answer: unknown) => void
  disabled?: boolean
}

export function ExerciseRouter({ data, onAnswer, disabled }: ExerciseRouterProps) {
  const Component = exerciseRegistry[data.type]

  if (!Component) {
    return (
      <div className="text-center text-dark/50 py-8">
        Type d'exercice inconnu : {data.type}
      </div>
    )
  }

  return <Component data={data} onAnswer={onAnswer} disabled={disabled} />
}
