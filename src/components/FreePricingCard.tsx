import { motion } from "framer-motion";
import { Headphones, Video, Layers, Server } from "lucide-react";

const FreePricingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden max-w-[420px] h-full flex flex-col"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        fontSize: "0.9em",
      }}
    >
      {/* Card Header */}
      <div className="py-5 px-7 border-b" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
        <h3 className="text-[28px] font-medium text-black mb-1">Free</h3>
        <p className="text-sm text-black/60 mb-5">Up to 2 hours of Analysis</p>
        <a
          href="https://sincerity.voicera.io/auth/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
        >
          Get Started
        </a>
      </div>

      {/* Sincerity Model Header */}
      <div className="text-center py-5 px-7">
        <h3 className="text-lg font-normal text-black">Sincerity<sup className="text-[9px] align-super ml-0.5">™</sup></h3>
      </div>

      {/* Analysis Section */}
      <div className="px-7 pt-3">
        <div
          className="text-sm font-medium text-black pb-2.5 mb-0"
          style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}
        >
          Analysis (per job)
        </div>
        {[
          { icon: Headphones, label: "Audio analysis" },
          { icon: Video, label: "Video analysis" },
          { icon: Layers, label: "Composite analysis" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-3"
            style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}
          >
            <span className="flex items-center gap-2 text-sm text-black">
              <item.icon size={16} className="text-black/40" />
              {item.label}
            </span>
            <span className="text-sm text-black/60">Free</span>
          </div>
        ))}
      </div>

      {/* Infrastructure */}
      <div className="px-7 pt-4">
        <div
          className="text-sm font-medium text-black pb-2.5 mb-0"
          style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}
        >
          Infrastructure (Monthly)
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="flex items-center gap-2 text-sm text-black">
            <Server size={16} className="text-black/40" />
            Platform hosting
          </span>
          <span className="text-sm text-black/60">Free</span>
        </div>
      </div>

      {/* Platform Section */}
      <div className="px-7 pt-2 pb-2 flex-1">
        <div className="text-center py-4">
          <span className="text-base font-normal text-black">Platform</span>
        </div>
        <div
          className="text-sm font-medium text-black pb-2.5 mb-0"
          style={{ borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}
        >
          Analysis by input type (One time)
        </div>
        {[
          { icon: Headphones, label: "Audio" },
          { icon: Video, label: "Video" },
          { icon: Layers, label: "Composite" },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-3"
            style={i < arr.length - 1 ? { borderBottom: "0.5px solid rgba(0,0,0,0.06)" } : undefined}
          >
            <span className="flex items-center gap-2 text-sm text-black">
              <item.icon size={16} className="text-black/40" />
              {item.label}
            </span>
            <span className="text-sm text-black/60">Free</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="text-[10px] text-black/40 text-center px-7 py-3">
        Free tier includes up to 2 hours of total analysis time.
      </p>
    </motion.div>
  );
};

export default FreePricingCard;
