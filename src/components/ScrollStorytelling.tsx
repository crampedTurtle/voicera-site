import { useState, useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { AlertTriangle, BrainCircuit, TrendingUp } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";
import voiceraDemoGif from "@/assets/voicera-demo.gif";
import logoGong from "@/assets/logo-gong.png";
import logoSalesforce from "@/assets/logo-salesforce.webp";

const CountUp = ({ target, className }: { target: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + "+";
      },
    });
    return () => controls.stop();
  }, [inView, target]);

  return <span ref={ref} className={className}>0+</span>;
};

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
  const [active, setActive] = useState(-1);

  return (
    <section id="product" className="section-padding bg-alt relative overflow-hidden">
      <FloatingCapsules variant="storytelling" count={9} className="-top-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">WHY VOICERA?</span>
          <h2 className="type-display text-body mt-6">
            Multimodal AI that understands<br />intent and integrity.
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
            {active >= 0 && (
              <div className="relative w-full max-w-md">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="card-surface pt-[72px] p-10 w-full flex flex-col items-center text-center"
                >
                  {(() => {
                    const Icon = steps[active].icon;
                    return <Icon size={56} strokeWidth={1.5} className="mb-6" style={{ stroke: "url(#iconGradient)" }} />;
                  })()}
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B6FF5" />
                        <stop offset="30%" stopColor="#4E7CF8" />
                        <stop offset="65%" stopColor="#6B9BFA" />
                        <stop offset="100%" stopColor="#52A0FC" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <h3 className="type-subheading text-body mb-3">{steps[active].title}</h3>
                  <p className="type-body">{steps[active].desc}</p>
                </motion.div>

                {/* Integration logos sticker overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="absolute -top-[56px] -right-8 z-20 rounded-xl border border-border bg-background px-7 py-5 text-center shadow-lg flex flex-col items-center"
                  style={{ transform: "rotate(3deg)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Join</span>
                  <CountUp target={850} className="text-2xl font-bold text-foreground my-1" />
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Active Users
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const StepItem = ({ step, isActive, onView }: { step: typeof steps[0]; isActive: boolean; onView: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onView();
  }, [inView, onView]);

  return (
    <div ref={ref} className="flex gap-6 items-start">
      <span
        className={`flex items-center justify-center px-3.5 py-1.5 rounded-full border text-xs font-medium shrink-0 transition-all duration-300 ${
          isActive
            ? "border-foreground text-foreground"
            : "border-border text-muted-foreground opacity-50"
        }`}
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
