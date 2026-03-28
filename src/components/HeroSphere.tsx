import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SINCERITY_LEVELS = [
  { label: "Sincere", color: "hsl(142 70% 45%)" },
  { label: "Neutral", color: "hsl(222 85% 60%)" },
  { label: "Likely Insincere", color: "hsl(38 92% 50%)" },
  { label: "Insincere", color: "hsl(0 72% 51%)" },
];

/* positions around the sphere (angle in degrees from top) */
const CAPSULE_POSITIONS = [
  { x: "8%", y: "12%", align: "left" as const },
  { x: "82%", y: "22%", align: "right" as const },
  { x: "6%", y: "78%", align: "left" as const },
  { x: "78%", y: "85%", align: "right" as const },
];

/* generate great-circle arc paths for a wireframe sphere look */
function generateArcs(cx: number, cy: number, r: number, count: number) {
  const arcs: string[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI;
    const rx = r;
    const ry = r * Math.abs(Math.cos(angle));
    const rot = (i / count) * 180;
    arcs.push(
      `M ${cx - rx * Math.cos((rot * Math.PI) / 180) + ry * Math.sin((rot * Math.PI) / 180)},${cy - rx * Math.sin((rot * Math.PI) / 180) - ry * Math.cos((rot * Math.PI) / 180)} A ${rx},${ry} ${rot} 1,1 ${cx + rx * Math.cos((rot * Math.PI) / 180) - ry * Math.sin((rot * Math.PI) / 180)},${cy + rx * Math.sin((rot * Math.PI) / 180) + ry * Math.cos((rot * Math.PI) / 180)}`
    );
  }
  return arcs;
}

/* Dot orbit: 4 stops matching capsule positions (top-left, top-right, bottom-right, bottom-left) */
const ORBIT_DURATION = 10; // seconds for full loop
const SEGMENT = ORBIT_DURATION / 4; // time per capsule

const HeroSphere = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = ((now - startRef.current) / 1000) % ORBIT_DURATION;
      const idx = Math.floor(elapsed / SEGMENT);
      setActiveIndex(idx);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const cx = 250, cy = 300, rx = 160, ry = 240;

  /* Dot keyframes: orbit ellipse hitting near each capsule
     0: top (near capsule 0 top-left)
     25%: right (near capsule 1 top-right)
     50%: bottom (near capsule 3 bottom-right)  
     75%: left (near capsule 2 bottom-left)
     100%: back to top */
  const dotKeyframes = {
    top:  ["8%",  "28%", "82%", "72%", "8%"],
    left: ["18%", "88%", "82%", "8%",  "18%"],
  };

  return (
    <div className="relative w-full max-w-[620px] mx-auto" style={{ aspectRatio: "5/5.5" }}>

      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(222 80% 96%) 0%, hsl(222 60% 97%) 50%, transparent 70%)",
        }}
      />

      {/* Rotating wireframe sphere SVG */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 500 600"
          className="w-full h-full"
          style={{ animation: "sphere-rotate 25s linear infinite" }}
        >
          <defs>
            <linearGradient id="sphere-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(222 85% 55%)" stopOpacity="0.9" />
              <stop offset="50%" stopColor="hsl(222 75% 65%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(222 60% 80%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Outer ellipse */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="hsl(222 40% 88%)" strokeWidth="1" opacity="0.5" />

          {/* Longitude lines (vertical great circles) */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * 180;
            const lrx = rx * Math.abs(Math.cos((angle * Math.PI) / 180));
            const opacity = 0.2 + 0.6 * Math.abs(Math.sin((angle * Math.PI) / 180));
            return (
              <ellipse
                key={`lon-${i}`}
                cx={cx}
                cy={cy}
                rx={lrx}
                ry={ry}
                fill="none"
                stroke="url(#sphere-grad)"
                strokeWidth={1 + 0.8 * Math.abs(Math.sin((angle * Math.PI) / 180))}
                opacity={opacity}
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
            );
          })}

          {/* Latitude lines (horizontal ellipses) */}
          {Array.from({ length: 11 }).map((_, i) => {
            const t = ((i + 1) / 12) * 2 - 1;
            const y = cy + t * ry;
            const latRx = rx * Math.sqrt(1 - t * t);
            const dist = Math.abs(t);
            const opacity = 0.15 + 0.4 * (1 - dist);
            return (
              <ellipse
                key={`lat-${i}`}
                cx={cx}
                cy={y}
                rx={latRx}
                ry={latRx * 0.25}
                fill="none"
                stroke="url(#sphere-grad)"
                strokeWidth={0.8}
                opacity={opacity}
              />
            );
          })}

          {/* Diagonal great circles for extra depth */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = 30 + (i / 6) * 150;
            const dry = ry * 0.85;
            return (
              <ellipse
                key={`diag-${i}`}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={dry * Math.abs(Math.sin(((angle + 45) * Math.PI) / 180))}
                fill="none"
                stroke="hsl(222 80% 60%)"
                strokeWidth={0.7}
                opacity={0.15 + 0.2 * Math.sin((i / 6) * Math.PI)}
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
            );
          })}
        </svg>
      </div>

      {/* Glowing dot on the ring */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: "radial-gradient(circle, white 30%, hsl(222 85% 60%) 70%, transparent)",
          boxShadow: "0 0 12px 4px hsl(222 85% 60% / 0.5)",
        }}
        animate={{
          top: dotKeyframes.top,
          left: dotKeyframes.left,
        }}
        transition={{
          duration: ORBIT_DURATION,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Sincerity level capsules */}
      {SINCERITY_LEVELS.map((level, i) => {
        const pos = CAPSULE_POSITIONS[i];
        const isActive = activeIndex === i;
        return (
          <AnimatePresence key={level.label} mode="wait">
            <motion.div
              className="absolute flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                left: pos.x,
                top: pos.y,
                background: isActive ? "white" : "hsl(222 30% 97%)",
                border: `1.5px solid ${isActive ? level.color : "hsl(222 30% 90%)"}`,
                zIndex: isActive ? 10 : 1,
                boxShadow: isActive
                  ? `0 4px 20px ${level.color}40, 0 0 0 3px ${level.color}20`
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
              initial={false}
              animate={{
                scale: isActive ? 1.15 : 0.85,
                opacity: isActive ? 1 : 0.45,
                y: isActive ? -6 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: level.color }}
              />
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: isActive ? level.color : "hsl(222 20% 50%)" }}
              >
                {level.label}
              </span>
            </motion.div>
          </AnimatePresence>
        );
      })}

      {/* CSS animation */}
      <style>{`
        @keyframes sphere-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroSphere;
