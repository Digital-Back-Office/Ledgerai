import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Mail, Landmark, Brain, BarChart3, Bell, TrendingUp, PoundSterling, Users, Plane,
  FileText, Table2, Image as ImageIcon, Database, BookOpen, AlertCircle, Clock, CheckCircle2
} from "lucide-react";

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
};

const features = [
  {
    id: 0,
    icon: Mail,
    title: "Email Statement Detection",
    desc: "Connect your firm's inbox. Ledger AI detects incoming statements from client companies, extracts transaction data automatically and maps it to the correct client ledger.",
    visual: "email",
  },
  {
    id: 1,
    icon: Landmark,
    title: "Bank Statement Ingestion",
    desc: "Receive bank statements from any client — HSBC, Barclays, NatWest, Lloyds and more. Our engine reads every format: PDF exports, CSV downloads, emailed statements — no manual entry.",
    visual: "statements",
  },
  {
    id: 2,
    icon: Brain,
    title: "AI Spending Categorisation",
    desc: "Every transaction is categorised in real time — Revenue, HMRC VAT, Dividends, Travel, Payroll and more. Trained on UK accounting standards. Override with one click.",
    visual: "categorise",
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Trial Balance & Reports",
    desc: "Generate a fully-reconciled trial balance at any point. Export to Excel or PDF for review. Drill into any category or client in seconds.",
    visual: "balance",
  },
  {
    id: 4,
    icon: Bell,
    title: "Statement Alerts",
    desc: "The moment a client company sends a statement, your firm is alerted. Know instantly which statements have arrived, which are pending, and which need attention.",
    visual: "alerts",
  },
];

