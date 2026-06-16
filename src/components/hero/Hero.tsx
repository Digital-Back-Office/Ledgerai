import { useRef, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Nav } from "./Nav";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks } from "./HowItWorks";
import { BookDemoSection } from "./BookDemoSection";
import { Footer } from "./Footer";
import { EmailPopupProvider } from "./EmailPopupContext";
import { CookieConsent } from "../CookieConsent";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LedgerAI() {
  const bookingRef = useRef(null);

  useEffect(() => {
    const sections = [
      { id: "features", label: "features" },
      { id: "how-it-works", label: "how_it_works" },
      { id: "book-demo", label: "book_demo" },
    ];
    const observers = sections.map(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            window.gtag?.("event", "section_view", { event_category: "scroll_funnel", event_label: label });
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.gtag?.("event", "book_demo_clicked", { event_category: "engagement", event_label: "nav" })
  };

  return (
    <EmailPopupProvider>
      <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
        `}</style>

        <TopBar />
        <Nav scrollToBooking={scrollToBooking} />
        <HeroSection scrollToBooking={scrollToBooking} />
        <ShowcaseSection />
        <FeaturesSection />
        <HowItWorks />
        <div ref={bookingRef}>
          <BookDemoSection />
        </div>
        <Footer />
        <CookieConsent />
      </div>
    </EmailPopupProvider>
  );
}
