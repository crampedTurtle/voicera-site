import { motion } from "framer-motion";

const CTABanner = () => (
  <section className="section-padding relative overflow-hidden">
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
        <h2
          className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-shimmer"
          style={{
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ready to unlock your voice data?
        </h2>
        <p className="text-body-muted text-lg max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
          Start building with Voicera today. Free to start, scales with your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="gradient-bg px-8 py-3.5 text-base font-semibold text-white rounded-full hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)]">
            Start Building Free
          </button>
          <button className="gradient-border px-8 py-3.5 text-base font-semibold gradient-text rounded-full hover:scale-[1.03] transition-transform duration-200">
            Talk to Sales
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
