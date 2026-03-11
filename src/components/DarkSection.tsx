import { motion } from "framer-motion";

const DarkSection = () => (
  <section className="relative overflow-hidden py-32" style={{ background: "#0A0A1A" }}>
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
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ letterSpacing: "-0.03em" }}>
          Find any scene in{" "}
          <br />
          natural language
        </h2>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10" style={{ lineHeight: 1.7 }}>
          Ask questions about your audio in plain English. Voicera understands context, emotion, and meaning — not just keywords.
        </p>
        <button className="gradient-bg px-8 py-3.5 text-base font-semibold text-white rounded-full hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)]">
          Explore Voice Search
        </button>
      </motion.div>
    </div>
  </section>
);

export default DarkSection;
