import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import voiceraDemoGif from "@/assets/voicera-capsule-1.gif";
import voiceraInterviewGif from "@/assets/voicera-interview.gif";

type DepthLayer = "foreground" | "midground" | "background";

interface CapsuleConfig {
  id: number;
  width: number;
  height: number;
  rotation: number;
  x: number;
  y: number;
  layer: DepthLayer;
  floatDuration: number;
  shimmerDuration: number;
  gradientVariant: number;
  strand: number;
  hasAnnotation?: boolean;
  annotationLabel?: string;
  annotationIndex?: number;
  crystalVariant: number; // 0-3 for different crystal shapes
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number]; glowScale: number }> = {
  foreground: { opacity: 0.9, blur: 0, parallaxRange: [0, -120], glowScale: 1.0 },
  midground: { opacity: 0.65, blur: 1, parallaxRange: [0, -60], glowScale: 0.55 },
  background: { opacity: 0.38, blur: 2, parallaxRange: [0, -20], glowScale: 0.25 },
};

const GRADIENTS = [
  "linear-gradient(135deg, rgba(75,110,245,0.45) 0%, rgba(255,255,255,0.7) 22%, rgba(155,77,235,0.4) 44%, rgba(255,255,255,0.65) 66%, rgba(240,24,122,0.35) 88%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,24,122,0.4) 25%, rgba(255,255,255,0.65) 45%, rgba(244,98,26,0.35) 65%, rgba(255,255,255,0.6) 85%, rgba(75,110,245,0.4) 100%)",
  "linear-gradient(135deg, rgba(155,77,235,0.4) 0%, rgba(255,255,255,0.7) 20%, rgba(244,98,26,0.35) 40%, rgba(255,255,255,0.65) 60%, rgba(75,110,245,0.4) 80%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(75,110,245,0.4) 22%, rgba(255,255,255,0.7) 44%, rgba(155,77,235,0.35) 66%, rgba(255,255,255,0.6) 82%, rgba(240,24,122,0.4) 100%)",
];

function prand(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) * 233280) % 1 + 1) % 1;
}

function generateHelixCapsules(
  count: number,
  variant: "hero" | "storytelling" | "cta"
): CapsuleConfig[] {
  const capsules: CapsuleConfig[] = [];
  const seed = variant === "hero" ? 1 : variant === "storytelling" ? 100 : 200;

  const helixCenterX = 50;
  const helixAmplitude = variant === "cta" ? 38 : 35;

  for (let i = 0; i < count; i++) {
    const s = seed + i;
    const p1 = prand(s);
    const p2 = prand(s + 1000);
    const p3 = prand(s + 2000);

    const strand = i % 2;
    const t = i / (count - 1 || 1);
    const yPos = 5 + t * 90;

    const phase = strand === 0 ? 0 : Math.PI;
    const frequency = 1.5;
    const xPos = helixCenterX + Math.sin(t * Math.PI * 2 * frequency + phase) * helixAmplitude;

    const sinVal = Math.abs(Math.sin(t * Math.PI * 2 * frequency + phase));
    const layer: DepthLayer = sinVal > 0.7 ? "foreground" : sinVal > 0.3 ? "midground" : "background";

    const sizeVariants = [0.15, 0.25, 0.4, 0.6, 0.8, 1.0, 0.3, 0.5, 0.7, 0.2, 0.9, 0.35, 0.55, 0.45, 0.65, 0.85, 0.18, 0.75];
    const sizeT = sizeVariants[i % sizeVariants.length];
    // 30% larger than original (original: 24-200, now: ~31-260)
    const width = Math.round((24 + sizeT * 176) * 1.3);
    const height = Math.round(width * (0.42 + p2 * 0.12));

    const tangentAngle = Math.cos(t * Math.PI * 2 * frequency + phase) * 30;
    const rotation = Math.round(tangentAngle + (p3 - 0.5) * 15);

    const annotationIndices = [3, 7];
    const hasAnnotation = variant === "storytelling" && annotationIndices.includes(i);
    const annotationLabels = ["20% Sincere, 15% Neutral, 65% Likely Insincere", "0:34–0:51 | Speaker 2"];

    capsules.push({
      id: s,
      width,
      height,
      rotation,
      x: Math.max(0, Math.min(95, xPos + (p2 - 0.5) * 6)),
      y: yPos,
      layer,
      strand,
      floatDuration: 5 + p1 * 4,
      shimmerDuration: 6 + p2 * 4, // 6-10s range for shimmer
      gradientVariant: Math.floor(p3 * GRADIENTS.length),
      hasAnnotation,
      annotationLabel: hasAnnotation
        ? annotationLabels[annotationIndices.indexOf(i)]
        : undefined,
      annotationIndex: hasAnnotation ? annotationIndices.indexOf(i) : undefined,
      crystalVariant: Math.floor(prand(s + 3000) * 4),
    });
  }

  return capsules;
}

