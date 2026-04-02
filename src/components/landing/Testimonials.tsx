import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    name: "Aminata Diallo",
    initials: "AD",
    role: "Etudiante, Paris",
    quote:
      "Grace a Kan Sira, j'ai enfin pu apprendre le Bambara de mes parents. Les lecons sont courtes et addictives, je ne peux plus m'arreter !",
    color: "primary",
    rating: 5,
  },
  {
    name: "Moussa Cisse",
    initials: "MC",
    role: "Ingenieur, Lyon",
    quote:
      "L'application est incroyablement bien faite. L'audio natif m'aide enormement avec la prononciation du Soninke. Un vrai plaisir d'apprendre.",
    color: "secondary",
    rating: 5,
  },
  {
    name: "Fatoumata Sacko",
    initials: "FS",
    role: "Professeure, Bamako",
    quote:
      "Je recommande Kan Sira a tous mes eleves. La gamification rend l'apprentissage fun et les exercices sont tres bien concus.",
    color: "gold",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#F4A100">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-black text-primary lowercase">
            ce qu'en disent nos apprenants
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto text-lg">
            Rejoins une communaute passionnee par les langues africaines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:shadow-2xl transition-shadow relative"
            >
              <StarRating count={t.rating} />

              {/* Quote */}
              <p className="text-base text-dark/70 leading-relaxed mb-8">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold ${
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
                  <p className="font-bold text-dark">{t.name}</p>
                  <p className="text-sm text-dark/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
