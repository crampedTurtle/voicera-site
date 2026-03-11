import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, BrainCircuit, Search } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Capture Every Word",
    desc: "Real-time transcription with 99%+ accuracy across 50+ languages. Our models understand accents, dialects, and domain-specific jargon.",
    icon: Mic,
  },
  {
    num: "02",
    title: "Understand Meaning",
    desc: "Go beyond transcription. Detect sentiment, identify speakers, extract topics, and understand the context behind every conversation.",
    icon: BrainCircuit,
  },
  {
    num: "03",
    title: "Search & Discover",
    desc: "Find any moment in hours of audio using natural language. Our semantic search understands what was said, who said it, and how it was said.",
    icon: Search,
  },
];

const ScrollStorytelling = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="product" className="section-padding bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">HOW IT WORKS</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-body" style={{ letterSpacing: "-0.02em" }}>
            People everywhere are moving to voice.{" "}
            <br className="hidden md:block" />
            Our AI hears voice like people do.
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
              <h3 className="text-2xl font-semibold text-body mb-3">{steps[active].title}</h3>
              <p className="text-body-muted text-base" style={{ lineHeight: 1.7 }}>{steps[active].desc}</p>
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
        className={`text-3xl font-bold transition-all duration-300 ${isActive ? "gradient-text" : "text-body-muted opacity-30"}`}
      >
        {step.num}
      </span>
      <div>
        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isActive ? "text-body" : "text-body-muted"}`}>
          {step.title}
        </h3>
        <p className="text-body-muted text-base" style={{ lineHeight: 1.7 }}>{step.desc}</p>
      </div>
    </div>
  );
};

export default ScrollStorytelling;
