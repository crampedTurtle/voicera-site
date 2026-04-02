import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const YOUTUBE_ID = "1J---fL-q2g";

const Testimonial = () => {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = () => {
    if (!playing) {
      setPlaying(true);
    }
  };

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
            className="relative mt-8 mx-auto cursor-pointer w-full md:w-[75%]"
            style={{ aspectRatio: "16/9" }}
            onClick={handlePlay}
          >
            <div
              className="absolute rounded-[1.75rem] md:rounded-[2.5rem]"
              style={{
                inset: "-12px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(79, 92, 220, 0.3) 30%, rgba(99, 102, 241, 0.15) 60%, transparent 100%)",
                filter: "blur(16px)",
                zIndex: 0,
              }}
            />
            <div
              className="relative w-full h-full overflow-hidden rounded-[1.25rem] md:rounded-[2rem]"
              style={{ zIndex: 1 }}
            >
              {playing ? (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&iv_load_policy=3`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                    alt="Sincerity AI Demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
                    <h2 className="type-display mb-3" style={{ color: "white" }}>
                      AI Voice &amp; Video Insights
                    </h2>
                    <p className="text-white/80 font-normal mb-6" style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                      For Enhancing Confidence in the Truth
                    </p>
                    <button className="inline-flex items-center gap-2 bg-black/80 text-white type-button px-6 py-3 rounded-xl hover:bg-black/90 transition-colors backdrop-blur-sm">
                      Watch
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
