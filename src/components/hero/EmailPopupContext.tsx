import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EmailPopup } from "./EmailPopup";

interface EmailPopupContextValue {
  open: () => void;
}

const EmailPopupContext = createContext<EmailPopupContextValue>({ open: () => {} });

export const useEmailPopup = () => useContext(EmailPopupContext);

export const EmailPopupProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open once per visitor when they scroll to the 4th section
  // (#how-it-works). After it fires once it's remembered in localStorage so it
  // never auto-opens again on later visits.
  useEffect(() => {
    if (localStorage.getItem("leadPopupSeen")) return;
    const target = document.getElementById("how-it-works");
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.gtag?.("event", "popup_opened", { event_category: "engagement", event_label: "auto" });
          setIsOpen(true);
          localStorage.setItem("leadPopupSeen", "true");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const open = () => {
    window.gtag?.("event", "popup_opened", { event_category: "engagement", event_label: "manual" });
    setIsOpen(true);
  };
  const close = () => {
    localStorage.setItem("leadPopupSeen", "true");
    setIsOpen(false);
  };

  return (
    <EmailPopupContext.Provider value={{ open }}>
      {children}
      <EmailPopup isOpen={isOpen} onClose={close} />
    </EmailPopupContext.Provider>
  );
};
