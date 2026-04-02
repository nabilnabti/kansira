import type {
  ExerciseType,
  ExerciseData,
  MultipleChoiceData,
  TranslationData,
  WordMatchData,
  FillBlankData,
  ListenChooseData,
  WordOrderData,
} from '../../types/database'

export function validateMultipleChoice(
  data: MultipleChoiceData,
  selectedIndex: number
): boolean {
  return selectedIndex === data.correct_index
}

export function validateTranslation(
  data: TranslationData,
  userAnswer: string
): boolean {
  const normalize = (s: string) => s.trim().toLowerCase()
  const normalizedAnswer = normalize(userAnswer)

  if (normalize(data.correct_answer) === normalizedAnswer) return true

  return data.accepted_answers.some(
    (accepted) => normalize(accepted) === normalizedAnswer
  )
}

export function validateWordMatch(
  data: WordMatchData,
  pairs: { left: string; right: string }[]
): boolean {
  if (pairs.length !== data.pairs.length) return false

  return data.pairs.every((expected) =>
    pairs.some(
      (submitted) =>
        submitted.left === expected.left && submitted.right === expected.right
    )
  )
}

export function validateFillBlank(
  data: FillBlankData,
  selectedIndex: number
): boolean {
  return selectedIndex === data.correct_index
}

export function validateListenChoose(
  data: ListenChooseData,
  selectedIndex: number
): boolean {
  return selectedIndex === data.correct_index
}

export function validateWordOrder(
  data: WordOrderData,
  selectedWords: string[]
): boolean {
  if (selectedWords.length !== data.correct_order.length) return false
  return selectedWords.every((word, i) => word === data.correct_order[i])
}

export type ValidatorFn = (data: ExerciseData, answer: unknown) => boolean

export const validators: Record<ExerciseType, ValidatorFn> = {
  multiple_choice: (data, answer) =>
    validateMultipleChoice(data as MultipleChoiceData, answer as number),
  translation: (data, answer) =>
    validateTranslation(data as TranslationData, answer as string),
  word_match: (data, answer) =>
    validateWordMatch(
      data as WordMatchData,
      answer as { left: string; right: string }[]
    ),
  fill_blank: (data, answer) =>
    validateFillBlank(data as FillBlankData, answer as number),
  listen_choose: (data, answer) =>
    validateListenChoose(data as ListenChooseData, answer as number),
  word_order: (data, answer) =>
    validateWordOrder(data as WordOrderData, answer as string[]),
}
