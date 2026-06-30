import { useRef, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Nav } from "./Nav";
import { HeroSection } from "./HeroSection";
import { ShowcaseSection } from "./ShowcaseSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks } from "./HowItWorks";
import { FaqSection } from "./FaqSection";
import { BookDemoSection } from "./BookDemoSection";
import { Footer } from "./Footer";
import { EmailPopupProvider } from "./EmailPopupContext";
import { CookieConsent } from "../CookieConsent";
import { TryItFree } from "./TryItFree";
import { SEO } from "../SEO";

// ─── Landing Page Schema-LD Structured Data Graph ─────────────────────────────
const landingPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ledgerai.backoffice.digital/#organization",
      "name": "Ledger AI",
      "url": "https://ledgerai.backoffice.digital/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ledgerai.backoffice.digital/favicon.svg"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ledgerai.backoffice.digital/#website",
      "url": "https://ledgerai.backoffice.digital/",
      "name": "Ledger AI",
      "publisher": {
        "@id": "https://ledgerai.backoffice.digital/#organization"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://ledgerai.backoffice.digital/#application",
      "name": "Ledger AI",
      "url": "https://ledgerai.backoffice.digital/",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 compatible browser",
      "description": "AI-powered bookkeeping and accounting automation software that extracts transaction details from invoices, receipts, and bank statements to generate Trial Balances.",
      "publisher": {
        "@id": "https://ledgerai.backoffice.digital/#organization"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://ledgerai.backoffice.digital/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does Ledger AI automate bookkeeping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ledger AI utilizes advanced machine learning and computer vision models to automatically extract transaction details (including transaction dates, supplier details, amounts, and VAT rate splits) from emailed documents, PDFs, and photographed receipts. It then structures this data and syncs it directly to your general ledger without manual data entry."
          }
        },
        {
          "@type": "Question",
          "name": "Is Ledger AI compatible with standard UK accounting software?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Ledger AI is built to fit into your existing workflow. We offer seamless direct integrations via API with leading UK accounting software, including Xero, QuickBooks Online, and Sage. This ensures your client ledgers are updated in real-time, removing the need for manual CSV exports and uploads."
          }
        },
        {
          "@type": "Question",
          "name": "How does Ledger AI handle Making Tax Digital (MTD) compliance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ledger AI is fully MTD-compliant. It establishes a continuous, unbroken digital link from the raw document ingestion phase through to your accounting ledgers. This guarantees that your firm's and clients' record keeping complies with HMRC's strict digital link requirements for VAT and ITSA reporting."
          }
        },
        {
          "@type": "Question",
          "name": "Can Ledger AI handle complex invoices with multiple VAT rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Unlike basic OCR tools, our intelligent extraction engine reads invoices line-by-line to identify separate VAT rates (standard 20%, reduced 5%, or zero-rated) and line descriptions. It automatically splits the transaction and applies the correct tax codes to the respective ledger lines."
          }
        },
        {
          "@type": "Question",
          "name": "What is the accuracy rate of data extraction?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ledger AI achieves an industry-leading average data extraction accuracy rate of 98%. To ensure complete reliability, any low-confidence extractions are automatically routed to a review queue for your team to check and approve, ensuring incorrect data is never posted."
          }
        },
        {
          "@type": "Question",
          "name": "How secure is client data on your platform?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Security is our highest priority. Ledger AI uses bank-grade AES-256 encryption protocols to protect data both in transit and at rest. We are fully compliant with UK GDPR regulations, and our infrastructure is built on secure, SOC 2-compliant cloud environments."
          }
        }
      ]
    }
  ]
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LedgerAI() {
  const bookingRef = useRef<HTMLDivElement>(null);

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

    // Check URL hash on load and scroll to corresponding section
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        }
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      observers.forEach((obs) => obs?.disconnect());
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, []);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.gtag?.("event", "book_demo_clicked", { event_category: "engagement", event_label: "nav" })
  };

  return (
    <EmailPopupProvider>
      <SEO
        title="Ledger AI | AI-Powered Bookkeeping & Accounting Automation"
        description="Save 80% of the time you spend on bookkeeping. Ledger AI extracts statements from emails, PDFs, Excel, and images, and builds a Trial Balance automatically."
        canonicalUrl="https://ledgerai.backoffice.digital/"
        ogTitle="Ledger AI | AI-Powered Bookkeeping & Accounting Automation"
        ogDescription="AI-powered bookkeeping and accounting automation for modern accounting firms."
        jsonLd={landingPageJsonLd}
      />
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
        <TryItFree scrollToBooking={scrollToBooking} />
        <FeaturesSection />
        <HowItWorks />
        <FaqSection />
        <div ref={bookingRef}>
          <BookDemoSection />
        </div>
        <Footer />
        <CookieConsent />
      </div>
    </EmailPopupProvider>
  );
}
