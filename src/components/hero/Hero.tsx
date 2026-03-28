import { useRef } from "react";
import { Nav } from "./Nav";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks } from "./HowItWorks";
import { BookDemoSection } from "./BookDemoSection";
import { Footer } from "./Footer";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LedgerAI() {
  const bookingRef = useRef(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      <Nav scrollToBooking={scrollToBooking} />
      <HeroSection scrollToBooking={scrollToBooking} />
      <FeaturesSection />
      <HowItWorks />
      <div ref={bookingRef}>
        <BookDemoSection />
      </div>
      <Footer />
    </div>
  );
}
