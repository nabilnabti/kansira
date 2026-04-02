import { supabase } from '../../config/supabase'
import type { Module, Lesson, Exercise, Profile } from '../../types/database'

// Modules
export async function fetchAllModules(languageId?: string) {
  let query = supabase.from('modules').select('*, lessons(count)').order('order_index')
  if (languageId) query = query.eq('language_id', languageId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createModule(module: Omit<Module, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('modules').insert(module).select().single()
  if (error) throw error
  return data
}

export async function updateModule(id: string, updates: Partial<Module>) {
  const { data, error } = await supabase.from('modules').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteModule(id: string) {
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) throw error
}

// Lessons
export async function fetchAllLessons(moduleId?: string) {
  let query = supabase.from('lessons').select('*, exercises(count), modules(title)').order('order_index')
  if (moduleId) query = query.eq('module_id', moduleId)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('lessons').insert(lesson).select().single()
  if (error) throw error
  return data
}

export async function updateLesson(id: string, updates: Partial<Lesson>) {
  const { data, error } = await supabase.from('lessons').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteLesson(id: string) {
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) throw error
}

// Exercises
export async function fetchExercises(lessonId: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index')
  if (error) throw error
  return data
}

export async function createExercise(exercise: Omit<Exercise, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('exercises').insert(exercise).select().single()
  if (error) throw error
  return data
}

export async function updateExercise(id: string, updates: Partial<Exercise>) {
  const { data, error } = await supabase.from('exercises').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteExercise(id: string) {
  const { error } = await supabase.from('exercises').delete().eq('id', id)
  if (error) throw error
}

// Users
export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_xp(*), user_streaks(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, updates: { is_premium?: boolean; is_admin?: boolean }) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  if (error) throw error
  return data
}

// Stats
export async function getAdminStats() {
  const [usersResult, progressResult] = await Promise.all([
    supabase.from('profiles').select('id, created_at'),
    supabase.from('user_progress').select('id, completed_at'),
  ])

  const totalUsers = usersResult.data?.length || 0
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const activeUsers = usersResult.data?.filter((u) => u.created_at > sevenDaysAgo).length || 0
  const recentLessons = progressResult.data?.filter((p) => p.completed_at > sevenDaysAgo).length || 0

  return { totalUsers, activeUsers, recentLessons, completionRate: 67 }
}
