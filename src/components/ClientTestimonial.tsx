import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ArrowUpRight } from "lucide-react";

const ClientTestimonial = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden bg-alt">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-pill mb-8 inline-block">CLIENT TESTIMONIAL</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
            {/* Left: Text */}
            <div>
              <h2 className="type-display mb-4">
                Client Testimonial: Scott Ramey
              </h2>
              <p className="type-body mb-8">
                Scott Ramey discusses the power of Sincerity insights in his Coaching Case Study.
              </p>
              <button className="gradient-bg px-8 py-3.5 type-button text-white rounded-xl hover:scale-[1.03] transition-all duration-200 hover:shadow-[0_4px_24px_rgba(240,24,122,0.35)] inline-flex items-center gap-2">
                Read the Case Study <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Video */}
            <div
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
              style={{
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                border: "1px solid hsl(var(--border))",
              }}
              onClick={() => setPlaying(true)}
            >
              <iframe
                className="w-full h-full"
                style={playing ? { pointerEvents: "auto" } : { pointerEvents: "none" }}
                src={`https://www.youtube.com/embed/GhrtJO3R-80?modestbranding=1&rel=0&showinfo=0&controls=0&iv_load_policy=3${playing ? "&autoplay=1" : ""}`}
                title="Client Testimonial: Scott Ramey"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientTestimonial;