function generateStrandPaths(capsules: CapsuleConfig[]): { path: string; strand: number }[] {
  const strands: CapsuleConfig[][] = [[], []];
  capsules.forEach((c) => strands[c.strand].push(c));
  strands.forEach((s) => s.sort((a, b) => a.y - b.y));

  return strands
    .filter((s) => s.length >= 2)
    .map((strandCapsules, strandIdx) => {
      const points = strandCapsules.map((c) => ({ x: c.x, y: c.y }));
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const midY = (curr.y + next.y) / 2;
        d += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
      }
      return { path: d, strand: strandIdx };
    });
}

/** Crystal prism SVG shapes - elongated hexagonal prisms with pointed tips */
const CrystalSVG = ({
  w,
  h,
  filled,
  gradient,
  glowScale,
}: {
  w: number;
  h: number;
  filled: boolean;
  gradient?: string;
  glowScale: number;
}) => {
  // We'll draw inside a viewBox, scale via width/height
  // Aspect: crystal is taller than wide
  const vW = 60;
  const vH = 100;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${vW} ${vH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(0 0 ${6 * glowScale}px rgba(168, 85, 247, ${0.9 * glowScale})) drop-shadow(0 0 ${16 * glowScale}px rgba(236, 72, 153, ${0.6 * glowScale})) drop-shadow(0 0 ${32 * glowScale}px rgba(168, 85, 247, ${0.3 * glowScale}))`,
      }}
    >
      {filled && gradient && (
        <defs>
          <linearGradient id={`cg-${w}-${h}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(155,77,235,0.35)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="60%" stopColor="rgba(75,110,245,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
          </linearGradient>
        </defs>
      )}

      {/* Main crystal body - elongated hexagonal prism with pointed tip */}
      <polygon
        points={`30,2 45,18 45,78 38,95 22,95 15,78 15,18`}
        fill={filled ? `url(#cg-${w}-${h})` : "none"}
        stroke="rgba(168,85,247,0.6)"
        strokeWidth="1"
      />

      {/* Right face edge */}
      <line x1="30" y1="2" x2="30" y2="95" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />

      {/* Tip facet lines */}
      <line x1="30" y1="2" x2="15" y2="18" stroke="rgba(168,85,247,0.4)" strokeWidth="0.7" />
      <line x1="30" y1="2" x2="45" y2="18" stroke="rgba(168,85,247,0.4)" strokeWidth="0.7" />

      {/* Diagonal facet near tip */}
      <line x1="20" y1="12" x2="40" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <line x1="18" y1="20" x2="35" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />

      {/* Bottom termination lines */}
      <line x1="30" y1="95" x2="15" y2="78" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" />
      <line x1="30" y1="95" x2="45" y2="78" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" />

      {/* Outer highlight stroke */}
      <polygon
        points={`30,2 45,18 45,78 38,95 22,95 15,78 15,18`}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth={filled ? 1 : 0.8}
      />
    </svg>
  );
};

/** Small shard variant */
const CrystalShardSVG = ({
  w,
  h,
  filled,
  glowScale,
}: {
  w: number;
  h: number;
  filled: boolean;
  glowScale: number;
}) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 40 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 ${6 * glowScale}px rgba(168, 85, 247, ${0.9 * glowScale})) drop-shadow(0 0 ${16 * glowScale}px rgba(236, 72, 153, ${0.6 * glowScale})) drop-shadow(0 0 ${32 * glowScale}px rgba(168, 85, 247, ${0.3 * glowScale}))`,
    }}
  >
    {filled && (
      <defs>
        <linearGradient id={`cs-${w}-${h}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(240,24,122,0.25)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(155,77,235,0.3)" />
        </linearGradient>
      </defs>
    )}
    <polygon
      points="20,2 35,20 32,65 20,78 8,65 5,20"
      fill={filled ? `url(#cs-${w}-${h})` : "none"}
      stroke="rgba(168,85,247,0.6)"
      strokeWidth="1"
    />
    <line x1="20" y1="2" x2="20" y2="78" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
    <line x1="20" y1="2" x2="5" y2="20" stroke="rgba(168,85,247,0.4)" strokeWidth="0.6" />
    <line x1="20" y1="2" x2="35" y2="20" stroke="rgba(168,85,247,0.4)" strokeWidth="0.6" />
    <line x1="12" y1="14" x2="30" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
    <polygon
      points="20,2 35,20 32,65 20,78 8,65 5,20"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth={filled ? 1 : 0.8}
    />
  </svg>
);

