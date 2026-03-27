import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROTATING_WORDS = [
  "sales",
  "hiring",
  "legal",
  "law enforcement",
  "coaching",
  "insurance",
  "behavioral science",
];

const CASE_STUDIES = [
  {
    title: "Apex Financial",
    number: "01",
    subtitle: "Apex Financial Trust Verification Platform",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tags: ["FINANCE", "TRUST VERIFICATION"],
  },
  {
    title: "Meridian Health",
    number: "02",
    subtitle: "Meridian Health Patient Intake Analysis",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    tags: ["HEALTHCARE", "PATIENT INTAKE"],
  },
  {
    title: "Vanguard Legal",
    number: "03",
    subtitle: "Vanguard Legal Deposition Intelligence",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    tags: ["LEGAL", "DEPOSITION ANALYSIS"],
  },
];

const CaseStudies = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Capsule pill */}
        <div className="text-center mb-10">
          <span className="gradient-pill inline-block">CASE STUDIES</span>
        </div>

        {/* Headline with rotating text */}
        <h2
          className="type-display text-center mx-auto mb-16"
          style={{
            fontSize: "clamp(26px, 3.2vw, 48px)",
            maxWidth: "52rem",
            lineHeight: 1.25,
          }}
        >
          The platforms that run on trust, in
          <br />
          <span className="relative inline-block text-left" style={{ minWidth: "8em" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="text-accent inline-block"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          , choose Voicera where deep human understanding meets the science of
          credibility.
        </h2>

        {/* Case study cards – 3-col overlay on desktop, stacked image+info on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-3">
          {CASE_STUDIES.map((cs) => (
            <motion.div
              key={cs.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Number(cs.number) * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image card */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/3]"
              >
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Desktop: dark gradient overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 hidden md:block" />

                {/* Logos overlay – visible on both */}
                <div className="absolute bottom-4 left-5 right-5 z-10 flex items-center gap-3">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 40 40"
                    fill="none"
                    className="opacity-90"
                  >
                    <rect x="4" y="4" width="32" height="32" rx="6" stroke="white" strokeWidth="2" />
                    <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" />
                  </svg>
                  <span className="text-white/60 text-sm hidden md:inline">|</span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 40 40"
                    fill="none"
                    className="opacity-90 hidden md:block"
                  >
                    <rect x="6" y="6" width="28" height="28" rx="14" stroke="white" strokeWidth="2" />
                  </svg>
                </div>

                {/* Desktop-only bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 hidden md:block">
                  <h3 className="font-display text-white text-2xl md:text-3xl font-bold leading-tight">
                    {cs.title}
                    <span className="text-white/50 text-base font-normal ml-1">
                      _{cs.number}
                    </span>
                  </h3>
                  <p className="text-white/70 text-sm mt-1">{cs.subtitle}</p>
                </div>
              </div>

              {/* Mobile-only info block below image */}
              <div className="md:hidden mt-0 rounded-b-2xl bg-muted p-5">
                <h3 className="font-display text-foreground text-xl font-bold leading-tight">
                  {cs.title}
                  <span className="text-muted-foreground text-sm font-normal ml-1">
                    _{cs.number}
                  </span>
                </h3>
                <p className="font-display text-foreground font-semibold text-sm mt-2">
                  {cs.subtitle}
                </p>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {cs.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-widest uppercase font-mono border border-border text-muted-foreground px-3 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
