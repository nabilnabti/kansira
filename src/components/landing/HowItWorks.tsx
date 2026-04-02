import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: 1,
    title: "Choisissez votre langue",
    description:
      "Sélectionnez le Bambara ou le Soninké et commencez votre parcours d'apprentissage personnalisé.",
    emoji: "\ud83c\udf0d",
  },
  {
    number: 2,
    title: "Suivez le parcours",
    description:
      "Des leçons structurées du débutant à l'avancé, avec des exercices interactifs à chaque étape.",
    emoji: "\ud83d\udcda",
  },
  {
    number: 3,
    title: "Progressez en jouant",
    description:
      "Gagnez des points, débloquez des badges et suivez votre progression jour après jour.",
    emoji: "\ud83d\ude80",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-20 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Comment ça marche ?
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto">
            Trois étapes simples pour commencer votre voyage linguistique.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-primary via-gold to-secondary" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    delay: 0.4 + i * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-lg ${
                    i === 0
                      ? "bg-primary shadow-primary/30"
                      : i === 1
                      ? "bg-gold shadow-gold/30"
                      : "bg-secondary shadow-secondary/30"
                  }`}
                >
                  {step.number}
                </motion.div>

                {/* Emoji */}
                <div className="mt-6 text-4xl">{step.emoji}</div>

                {/* Text */}
                <h3 className="mt-4 font-heading font-bold text-xl text-dark">
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
