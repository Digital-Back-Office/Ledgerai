import { useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "../Link";
import Logo from '../../../public/Logo.png'

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.gtag?.("event", "scrolled_to_bottom", { event_category: "engagement" });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-white border-t border-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-24 sm:w-32 md:w-36 lg:w-40 h-auto"
          />
        </Link>
        <p className="text-slate-400 text-xs">© 2025 Ledger AI. All rights reserved.</p>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/blogs" className="hover:text-slate-600 transition-colors">
            Blogs
          </Link>
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
