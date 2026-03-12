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
          className="text-center"
        >
          <span className="gradient-pill mb-8 inline-block">SINCERITY™ BY VOICERA</span>

          <div
            className="relative w-full mt-8 overflow-hidden cursor-pointer"
            style={{ aspectRatio: "21/9", borderRadius: "2rem" }}
            onClick={() => !playing && setPlaying(true)}
          >
            {!playing ? (
              <>
                <img
                  src={THUMB_URL}
                  alt="Sincerity by Voicera demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
                  <h2 className="type-display text-white mb-3">
                    AI Voice &amp; Video Insights
                  </h2>
                  <p className="text-white/80 font-normal mb-6" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                    For Enhancing Confidence in the Truth
                  </p>
                  <button className="inline-flex items-center gap-2 gradient-bg text-primary-foreground type-button px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                    <Play className="w-4 h-4" fill="currentColor" />
                    Watch
                  </button>
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
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
