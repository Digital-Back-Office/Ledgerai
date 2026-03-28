import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronRight, Check } from "lucide-react";
import heroImg from "../../assets/hero.png";

interface HeroSectionProps {
  scrollToBooking: () => void;
}

export const HeroSection = ({ scrollToBooking }: HeroSectionProps) => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-24 pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest"
          >
            <Sparkles size={11} /> AI-powered bookkeeping
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Turn messy financial data into{" "}
            <span className="text-[#13b5ea]">clean books</span>{" "}
            automatically
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
          >
            Extract statements from emails, PDFs, Excel, and images. Convert to structured data, categorize spending, and generate trial
            balance instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scrollToBooking()}
              className="inline-flex items-center gap-2 bg-[#13b5ea] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#0e9fd2] transition-colors text-sm shadow-lg shadow-[#13b5ea]/25"
            >
              Book a Demo <ArrowRight size={16} />
            </button>
            <a
              href="#how-it-works"
              className="text-sm text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1 transition-colors"
            >
              See how it works <ChevronRight size={14} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 mt-10 text-sm text-gray-400"
          >
            {["No credit card required", "SOC 2 compliant", "GDPR ready"].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <Check size={13} className="text-[#13b5ea]" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — Pipeline Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <img src={heroImg} alt="Ledger AI Data Pipeline" className="w-full max-w-lg lg:max-w-xl h-auto object-contain rounded-2xl" />
        </motion.div>
      </div>
    </section>
  );
};
