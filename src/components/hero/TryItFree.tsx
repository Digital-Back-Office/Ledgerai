import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowRight,
  Landmark,
  Lock,
  X,
} from "lucide-react";

// const API_BASE_URL = window.location.origin.includes("localhost")
//   ? "http://localhost:8000/api/v1"
//   : "/api/v1";
const API_BASE_URL = "https://la.backoffice.digital/api/v1";
const DAILY_LIMIT = 3;
const USAGE_KEY = "guestPdfConversions";
const EMAIL_KEY = "guestEmail";

const FALLBACK_BANKS = [
  "HSBC", "HSBC Commercial Card", "Barclays", "NatWest", "Lloyds",
  "Monzo", "Starling", "Metro Bank", "Virgin Money", "American Express", "ANNA",
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const readLocalUsage = (): number => {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date: string; count: number };
    return parsed.date === todayKey() ? parsed.count : 0;
  } catch { return 0; }
};

const writeLocalUsage = (count: number) =>
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: todayKey(), count }));

const readStoredEmail = () => localStorage.getItem(EMAIL_KEY) || "";
const writeStoredEmail = (email: string) => localStorage.setItem(EMAIL_KEY, email);

interface ConversionResult {
  bank: string;
  transactionCount: number;
  sentTo: string;
  remaining: number;
}

