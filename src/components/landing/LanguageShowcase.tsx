import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const languages = [
  {
    name: "Bamanankan",
    subtitle: "Bambara",
    flag: "\ud83c\uddf2\ud83c\uddf1",
    color: "primary",
    words: [
      { original: "I ni ce", translation: "Bonjour" },
      { original: "I ka k\u025bn\u025b wa?", translation: "Comment vas-tu ?" },
      { original: "Aw ni ce", translation: "Bonjour \u00e0 tous" },
    ],
  },
  {
    name: "Sooninkanxanne",
    subtitle: "Soninké",
    flag: "\ud83c\uddf2\ud83c\uddf1",
    color: "secondary",
    words: [
      { original: "An ni telle", translation: "Bonjour" },
      { original: "An kuta safe?", translation: "Comment vas-tu ?" },
      { original: "An ni wuro", translation: "Bonsoir" },
    ],
  },
];

export default function LanguageShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            Deux langues, une aventure
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto">
            Découvrez les richesses linguistiques du Mali à travers le Bambara et
            le Soninké. Commencez par les bases et progressez à votre rythme.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`group relative rounded-3xl border-2 p-8 bg-white transition-shadow hover:shadow-xl ${
                lang.color === "primary"
                  ? "border-primary/20 hover:border-primary/40"
                  : "border-secondary/20 hover:border-secondary/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{lang.flag}</span>
                <div>
                  <h3 className="font-heading font-bold text-xl text-dark">
                    {lang.name}
                  </h3>
                  <p className={`text-sm font-medium ${
                    lang.color === "primary" ? "text-primary" : "text-secondary"
                  }`}>
                    {lang.subtitle}
                  </p>
                </div>
              </div>

              {/* Sample words */}
              <div className="space-y-3">
                {lang.words.map((word, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.2 + j * 0.1, duration: 0.4 }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                      lang.color === "primary"
                        ? "bg-primary/5"
                        : "bg-secondary/5"
                    }`}
                  >
                    <span className="font-semibold text-dark text-sm">
                      {word.original}
                    </span>
                    <span className="text-dark/50 text-sm">
                      {word.translation}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer ${
                  lang.color === "primary"
                    ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                    : "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white"
                }`}
              >
                Apprendre le {lang.subtitle}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
