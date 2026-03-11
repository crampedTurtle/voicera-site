import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const words = ["Search", "and", "Understand", "Your", "Voice", "—", "with", "AI"];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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
        <h1 className="mb-6" style={{ fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          <span className="gradient-text animate-shimmer inline-block" style={{
            background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
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
          className="text-lg text-body-muted max-w-2xl mx-auto mb-10"
          style={{ lineHeight: 1.7 }}
        >
          Voicera's multimodal AI understands speech the way people do — context,
          emotion, intent. Build powerful voice applications with our APIs.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="gradient-bg px-8 py-3.5 text-base font-semibold text-white rounded-full hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)]">
            Get Started Free
          </button>
          <button className="gradient-border px-8 py-3.5 text-base font-semibold gradient-text rounded-full hover:scale-[1.03] transition-transform duration-200">
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
