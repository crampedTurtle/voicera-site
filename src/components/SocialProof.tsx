import { motion } from "framer-motion";

const logos = [
  "Salesforce", "HubSpot", "Gong", "Outreach", "ZoomInfo", "Clari", "Chorus", "Drift",
];

const SocialProof = () => (
  <section className="py-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
      <span className="gradient-pill">SOCIAL PROOF</span>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="type-subheading text-body mt-6"
      >
        Trusted by forward-thinking sales teams
      </motion.h3>
    </div>
    <div className="relative overflow-hidden mt-10">
      <div className="animate-marquee flex gap-16 items-center w-max">
        {[...logos, ...logos].map((name, i) => (
          <span
            key={i}
            className="text-xl font-semibold tracking-tight text-body-muted/30 hover:text-body-muted transition-colors duration-300 whitespace-nowrap select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
