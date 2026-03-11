import { motion } from "framer-motion";
import logoPoliceReports from "@/assets/logo-policereports.png";
import logoErie from "@/assets/logo-erie.png";
import logoScottRamey from "@/assets/logo-scottramey.png";

const logos = [
  { src: logoPoliceReports, alt: "Policereports.ai" },
  { src: logoErie, alt: "City of Erie" },
  { src: logoScottRamey, alt: "Scott Ramey" },
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
    <div className="flex justify-center items-center gap-16 mt-10 px-6">
      {logos.map((logo, i) => (
        <motion.img
          key={i}
          src={logo.src}
          alt={logo.alt}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="h-10 max-w-[180px] object-contain grayscale brightness-0 opacity-40 hover:opacity-70 transition-opacity duration-300"
        />
      ))}
    </div>
  </section>
);

export default SocialProof;
