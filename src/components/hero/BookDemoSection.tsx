import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookingForm } from "./BookingForm";

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
};

export const BookDemoSection = () => {
  const bookingRef = useRef(null);
  const { ref: ctaRef, isInView: ctaInView } = useScrollInView();

  return (
    <section id="book-demo" className="py-24 bg-slate-50 border-t border-slate-100" ref={ctaRef}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left copy */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#13b5ea] mb-4">Book a demo</p>
            <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight mb-4">
              See Ledger AI in your firm's workflow
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-4">
              A focused 20-minute walkthrough — we'll show you how Ledger AI handles your clients' bank statements, categorises
              transactions and keeps your team instantly informed.
            </p>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#13b5ea] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">RH</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Rachel Hughes</p>
                    <p className="text-xs text-slate-400">Hughes & Associates</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-3 italic">
                  "Ledger AI transformed how we handle statements. What used to take a day now takes minutes. Exceptional accuracy."
                </p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#13b5ea] text-sm">
                      ★
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right form */}
          <div ref={bookingRef} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Reserve your slot</h3>
            <p className="text-slate-400 text-sm mb-6">No sales pitch. Just a live walkthrough tailored to accounting firms.</p>
            <BookingForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
