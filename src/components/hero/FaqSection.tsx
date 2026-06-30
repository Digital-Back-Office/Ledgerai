import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does Ledger AI automate bookkeeping?",
    answer: "Ledger AI utilizes advanced machine learning and computer vision models to automatically extract transaction details (including transaction dates, supplier details, amounts, and VAT rate splits) from emailed documents, PDFs, and photographed receipts. It then structures this data and syncs it directly to your general ledger without manual data entry.",
  },
  {
    question: "Is Ledger AI compatible with standard UK accounting software?",
    answer: "Yes, Ledger AI is built to fit into your existing workflow. We offer seamless direct integrations via API with leading UK accounting software, including Xero, QuickBooks Online, and Sage. This ensures your client ledgers are updated in real-time, removing the need for manual CSV exports and uploads.",
  },
  {
    question: "How does Ledger AI handle Making Tax Digital (MTD) compliance?",
    answer: "Ledger AI is fully MTD-compliant. It establishes a continuous, unbroken digital link from the raw document ingestion phase through to your accounting ledgers. This guarantees that your firm's and clients' record keeping complies with HMRC's strict digital link requirements for VAT and ITSA reporting.",
  },
  {
    question: "Can Ledger AI handle complex invoices with multiple VAT rates?",
    answer: "Absolutely. Unlike basic OCR tools, our intelligent extraction engine reads invoices line-by-line to identify separate VAT rates (standard 20%, reduced 5%, or zero-rated) and line descriptions. It automatically splits the transaction and applies the correct tax codes to the respective ledger lines.",
  },
  {
    question: "What is the accuracy rate of data extraction?",
    answer: "Ledger AI achieves an industry-leading average data extraction accuracy rate of 98%. To ensure complete reliability, any low-confidence extractions are automatically routed to a review queue for your team to check and approve, ensuring incorrect data is never posted.",
  },
  {
    question: "How secure is client data on your platform?",
    answer: "Security is our highest priority. Ledger AI uses bank-grade AES-256 encryption protocols to protect data both in transit and at rest. We are fully compliant with UK GDPR regulations, and our infrastructure is built on secure, SOC 2-compliant cloud environments.",
  },
];

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
};

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: faqRef, isInView: faqInView } = useScrollInView();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-slate-50 border-t border-slate-100 py-24"
      ref={faqRef}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#13b5ea] mb-3">
            FAQ
          </p>
          <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 mt-3 text-base max-w-lg mx-auto">
            Everything you need to know about our AI-powered bookkeeping automation and how it integrates into your UK accounting practice.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-bold text-slate-800 text-base sm:text-lg hover:text-[#13b5ea] transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 shrink-0 ml-4"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-500 text-sm sm:text-base leading-relaxed border-t border-slate-100/50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
