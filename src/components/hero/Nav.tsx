import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Link } from "../Link";

interface NavProps {
  scrollToBooking: () => void;
}

export const Nav = ({ scrollToBooking }: NavProps) => {
  const isHome = window.location.pathname === "/";

  const handleBookingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isHome) {
      scrollToBooking();
    } else {
      window.location.href = "/#book-demo";
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-10 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-[#13b5ea] flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">Ledger AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-medium">
          <Link href="/#features" className="hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">
            How it works
          </Link>
          <Link href="/blogs" className="hover:text-slate-900 transition-colors">
            Blogs
          </Link>
          <Link href="/#book-demo" className="hover:text-slate-900 transition-colors">
            Book a demo
          </Link>
        </div>
        <button
          onClick={handleBookingClick}
          className="bg-white text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg border border-slate-200 hover:border-[#13b5ea] hover:text-[#13b5ea] transition-colors cursor-pointer"
        >
          Book a Demo
        </button>
      </div>
    </motion.nav>
  );
};
