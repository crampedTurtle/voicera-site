import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";
import HeroSphere from "./HeroSphere";

const words = ["Quantify", "&", "Understand", "Human", "Sincerity", "with", "AI"];

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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
        {/* Left: Text content */}
        <div className="max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            className="inline-block type-accent text-body-muted tracking-[0.15em] uppercase text-xs mb-4"
          >
            AI-POWERED SINCERITY ANALYSIS
          </motion.span>
          <h1 className="type-hero mb-6 text-left" style={{ fontSize: "clamp(38px, 4.5vw, 62px)", maxWidth: "11em" }}>
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
            className="type-body max-w-md mb-10 text-left"
          >
            Quantify sincerity, unlock behavioral intelligence, and integrate high-trust workflows with proprietary Multimodal AI that sees micro-expressions, hears tonal shifts, and reasons across paralinguistic cues.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <button onClick={() => (window as any).Calendly?.initPopupWidget({ url: 'https://calendly.com/kevins-voicera-calendar/30min' })} className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(99,102,241,0.35)] inline-flex items-center gap-2">
              Book a Demo <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Right: 3D Sphere */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center mt-8 lg:mt-0"
        >
          <HeroSphere />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
