export type ExerciseType =
  | 'multiple_choice'
  | 'translation'
  | 'word_match'
  | 'fill_blank'
  | 'listen_choose'
  | 'word_order'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Profile>
      }
      languages: {
        Row: Language
        Insert: Omit<Language, 'id'>
        Update: Partial<Language>
      }
      modules: {
        Row: Module
        Insert: Omit<Module, 'id' | 'created_at'>
        Update: Partial<Module>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at'>
        Update: Partial<Lesson>
      }
      exercises: {
        Row: Exercise
        Insert: Omit<Exercise, 'id' | 'created_at'>
        Update: Partial<Exercise>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id' | 'completed_at'>
        Update: Partial<UserProgress>
      }
      user_xp: {
        Row: UserXP
        Insert: Omit<UserXP, 'updated_at'>
        Update: Partial<UserXP>
      }
      user_streaks: {
        Row: UserStreak
        Insert: Omit<UserStreak, 'updated_at'>
        Update: Partial<UserStreak>
      }
      user_badges: {
        Row: UserBadge
        Insert: Omit<UserBadge, 'id' | 'earned_at'>
        Update: Partial<UserBadge>
      }
      badge_definitions: {
        Row: BadgeDefinition
        Insert: Omit<BadgeDefinition, 'id'>
        Update: Partial<BadgeDefinition>
      }
    }
  }
}

export interface Profile {
  id: string
  display_name: string | null
  is_premium: boolean
  is_admin: boolean
  preferred_lang: string
  daily_goal: number
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Language {
  id: string
  name: string
  native_name: string
  flag: string
  is_active: boolean
}

export interface Module {
  id: string
  language_id: string
  title: string
  description: string
  icon: string
  order_index: number
  is_free: boolean
  is_published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  description: string | null
  xp_reward: number
  order_index: number
  created_at: string
}

export interface Exercise {
  id: string
  lesson_id: string
  type: ExerciseType
  order_index: number
  data: ExerciseData
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  score: number
  xp_earned: number
  perfect: boolean
  completed_at: string
}

export interface UserXP {
  user_id: string
  total_xp: number
  level: number
  updated_at: string
}

export interface UserStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
  updated_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  condition: Record<string, unknown>
  is_premium: boolean
}

// Exercise data types
export type ExerciseData =
  | MultipleChoiceData
  | TranslationData
  | WordMatchData
  | FillBlankData
  | ListenChooseData
  | WordOrderData

export interface MultipleChoiceData {
  type: 'multiple_choice'
  question: string
  options: string[]
  correct_index: number
  audio_url?: string
  image_url?: string
}

export interface TranslationData {
  type: 'translation'
  prompt: string
  correct_answer: string
  accepted_answers: string[]
  word_bank?: string[]
  source_lang: string
  target_lang: string
}

export interface WordMatchData {
  type: 'word_match'
  pairs: { left: string; right: string }[]
}

export interface FillBlankData {
  type: 'fill_blank'
  sentence: string
  blank_index: number
  options: string[]
  correct_index: number
}

export interface ListenChooseData {
  type: 'listen_choose'
  audio_url: string
  options: string[]
  correct_index: number
  transcript: string
}

export interface WordOrderData {
  type: 'word_order'
  prompt: string
  correct_order: string[]
  shuffled_words: string[]
}

// Module with lessons for the learning path
export interface ModuleWithLessons extends Module {
  lessons: LessonWithProgress[]
  language?: Language
}

export interface LessonWithProgress extends Lesson {
  completed: boolean
  score?: number
  locked: boolean
  premium_locked: boolean
}
