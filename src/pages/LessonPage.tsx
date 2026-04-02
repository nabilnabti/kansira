import type { Exercise } from '../types/database'
import { ExerciseShell } from '../components/exercises/ExerciseShell'

// Mock exercises with Bambara vocabulary
const mockExercises: Exercise[] = [
  {
    id: 'ex-1',
    lesson_id: 'lesson-1',
    type: 'multiple_choice',
    order_index: 0,
    created_at: new Date().toISOString(),
    data: {
      type: 'multiple_choice',
      question: 'Que signifie "I ni ce" en français ?',
      options: ['Au revoir', 'Bonjour', 'Merci', 'S\'il vous plaît'],
      correct_index: 1,
    },
  },
  {
    id: 'ex-2',
    lesson_id: 'lesson-1',
    type: 'translation',
    order_index: 1,
    created_at: new Date().toISOString(),
    data: {
      type: 'translation',
      prompt: 'Bonjour à tous',
      correct_answer: 'Aw ni ce',
      accepted_answers: ['Aw ni ce', 'aw ni ce'],
      word_bank: ['Aw', 'ni', 'ce', 'ka', 'ba'],
      source_lang: 'Français',
      target_lang: 'Bambara',
    },
  },
  {
    id: 'ex-3',
    lesson_id: 'lesson-1',
    type: 'word_match',
    order_index: 2,
    created_at: new Date().toISOString(),
    data: {
      type: 'word_match',
      pairs: [
        { left: 'I ni ce', right: 'Bonjour' },
        { left: 'I ka kɛnɛ wa?', right: 'Comment vas-tu ?' },
        { left: 'Aw ni ce', right: 'Bonjour à tous' },
        { left: 'N bɛ here la', right: 'Je vais bien' },
      ],
    },
  },
  {
    id: 'ex-4',
    lesson_id: 'lesson-1',
    type: 'fill_blank',
    order_index: 3,
    created_at: new Date().toISOString(),
    data: {
      type: 'fill_blank',
      sentence: 'I ___ ce',
      blank_index: 1,
      options: ['ka', 'ni', 'bɛ', 'ye'],
      correct_index: 1,
    },
  },
  {
    id: 'ex-5',
    lesson_id: 'lesson-1',
    type: 'listen_choose',
    order_index: 4,
    created_at: new Date().toISOString(),
    data: {
      type: 'listen_choose',
      audio_url: '',
      options: ['I ni ce', 'Aw ni ce', 'I ka kɛnɛ wa?', 'N bɛ here la'],
      correct_index: 0,
      transcript: 'I ni ce',
    },
  },
  {
    id: 'ex-6',
    lesson_id: 'lesson-1',
    type: 'word_order',
    order_index: 5,
    created_at: new Date().toISOString(),
    data: {
      type: 'word_order',
      prompt: 'Traduisez : "Comment vas-tu ?"',
      correct_order: ['I', 'ka', 'kɛnɛ', 'wa?'],
      shuffled_words: ['kɛnɛ', 'wa?', 'I', 'ka'],
    },
  },
]

export function LessonPage() {
  return <ExerciseShell exercises={mockExercises} xpReward={30} />
}
