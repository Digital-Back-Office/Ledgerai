import { motion } from "framer-motion";
import { Gift, ArrowRight, Check } from "lucide-react";
import heroImg from "../../assets/hero.png";
import { useEmailPopup } from "./EmailPopupContext";

export const ShowcaseSection = () => {
  const { open } = useEmailPopup();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Picture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-1"
        >
          <img
            src={heroImg}
            alt="Ledger AI data pipeline"
            className="w-full h-auto object-contain rounded-2xl"
          />
        </motion.div>

        {/* 1 month free offer — left aligned */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-2 text-left"
        >
          <div className="inline-flex items-center gap-2 bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Gift size={12} /> 1 month free
          </div>

          <h2
            className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Try Ledger AI free for a{" "}
            <span className="text-[#13b5ea]">full month</span>
          </h2>
          <p className="text-lg text-gray-600 mb-7 max-w-lg">
            See your books clean themselves. Enter your email and we'll set you
            up with a full month of Ledger AI — completely free, no card
            required.
          </p>

          <div className="space-y-3 mb-8">
            {[
              "Automatic statement extraction & categorization",
              "Instant trial balance generation",
              "Cancel anytime — no strings attached",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700">
                <span className="w-5 h-5 rounded-full bg-[#13b5ea]/10 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-[#13b5ea]" />
                </span>
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>

          <button
            onClick={open}
            className="inline-flex items-center gap-2 bg-[#13b5ea] text-white font-semibold px-9 py-4 rounded-xl hover:bg-[#0e9fd2] transition-colors text-base shadow-lg shadow-[#13b5ea]/30"
          >
            Claim 1 Month Free <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
