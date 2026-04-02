import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: 1,
    title: "choisis ta langue",
    description:
      "Bambara ou Soninke ? Selectionne ta langue et commence ton parcours personnalise.",
    emoji: "🌍",
  },
  {
    number: 2,
    title: "suis le parcours",
    description:
      "Des lecons structurees avec des exercices interactifs a chaque etape. Du debutant a l'avance.",
    emoji: "📚",
  },
  {
    number: 3,
    title: "progresse en jouant",
    description:
      "Gagne des points, debloque des badges et suis ta progression jour apres jour.",
    emoji: "🚀",
  },
];

const floatingLetters = [
  { char: "ɛ", x: "5%", y: "15%", delay: 0, color: "#FF6B00" },
  { char: "ɔ", x: "85%", y: "20%", delay: 0.5, color: "#2D9F4F" },
  { char: "ŋ", x: "90%", y: "75%", delay: 1, color: "#F4A100" },
  { char: "ɲ", x: "8%", y: "80%", delay: 1.5, color: "#E63946" },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-blue-light overflow-hidden" ref={ref}>
      {/* Floating decorative elements */}
      {floatingLetters.map((el, i) => (
        <motion.div
          key={i}
          className="absolute font-black text-2xl opacity-20 select-none pointer-events-none"
          style={{ left: el.x, top: el.y, color: el.color }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: el.delay, ease: "easeInOut" }}
        >
          {el.char}
        </motion.div>
      ))}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-black text-blue-dark lowercase">
            comment ca marche
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto text-lg">
            Trois etapes simples pour commencer ton voyage linguistique.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-20 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-1 bg-gradient-to-r from-primary via-gold to-secondary rounded-full" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                {/* 3D number button */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    delay: 0.4 + i * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg ${
                    i === 0
                      ? "bg-primary shadow-primary/30 border-b-4 border-primary-dark"
                      : i === 1
                      ? "bg-gold shadow-gold/30 border-b-4 border-yellow-600"
                      : "bg-secondary shadow-secondary/30 border-b-4 border-secondary-dark"
                  }`}
                >
                  {step.number}
                </motion.div>

                {/* Emoji */}
                <motion.div
                  className="mt-6 text-5xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                >
                  {step.emoji}
                </motion.div>

                {/* Text */}
                <h3 className="mt-4 font-heading font-black text-xl text-blue-dark lowercase">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-dark/50 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
