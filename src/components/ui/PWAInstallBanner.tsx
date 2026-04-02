import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, MoreVertical } from "lucide-react";
import { Mascot } from "./Mascot";

const DISMISS_KEY = "pwa-install-banner-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const timestamp = Number(raw);
    if (Date.now() - timestamp < DISMISS_DURATION_MS) return true;
    localStorage.removeItem(DISMISS_KEY);
    return false;
  } catch {
    return false;
  }
}

export function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => setVisible(true), 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") {
        dismiss();
      }
      deferredPrompt.current = null;
    }
  };

  const ios = isIOS();

  // Only show on mobile (< 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <AnimatePresence>
      {visible && isMobile && (
        <motion.div
          initial={{ y: -140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -140, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-[100] px-3 pt-[calc(env(safe-area-inset-top)+8px)]"
        >
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-4 flex items-start gap-3 mx-auto max-w-md">
            {/* Mascot */}
            <div className="shrink-0 pt-1">
              <Mascot size={56} expression="waving" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark text-sm leading-tight">
                Installez Kan Sira sur votre téléphone !
              </p>

              {ios ? (
                <p className="text-xs text-dark/60 mt-1.5 leading-relaxed">
                  Appuyez sur{" "}
                  <Share className="inline-block w-3.5 h-3.5 -mt-0.5 text-primary" />{" "}
                  puis <span className="font-medium">&laquo;&nbsp;Sur l'écran d'accueil&nbsp;&raquo;</span>
                </p>
              ) : (
                <p className="text-xs text-dark/60 mt-1.5 leading-relaxed">
                  Appuyez sur <span className="font-medium">&laquo;&nbsp;Installer&nbsp;&raquo;</span> ou{" "}
                  <MoreVertical className="inline-block w-3.5 h-3.5 -mt-0.5" />{" "}
                  &rarr; <span className="font-medium">&laquo;&nbsp;Installer l'application&nbsp;&raquo;</span>
                </p>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-2 mt-3">
                {!ios && (
                  <button
                    onClick={handleInstall}
                    className="bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Installer
                  </button>
                )}
                <button
                  onClick={dismiss}
                  className="text-xs text-dark/50 font-medium px-3 py-1.5 rounded-lg hover:bg-dark/5 transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={dismiss}
              className="shrink-0 p-1 rounded-full hover:bg-dark/5 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-dark/40" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
