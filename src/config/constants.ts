export const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 1750 },
  { level: 7, xpRequired: 2750 },
  { level: 8, xpRequired: 4000 },
  { level: 9, xpRequired: 5500 },
  { level: 10, xpRequired: 7500 },
  { level: 11, xpRequired: 10000 },
  { level: 12, xpRequired: 13000 },
  { level: 13, xpRequired: 17000 },
  { level: 14, xpRequired: 22000 },
  { level: 15, xpRequired: 28000 },
] as const

export const BONUS_XP_PERFECT = 5
export const BONUS_XP_STREAK_PER_DAY = 2
export const MAX_STREAK_BONUS = 10

export const DAILY_GOALS = [10, 20, 30, 50] as const

export const LANGUAGES = [
  { id: 'bm', name: 'Bambara', flag: '🇲🇱', nativeName: 'Bamanankan' },
  { id: 'snk', name: 'Soninké', flag: '🇲🇱', nativeName: 'Sooninkanxanne' },
] as const

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  app: '/app',
  lesson: '/app/lesson/:id',
  profile: '/app/profile',
  badges: '/app/badges',
  settings: '/app/settings',
  premium: '/app/premium',
  admin: '/admin',
  adminModules: '/admin/modules',
  adminLessons: '/admin/lessons',
  adminExercises: '/admin/exercises/:id',
  adminUsers: '/admin/users',
} as const
