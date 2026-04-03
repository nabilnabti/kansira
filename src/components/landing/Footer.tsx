import { useNavigate } from "react-router-dom";
import { Mascot } from "../ui/Mascot";

export default function Footer() {
  const navigate = useNavigate();
  const scrollTo = (id: string) => {
    if (id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Mascot size={32} expression="happy" />
              <span className="font-heading text-xl font-bold text-primary">
                Kan Sira
              </span>
            </div>
            <p className="mt-3 text-sm text-white/40 leading-relaxed max-w-xs">
              Apprends le Bambara et le Soninké de manière ludique et
              interactive, ou que tu sois.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Accueil", href: "#" },
                { label: "Fonctionnalites", href: "#features" },
                { label: "Tarifs", href: "#pricing" },
                { label: "Contact", href: "#cta" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-white/40 hover:text-primary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-white/40 hover:text-primary transition-colors cursor-pointer"
                >
                  Se connecter
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Mentions legales", "Politique de confidentialite"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-white/60 mb-4">
              Langues
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-white/40">
                <span className="mr-2">{"\ud83c\uddf2\ud83c\uddf1"}</span>
                Bambara
              </li>
              <li className="text-sm text-white/40">
                <span className="mr-2">{"\ud83c\uddf2\ud83c\uddf1"}</span>
                Soninké
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; 2026 Kan Sira. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-sm text-white/30">
            Fait avec
            <span className="text-accent mx-0.5">&hearts;</span>
            pour les langues africaines
          </div>
        </div>
      </div>
    </footer>
  );
}
