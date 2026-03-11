import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";


const words = ["The", "Intelligence", "Layer", "for", "Human", "Credibility"];

const HeroSection = () => {
  const [playing, setPlaying] = useState(false);
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
      {/* Timeline line – center, bottom half */}
      <div
        className="absolute left-1/2 bottom-0 w-px pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Floating capsules */}
      <FloatingCapsules variant="hero" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 items-center">
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
            <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)] inline-flex items-center gap-2">
              Start Free Trial <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="gradient-border-rect px-8 py-3.5 type-button rounded-xl hover:scale-[1.03] transition-transform duration-200 inline-flex items-center gap-2">
              <span className="btn-label inline-flex items-center gap-2">Book a Demo <ArrowUpRight className="w-4 h-4" /></span>
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
            className="relative w-[110%] aspect-video rounded-2xl overflow-hidden cursor-pointer"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              marginTop: "-50px",
            }}
            onClick={() => setPlaying(true)}
          >
            <iframe
              className="w-full h-full pointer-events-none"
              style={playing ? { pointerEvents: "auto" } : undefined}
              src={`https://www.youtube.com/embed/BSTZmbYonpI?start=10&modestbranding=1&rel=0&showinfo=0&controls=0&iv_load_policy=3${playing ? "&autoplay=1" : ""}`}
              title="Voicera Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
