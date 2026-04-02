import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      navigate('/app')
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3E0] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-[#FF6B00]">
            Kan Sira
          </h1>
          <p className="mt-2 text-sm text-[#131516]/60">
            Créez votre compte et commencez à apprendre
          </p>
        </motion.div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-[#FF6B00]/5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display name */}
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium text-[#131516]"
              >
                Nom d'affichage
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#131516]/40" />
                <input
                  id="displayName"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full rounded-xl border border-[#131516]/10 bg-[#FFF3E0]/40 py-3 pl-10 pr-4 text-sm text-[#131516] placeholder-[#131516]/30 outline-none transition-all focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#131516]"
              >
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#131516]/40" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full rounded-xl border border-[#131516]/10 bg-[#FFF3E0]/40 py-3 pl-10 pr-4 text-sm text-[#131516] placeholder-[#131516]/30 outline-none transition-all focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#131516]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#131516]/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full rounded-xl border border-[#131516]/10 bg-[#FFF3E0]/40 py-3 pl-10 pr-11 text-sm text-[#131516] placeholder-[#131516]/30 outline-none transition-all focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#131516]/40 transition-colors hover:text-[#131516]/70"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-[#131516]"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#131516]/40" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez votre mot de passe"
                  className="w-full rounded-xl border border-[#131516]/10 bg-[#FFF3E0]/40 py-3 pl-10 pr-4 text-sm text-[#131516] placeholder-[#131516]/30 outline-none transition-all focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20"
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B00] py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF6B00]/25 transition-colors hover:bg-[#FF6B00]/90 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Créer un compte
                </>
              )}
            </motion.button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-[#131516]/60">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#2D9F4F] transition-colors hover:text-[#2D9F4F]/80"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
