import { useRef, useMemo, useId } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface CrystalConfig {
  id: number;
  x: number;
  y: number;
  height: number;
  width: number;
  rotation: number;
  opacity: number;
  sparkleDelay: number;
  variant: number;
  side: "left" | "right" | "bottom" | "top";
}

function prand(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) * 233280) % 1 + 1) % 1;
}

function generateCrystals(count: number): CrystalConfig[] {
  const crystals: CrystalConfig[] = [];

  for (let i = 0; i < count; i++) {
    const p1 = prand(i * 7 + 3);
    const p2 = prand(i * 13 + 7);
    const p3 = prand(i * 19 + 11);
    const p4 = prand(i * 23 + 17);

    // Distribute crystals along edges to create a cave-like frame
    const sideRoll = p1;
    let side: "left" | "right" | "bottom" | "top";
    let x: number, y: number, rotation: number;

    if (sideRoll < 0.3) {
      side = "left";
      x = p2 * 18; // 0-18% from left
      y = 10 + p3 * 80;
      rotation = 10 + p4 * 25; // Tilt inward
    } else if (sideRoll < 0.6) {
      side = "right";
      x = 82 + p2 * 18; // 82-100% from left
      y = 10 + p3 * 80;
      rotation = -(10 + p4 * 25); // Tilt inward
    } else if (sideRoll < 0.8) {
      side = "bottom";
      x = 10 + p2 * 80;
      y = 78 + p3 * 22;
      rotation = -15 + p4 * 30;
    } else {
      side = "top";
      x = 10 + p2 * 80;
      y = p3 * 18;
      rotation = 160 + p4 * 40; // Point downward
    }

    const height = 40 + p2 * 120;
    const width = 12 + p3 * 30;

    crystals.push({
      id: i,
      x,
      y,
      height,
      width,
      rotation,
      opacity: 0.25 + p4 * 0.35, // More visible: 0.25-0.60
      sparkleDelay: p1 * 8,
      variant: Math.floor(p2 * 4),
      side,
    });
  }

  return crystals;
}

const CrystalShape = ({ width, height, variant }: { width: number; height: number; variant: number }) => {
  const uid = useId();

  const gradStops = [
    { s1: "hsla(270,60%,80%,0.5)", s2: "hsla(270,50%,90%,0.2)", s3: "hsla(280,40%,95%,0.1)" },
    { s1: "hsla(260,55%,85%,0.45)", s2: "hsla(275,45%,88%,0.25)", s3: "hsla(290,35%,92%,0.1)" },
    { s1: "hsla(280,50%,82%,0.5)", s2: "hsla(265,55%,87%,0.2)", s3: "hsla(270,40%,94%,0.08)" },
    { s1: "hsla(270,65%,78%,0.4)", s2: "hsla(280,50%,85%,0.25)", s3: "hsla(260,40%,92%,0.1)" },
  ];

  const g = gradStops[variant % gradStops.length];

  // Different crystal point shapes
  const shapes = [
    "20,2 32,20 30,80 20,98 10,80 8,20",       // Classic point
    "18,2 30,18 28,75 18,96 8,75 6,18",         // Lean point
    "22,2 36,24 34,78 22,98 10,78 8,24",        // Wide base
    "20,2 28,15 26,82 20,98 14,82 12,15",       // Narrow shard
  ];

  return (
    <svg width={width} height={height} viewBox="0 0 40 100" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={g.s1} />
          <stop offset="50%" stopColor={g.s2} />
          <stop offset="100%" stopColor={g.s3} />
        </linearGradient>
      </defs>
      <polygon
        points={shapes[variant % shapes.length]}
        fill={`url(#${uid})`}
        stroke="hsla(270,60%,75%,0.25)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Internal facet line */}
      <line x1="20" y1="2" x2="20" y2="98" stroke="hsla(0,0%,100%,0.15)" strokeWidth="0.4" />
      <line x1="20" y1="2" x2="8" y2="20" stroke="hsla(270,50%,75%,0.2)" strokeWidth="0.5" />
      <line x1="20" y1="2" x2="32" y2="20" stroke="hsla(270,50%,75%,0.2)" strokeWidth="0.5" />
      {/* Outer highlight */}
      <polygon
        points={shapes[variant % shapes.length]}
        fill="none"
        stroke="hsla(0,0%,100%,0.2)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SparkleParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{
      background: "hsla(270,80%,85%,0.8)",
      boxShadow: "0 0 4px hsla(270,70%,80%,0.6), 0 0 8px hsla(270,60%,75%,0.3)",
      top: "30%",
      left: "50%",
    }}
    animate={{
      opacity: [0, 0.9, 0],
      scale: [0.3, 1.2, 0.3],
    }}
    transition={{
      duration: 2.5,
      delay,
      repeat: Infinity,
      repeatDelay: 4 + delay * 0.5,
      ease: "easeInOut",
    }}
  />
);

const CrystalElement = ({
  config,
  scrollProgress,
}: {
  config: CrystalConfig;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const parallaxY = useTransform(scrollProgress, [0, 1], [0, -15 - config.height * 0.1]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${config.x}%`,
        top: `${config.y}%`,
        translateY: parallaxY,
        opacity: config.opacity,
      }}
    >
      <motion.div
        style={{ rotate: config.rotation }}
        animate={{ rotate: [config.rotation - 1, config.rotation + 1, config.rotation - 1] }}
        transition={{ duration: 8 + config.sparkleDelay, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <CrystalShape width={config.width} height={config.height} variant={config.variant} />
          <SparkleParticle delay={config.sparkleDelay} />
        </div>
      </motion.div>
    </motion.div>
  );
};

const CrystalCaveBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const crystals = useMemo(() => generateCrystals(28), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ top: "-200px" }}>
      {/* Soft purple ambient wash */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 100%, hsla(270,40%,88%,0.35) 0%, transparent 60%), radial-gradient(ellipse 100% 60% at 0% 50%, hsla(270,35%,90%,0.2) 0%, transparent 50%), radial-gradient(ellipse 100% 60% at 100% 50%, hsla(280,35%,90%,0.2) 0%, transparent 50%)",
        }}
      />

      {/* Crystal elements */}
      {crystals.map((c) => (
        <CrystalElement key={c.id} config={c} scrollProgress={scrollYProgress} />
      ))}

      {/* Cave arch vignette — darkens edges to create depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, hsla(270,20%,92%,0.5) 100%)",
        }}
      />
    </div>
  );
};

export default CrystalCaveBackground;
