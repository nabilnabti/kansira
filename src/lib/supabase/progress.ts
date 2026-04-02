import { supabase } from '../../config/supabase'
import type { UserProgress, UserXP, UserStreak } from '../../types/database'

export async function saveProgress(
  userId: string,
  lessonId: string,
  score: number,
  xpEarned: number,
  perfect: boolean
): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      score,
      xp_earned: xpEarned,
      perfect,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserXP(userId: string, xpToAdd: number): Promise<void> {
  const { data: current } = await supabase
    .from('user_xp')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!current) return

  const newXP = current.total_xp + xpToAdd
  const newLevel = calculateLevel(newXP)

  await supabase
    .from('user_xp')
    .update({ total_xp: newXP, level: newLevel })
    .eq('user_id', userId)
}

export async function updateStreak(userId: string): Promise<{ current: number; isNew: boolean }> {
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!streak) return { current: 0, isNew: false }

  const today = new Date().toISOString().split('T')[0]
  const lastActivity = streak.last_activity_date

  if (lastActivity === today) {
    return { current: streak.current_streak, isNew: false }
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  let newStreak: number

  if (lastActivity === yesterday) {
    newStreak = streak.current_streak + 1
  } else {
    newStreak = 1
  }

  const longestStreak = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
    })
    .eq('user_id', userId)

  return { current: newStreak, isNew: newStreak > streak.current_streak }
}

export async function getUserStats(userId: string) {
  const [xpResult, streakResult, progressResult] = await Promise.all([
    supabase.from('user_xp').select('*').eq('user_id', userId).single(),
    supabase.from('user_streaks').select('*').eq('user_id', userId).single(),
    supabase.from('user_progress').select('id').eq('user_id', userId),
  ])

  return {
    xp: xpResult.data as UserXP | null,
    streak: streakResult.data as UserStreak | null,
    lessonsCompleted: progressResult.data?.length || 0,
  }
}

function calculateLevel(totalXP: number): number {
  const levels = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000, 13000, 17000, 22000, 28000]
  let level = 1
  for (let i = 1; i < levels.length; i++) {
    if (totalXP >= levels[i]) level = i + 1
    else break
  }
  return level
}
