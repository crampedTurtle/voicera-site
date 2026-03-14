import { motion } from "framer-motion";
import logoPoliceReports from "@/assets/logo-policereports.png";
import logoErie from "@/assets/logo-erie.png";
import logoScottRamey from "@/assets/logo-scottramey.png";
import logoMindtickle from "@/assets/logo-mindtickle.png";

const logos = [
  { src: logoPoliceReports, alt: "Policereports.ai" },
  { src: logoErie, alt: "City of Erie" },
  { src: logoScottRamey, alt: "Scott Ramey" },
  { src: logoMindtickle, alt: "Mindtickle" },
];

const SocialProof = () => (
  <section className="py-20 overflow-hidden relative" style={{ background: "linear-gradient(180deg, hsl(0 0% 100%) 0%, var(--bg-alt) 40%, var(--bg-alt) 60%, hsl(0 0% 100%) 100%)" }}>

    <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
      <span className="gradient-pill">PILOTING NOW</span>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="type-subheading text-body mt-6"
      >
        Trusted by forward-thinking teams
      </motion.h3>
    </div>
    <div className="relative mt-10 overflow-hidden">
      <div className="flex animate-marquee w-max gap-16 items-center">
        {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="h-10 max-w-[180px] object-contain grayscale brightness-0 opacity-40 flex-shrink-0"
          />
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
