import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

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

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <HelpCircle size={12} /> Questions & Answers
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Everything you need to know about our AI-powered bookkeeping automation and how it integrates into your UK accounting practice.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-slate-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-800 text-base sm:text-lg hover:text-[#13b5ea] transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 shrink-0 ml-4"
                  >
                    <ChevronDown size={20} />
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
                      <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
