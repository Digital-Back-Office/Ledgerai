import { BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#13b5ea] flex items-center justify-center">
            <BookOpen size={13} className="text-white" />
          </div>
          <span className="text-slate-800 font-bold text-sm">Ledger AI</span>
        </div>
        <p className="text-slate-400 text-xs">© 2025 Ledger AI. All rights reserved.</p>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            GDPR
          </a>
        </div>
      </div>
    </footer>
  );
};
