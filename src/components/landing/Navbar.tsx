import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot } from "../ui/Mascot";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 font-heading text-xl font-bold text-primary"
          >
            <Mascot size={36} expression="happy" />
            Kan Sira
          </a>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-dark/60 hover:text-primary transition-colors cursor-pointer uppercase tracking-wider"
            >
              J'ai déjà un compte
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="btn-3d-green bg-secondary hover:bg-secondary-light text-white rounded-2xl px-6 py-2.5 text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              C'est parti !
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-dark p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="text-left text-sm font-bold text-dark/60 hover:text-primary transition-colors py-2 cursor-pointer uppercase tracking-wider"
              >
                J'ai déjà un compte
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/signup"); }}
                className="btn-3d-green bg-secondary hover:bg-secondary-light text-white rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                C'est parti !
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
