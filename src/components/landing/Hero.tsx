import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mascot } from "../ui/Mascot";

const floatingElements = [
  { char: "ɛ", color: "#FF6B00", x: -60, y: -40, delay: 0, size: 32 },
  { char: "ɔ", color: "#2D9F4F", x: 70, y: -30, delay: 0.5, size: 28 },
  { char: "ŋ", color: "#F4A100", x: -80, y: 40, delay: 1, size: 26 },
  { char: "ɲ", color: "#E63946", x: 80, y: 50, delay: 1.5, size: 30 },
  { char: "★", color: "#F4A100", x: -50, y: -80, delay: 0.3, size: 20 },
  { char: "★", color: "#FF6B00", x: 60, y: -70, delay: 0.8, size: 16 },
  { char: "♪", color: "#2D9F4F", x: -90, y: 10, delay: 1.2, size: 22 },
  { char: "📖", color: "", x: 90, y: 0, delay: 0.7, size: 24 },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-white pt-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Mascot with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Floating letters and decorations */}
              {floatingElements.map((el, i) => (
                <motion.div
                  key={i}
                  className="absolute font-black select-none pointer-events-none"
                  style={{
                    left: `calc(50% + ${el.x}px)`,
                    top: `calc(50% + ${el.y}px)`,
                    fontSize: el.size,
                    color: el.color,
                  }}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, el.delay > 0.8 ? 10 : -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + el.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: el.delay,
                  }}
                >
                  {el.char}
                </motion.div>
              ))}

              {/* Mascot */}
              <Mascot size={250} expression="excited" />
            </div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left order-1 lg:order-2"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-dark leading-tight"
            >
              La methode{" "}
              <span className="text-primary">gratuite</span>,{" "}
              <span className="text-secondary">fun</span> et{" "}
              <span className="text-gold">efficace</span>{" "}
              pour apprendre le{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Bambara</span>
                <motion.span
                  className="absolute left-[-4px] right-[-4px] top-[10%] bottom-[5%] rounded-sm bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                    times: [0, 0.35, 0.7, 1],
                  }}
                  style={{ originX: 0, transformOrigin: "left" }}
                />
              </span>{" "}
              et le{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Soninké</span>
                <motion.span
                  className="absolute left-[-4px] right-[-4px] top-[10%] bottom-[5%] rounded-sm bg-secondary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 1, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                    times: [0, 0.35, 0.7, 1],
                    delay: 1.7,
                  }}
                  style={{ originX: 0, transformOrigin: "left" }}
                />
              </span>{" "}
              !
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => navigate("/signup")}
                className="btn-3d-primary bg-primary hover:bg-primary-light text-white rounded-2xl px-10 py-4 text-base font-bold uppercase tracking-wider cursor-pointer"
              >
                C'est parti !
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white hover:bg-gray-50 text-dark border-2 border-gray-200 rounded-2xl px-10 py-4 text-base font-bold uppercase tracking-wider cursor-pointer border-b-4 border-b-gray-300 active:border-b-0 active:translate-y-1 transition-all"
              >
                J'ai déjà un compte
              </button>
            </motion.div>

            {/* Language pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex gap-4 justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2.5">
                <span className="text-lg">{"\ud83c\uddf2\ud83c\uddf1"}</span>
                <span className="font-bold text-sm text-primary">Bambara</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-5 py-2.5">
                <span className="text-lg">{"\ud83c\uddf2\ud83c\uddf1"}</span>
                <span className="font-bold text-sm text-secondary">Soninké</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
