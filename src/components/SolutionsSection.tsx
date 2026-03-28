import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Video, Layers, Server, ArrowUpRight } from "lucide-react";
import PricingCapsules from "./PricingCapsules";
import FreePricingCard from "./FreePricingCard";

type Unit = "minute" | "hour";

const analysisItems = [
  {
    icon: Headphones,
    label: "Audio analysis",
    perMinute: 0.006,
    per5Min: 0.03,
  },
  {
    icon: Video,
    label: "Video analysis",
    perMinute: 0.0018,
    per5Min: 0.009,
  },
  {
    icon: Layers,
    label: "Composite analysis",
    perMinute: 0.0076,
    per5Min: 0.038,
  },
];

const platformItems = [
  { icon: Headphones, label: "Audio", perMinute: 0.006 },
  { icon: Video, label: "Video", perMinute: 0.0018 },
  { icon: Layers, label: "Composite", perMinute: 0.0076 },
];

const formatPrice = (value: number, unit: Unit) => {
  if (unit === "hour") {
    const hourly = value * 60;
    return `$${hourly.toFixed(2)} / hour`;
  }
  return `$${value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")} / minute`;
};

const SolutionsSection = () => {
  const [unit, setUnit] = useState<Unit>("minute");

  return (
    <section
      className="relative overflow-hidden bg-[#0B1120]"
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/pricing-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/[0.09]" style={{ zIndex: 1 }} />
      <PricingCapsules />
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-11 pb-20">
        {/* Header — left aligned */}
        <div className="mb-10 max-w-xl">
          <span className="gradient-pill">PRICING</span>
          <h2 className="type-display mt-6" style={{ color: '#ffffff' }}>
            Try it, trust it, scale it.
          </h2>
          <p className="type-body mt-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Pay only for what you analyze. No seat fees, no minimums.
          </p>
        </div>

        {/* Layout: card left, empty right for future image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Tier Card */}
          <FreePricingCard />
          {/* Paid Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden max-w-[420px] h-full flex flex-col"
            style={{
              background: "linear-gradient(to bottom, #ffffff 0%, #e8effe 50%, #3B6FF5 100%)",
              border: "1px solid hsl(var(--border))",
              fontSize: "0.9em",
            }}
          >
            {/* Card Header */}
            <div className="py-5 px-7 border-b border-border">
              <h3 className="text-[28px] font-medium text-foreground mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-5">Pay as you go</p>
              <button
                onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' })}
                className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
              >
                Talk to Sales
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Sincerity Model Header */}
            <div className="text-center py-5 px-7">
              <h3 className="text-lg font-normal text-foreground">Sincerity<sup className="text-[9px] align-super ml-0.5">™</sup></h3>
            </div>

            {/* Toggle */}
            <div className="flex justify-center py-4">
              <div
                className="inline-flex rounded-full p-0.5"
                style={{ background: "hsl(var(--foreground) / 0.06)" }}
              >
                <button
                  onClick={() => setUnit("minute")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    unit === "minute"
                      ? "bg-foreground/10 text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Per Minute
                </button>
                <button
                  onClick={() => setUnit("hour")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    unit === "hour"
                      ? "bg-foreground/10 text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Per Hour
                </button>
              </div>
            </div>

            {/* Analysis Section */}
            <div className="px-7 pt-3">
              <div
                className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border"
              >
                Analysis (per job)
              </div>
              {analysisItems.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-3 border-b border-border/50"
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <item.icon size={16} className="text-muted-foreground" />
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatPrice(unit === "minute" ? item.per5Min / 5 : item.per5Min / 5, unit)}
                  </span>
                </div>
              ))}
            </div>

            {/* Infrastructure */}
            <div className="px-7 pt-4">
              <div
                className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border"
              >
                Infrastructure (Monthly)
              </div>
              <div
                className="flex justify-between items-center py-3"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Server size={16} className="text-muted-foreground" />
                  Platform hosting
                </span>
                <span className="text-sm text-muted-foreground">$1,089 / month</span>
              </div>
            </div>

            {/* Platform Section */}
            <div className="px-7 pt-2 pb-2">
              <div className="text-center py-4">
                <span className="text-base font-normal text-foreground">Platform</span>
              </div>
              <div
                className="text-sm font-medium text-foreground pb-2.5 mb-0 border-b border-border"
              >
                Per-{unit} rate by input type
              </div>
              {platformItems.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex justify-between items-center py-3 ${i < platformItems.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <item.icon size={16} className="text-muted-foreground" />
                    {item.label}
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatPrice(item.perMinute, unit)}
                  </span>
                </div>
              ))}

              {/* Hourly cap */}
              <div
                className="flex justify-between items-center py-3 mt-1 border-t border-border/50"
              >
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Layers size={16} className="text-muted-foreground" />
                  Hourly cap (composite)
                </span>
                <span className="text-sm text-muted-foreground">$0.37 / hour</span>
              </div>
            </div>

            {/* Note */}
            <p className="text-[10px] text-muted-foreground text-center px-7 py-3">
              Composite = audio + video (parallel) + fusion Lambda.
              <br />
              Worker cost: (processing min × $0.0039) + $0.001 overhead.
            </p>
          </motion.div>

          {/* Right side — empty for capsules overlay */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
