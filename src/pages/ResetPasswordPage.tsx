import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF3E0] px-4">
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
            Réinitialisez votre mot de passe
          </p>
        </motion.div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-[#FF6B00]/5">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2D9F4F]/10">
                <CheckCircle2 className="h-7 w-7 text-[#2D9F4F]" />
              </div>
              <h2 className="text-lg font-semibold text-[#131516]">
                E-mail envoyé !
              </h2>
              <p className="text-sm text-[#131516]/60">
                Si un compte est associé à{' '}
                <span className="font-medium text-[#131516]">{email}</span>, vous
                recevrez un lien de réinitialisation dans quelques instants.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B00] transition-colors hover:text-[#FF6B00]/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </motion.div>
          ) : (
            <>
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
                <p className="text-sm text-[#131516]/60">
                  Entrez votre adresse e-mail et nous vous enverrons un lien pour
                  réinitialiser votre mot de passe.
                </p>

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
                      <Send className="h-4 w-4" />
                      Réinitialiser
                    </>
                  )}
                </motion.button>
              </form>

              {/* Back to login */}
              <p className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D9F4F] transition-colors hover:text-[#2D9F4F]/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