/** Wide crystal variant */
const CrystalWideSVG = ({
  w,
  h,
  filled,
  glowScale,
}: {
  w: number;
  h: number;
  filled: boolean;
  glowScale: number;
}) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 70 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 ${6 * glowScale}px rgba(168, 85, 247, ${0.9 * glowScale})) drop-shadow(0 0 ${16 * glowScale}px rgba(236, 72, 153, ${0.6 * glowScale})) drop-shadow(0 0 ${32 * glowScale}px rgba(168, 85, 247, ${0.3 * glowScale}))`,
    }}
  >
    {filled && (
      <defs>
        <linearGradient id={`cw-${w}-${h}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(75,110,245,0.3)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="80%" stopColor="rgba(155,77,235,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>
      </defs>
    )}
    <polygon
      points="35,2 55,15 58,75 45,95 25,95 12,75 15,15"
      fill={filled ? `url(#cw-${w}-${h})` : "none"}
      stroke="rgba(168,85,247,0.6)"
      strokeWidth="1"
    />
    <line x1="35" y1="2" x2="35" y2="95" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7" />
    <line x1="35" y1="2" x2="15" y2="15" stroke="rgba(168,85,247,0.4)" strokeWidth="0.7" />
    <line x1="35" y1="2" x2="55" y2="15" stroke="rgba(168,85,247,0.4)" strokeWidth="0.7" />
    <line x1="22" y1="10" x2="48" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
    <line x1="18" y1="16" x2="42" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.35" />
    <line x1="35" y1="95" x2="12" y2="75" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" />
    <line x1="35" y1="95" x2="58" y2="75" stroke="rgba(168,85,247,0.3)" strokeWidth="0.5" />
    <polygon
      points="35,2 55,15 58,75 45,95 25,95 12,75 15,15"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth={filled ? 1 : 0.8}
    />
  </svg>
);

