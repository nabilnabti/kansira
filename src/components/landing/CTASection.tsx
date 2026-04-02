import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mascot } from "../ui/Mascot";

/* Confetti pieces */
const confetti = [
  { shape: "circle", color: "#FFD54F", x: "10%", y: "20%", size: 12, delay: 0 },
  { shape: "rect", color: "#FFFFFF", x: "85%", y: "15%", size: 10, delay: 0.5 },
  { shape: "circle", color: "#2D9F4F", x: "75%", y: "80%", size: 8, delay: 1 },
  { shape: "rect", color: "#FFD54F", x: "15%", y: "75%", size: 14, delay: 0.3 },
  { shape: "circle", color: "#FFFFFF", x: "90%", y: "50%", size: 10, delay: 0.8 },
  { shape: "rect", color: "#2D9F4F", x: "5%", y: "50%", size: 8, delay: 1.2 },
];

export default function CTASection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="cta" className="relative bg-primary overflow-hidden" ref={ref}>
      {/* Floating confetti */}
      {confetti.map((c, i) => (
        <motion.div
          key={i}
          className="absolute opacity-30 pointer-events-none"
          style={{ left: c.x, top: c.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
        >
          {c.shape === "circle" ? (
            <div
              className="rounded-full"
              style={{ width: c.size, height: c.size, backgroundColor: c.color }}
            />
          ) : (
            <div
              className="rounded-sm"
              style={{ width: c.size, height: c.size, backgroundColor: c.color, transform: "rotate(45deg)" }}
            />
          )}
        </motion.div>
      ))}

      {/* Star decorations */}
      {[
        { x: "20%", y: "25%", delay: 0 },
        { x: "80%", y: "30%", delay: 0.7 },
        { x: "70%", y: "70%", delay: 1.4 },
      ].map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute pointer-events-none"
          style={{ left: s.x, top: s.y }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex-shrink-0"
          >
            <Mascot size={200} expression="waving" />
          </motion.div>

          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white lowercase leading-tight"
            >
              pret a commencer ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-4 text-white/80 text-lg max-w-lg"
            >
              Rejoins des centaines d'apprenants et decouvre la richesse des
              langues Bambara et Soninke des aujourd'hui.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={() => navigate('/signup')}
                className="btn-3d-white bg-white text-primary rounded-2xl px-10 py-4 text-base font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
              >
                C'est parti !
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
