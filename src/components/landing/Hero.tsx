import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-background/50 to-white">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Disponible maintenant
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dark leading-tight"
            >
              Apprenez le{" "}
              <span className="text-primary">Bambara</span> et le{" "}
              <span className="text-secondary">Soninké</span>{" "}
              en jouant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-lg text-dark/60 max-w-xl mx-auto lg:mx-0"
            >
              Une méthode ludique et interactive pour maîtriser les langues
              ouest-africaines. Des leçons courtes, des exercices variés et un
              suivi de progression pour apprendre à votre rythme.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-3.5 text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                Commencer gratuitement
              </button>
              <button
                onClick={() => scrollTo("#how-it-works")}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-dark border border-gray-200 rounded-full px-8 py-3.5 text-base font-semibold transition-all cursor-pointer"
              >
                <BookOpen size={18} />
                Comment ça marche
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {["A", "M", "F", "S"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 text-primary text-xs font-bold flex items-center justify-center"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-dark/50">
                <span className="font-semibold text-dark/70">500+</span>{" "}
                apprenants actifs
              </p>
            </motion.div>
          </motion.div>

          {/* Illustration area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Phone mockup */}
              <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-dark/10 p-3 mx-auto w-72 sm:w-80">
                <div className="bg-gradient-to-br from-background to-white rounded-[2rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-primary/5 px-6 py-3 flex justify-between items-center">
                    <span className="font-heading font-bold text-sm text-primary">Kan Sira</span>
                    <div className="flex gap-1">
                      <span className="text-xs text-gold font-bold">🔥 12</span>
                    </div>
                  </div>
                  {/* Lesson card */}
                  <div className="p-5 space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-dark/40 font-medium uppercase tracking-wider">Leçon 1</p>
                      <p className="font-heading font-bold text-lg text-dark mt-1">Les salutations</p>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-4 text-center">
                      <p className="text-3xl mb-2">👋</p>
                      <p className="font-heading font-bold text-xl text-dark">I ni ce</p>
                      <p className="text-sm text-dark/50 mt-1">Bonjour</p>
                    </div>
                    <div className="space-y-2">
                      {["I ni ce", "Aw ni ce", "I ka kɛnɛ wa?"].map((opt, i) => (
                        <div
                          key={i}
                          className={`rounded-xl px-4 py-3 text-sm font-medium border-2 text-center ${
                            i === 0
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-gray-200 text-dark/60"
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-1/3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-xs font-bold text-dark">Série de 7 jours</p>
                  <p className="text-[10px] text-dark/40">Badge débloqué !</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-xs font-bold text-secondary">+10 XP</p>
                  <p className="text-[10px] text-dark/40">Bonne réponse</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
