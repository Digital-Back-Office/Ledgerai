import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Upload, Brain, BarChart3 } from "lucide-react";

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
};

export const HowItWorks = () => {
  const { ref: howRef, isInView: howInView } = useScrollInView();

  return (
    <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6" ref={howRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={howInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-14"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#13b5ea] mb-3">How it works</p>
        <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight">
          From statement to report in minutes
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-10 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px bg-slate-200 z-0" />
        {[
          {
            step: "01",
            icon: Upload,
            title: "Receive client statements",
            desc: "Clients email statements directly to your firm. Ledger AI detects them automatically from HSBC, Barclays, NatWest, Lloyds and all major UK banks.",
          },
          {
            step: "02",
            icon: Brain,
            title: "AI extracts & categorises",
            desc: "Every transaction is parsed, de-duplicated and categorised — Revenue, HMRC VAT, Dividends, Travel, Payroll — trained on UK accounting standards.",
          },
          {
            step: "03",
            icon: BarChart3,
            title: "Reports & alerts ready",
            desc: "Your team is alerted the moment processing is complete. Download a reconciled trial balance or review category breakdowns per client.",
          },
        ].map(({ step, icon: Icon, title, desc }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 25 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.13, duration: 0.5 }}
            className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group z-10"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#13b5ea]/10 flex items-center justify-center group-hover:bg-[#13b5ea] transition-colors">
                <Icon size={20} className="text-[#13b5ea] group-hover:text-white transition-colors" />
              </div>
              <span
                className="text-4xl font-extrabold text-[#13b5ea] select-none"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {step}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
