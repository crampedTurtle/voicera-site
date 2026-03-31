import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import scottRameyImg from "@/assets/case-study-scott-ramey.png";
import srLogo from "@/assets/case-study-sr-logo.png";
import policeImg from "@/assets/case-study-police.jpg";
import policeLogo from "@/assets/case-study-police-logo.png";
import peekLeftImg from "@/assets/case-study-peek-left.jpg";
import peekRightImg from "@/assets/case-study-peek-right.jpg";

const CASE_STUDIES = [
  {
    title: "Policereports.ai",
    number: "01",
    subtitle: "Revolutionizing Law Enforcement",
    image: policeImg,
    logo: policeLogo,
    tags: ["LAW ENFORCEMENT", "AI"],
  },
  {
    title: "Scott Ramey",
    number: "02",
    subtitle: "Executive Coaching & Leadership Platform",
    image: scottRameyImg,
    logo: srLogo,
    bgClass: "bg-black",
    tags: ["COACHING", "LEADERSHIP"],
  },
];

const CaseStudies = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  // Peek tiles for carousel edges
  const peekLeft = { title: "Coming Soon", number: "", subtitle: "", image: peekLeftImg, logo: undefined as string | undefined, tags: [] as string[] };
  const peekRight = { title: "Sales CRM", number: "", subtitle: "", image: peekRightImg, logo: undefined as string | undefined, tags: [] as string[] };

  const handleTileClick = (cs: (typeof CASE_STUDIES)[number]) => {
    if (cs.title === "Scott Ramey") {
      setVideoOpen(true);
    }
  };

  return (
    <section className="section-padding relative overflow-hidden bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Capsule pill */}
        <div className="text-center mb-10">
          <span className="gradient-pill inline-block">CASE STUDIES</span>
        </div>

        {/* Headline */}
        <h2
          className="type-display text-center mx-auto mb-16"
          style={{
            fontSize: "clamp(26px, 3.2vw, 48px)",
            maxWidth: "52rem",
            lineHeight: 1.25,
          }}
        >
          Platforms that run on trust in{" "}
          <span className="text-accent">sales, hiring, legal, law enforcement, coaching</span> and{" "}
          <span className="text-accent">behavioral science</span>{" "}
          choose Voicera where deep human understanding meets the science of
          sincerity.
        </h2>

        {/* Carousel-style layout: peek tiles + centered main tiles */}
        <div className="relative">
          {/* Desktop carousel with peek edges */}
          <div className="hidden md:flex items-stretch justify-center gap-4 -mx-16 lg:-mx-24">
            {/* Left peek tile */}
            <div
              className="w-[300px] lg:w-[360px] flex-shrink-0 overflow-hidden rounded-2xl relative blur-[2px] opacity-50"
            >
              <CaseCard cs={peekLeft} />
            </div>

            {/* Main tiles */}
            {CASE_STUDIES.map((cs, i) => (
              <motion.div
                key={cs.number}
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-[340px] lg:w-[400px] flex-shrink-0 cursor-pointer"
                onClick={() => handleTileClick(cs)}
              >
                <CaseCard cs={cs} />
              </motion.div>
            ))}

            {/* Right peek tile */}
            <div
              className="w-[300px] lg:w-[360px] flex-shrink-0 overflow-hidden rounded-2xl relative blur-[2px] opacity-50"
            >
              <CaseCard cs={peekRight} />
            </div>
          </div>

          {/* Mobile/Tablet carousel */}
          <div className="md:hidden">
            <MobileCarousel studies={CASE_STUDIES} onTileClick={handleTileClick} />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute -top-10 right-0 z-10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/GhrtJO3R-80?autoplay=1&start=3&rel=0"
                title="Scott Ramey Case Study"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* Shared card rendering */
const CaseCard = ({ cs }: { cs: (typeof CASE_STUDIES)[number] }) => (
  <div
    className={`relative rounded-2xl overflow-hidden aspect-[3/4] ${cs.bgClass || ""}`}
  >
    <img
      src={cs.image}
      alt={cs.title}
      className={`absolute inset-0 w-full h-full ${cs.bgClass ? "object-contain object-bottom scale-150 origin-bottom" : "object-cover"}`}
    />

    {/* Dark gradient overlay – bottom */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

    {/* Dark gradient overlay – top-left corner for logo readability */}
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 25%, transparent 50%)" }} />

    {/* Logo top-left */}
    <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
      {cs.logo ? (
        <img src={cs.logo} alt={`${cs.title} logo`} className="h-7 opacity-90" style={{ imageRendering: "auto" }} />
      ) : (
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="opacity-90">
          <rect x="4" y="4" width="32" height="32" rx="6" stroke="white" strokeWidth="2" />
          <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" />
        </svg>
      )}
    </div>

    {/* Bottom text */}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
      <h3 className="font-display text-white text-2xl lg:text-3xl font-bold leading-tight">
        {cs.title}
      </h3>
      <p className="text-white/60 text-sm mt-1">{cs.subtitle}</p>
    </div>
  </div>
);

export default CaseStudies;
