import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const capsules = [
  { label: "85% Sincere", color: "hsl(142 70% 45%)", border: "hsl(142 70% 45%)" },
  { label: "100% Neutral", color: "hsl(222 85% 60%)", border: "hsl(222 85% 60%)" },
  { label: "90% Likely Insincere", color: "hsl(38 92% 50%)", border: "hsl(38 92% 50%)" },
];

const positions = [
  { top: "28%", right: "14%" },
  { top: "48%", right: "8%" },
  { top: "calc(68% - 70px)", right: "18%" },
];

const PricingCapsules = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % capsules.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const capsule = capsules[activeIndex];
  const pos = positions[activeIndex];

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 2 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute flex items-center gap-2 rounded-full px-5 py-2.5 shadow-md"
          style={{
            ...pos,
            background: "rgba(255,255,255,0.88)",
            border: `1.5px solid ${capsule.border}`,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -10 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: capsule.color }}
          />
          <span
            className="text-sm font-medium whitespace-nowrap"
            style={{ color: capsule.color }}
          >
            {capsule.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PricingCapsules;
