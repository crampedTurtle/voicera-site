import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";


const CTABanner = () => (
  <section className="section-padding relative overflow-hidden">
    {/* Floating capsules */}
    <FloatingCapsules variant="cta" count={16} />
    <SubtleGuideLines variant="vertical-left" />
    <SubtleGuideLines variant="vertical-right" />
    <SubtleGuideLines variant="horizontal" className="top-0" />
    {/* Ambient orb */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full animate-float-orb pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
        filter: "blur(80px)",
        opacity: 0.12,
        top: "50%",
        right: "-100px",
        transform: "translateY(-50%)",
      }}
    />

    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="type-display mb-6">
          Ready to turn every sales call into a growth lever?
        </h2>
        <p className="type-body max-w-xl mx-auto mb-10">
          Join hundreds of sales teams using Voicera to coach smarter, close faster, and build credibility at scale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)] inline-flex items-center gap-2">
            Start Free Trial <ArrowUpRight className="w-4 h-4" />
          </button>
          <button className="gradient-border-rect px-8 py-3.5 type-button rounded-xl hover:scale-[1.03] transition-transform duration-200 inline-flex items-center gap-2">
            <span className="btn-label inline-flex items-center gap-2">Talk to Sales <ArrowUpRight className="w-4 h-4" /></span>
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
