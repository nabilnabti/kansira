import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0\u20ac",
    period: "pour toujours",
    description: "Parfait pour decouvrir l'application",
    features: [
      "Module 1 gratuit",
      "5 lecons completes",
      "Exercices varies",
      "Audio natif",
    ],
    cta: "COMMENCER GRATUITEMENT",
    popular: false,
  },
  {
    name: "Premium",
    price: "4.99\u20ac",
    period: "/mois",
    description: "Acces illimite a tout le contenu",
    features: [
      "Tout le contenu",
      "100+ lecons",
      "Badges exclusifs",
      "Support prioritaire",
    ],
    cta: "ESSAYER PREMIUM",
    popular: true,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-black text-primary lowercase">
            des tarifs simples
          </h2>
          <p className="mt-4 text-dark/50 max-w-2xl mx-auto text-lg">
            Commence gratuitement et passe au Premium quand tu es pret.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "bg-primary text-white shadow-xl premium-glow"
                  : "bg-white border-2 border-gray-100 hover:border-primary/20"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-dark text-xs font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Populaire
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <h3
                  className={`font-heading font-bold text-xl ${
                    plan.popular ? "text-white" : "text-dark"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    plan.popular ? "text-white/70" : "text-dark/40"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <span
                  className={`font-heading text-5xl font-bold ${
                    plan.popular ? "text-white" : "text-dark"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    plan.popular ? "text-white/70" : "text-dark/40"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular
                          ? "bg-white/20"
                          : "bg-secondary/10"
                      }`}
                    >
                      <Check
                        size={12}
                        className={
                          plan.popular ? "text-white" : "text-secondary"
                        }
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white/90" : "text-dark/60"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 3D CTA Button */}
              <button
                onClick={() => navigate('/signup')}
                className={`w-full rounded-2xl py-3.5 text-sm font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  plan.popular
                    ? "bg-white text-primary btn-3d-white"
                    : "bg-primary text-white btn-3d-primary"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