const StatementsVisual = () => {
  const banks = [
    { name: "HSBC", client: "Meridian Logistics Ltd", date: "01 Jan–31 Jan 2025", color: "#cc0000", txns: 142 },
    { name: "Barclays", client: "Thornton & Sons Ltd", date: "01 Jan–31 Jan 2025", color: "#00aeef", txns: 87 },
    { name: "NatWest", client: "Apex Property Group", date: "01 Dec–31 Dec 2024", color: "#6f2da8", txns: 203 },
    { name: "Lloyds", client: "Greenfield Retail Ltd", date: "01 Jan–31 Jan 2025", color: "#006a4e", txns: 64 },
  ];
  return (
    <div className="p-5 space-y-2.5">
      {banks.map((b, i) => (
        <motion.div
          key={b.name}
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-xs shrink-0"
            style={{ backgroundColor: b.color }}
          >
            {b.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800">
              {b.name} — {b.client}
            </p>
            <p className="text-[10px] text-gray-400">
              {b.date} · {b.txns} transactions
            </p>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.15 + 0.4, type: "spring" }}
            className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200"
          >
            Parsed
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

const EmailVisual = () => {
  const emails = [
    { from: "accounts@meridianlogistics.co.uk", subject: "January 2025 Statement — HSBC", time: "09:14" },
    { from: "finance@thorntonandsons.co.uk", subject: "Barclays Monthly Statement Attached", time: "10:02" },
    { from: "noreply@natwest.com", subject: "Apex Property Group — Statement Ready", time: "11:30" },
  ];
  return (
    <div className="p-5 space-y-2.5">
      {emails.map((e, i) => (
        <motion.div
          key={i}
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.18 }}
          className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#13b5ea]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Mail size={12} className="text-[#13b5ea]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 truncate">{e.from}</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{e.subject}</p>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">{e.time}</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.18 + 0.5 }}
            className="mt-2 ml-10 flex items-center gap-1.5 text-[10px] font-semibold text-[#13b5ea]"
          >
            <CheckCircle2 size={10} /> Statement detected & extracted
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const CategoriseVisual = () => {
  const txns = [
    { name: "Client Invoice Payment", cat: "Revenue", amount: "£18,500", color: "#10b981" },
    { name: "HMRC VAT Payment", cat: "HMRC VAT", amount: "£6,200", color: "#f59e0b" },
    { name: "Shareholder Distribution", cat: "Dividends", amount: "£5,000", color: "#6366f1" },
    { name: "British Airways", cat: "Travel", amount: "£1,240", color: "#0ea5e9" },
    { name: "Office Supplies", cat: "Overheads", amount: "£320", color: "#8b5cf6" },
  ];
  return (
    <div className="p-5 space-y-2">
      {txns.map(({ name, cat, amount, color }, i) => (
        <motion.div
          key={name}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm"
        >
          <span className="text-xs text-gray-700 flex-1 font-medium truncate">{name}</span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.15 + 0.35, type: "spring" }}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ backgroundColor: color + "18", color }}
          >
            {cat}
          </motion.span>
          <span className="text-xs text-gray-500 font-mono w-16 text-right shrink-0">{amount}</span>
        </motion.div>
      ))}
    </div>
  );
};

const AlertsVisual = () => {
  const alerts = [
    { company: "Meridian Logistics Ltd", bank: "HSBC", type: "received", color: "#10b981", icon: CheckCircle2 },
    { company: "Thornton & Sons Ltd", bank: "Barclays", type: "received", color: "#10b981", icon: CheckCircle2 },
    { company: "Apex Property Group", bank: "NatWest", type: "processing", color: "#f59e0b", icon: AlertCircle },
    { company: "Greenfield Retail Ltd", bank: "Lloyds", type: "pending", color: "#94a3b8", icon: Clock },
  ];
  const labels = { received: "Statement processed", processing: "Processing now", pending: "Awaiting statement" };
  return (
    <div className="p-5 space-y-2.5">
      {alerts.map(({ company, bank, type, color, icon: Icon }, i) => (
        <motion.div
          key={company}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.18 }}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
            <Icon size={14} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{company}</p>
            <p className="text-[10px] text-gray-400">
              {bank} · {labels[type]}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const BalanceVisual = () => {
  const rows = [
    { account: "Revenue", debit: "", credit: "£248,500" },
    { account: "HMRC VAT", debit: "£41,420", credit: "" },
    { account: "Dividends Paid", debit: "£20,000", credit: "" },
    { account: "Travel & Subsistence", debit: "£8,640", credit: "" },
    { account: "Retained Earnings", debit: "", credit: "£178,440" },
  ];
  return (
    <div className="p-5">
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <span>Account</span>
          <span className="text-right">Debit</span>
          <span className="text-right">Credit</span>
        </div>
        {rows.map(({ account, debit, credit }, i) => (
          <motion.div
            key={account}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.12 }}
            className="grid grid-cols-3 text-xs px-4 py-2.5 border-b border-gray-50 last:border-0"
          >
            <span className="text-gray-700 font-medium">{account}</span>
            <span className="text-right font-mono text-gray-600">{debit}</span>
            <span className="text-right font-mono text-gray-600">{credit}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold"
      >
        <span>✓</span> Balanced — £248,500 = £248,500
      </motion.div>
    </div>
  );
};

const visuals = {
  statements: StatementsVisual,
  email: EmailVisual,
  categorise: CategoriseVisual,
  alerts: AlertsVisual,
  balance: BalanceVisual,
};

export const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { ref: featRef, isInView: featInView } = useScrollInView();

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature((p) => (p + 1) % features.length), 3375);
    return () => clearInterval(timer);
  }, []);

  const ActiveVisual = visuals[features[activeFeature].visual as keyof typeof visuals];

  return (
    <section id="features" className="bg-slate-50 border-y border-slate-100 py-24" ref={featRef}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={featInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#13b5ea] mb-3">Features</p>
          <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight">Everything your firm needs</h2>
          <p className="text-slate-400 mt-3 text-base max-w-lg mx-auto">
            One platform to receive, process and report on all your clients' financial data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-1">
            {features.map((f, i) => {
              const Icon = f.icon;
              const active = activeFeature === i;
              return (
                <motion.button
                  key={f.id}
                  onClick={() => setActiveFeature(i)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={featInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.07 }}
                  className={`relative text-left rounded-xl px-4 py-3.5 transition-all duration-300 ${
                    active ? "bg-white shadow-sm border border-slate-200" : "hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        active ? "bg-[#13b5ea]" : "bg-slate-100"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-white" : "text-slate-400"} />
                    </div>
                    <p className={`text-sm font-semibold ${active ? "text-slate-900" : "text-slate-500"}`}>{f.title}</p>
                  </div>
                  {active && (
                    <>
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#13b5ea] rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <div className="mt-3 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          key={activeFeature}
                          className="h-full bg-[#13b5ea] rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 3.375, ease: "linear" }}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="font-bold text-slate-900 text-base">{features[activeFeature].title}</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{features[activeFeature].desc}</p>
            </div>
            <div className="bg-slate-50/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ActiveVisual />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
