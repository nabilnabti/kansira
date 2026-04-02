import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Gamepad2,
  Trophy,
  Smartphone,
  Volume2,
  Gift,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    emoji: "\ud83c\udfae",
    title: "Exercices variés",
    description:
      "QCM, écoute, traduction, dictée... Des exercices diversifiés pour un apprentissage complet.",
  },
  {
    icon: Trophy,
    emoji: "\ud83c\udfc6",
    title: "Gamification",
    description:
      "Gagnez des XP, débloquez des badges et maintenez votre série quotidienne pour rester motivé.",
  },
  {
    icon: Smartphone,
    emoji: "\ud83d\udcf1",
    title: "Hors ligne",
    description:
      "Téléchargez vos leçons et apprenez partout, même sans connexion internet.",
  },
  {
    icon: Volume2,
    emoji: "\ud83d\udd0a",
    title: "Audio natif",
    description:
      "Écoutez la prononciation authentique par des locuteurs natifs pour chaque mot et phrase.",
  },
  {
    icon: Gift,
    emoji: "\ud83c\udd93",
    title: "Gratuit",
    description:
      "Commencez gratuitement avec le premier module complet. Aucune carte bancaire requise.",
  },
  {
    icon: Globe,
    emoji: "\ud83c\udf0d",
    title: "2 langues",
    description:
      "Bambara et Soninké, deux langues majeures d'Afrique de l'Ouest, dans une seule application.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-20 bg-background/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Tout pour apprendre efficacement
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto">
            Une application pensée pour rendre l'apprentissage des langues
            africaines accessible, ludique et efficace.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">{feature.emoji}</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-dark mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-dark/50 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
