import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, BrainCircuit, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "The Problem",
    desc: "Sales leaders rely on subjective gut feelings to evaluate rep performance, qualify deals, and forecast pipeline — leading to inconsistent coaching, missed signals, and lost revenue.",
    icon: AlertTriangle,
  },
  {
    num: "02",
    title: "The Solution",
    desc: "Voicera's multimodal AI analyzes every sales conversation in real time — detecting credibility signals, buyer sentiment, objection patterns, and engagement levels that humans miss.",
    icon: BrainCircuit,
  },
  {
    num: "03",
    title: "The Delivery",
    desc: "Get actionable scorecards after every call. Identify top-performer patterns, replicate winning behaviors across your team, and build a data-driven coaching culture that scales.",
    icon: TrendingUp,
  },
];

const ScrollStorytelling = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="product" className="section-padding bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">WHY VOICERA?</span>
          <h2 className="type-display text-body mt-6">
            Why Voicera?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Steps */}
          <div className="space-y-12">
            {steps.map((step, i) => (
              <StepItem key={i} step={step} isActive={active === i} onView={() => setActive(i)} />
            ))}
          </div>

          {/* Right: Visual */}
          <div className="hidden md:flex sticky top-32 items-center justify-center min-h-[400px]">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="card-surface p-10 w-full max-w-md flex flex-col items-center text-center"
            >
              {(() => {
                const Icon = steps[active].icon;
                return <Icon size={56} strokeWidth={1.5} className="mb-6" style={{ stroke: "url(#iconGradient)" }} />;
              })()}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4B6EF5" />
                    <stop offset="30%" stopColor="#9B4DEB" />
                    <stop offset="65%" stopColor="#F0187A" />
                    <stop offset="100%" stopColor="#F4621A" />
                  </linearGradient>
                </defs>
              </svg>
              <h3 className="type-subheading text-body mb-3">{steps[active].title}</h3>
              <p className="type-body">{steps[active].desc}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepItem = ({ step, isActive, onView }: { step: typeof steps[0]; isActive: boolean; onView: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  if (inView) onView();

  return (
    <div ref={ref} className="flex gap-6 items-start">
      <span
        className={`type-step text-3xl transition-all duration-300 ${isActive ? "gradient-text" : "opacity-30"}`}
        style={{ fontWeight: 500, color: isActive ? undefined : "var(--color-step)" }}
      >
        {step.num}
      </span>
      <div>
        <h3 className={`type-card-title mb-2 transition-colors duration-300 ${isActive ? "text-body" : "text-body-muted"}`}>
          {step.title}
        </h3>
        <p className="type-body">{step.desc}</p>
      </div>
    </div>
  );
};

export default ScrollStorytelling;
