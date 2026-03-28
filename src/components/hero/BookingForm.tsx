import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader } from "lucide-react";

interface BookingFormProps {
  onClose?: () => void;
}

export const BookingForm = ({ onClose }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    phone: "",
  });
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult("Sending....");

    const formDataObj = new FormData(event.currentTarget);
    formDataObj.append("access_key", "80f3160a-fb9c-46c6-afc6-577479cd4251");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully");
        setSubmitted(true);
        setFormData({ name: "", email: "", firm: "", phone: "" });
      } else {
        setResult("Error submitting form");
        setIsLoading(false);
      }
    } catch (error) {
      setResult("Error connecting to server");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-16 h-16 bg-[#13b5ea]/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 size={28} className="text-[#13b5ea]" />
        </motion.div>
        <h3 className="text-slate-900 font-bold text-xl mb-2">Demo Confirmed!</h3>
        <p className="text-slate-500 text-sm mb-1">Thank you for booking a demo with us.</p>
        <p className="text-slate-400 text-sm">We'll send a confirmation to {formData.email}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {[
        { name: "name", placeholder: "Your full name", type: "text", required: true },
        { name: "email", placeholder: "Work email address", type: "email", required: true },
        { name: "firm", placeholder: "Accounting firm name", type: "text", required: true },
        { name: "phone", placeholder: "Phone number (optional)", type: "tel", required: false },
      ].map(({ name, placeholder, type, required }) => (
        <input
          key={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name as keyof typeof formData]}
          onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))}
          required={required}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:border-[#13b5ea] focus:bg-white transition-all"
        />
      ))}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm p-3 rounded-lg ${
            result === "Sending...." || result === "Form Submitted Successfully"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {result}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isLoading || !formData.name || !formData.email || !formData.firm}
        className="w-full bg-[#13b5ea] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0e9fd2] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader size={15} className="animate-spin" /> Booking...
          </>
        ) : (
          "Book Your Demo"
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">We'll send you a calendar invite within 24 hours</p>
    </form>
  );
};
