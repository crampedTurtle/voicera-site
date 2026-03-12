import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const YOUTUBE_ID = "GhrtJO3R-80";
const THUMB_URL = `https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

const Testimonial = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-pill mb-8 inline-block">SINCERITY™ BY VOICERA</span>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 items-center">
            {/* Left – text */}
            <div>
              <h2 className="type-display mb-4">
                AI Voice &amp; Video Insights
              </h2>
              <p className="type-subheading text-body-text font-normal mb-8" style={{ fontSize: "clamp(20px, 2vw, 28px)" }}>
                For Enhancing Confidence in the Truth
              </p>
              <a
                href="#"
                className="inline-block gradient-bg text-primary-foreground type-button px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Sign Up for Free
              </a>
            </div>

            {/* Right – video */}
            <div
              className="relative w-full rounded-xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setPlaying(true)}
            >
              {!playing ? (
                <>
                  <img
                    src={THUMB_URL}
                    alt="Sincerity by Voicera demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 text-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&start=27&modestbranding=1&rel=0&showinfo=0&controls=0&iv_load_policy=3`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Sincerity by Voicera"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
