import { motion } from "framer-motion";
import scottRameyImg from "@/assets/case-study-scott-ramey.png";
import srLogo from "@/assets/case-study-sr-logo.png";
import policeImg from "@/assets/case-study-police.jpg";
import policeLogo from "@/assets/case-study-police-logo.png";


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
    title: "Policereports.ai",
    number: "02",
    subtitle: "Revolutionizing Law Enforcement",
    image: policeImg,
    logo: policeLogo,
    tags: ["LAW ENFORCEMENT", "AI"],
  },
  {
    title: "Scott Ramey",
    number: "03",
    subtitle: "Executive Coaching & Leadership Platform",
    image: scottRameyImg,
    logo: srLogo,
    bgClass: "bg-black",
    tags: ["COACHING", "LEADERSHIP"],
  },
];

const CaseStudies = () => {
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

        {/* Case study cards – 3-col overlay on desktop, stacked image+info on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-3">
          {CASE_STUDIES.map((cs) => (
            <motion.div
              key={cs.number}
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: Number(cs.number) * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="cursor-pointer"
            >
              {/* Image card */}
              <div
                className={`relative rounded-2xl overflow-hidden aspect-square md:aspect-[3/4] ${cs.bgClass || ""}`}
              >
                <img
                  src={cs.image}
                  alt={cs.title}
                  className={`absolute inset-0 w-full h-full ${cs.bgClass ? "object-contain object-bottom scale-150 origin-bottom" : "object-cover"}`}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 hidden md:block" />

                {/* Logo top-left (desktop) */}
                <div className="absolute top-5 left-5 z-10 hidden md:flex items-center gap-2">
                  {cs.logo ? (
                    <img src={cs.logo} alt={`${cs.title} logo`} className="h-8 opacity-90" />
                  ) : (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 40 40"
                      fill="none"
                      className="opacity-90"
                    >
                      <rect x="4" y="4" width="32" height="32" rx="6" stroke="white" strokeWidth="2" />
                      <circle cx="20" cy="20" r="8" stroke="white" strokeWidth="2" />
                    </svg>
                  )}
                </div>

                {/* Desktop-only bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 hidden md:block">
                  <h3 className="font-display text-white text-2xl lg:text-3xl font-bold leading-tight">
                    {cs.title}
                    <span className="text-white/50 text-base font-normal ml-1">
                      _{cs.number}
                    </span>
                  </h3>
                  <p className="text-white/60 text-sm mt-1">{cs.subtitle}</p>
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
