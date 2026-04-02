import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Mascot } from '../components/ui/Mascot'

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
    <div className="flex min-h-screen flex-col items-center bg-[#FFF3E0] px-5 pt-16 pb-10">
      {/* Mascot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="mb-4"
      >
        <Mascot size={90} expression="thinking" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mb-2 text-center"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-[#FF6B00]">
          Kan Sira
        </h1>
        <p className="mt-1 text-sm font-medium text-[#131516]/50">
          R&eacute;initialisez votre mot de passe
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
        className="mt-6 w-full max-w-md"
      >
        <div className="rounded-3xl bg-white p-7 shadow-xl shadow-[#FF6B00]/8">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2D9F4F]/10"
              >
                <CheckCircle2 className="h-8 w-8 text-[#2D9F4F]" />
              </motion.div>
              <h2 className="text-lg font-bold text-[#131516]">
                E-mail envoy&eacute; !
              </h2>
              <p className="text-sm text-[#131516]/50 leading-relaxed">
                Si un compte est associ&eacute; &agrave;{' '}
                <span className="font-semibold text-[#131516]">{email}</span>, vous
                recevrez un lien de r&eacute;initialisation dans quelques instants.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-colors active:bg-[#e55f00]"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour &agrave; la connexion
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-5 rounded-2xl bg-[#E63946]/10 px-4 py-3.5 text-sm font-medium text-[#E63946]"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-[#131516]/50 mb-5 leading-relaxed">
                Entrez votre adresse e-mail et nous vous enverrons un lien pour
                r&eacute;initialiser votre mot de passe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#131516]"
                  >
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#131516]/30" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="h-14 w-full rounded-2xl border-2 border-[#131516]/8 bg-[#FFF3E0]/30 pl-12 pr-4 text-base text-[#131516] placeholder-[#131516]/25 outline-none transition-all focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10"
                    />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#FF6B00] text-base font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-colors active:bg-[#e55f00] disabled:opacity-60"
                >
                  {loading ? (
                    <span className="h-6 w-6 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                  ) : (
                    'R\u00e9initialiser'
                  )}
                </motion.button>
              </form>

              {/* Back to login */}
              <p className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2D9F4F] transition-colors active:text-[#2D9F4F]/70"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour &agrave; la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
