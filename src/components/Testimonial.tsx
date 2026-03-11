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
        <span className="gradient-pill mb-8 inline-block">WHAT SALES LEADERS SAY</span>
        <blockquote className="type-subheading text-body leading-relaxed mt-8 mb-8">
          "Voicera gave us objective data on every sales call — we stopped guessing which reps needed coaching and
          started seeing a 34% increase in win rates within the first quarter."
        </blockquote>
        <div className="text-sm text-body-muted">
          <span className="font-semibold text-body">Marcus Rivera</span> · VP of Sales Enablement, ScaleForce
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonial;
