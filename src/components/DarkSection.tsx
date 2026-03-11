import { motion } from "framer-motion";

const DarkSection = () => (
  <section id="developers" className="relative overflow-hidden py-32" style={{ background: "#0A0A1A" }}>
    {/* Gradient orb */}
    <div
      className="absolute w-[600px] h-[600px] rounded-full animate-float-orb pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
        filter: "blur(100px)",
        opacity: 0.2,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />

    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full type-tag text-white/80 border border-white/20 mb-8">
          PARTNER PROGRAM
        </span>
        <h2 className="type-display text-white mb-6">
          Join the Voicera{" "}
          <br />
          Partner Program
        </h2>
        <p className="type-body text-white/60 max-w-xl mx-auto mb-10">
          Integrate Voicera into your sales enablement platform, CRM, or coaching tool.
          Access our APIs, co-marketing resources, and dedicated partner support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
          <div className="border border-white/10 rounded-xl p-5 text-center">
            <div className="type-card-title text-white mb-1">Early Access</div>
            <p className="text-white/50 text-xs" style={{ lineHeight: 1.6 }}>New features & APIs before public release</p>
          </div>
          <div className="border border-white/10 rounded-xl p-5 text-center">
            <div className="type-card-title text-white mb-1">Co-Marketing</div>
            <p className="text-white/50 text-xs" style={{ lineHeight: 1.6 }}>Joint case studies, webinars & events</p>
          </div>
          <div className="border border-white/10 rounded-xl p-5 text-center">
            <div className="type-card-title text-white mb-1">Revenue Share</div>
            <p className="text-white/50 text-xs" style={{ lineHeight: 1.6 }}>Earn recurring commissions on referrals</p>
          </div>
        </div>

        <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-full hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)]">
          Become a Partner
        </button>
      </motion.div>
    </div>
  </section>
);

export default DarkSection;
