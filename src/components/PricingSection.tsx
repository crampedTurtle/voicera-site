import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    desc: "For individuals and small experiments",
    features: ["600 mins/month", "Transcribe API", "Community support", "Standard models"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    desc: "For teams building production apps",
    features: ["10,000 mins/month", "All APIs included", "Priority support", "Custom vocabulary", "Webhooks"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For organizations at scale",
    features: ["Unlimited minutes", "Dedicated infrastructure", "SLA guarantee", "SSO & RBAC", "On-prem option"],
    highlight: false,
  },
];

const PricingSection = () => (
  <section className="section-padding bg-alt" id="pricing">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="gradient-pill">PRICING</span>
        <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-body" style={{ letterSpacing: "-0.02em" }}>
          Simple, transparent pricing
        </h2>
        <p className="text-body-muted text-lg mt-4">Start free. Scale as you grow.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
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
                <span className="gradient-pill text-[10px]">RECOMMENDED</span>
              </div>
            )}
            {/* Force gradient border visible for highlight */}
            {tier.highlight && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                padding: "1.5px",
                background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                borderRadius: "1rem",
              }} />
            )}

            <h3 className="text-xl font-semibold text-body mb-1">{tier.name}</h3>
            <p className="text-body-muted text-sm mb-6">{tier.desc}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-body">{tier.price}</span>
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
              className={`w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] ${
                tier.highlight
                  ? "gradient-bg text-white hover:shadow-[0_4px_20px_rgba(240,24,122,0.3)]"
                  : "gradient-border gradient-text"
              }`}
            >
              {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
