import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "For individual reps exploring AI coaching",
    features: ["5 call analyses/month", "Basic credibility scoring", "Transcript export", "Community support"],
    highlight: false,
  },
  {
    name: "Team",
    price: "$79",
    period: "/seat/mo",
    desc: "For sales teams scaling performance",
    features: ["Unlimited call analyses", "Advanced credibility & sentiment", "Team leaderboards", "CRM integration", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations with complex needs",
    features: ["Unlimited everything", "Custom AI models", "SSO & RBAC", "Dedicated CSM", "SLA & on-prem option"],
    highlight: false,
  },
];

const TierCard = ({ tier, i }: { tier: (typeof tiers)[number]; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.15, duration: 0.5 }}
    className={`card-surface p-8 flex flex-col relative ${tier.highlight ? "gradient-card-border" : ""}`}
    style={tier.highlight ? {
      boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 12px 40px rgba(75, 110, 245, 0.12)",
    } : undefined}
  >
    {tier.highlight && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="gradient-pill text-[10px]">MOST POPULAR</span>
      </div>
    )}
    {tier.highlight && (
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
        padding: "1.5px",
        background: "linear-gradient(135deg, #3B6FF5 0%, #4E7CF8 30%, #6B9BFA 65%, #52A0FC 100%)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        borderRadius: "1rem",
      }} />
    )}

    <h3 className="type-card-title text-body mb-1">{tier.name}</h3>
    <p className="text-sm text-body-muted mb-6">{tier.desc}</p>
    <div className="mb-8">
      <span className="font-display text-4xl font-bold text-body tabular-nums">{tier.price}</span>
      {tier.period && <span className="text-body-muted text-base">{tier.period}</span>}
    </div>
    <ul className="space-y-3 mb-8 flex-1">
      {tier.features.map((f) => (
        <li key={f} className="flex items-center gap-2 text-sm text-body-muted">
          <Check size={16} strokeWidth={2} className="text-primary flex-shrink-0" />
          {f}
        </li>
      ))}
    </ul>
    <button
      className={`w-full py-3 rounded-xl type-button transition-all duration-200 hover:scale-[1.02] ${
        tier.highlight
          ? "gradient-bg text-white hover:shadow-[0_4px_20px_rgba(240,24,122,0.3)]"
          : "gradient-border-rect"
      }`}
    >
      {tier.highlight ? (
        tier.price === "Custom" ? "Contact Sales" : "Get Started"
      ) : (
        <span className="btn-label">{tier.price === "Custom" ? "Contact Sales" : "Get Started"}</span>
      )}
    </button>
  </motion.div>
);

const PricingSection = () => {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c <= 0 ? tiers.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c >= tiers.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-alt" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">PRICING</span>
          <h2 className="type-display text-body mt-6">
            Simple, transparent pricing
          </h2>
          <p className="type-body mt-4">Start free. Scale as your team grows.</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} i={i} />
          ))}
        </div>

        {/* Mobile/Tablet carousel */}
        <div className="lg:hidden max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.3 }}
            >
              <TierCard tier={tiers[current]} i={0} />
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="text-body-muted hover:text-body transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {tiers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-accent" : "bg-border"}`}
                />
              ))}
            </div>
            <button onClick={next} className="text-body-muted hover:text-body transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;