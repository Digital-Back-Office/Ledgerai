import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, CheckCircle2, Loader } from "lucide-react";

interface HeroSectionProps {
  scrollToBooking: () => void;
}

export const HeroSection = ({ scrollToBooking }: HeroSectionProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const emailStartedRef = useRef(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("email", email);
    formDataObj.append("source", "Hero lead magnet");
    formDataObj.append("access_key", "80f3160a-fb9c-46c6-afc6-577479cd4251");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("ledgerSignedUp", "true");
        window.gtag?.("event", "form_submitted", { event_category: "conversion", event_label: "hero" });
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-white">
      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-4 py-2 rounded-full mb-7 uppercase tracking-widest"
        >
          <Sparkles size={12} /> AI-powered bookkeeping
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6"
        >
          Save <span className="text-[#13b5ea]">80% of the time</span> you
          spend on bookkeeping
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Ledger AI extracts statements from emails, PDFs, Excel, and images,
          then converts them to clean books, categorizes spending, and builds a
          trial balance — automatically.
        </motion.p>

        {/* Prominent email lead magnet */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-3 bg-[#13b5ea]/10 text-slate-800 rounded-2xl px-6 py-5 max-w-lg mx-auto">
              <CheckCircle2 size={24} className="text-[#13b5ea] shrink-0" />
              <p className="text-sm font-medium text-left">
                You're in! Our team will reach out to you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={onSubmit}
                className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl shadow-xl shadow-[#13b5ea]/15 border-2 border-[#13b5ea]/20 transition-all focus-within:border-[#13b5ea] focus-within:shadow-[#13b5ea]/30"
              >
                <input
                  type="email"
                  name="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!emailStartedRef.current && e.target.value.length > 0) {
                      emailStartedRef.current = true;
                      window.gtag?.("event", "email_started", { event_category: "engagement", event_label: "hero" });
                    }
                  }}
                  placeholder="Enter your work email"
                  className="flex-1 bg-transparent text-slate-900 text-base rounded-xl px-5 py-4 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => window.gtag?.("event", "cta_click", { event_category: "engagement", event_label: "hero" })}
                  className="inline-flex items-center justify-center gap-2 bg-[#13b5ea] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#0e9fd2] transition-colors text-base shadow-lg shadow-[#13b5ea]/30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Get Early Access <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              <button
                onClick={scrollToBooking}
                className="text-sm text-gray-500 hover:text-gray-800 font-medium mt-4 transition-colors"
              >
                or book a live demo →
              </button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-gray-500"
        >
          {["No credit card required", "SOC 2 compliant", "GDPR ready"].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check size={14} className="text-[#13b5ea]" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
