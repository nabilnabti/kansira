// @ts-nocheck — Not used in demo mode, Supabase types require real DB schema
import { supabase } from '../../config/supabase'
import type { Module, Lesson, Exercise, ModuleWithLessons, LessonWithProgress } from '../../types/database'

export async function fetchModulesWithLessons(
  languageId: string,
  userId?: string
): Promise<ModuleWithLessons[]> {
  const { data: modules, error: modError } = await supabase
    .from('modules')
    .select('*')
    .eq('language_id', languageId)
    .eq('is_published', true)
    .order('order_index')

  if (modError) throw modError
  if (!modules) return []

  const moduleIds = modules.map((m) => m.id)
  const { data: lessons, error: lesError } = await supabase
    .from('lessons')
    .select('*')
    .in('module_id', moduleIds)
    .order('order_index')

  if (lesError) throw lesError

  let progressMap: Record<string, { score: number }> = {}
  if (userId) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, score')
      .eq('user_id', userId)

    if (progress) {
      progressMap = Object.fromEntries(
        progress.map((p) => [p.lesson_id, { score: p.score }])
      )
    }
  }

  let previousCompleted = true

  return modules.map((mod) => {
    const modLessons = (lessons || []).filter((l) => l.module_id === mod.id)
    const lessonsWithProgress: LessonWithProgress[] = modLessons.map((lesson) => {
      const progress = progressMap[lesson.id]
      const completed = !!progress
      const available = previousCompleted
      previousCompleted = completed

      return {
        ...lesson,
        completed,
        score: progress?.score,
        locked: !available && !completed,
        premium_locked: !mod.is_free,
      }
    })

    return { ...mod, lessons: lessonsWithProgress }
  })
}

export async function fetchLessonExercises(lessonId: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index')

  if (error) throw error
  return data || []
}

export async function fetchLesson(lessonId: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (error) return null
  return data
}