// ── Email capture modal ────────────────────────────────────────────────────────
function EmailModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (email: string) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(readStoredEmail());
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => {
    if (!isValidEmail(email)) { setErr("Please enter a valid email address."); return; }
    writeStoredEmail(email.trim().toLowerCase());
    onConfirm(email.trim().toLowerCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 bg-[#13b5ea]/10 rounded-xl flex items-center justify-center mb-5">
          <Mail size={22} className="text-[#13b5ea]" />
        </div>

        <h3 className="text-slate-900 font-bold text-xl mb-1">Where should we send it?</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          We'll email you the Excel file the moment it's ready. We save your address so you
          won't need to enter it again.
        </p>

        <input
          ref={inputRef}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          className="w-full border border-slate-200 bg-slate-50 text-slate-900 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:border-[#13b5ea] focus:bg-white transition-all mb-2"
        />

        {err && (
          <p className="text-xs text-red-500 flex items-center gap-1 mb-3">
            <AlertCircle size={12} /> {err}
          </p>
        )}

        <button
          onClick={submit}
          className="w-full bg-[#13b5ea] text-white font-semibold py-3 rounded-xl hover:bg-[#0e9fd2] transition-colors text-sm flex items-center justify-center gap-2 mt-2"
        >
          Send my Excel <ArrowRight size={15} />
        </button>

        <p className="text-xs text-slate-400 text-center mt-3">
          No spam — just your statement. We'll include a demo invite too.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export const TryItFree = ({ scrollToBooking }: { scrollToBooking: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [supportedBanks, setSupportedBanks] = useState<string[]>(FALLBACK_BANKS);
  const [usedToday, setUsedToday] = useState(readLocalUsage());
  const [storedEmail, setStoredEmail] = useState(readStoredEmail());

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/lead-magnet/info`)
      .then((r) => (r.ok ? r.json() : null))
      .then((info) => {
        if (!info) return;
        if (Array.isArray(info.supported_banks) && info.supported_banks.length > 0)
          setSupportedBanks(info.supported_banks);
        setUsedToday((local) => Math.max(local, info.used_today ?? 0));
      })
      .catch(() => {});
  }, []);

  const remaining = Math.max(DAILY_LIMIT - usedToday, 0);

  const selectFile = (selected: File | null) => {
    setError("");
    setResult(null);
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF statements are supported in the free converter.");
      return;
    }
    if (selected.size > 15 * 1024 * 1024) {
      setError("File too large. Maximum size is 15 MB.");
      return;
    }
    setFile(selected);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files?.[0] ?? null);
  }, []);

  const handleConvertClick = () => {
    if (!file || remaining <= 0) return;
    // If we already have a stored email, go straight to processing
    if (storedEmail && isValidEmail(storedEmail)) {
      void doConvert(storedEmail);
    } else {
      setShowEmailModal(true);
    }
  };

  const handleEmailConfirm = (email: string) => {
    setShowEmailModal(false);
    setStoredEmail(email);
    void doConvert(email);
  };

  const doConvert = async (email: string) => {
    if (!file || processing) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      const response = await fetch(`${API_BASE_URL}/public/lead-magnet/process`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 429) {
          setUsedToday(DAILY_LIMIT);
          writeLocalUsage(DAILY_LIMIT);
        }
        throw new Error(data?.detail || "Failed to process the statement. Please try again.");
      }

      const newUsed = DAILY_LIMIT - Math.max(data.remaining_today ?? 0, 0);
      setUsedToday(newUsed);
      writeLocalUsage(newUsed);

      setResult({
        bank: data.detected_bank || "",
        transactionCount: data.transaction_count,
        sentTo: data.sent_to,
        remaining: data.remaining_today,
      });
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showEmailModal && (
          <EmailModal
            onConfirm={handleEmailConfirm}
            onClose={() => setShowEmailModal(false)}
          />
        )}
      </AnimatePresence>

      <section id="try-free" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#13b5ea] mb-3">
              Try it free — no signup
            </p>
            <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight">
              Convert a bank statement PDF to Excel
            </h2>
            <p className="text-slate-400 mt-3 text-base max-w-xl mx-auto">
              Upload a PDF bank statement and we'll email you a clean Excel file with every
              transaction extracted and AI-predicted spending categories — up to {DAILY_LIMIT} per
              day, completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
            {/* Uploader / result card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
              {remaining > 0 ? (
                <>
                  {/* Email reminder chip */}
                  {storedEmail && !result && (
                    <div className="flex items-center justify-between mb-4 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} className="text-[#13b5ea]" />
                        Sending to <strong className="text-slate-800">{storedEmail}</strong>
                      </span>
                      <button
                        onClick={() => { setStoredEmail(""); localStorage.removeItem(EMAIL_KEY); }}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="Change email"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl px-6 py-10 text-center transition-colors ${
                      dragging
                        ? "border-[#13b5ea] bg-[#13b5ea]/5"
                        : "border-slate-300 bg-white hover:border-[#13b5ea]/60"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-2 text-slate-700">
                        <FileText size={18} className="text-[#13b5ea]" />
                        <span className="text-sm font-semibold">{file.name}</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={28} className="mx-auto text-[#13b5ea] mb-3" />
                        <p className="text-sm font-semibold text-slate-700">
                          Drop your PDF statement here, or click to browse
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5">
                          Digital (text-based) PDFs only — scanned statements aren't supported yet
                        </p>
                      </>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3"
                    >
                      <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
                    </motion.div>
                  )}

                  {/* Success */}
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-5"
                    >
                      <p className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-1">
                        <CheckCircle2 size={16} /> Excel sent to {result.sentTo}
                      </p>
                      <p className="text-emerald-700 text-sm mb-3 leading-relaxed">
                        {result.bank ? `${result.bank} · ` : ""}
                        {result.transactionCount} transactions extracted and categorized. Check your
                        inbox — the email also includes a demo invite.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={scrollToBooking}
                          className="inline-flex items-center gap-1.5 bg-[#13b5ea] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#0e9fd2] transition-colors"
                        >
                          Book a demo <ArrowRight size={12} />
                        </button>
                        {result.remaining > 0 && (
                          <span className="text-xs text-emerald-600">
                            {result.remaining} free conversion{result.remaining !== 1 ? "s" : ""}{" "}
                            left today
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* CTA button */}
                  <button
                    onClick={handleConvertClick}
                    disabled={!file || processing}
                    className="mt-5 w-full bg-[#13b5ea] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0e9fd2] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Extracting & sending…
                      </>
                    ) : (
                      <>
                        <Mail size={15} /> Email me the Excel
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-3">
                    {remaining} of {DAILY_LIMIT} free conversions left today ·{" "}
                    {storedEmail ? (
                      <>
                        sending to <strong>{storedEmail}</strong> ·{" "}
                        <button
                          onClick={() => { setStoredEmail(""); localStorage.removeItem(EMAIL_KEY); }}
                          className="underline"
                        >
                          change
                        </button>
                      </>
                    ) : (
                      "we'll ask for your email next"
                    )}
                  </p>
                </>
              ) : (
                /* Daily limit reached */
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-[#13b5ea]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={22} className="text-[#13b5ea]" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">
                    You've used today's {DAILY_LIMIT} free conversions
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                    Come back tomorrow — or get unlimited statement processing, trial balances and
                    automated Gmail intake for your whole firm.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={scrollToBooking}
                      className="bg-[#13b5ea] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0e9fd2] transition-colors"
                    >
                      Book a Demo
                    </button>
                    <button
                      onClick={() => window.open('https://la.backoffice.digital/login', '_blank')}
                      className="text-sm font-semibold px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:border-[#13b5ea] hover:text-[#13b5ea] transition-colors"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Supported banks */}
            <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#13b5ea]/10 flex items-center justify-center">
                  <Landmark size={15} className="text-[#13b5ea]" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Supported banks</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {supportedBanks.map((bank) => (
                  <span
                    key={bank}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600"
                  >
                    {bank}
                  </span>
                ))}
              </div>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#13b5ea] mt-0.5 shrink-0" />
                  Excel emailed with every transaction and AI-predicted spending category
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#13b5ea] mt-0.5 shrink-0" />
                  Date, type, description, debit, credit and balance preserved
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-[#13b5ea] mt-0.5 shrink-0" />
                  We save your email locally — no need to enter it again
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  Digital PDF statements only — scanned copies coming soon
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};