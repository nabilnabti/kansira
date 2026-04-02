import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mascot } from "../ui/Mascot";

/* Floating star SVG */
function Star({ color = "#F4A100", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

/* Sound wave SVG */
function SoundWaves() {
  return (
    <div className="flex items-center gap-1">
      {[0, 0.2, 0.4, 0.6, 0.4, 0.2, 0].map((delay, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-primary"
          animate={{ height: [8, 24, 8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: delay + i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const sections = [
  {
    id: "gamification",
    title: "une methode ludique",
    description:
      "Gagne des XP à chaque bonne réponse, débloque des badges et maintiens ta série quotidienne. Avec Kan Sira, apprendre les langues africaines devient un jeu dont tu ne te lasseras jamais.",
    mascotExpression: "excited" as const,
    reverse: false,
    renderDecorations: () => (
      <>
        {[
          { x: -30, y: -50, delay: 0 },
          { x: 50, y: -40, delay: 0.5 },
          { x: -60, y: 30, delay: 1 },
          { x: 60, y: 40, delay: 1.5 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
          >
            <Star color={i % 2 === 0 ? "#F4A100" : "#FF6B00"} size={i % 2 === 0 ? 24 : 18} />
          </motion.div>
        ))}
        <motion.span
          className="absolute text-3xl"
          style={{ left: "calc(50% + 70px)", top: "calc(50% - 10px)" }}
          animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🏆
        </motion.span>
      </>
    ),
  },
  {
    id: "motivation",
    title: "une motivation toujours au top",
    description:
      "Les rappels quotidiens et les defis entre amis te gardent motive. Ta serie de jours consecutifs est ta fierte — ne la laisse pas s'arreter !",
    mascotExpression: "waving" as const,
    reverse: true,
    renderDecorations: () => (
      <>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute text-3xl"
            style={{
              left: `calc(50% + ${-40 + i * 40}px)`,
              top: `calc(50% + ${-60 + i * 10}px)`,
            }}
            animate={{ scale: [1, 1.2, 1], y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          >
            🔥
          </motion.span>
        ))}
      </>
    ),
  },
  {
    id: "audio",
    title: "audio natif. prononciation parfaite.",
    description:
      "Chaque mot, chaque phrase est prononce par des locuteurs natifs. Ecoute, repete, et perfectionne ton accent bambara ou soninke.",
    mascotExpression: "happy" as const,
    reverse: false,
    renderDecorations: () => (
      <motion.div
        className="absolute"
        style={{ right: "-30px", top: "calc(50% - 20px)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <SoundWaves />
      </motion.div>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="py-12 bg-white">
      {sections.map((section) => (
        <FeatureSection key={section.id} section={section} />
      ))}
    </section>
  );
}

function FeatureSection({ section }: { section: (typeof sections)[number] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            section.reverse ? "direction-rtl" : ""
          }`}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: section.reverse ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className={section.reverse ? "lg:order-2" : ""}
          >
            <h3 className="font-heading text-4xl md:text-5xl font-black text-primary lowercase leading-tight">
              {section.title}
            </h3>
            <p className="mt-6 text-lg text-dark/60 leading-relaxed max-w-lg">
              {section.description}
            </p>
          </motion.div>

          {/* Mascot + Decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`relative flex items-center justify-center ${
              section.reverse ? "lg:order-1" : ""
            }`}
          >
            <div className="relative">
              {section.renderDecorations()}
              <Mascot size={200} expression={section.mascotExpression} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
