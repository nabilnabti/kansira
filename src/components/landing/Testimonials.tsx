import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aminata Diallo",
    initials: "AD",
    role: "Étudiante, Paris",
    quote:
      "Grâce à Kan Sira, j'ai enfin pu apprendre le Bambara de mes parents. Les leçons sont courtes et addictives, je ne peux plus m'arrêter !",
    color: "primary",
  },
  {
    name: "Moussa Cissé",
    initials: "MC",
    role: "Ingénieur, Lyon",
    quote:
      "L'application est incroyablement bien faite. L'audio natif m'aide énormément avec la prononciation du Soninké. Un vrai plaisir d'apprendre.",
    color: "secondary",
  },
  {
    name: "Fatoumata Sacko",
    initials: "FS",
    role: "Professeure, Bamako",
    quote:
      "Je recommande Kan Sira à tous mes élèves. La gamification rend l'apprentissage fun et les exercices sont très bien conçus.",
    color: "gold",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-background/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Ce qu'en disent nos apprenants
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto">
            Rejoignez une communauté passionnée par les langues africaines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow relative"
            >
              {/* Quote icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  t.color === "primary"
                    ? "bg-primary/10"
                    : t.color === "secondary"
                    ? "bg-secondary/10"
                    : "bg-gold/10"
                }`}
              >
                <Quote
                  size={18}
                  className={
                    t.color === "primary"
                      ? "text-primary"
                      : t.color === "secondary"
                      ? "text-secondary"
                      : "text-gold"
                  }
                />
              </div>

              {/* Quote */}
              <p className="text-sm text-dark/70 leading-relaxed mb-6">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    t.color === "primary"
                      ? "bg-primary"
                      : t.color === "secondary"
                      ? "bg-secondary"
                      : "bg-gold"
                  }`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">{t.name}</p>
                  <p className="text-xs text-dark/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
