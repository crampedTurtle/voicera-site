import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Headphones, Video, Layers, Server } from "lucide-react";

const FreePricingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden max-w-[420px] h-full flex flex-col bg-secondary border border-border"
      style={{ fontSize: "0.9em" }}
    >
      {/* Card Header */}
      <div className="py-5 px-7 border-b border-border">
        <h3 className="text-[28px] font-medium text-foreground mb-1">Free</h3>
        <p className="text-sm text-muted-foreground mb-5">Up to 2 hours of Analysis</p>
        <a
          href="https://sincerity.voicera.io/auth/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
        >
          Get Started
          <ArrowUpRight size={16} />
        </a>
      </div>

      {/* Sincerity Model Header */}
      <div className="text-center py-5 px-7">
        <h3 className="text-lg font-normal text-foreground">Sincerity<sup className="text-[9px] align-super ml-0.5">™</sup></h3>
      </div>

      {/* Analysis Section */}
      <div className="px-7 pt-3">
        <div className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border">
          Analysis (per job)
        </div>
        {[
          { icon: Headphones, label: "Audio analysis" },
          { icon: Video, label: "Video analysis" },
          { icon: Layers, label: "Composite analysis" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-3 border-b border-border/50"
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              <item.icon size={16} className="text-muted-foreground" />
              {item.label}
            </span>
            <span className="text-sm text-muted-foreground">Free</span>
          </div>
        ))}
      </div>

      {/* Infrastructure */}
      <div className="px-7 pt-4">
        <div className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border">
          Infrastructure (Monthly)
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="flex items-center gap-2 text-sm text-foreground">
            <Server size={16} className="text-muted-foreground" />
            Platform hosting
          </span>
          <span className="text-sm text-muted-foreground">Free</span>
        </div>
      </div>

      {/* Platform Section */}
      <div className="px-7 pt-2 pb-2 flex-1">
        <div className="text-center py-4">
          <span className="text-base font-normal text-foreground">Platform</span>
        </div>
        <div className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border">
          Analysis by input type (One time)
        </div>
        {[
          { icon: Headphones, label: "Audio" },
          { icon: Video, label: "Video" },
          { icon: Layers, label: "Composite" },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              <item.icon size={16} className="text-muted-foreground" />
              {item.label}
            </span>
            <span className="text-sm text-muted-foreground">Free</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="text-[10px] text-muted-foreground text-center px-7 py-3">
        Free tier includes up to 2 hours of total analysis time.
      </p>
    </motion.div>
  );
};

export default FreePricingCard;
