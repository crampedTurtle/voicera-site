import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FloatingCapsules from "./FloatingCapsules";

const words = ["The", "Intelligence", "Layer", "for", "Human", "Credibility."];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Floating capsules */}
      <FloatingCapsules variant="hero" />
      {/* Ambient orb */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full animate-float-orb pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
          filter: "blur(80px)",
          opacity: 0.18,
          y: orbY,
          top: "10%",
          left: "50%",
          marginLeft: "-350px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="type-hero mb-6">
          <span className="inline-block">
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
          </span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="type-body max-w-2xl mx-auto mb-10"
        >
          Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — helping sales teams
          coach reps, qualify prospects faster, and close deals with data-backed confidence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
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
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-body-muted"
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
    </section>
  );
};

export default HeroSection;
