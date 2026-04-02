import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mascot } from "../ui/Mascot";

export default function LanguageShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-5xl md:text-6xl font-black text-primary lowercase leading-tight">
              gratuit. fun. efficace.
            </h2>
            <p className="mt-6 text-lg text-dark/60 leading-relaxed max-w-lg">
              Apprendre avec Kan Sira, c'est fun, et en plus ca marche vraiment !
              Avec nos leçons courtes et interactives, tu progresseras chaque jour
              sans meme t'en rendre compte. Pas de pression, juste du plaisir.
            </p>
          </motion.div>

          {/* Right: Phone mockup + Mascot */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Phone mockup */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-dark/10 p-3 w-72 sm:w-80">
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
                    <p className="text-xs text-dark/40 font-medium uppercase tracking-wider">Lecon 1</p>
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
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 w-1/3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mascot pointing at screen */}
            <motion.div
              className="absolute -bottom-6 -right-4 md:-right-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Mascot size={100} expression="happy" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
