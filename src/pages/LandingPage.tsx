import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import LanguageShowcase from "../components/landing/LanguageShowcase";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

/* SVG Wave divider */
function WaveDivider({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div className={`relative h-16 md:h-24 ${flip ? "rotate-180" : ""}`} style={{ backgroundColor: to }}>
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill={from}
      >
        <path d="M0,0 C360,120 1080,0 1440,80 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LanguageShowcase />
      <Features />
      <WaveDivider from="#FFFFFF" to="#E8F4FD" />
      <HowItWorks />
      <WaveDivider from="#E8F4FD" to="#FFFFFF" flip />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
