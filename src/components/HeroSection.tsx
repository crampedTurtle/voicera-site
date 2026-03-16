import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";
import heroThumb from "@/assets/hero-video-thumb.jpg";

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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
        {/* Left: Text content */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            className="inline-block type-accent text-body-muted tracking-[0.15em] uppercase text-xs mb-4"
          >
            AI-Powered Credibility Analysis
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
            Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — helping sales teams
            coach reps, qualify prospects faster, and close deals with data-backed confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)] inline-flex items-center gap-2">
              Start Free Trial <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Right: Video */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center mt-8 lg:mt-0"
        >
          <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer"
            style={{
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            }}
            onClick={() => setPlaying(true)}
          >
            {playing ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/BSTZmbYonpI?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=0&iv_load_policy=3"
                title="Voicera Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={heroThumb}
                  alt="Voicera Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
