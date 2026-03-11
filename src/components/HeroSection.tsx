import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FloatingCapsules from "./FloatingCapsules";

const words = ["The", "Intelligence", "Layer", "for", "Human", "Credibility."];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        background: "linear-gradient(to right, hsl(270 40% 96%) 0%, hsl(330 30% 96%) 40%, hsl(0 0% 100%) 75%, hsl(0 0% 100%) 100%)",
      }}
    >
      {/* Floating capsules */}
      <FloatingCapsules variant="hero" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text content */}
        <div>
          <h1 className="type-hero mb-6 text-left">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="type-body max-w-lg mb-10 text-left"
          >
            Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — helping sales teams
            coach reps, qualify prospects faster, and close deals with data-backed confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-full hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)]">
              Start Free Trial
            </button>
            <button className="gradient-border px-8 py-3.5 type-button rounded-full hover:scale-[1.03] transition-transform duration-200">
              <span className="btn-label">Book a Demo</span>
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-14 flex items-center justify-between text-xs text-body-muted w-full"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
              SOC 2 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
              GDPR Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
              99.9% Uptime SLA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
              Enterprise Ready
            </span>
          </motion.div>
        </div>

        {/* Right: Video placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-center"
        >
          <div
            className="w-[110%] aspect-video rounded-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(240 5% 96%), hsl(270 10% 94%), hsl(330 8% 95%))",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              marginTop: "-50px",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