/** Cluster crystal - two prisms together */
const CrystalClusterSVG = ({
  w,
  h,
  filled,
  glowScale,
}: {
  w: number;
  h: number;
  filled: boolean;
  glowScale: number;
}) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 80 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: `drop-shadow(0 0 ${6 * glowScale}px rgba(168, 85, 247, ${0.9 * glowScale})) drop-shadow(0 0 ${16 * glowScale}px rgba(236, 72, 153, ${0.6 * glowScale})) drop-shadow(0 0 ${32 * glowScale}px rgba(168, 85, 247, ${0.3 * glowScale}))`,
    }}
  >
    {filled && (
      <defs>
        <linearGradient id={`cc-${w}-${h}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(155,77,235,0.3)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(75,110,245,0.25)" />
        </linearGradient>
      </defs>
    )}
    {/* Main tall crystal */}
    <polygon
      points="30,2 42,16 42,72 36,88 24,88 18,72 18,16"
      fill={filled ? `url(#cc-${w}-${h})` : "none"}
      stroke="rgba(168,85,247,0.6)"
      strokeWidth="1"
    />
    <line x1="30" y1="2" x2="30" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
    <line x1="30" y1="2" x2="18" y2="16" stroke="rgba(168,85,247,0.4)" strokeWidth="0.6" />
    <line x1="30" y1="2" x2="42" y2="16" stroke="rgba(168,85,247,0.4)" strokeWidth="0.6" />
    <line x1="23" y1="10" x2="38" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />

    {/* Smaller side crystal */}
    <polygon
      points="58,22 68,32 68,72 63,85 53,85 48,72 48,32"
      fill={filled ? `url(#cc-${w}-${h})` : "none"}
      stroke="rgba(168,85,247,0.5)"
      strokeWidth="0.8"
    />
    <line x1="58" y1="22" x2="58" y2="85" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
    <line x1="58" y1="22" x2="48" y2="32" stroke="rgba(168,85,247,0.35)" strokeWidth="0.5" />
    <line x1="58" y1="22" x2="68" y2="32" stroke="rgba(168,85,247,0.35)" strokeWidth="0.5" />

    {/* Tiny base shard */}
    <polygon
      points="12,55 18,62 17,85 12,92 7,85 6,62"
      fill={filled ? `url(#cc-${w}-${h})` : "none"}
      stroke="rgba(168,85,247,0.4)"
      strokeWidth="0.6"
    />

    {/* Outer highlights */}
    <polygon
      points="30,2 42,16 42,72 36,88 24,88 18,72 18,16"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth={filled ? 1 : 0.7}
    />
  </svg>
);

interface FloatingCapsulesProps {
  variant: "hero" | "storytelling" | "cta";
  count?: number;
  className?: string;
}

const FloatingCapsules = ({ variant, count, className = "" }: FloatingCapsulesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultCount = variant === "cta" ? 18 : variant === "hero" ? 16 : 14;
  const capsules = useMemo(
    () => generateHelixCapsules(count ?? defaultCount, variant),
    [count, defaultCount, variant]
  );
  const strandPaths = useMemo(() => generateStrandPaths(capsules), [capsules]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Connecting strand lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        style={{ zIndex: 0 }}
      >
        {strandPaths.map(({ path, strand }, i) => (
          <path
            key={i}
            d={path}
            stroke={strand === 0 ? "rgba(155, 77, 235, 0.12)" : "rgba(75, 110, 245, 0.12)"}
            strokeWidth="0.15"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {capsules.map((c) => (
        <CapsuleElement key={c.id} config={c} scrollProgress={scrollYProgress} />
      ))}
    </div>
  );
};

const CapsuleElement = ({
  config,
  scrollProgress,
}: {
  config: CapsuleConfig;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const {
    layer,
    width,
    height,
    rotation,
    x,
    y,
    floatDuration,
    shimmerDuration,
    gradientVariant,
    hasAnnotation,
    annotationLabel,
    annotationIndex,
    crystalVariant,
  } = config;
  const { opacity, blur, parallaxRange, glowScale } = layerProps[layer];

  const translateY = useTransform(scrollProgress, [0, 1], parallaxRange);
  const rotateOffset = useTransform(scrollProgress, [0, 1], [-4, 4]);

  const isFilled = layer !== "background";

  // Pick crystal shape based on variant
  const renderCrystal = () => {
    const props = { w: width, h: height, filled: isFilled, glowScale, shimmerDuration, gradientVariant };
    switch (crystalVariant) {
      case 0: return <CrystalSVG {...props} />;
      case 1: return <CrystalShardSVG {...props} />;
      case 2: return <CrystalWideSVG {...props} />;
      case 3: return <CrystalClusterSVG {...props} />;
      default: return <CrystalSVG {...props} />;
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        translateY,
        zIndex: layer === "foreground" ? 3 : layer === "midground" ? 2 : 1,
      }}
    >
      <motion.div style={{ rotate: rotation, rotateZ: rotateOffset }}>
        <div
          style={{
            opacity,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            animation: `floatDrift ${floatDuration}s ease-in-out infinite`,
            position: "relative",
          }}
        >
          {renderCrystal()}

          {hasAnnotation && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{ clipPath: "polygon(50% 2%, 75% 18%, 75% 78%, 63% 95%, 37% 95%, 25% 78%, 25% 18%)" }}
            >
              <img
                src={annotationIndex === 1 ? voiceraInterviewGif : voiceraDemoGif}
                alt="Voicera AI analysis"
                className="w-full h-full object-cover"
                style={{ transform: `rotate(${-rotation}deg) scale(1.2)` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, hsla(270, 60%, 70%, 0.45) 0%, hsla(270, 60%, 80%, 0.2) 40%, transparent 70%)",
                }}
              />
            </div>
          )}
        </div>

        {hasAnnotation && annotationLabel && (
          <div
            className="absolute flex flex-col items-center"
            style={{
              left: "50%",
              top: "100%",
              transform: `translateX(-50%) rotate(${-rotation}deg)`,
            }}
          >
            <div
              style={{
                width: 2,
                height: 16,
                background: "rgba(168, 85, 247, 0.3)",
              }}
            />
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "rgba(168, 85, 247, 0.8)",
                background: "rgba(255,255,255,0.92)",
                borderRadius: 4,
                padding: "2px 6px",
                marginTop: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {annotationLabel}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FloatingCapsules;
