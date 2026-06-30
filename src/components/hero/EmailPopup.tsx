import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Loader, Check, Flame } from "lucide-react";

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_SPOTS = 20;
const BASE_SPOTS_LEFT = 15; // shown today / before the decay starts
const MIN_SPOTS_LEFT = 6; // bare minimum it can ever reach
const DECAY_START = new Date(2026, 5, 16); // 16 Jun 2026 (month is 0-indexed)
const DECAY_EVERY_DAYS = 2; // every two days...
const DECAY_AMOUNT = 3; // ...drop 3 spots

// Spots remaining for today's date: starts at 15, drops 3 every 2 days from
// 16 Jun 2026, never below 6. Sign-up takes one more (per-visitor real feel).
function computeSpotsLeft(signedUp: boolean): number {
  const days = Math.floor((Date.now() - DECAY_START.getTime()) / 86_400_000);
  let left = BASE_SPOTS_LEFT;
  if (days >= 0) {
    const periods = Math.floor(days / DECAY_EVERY_DAYS) + 1;
    left = BASE_SPOTS_LEFT - periods * DECAY_AMOUNT;
  }
  if (signedUp) left -= 1;
  return Math.max(MIN_SPOTS_LEFT, left);
}

export const EmailPopup = ({ isOpen, onClose }: EmailPopupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [spotsLeft, setSpotsLeft] = useState(BASE_SPOTS_LEFT);
  const inputRef = useRef<HTMLInputElement>(null);
  const emailStartedRef = useRef(false);
  const submittedRef = useRef(false);

  const handleClose = () => {
    if (!submittedRef.current) {
      window.gtag?.("event", "popup_dismissed", { event_category: "engagement" });
    }
    onClose();
  };

  // Recompute the spots from today's date + this visitor's sign-up whenever the
  // popup opens. Also drop the cursor straight into the email field on open.
  useEffect(() => {
    if (isOpen) {
      setSpotsLeft(computeSpotsLeft(!!localStorage.getItem("ledgerSignedUp")));
      emailStartedRef.current = false;
      submittedRef.current = false;
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const claimed = TOTAL_SPOTS - spotsLeft;
  const fillPercent = (claimed / TOTAL_SPOTS) * 100;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formDataObj = new FormData();
    formDataObj.append("email", email);
    formDataObj.append("source", "1 month free popup");
    formDataObj.append("access_key", "80f3160a-fb9c-46c6-afc6-577479cd4251");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("ledgerSignedUp", "true");
        submittedRef.current = true;
        window.gtag?.("event", "form_submitted", { event_category: "conversion", event_label: "popup" });
        setSpotsLeft(computeSpotsLeft(true));
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 bg-[#0a0e17] shadow-2xl"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-10"
            >
              <X size={22} />
            </button>

            <div className="relative px-10 pt-12 pb-10">
              {submitted ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.05 }}
                    className="relative w-20 h-20 mx-auto mb-6"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#13b5ea]/30 animate-ping" />
                    <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#13b5ea] shadow-xl shadow-[#13b5ea]/40">
                      <Check size={40} strokeWidth={3} className="text-white" />
                    </span>
                  </motion.div>

                  <h4 className="text-white font-bold text-3xl mb-3">You're in! 🎉</h4>
                  <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                    Your free month is reserved. Our team will reach out to you{" "}
                    <span className="text-white font-semibold">within 24 hours</span>{" "}
                    to get you set up.
                  </p>

                  <div className="inline-flex items-center gap-2 bg-[#13b5ea]/15 text-[#13b5ea] text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                    <Gift size={13} /> 1 month free locked in
                  </div>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-[#13b5ea]/15 text-[#13b5ea] text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                    <Gift size={12} /> Limited offer
                  </div>

                  <h3
                    className="text-4xl font-bold leading-tight text-white"
                  >
                    Get your <span className="text-[#13b5ea]">first month free</span>
                  </h3>
                  <p className="text-white/55 text-sm mt-3 mb-6 leading-relaxed">
                    Drop your email and we'll set up your account with a full
                    month of Ledger AI on us — no credit card needed.
                  </p>

                  {/* Scarcity / pressure */}
                  <div className="mb-7">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-amber-400 text-sm font-semibold">
                        <Flame size={14} /> Only {spotsLeft} of {TOTAL_SPOTS} free
                        spots left
                      </span>
                      <span className="text-white/40 text-xs">{claimed} claimed</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-3">
                    <input
                      ref={inputRef}
                      type="email"
                      name="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (!emailStartedRef.current && e.target.value.length > 0) {
                          emailStartedRef.current = true;
                          window.gtag?.("event", "email_started", { event_category: "engagement", event_label: "popup" });
                        }
                      }}
                      placeholder="Enter your work email"
                      className="w-full bg-white/5 border border-white/10 text-white text-base rounded-xl px-5 py-4 placeholder-white/30 focus:outline-none focus:border-[#13b5ea] focus:bg-white/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#13b5ea] text-white font-bold py-5 rounded-xl hover:bg-[#0e9fd2] transition-all text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#13b5ea]/40 hover:shadow-[#13b5ea]/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="animate-spin" /> Sending...
                        </>
                      ) : (
                        "Claim My Free Month"
                      )}
                    </button>
                  </form>
                  {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

                  <div className="flex items-center justify-center gap-5 mt-6 text-xs text-white/40">
                    {["No credit card", "Cancel anytime"].map((t, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <Check size={12} className="text-[#13b5ea]" /> {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
