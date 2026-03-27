import { motion } from "framer-motion";

const capsules = [
  { label: "85% Sincere", color: "rgba(34,197,94,0.85)", border: "rgba(34,197,94,0.5)", glow: "rgba(34,197,94,0.3)", delay: 0.3 },
  { label: "100% Neutral", color: "rgba(59,130,246,0.85)", border: "rgba(59,130,246,0.5)", glow: "rgba(59,130,246,0.3)", delay: 1.2 },
  { label: "90% Likely Insincere", color: "rgba(234,179,8,0.85)", border: "rgba(234,179,8,0.5)", glow: "rgba(234,179,8,0.3)", delay: 2.1 },
];

const positions = [
  { top: "18%", right: "12%" },
  { top: "45%", right: "22%" },
  { top: "70%", right: "8%" },
];

const PricingCapsules = () => (
  <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 2 }}>
    {capsules.map((capsule, i) => (
      <motion.div
        key={capsule.label}
        className="absolute"
        style={{ ...positions[i] }}
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: capsule.delay, duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${capsule.color}, ${capsule.border})`,
            border: `1px solid ${capsule.border}`,
            boxShadow: `0 0 20px ${capsule.glow}, 0 0 40px ${capsule.glow}`,
            color: "#fff",
            backdropFilter: "blur(12px)",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {capsule.label}
        </motion.div>
      </motion.div>
    ))}
  </div>
);

export default PricingCapsules;
