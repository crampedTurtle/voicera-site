import { useState } from "react";
import { Play } from "lucide-react";

const YOUTUBE_ID = "1J---fL-q2g";

const YouTubeCase = ({ aspect = "16/9" }: { aspect?: string }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      style={{ aspectRatio: aspect, position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", background: "#000" }}
      onClick={() => !playing && setPlaying(true)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&iv_load_policy=3`}
          style={{ width: "100%", height: "100%", border: 0 }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
            alt="Elizabeth Holmes Case Analysis"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              <Play style={{ width: 28, height: 28, color: "#0f172a", marginLeft: 3 }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default YouTubeCase;
