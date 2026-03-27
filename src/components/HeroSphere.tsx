import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SINCERITY_LEVELS = [
  { label: "Sincere", color: "hsl(142 70% 45%)" },
  { label: "Neutral", color: "hsl(222 85% 60%)" },
  { label: "Likely Insincere", color: "hsl(38 92% 50%)" },
  { label: "Insincere", color: "hsl(0 72% 51%)" },
];

const CAPSULE_POSITIONS = [
  { x: "2%", y: "10%", align: "left" as const },
  { x: "78%", y: "18%", align: "right" as const },
  { x: "0%", y: "78%", align: "left" as const },
  { x: "75%", y: "85%", align: "right" as const },
];

const HeroSphere = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SINCERITY_LEVELS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const cx = 250, cy = 250;

  // Hexagonal prism vertices (top & bottom hexagons, wider horizontally)
  const sides = 6;
  const rx = 170; // horizontal radius (25% wider)
  const ry = 136; // standard radius
  const topY = 80;
  const botY = 420;
  const topVerts: [number, number][] = [];
  const botVerts: [number, number][] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    topVerts.push([cx + rx * Math.cos(angle), topY + ry * 0.35 * Math.sin(angle)]);
    botVerts.push([cx + rx * Math.cos(angle), botY + ry * 0.35 * Math.sin(angle)]);
  }

  const topPath = topVerts.map((v, i) => `${i === 0 ? "M" : "L"} ${v[0]},${v[1]}`).join(" ") + " Z";
  const botPath = botVerts.map((v, i) => `${i === 0 ? "M" : "L"} ${v[0]},${v[1]}`).join(" ") + " Z";

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Outer orbit ring */}
      <div
        className="absolute inset-[-6%] rounded-full"
        style={{ border: "1px solid hsl(222 40% 88%)" }}
      />

      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(222 80% 96%) 0%, hsl(222 60% 97%) 50%, transparent 70%)",
        }}
      />

      {/* Rotating prism SVG */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{ animation: "prism-rotate 20s linear infinite" }}
        >
          <defs>
            <linearGradient id="prism-edge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(222 85% 55%)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(222 60% 78%)" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="prism-face" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(222 80% 65%)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="hsl(222 80% 65%)" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="prism-face-accent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(222 85% 60%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(222 70% 75%)" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Top hexagon face */}
          <path d={topPath} fill="url(#prism-face-accent)" stroke="url(#prism-edge)" strokeWidth="1.2" />

          {/* Bottom hexagon face */}
          <path d={botPath} fill="url(#prism-face)" stroke="url(#prism-edge)" strokeWidth="0.8" opacity="0.5" />

          {/* Vertical edges connecting top to bottom */}
          {topVerts.map((tv, i) => {
            const bv = botVerts[i];
            const opacity = 0.25 + 0.55 * Math.abs(Math.sin(((i / sides) * Math.PI * 2)));
            return (
              <line
                key={`edge-${i}`}
                x1={tv[0]} y1={tv[1]}
                x2={bv[0]} y2={bv[1]}
                stroke="url(#prism-edge)"
                strokeWidth={1 + 0.5 * opacity}
                opacity={opacity}
              />
            );
          })}

          {/* Side faces (filled subtly) */}
          {topVerts.map((tv, i) => {
            const next = (i + 1) % sides;
            const tvn = topVerts[next];
            const bv = botVerts[i];
            const bvn = botVerts[next];
            const facePath = `M ${tv[0]},${tv[1]} L ${tvn[0]},${tvn[1]} L ${bvn[0]},${bvn[1]} L ${bv[0]},${bv[1]} Z`;
            return (
              <path
                key={`face-${i}`}
                d={facePath}
                fill="url(#prism-face)"
                stroke="url(#prism-edge)"
                strokeWidth="0.5"
                opacity={0.15 + 0.15 * Math.sin((i / sides) * Math.PI * 2)}
              />
            );
          })}

          {/* Internal wireframe lines for depth */}
          {Array.from({ length: 5 }).map((_, i) => {
            const t = (i + 1) / 6;
            const midY = topY + t * (botY - topY);
            const scale = 1 - t * 0.05;
            const points = Array.from({ length: sides }).map((_, j) => {
              const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
              return `${cx + rx * scale * Math.cos(angle)},${midY + ry * 0.35 * scale * Math.sin(angle)}`;
            });
            return (
              <polygon
                key={`ring-${i}`}
                points={points.join(" ")}
                fill="none"
                stroke="hsl(222 75% 65%)"
                strokeWidth="0.6"
                opacity={0.12 + 0.08 * Math.sin(t * Math.PI)}
              />
            );
          })}

          {/* Diagonal internal struts for crystalline depth */}
          {topVerts.map((tv, i) => {
            const opposite = (i + 3) % sides;
            const bv = botVerts[opposite];
            return (
              <line
                key={`strut-${i}`}
                x1={tv[0]} y1={tv[1]}
                x2={bv[0]} y2={bv[1]}
                stroke="hsl(222 70% 70%)"
                strokeWidth="0.4"
                opacity="0.12"
              />
            );
          })}
        </svg>
      </div>

      {/* Orbiting glow dot */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: "radial-gradient(circle, white 30%, hsl(222 85% 60%) 70%, transparent)",
          boxShadow: "0 0 12px 4px hsl(222 85% 60% / 0.5)",
        }}
        animate={{
          top: ["10%", "50%", "88%", "50%", "10%"],
          left: ["50%", "95%", "50%", "3%", "50%"],
        }}
        transition={{ duration: 11.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Sincerity level capsules */}
      {SINCERITY_LEVELS.map((level, i) => {
        const pos = CAPSULE_POSITIONS[i];
        const isActive = activeIndex === i;
        return (
          <motion.div
            key={level.label}
            className="absolute flex items-center gap-2 rounded-full px-4 py-2 shadow-md"
            style={{
              left: pos.x,
              top: pos.y,
              background: isActive ? "white" : "hsl(222 30% 97%)",
              border: `1.5px solid ${isActive ? level.color : "hsl(222 30% 90%)"}`,
              zIndex: isActive ? 10 : 1,
            }}
            animate={{
              scale: isActive ? 1.08 : 0.95,
              opacity: isActive ? 1 : 0.6,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
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
        );
      })}

      <style>{`
        @keyframes prism-rotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroSphere;
