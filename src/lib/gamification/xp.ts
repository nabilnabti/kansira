import { XP_LEVELS, BONUS_XP_PERFECT, BONUS_XP_STREAK_PER_DAY, MAX_STREAK_BONUS } from '../../config/constants'

export function calculateXPEarned(
  baseXP: number,
  score: number,
  isPerfect: boolean,
  currentStreak: number
): number {
  let xp = Math.round(baseXP * (score / 100))

  if (isPerfect) {
    xp += BONUS_XP_PERFECT
  }

  const streakBonus = Math.min(currentStreak * BONUS_XP_STREAK_PER_DAY, MAX_STREAK_BONUS)
  xp += streakBonus

  return xp
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1
  for (const lvl of XP_LEVELS) {
    if (totalXP >= lvl.xpRequired) level = lvl.level
    else break
  }
  return level
}

export function getXPForNextLevel(totalXP: number): { current: number; required: number; progress: number } {
  const currentLevel = getLevelFromXP(totalXP)
  const currentLevelXP = XP_LEVELS.find((l) => l.level === currentLevel)?.xpRequired || 0
  const nextLevelXP = XP_LEVELS.find((l) => l.level === currentLevel + 1)?.xpRequired

  if (!nextLevelXP) {
    return { current: totalXP - currentLevelXP, required: 1, progress: 100 }
  }

  const progressXP = totalXP - currentLevelXP
  const requiredXP = nextLevelXP - currentLevelXP

  return {
    current: progressXP,
    required: requiredXP,
    progress: Math.round((progressXP / requiredXP) * 100),
  }
}
