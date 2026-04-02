// @ts-nocheck — Not used in demo mode, Supabase types require real DB schema
import { supabase } from '../../config/supabase'
import type { BadgeDefinition } from '../../types/database'

export async function checkAndAwardBadges(userId: string): Promise<BadgeDefinition[]> {
  // Fetch all badge definitions
  const { data: allBadges } = await supabase.from('badge_definitions').select('*')
  if (!allBadges) return []

  // Fetch user's existing badges
  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  const earnedIds = new Set(earnedBadges?.map((b) => b.badge_id) || [])

  // Fetch user stats for checking conditions
  const [xpResult, streakResult, progressResult] = await Promise.all([
    supabase.from('user_xp').select('total_xp').eq('user_id', userId).single(),
    supabase.from('user_streaks').select('current_streak').eq('user_id', userId).single(),
    supabase.from('user_progress').select('lesson_id, perfect').eq('user_id', userId),
  ])

  const totalXP = xpResult.data?.total_xp || 0
  const currentStreak = streakResult.data?.current_streak || 0
  const lessonsCompleted = progressResult.data?.length || 0
  const perfectLessons = progressResult.data?.filter((p) => p.perfect).length || 0

  const newBadges: BadgeDefinition[] = []

  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue

    const condition = badge.condition as Record<string, unknown>
    let earned = false

    switch (condition.type) {
      case 'lessons_completed':
        earned = lessonsCompleted >= (condition.count as number)
        break
      case 'streak':
        earned = currentStreak >= (condition.days as number)
        break
      case 'total_xp':
        earned = totalXP >= (condition.amount as number)
        break
      case 'perfect_lessons':
        earned = perfectLessons >= (condition.count as number)
        break
      default:
        break
    }

    if (earned) {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id })
      newBadges.push(badge)
    }
  }

  return newBadges
}

export async function getUserBadges(userId: string) {
  const { data } = await supabase
    .from('user_badges')
    .select('*, badge_definitions(*)')
    .eq('user_id', userId)

  return data || []
}
