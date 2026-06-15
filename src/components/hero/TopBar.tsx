import { Sparkles } from "lucide-react";
import { useEmailPopup } from "./EmailPopupContext";

export const TopBar = () => {
  const { open } = useEmailPopup();

  return (
    <div className="sticky top-0 z-[60] bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-center text-sm">
        <button
          onClick={() => {
            window.gtag?.("event", "banner_click", { event_category: "engagement" });
            open();
          }}
          className="flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
        >
          <Sparkles size={13} className="text-[#13b5ea]" />
          <span>
            Limited launch offer —{" "}
            <span className="text-[#13b5ea] font-semibold">1 month free</span>{" "}
            for early accounting firms.
          </span>
          <span className="underline underline-offset-2 hidden sm:inline">
            Claim your spot here
          </span>
        </button>
      </div>
    </div>
  );
};
