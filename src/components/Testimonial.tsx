import { motion } from "framer-motion";

const Testimonial = () => (
  <section className="section-padding">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="gradient-pill mb-8 inline-block">WHAT CUSTOMERS SAY</span>
        <blockquote className="text-2xl md:text-3xl font-semibold text-body leading-relaxed mt-8 mb-8" style={{ letterSpacing: "-0.01em" }}>
          "The world-class team at Voicera is leveraging cutting-edge
          AI to transform how enterprises work with voice data, leading
          to new ways for customers to take advantage of generative AI."
        </blockquote>
        <div className="text-body-muted text-sm">
          <span className="font-semibold text-body">Sarah Chen</span> · VP of Engineering, TechCorp
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonial;
