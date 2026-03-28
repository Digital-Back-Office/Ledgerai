import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface NavProps {
  scrollToBooking: () => void;
}

export const Nav = ({ scrollToBooking }: NavProps) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#13b5ea] flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Ledger AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-medium">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How it works
          </a>
          <a href="#book-demo" className="hover:text-slate-900 transition-colors">
            Book a demo
          </a>
        </div>
        <button
          onClick={scrollToBooking}
          className="bg-[#13b5ea] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0e9fd2] transition-colors"
        >
          Book a Demo
        </button>
      </div>
    </motion.nav>
  );
};
