import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import voiceraDemoGif from "@/assets/voicera-capsule-1.gif";
import voiceraInterviewGif from "@/assets/voicera-interview.gif";
import CrystalShape from "./CrystalShape";

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
  strand: number; // 0 or 1
  hasAnnotation?: boolean;
  annotationLabel?: string;
  annotationIndex?: number;
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number] }> = {
  foreground: { opacity: 0.9, blur: 0, parallaxRange: [0, -120] },
  midground: { opacity: 0.65, blur: 1, parallaxRange: [0, -60] },
  background: { opacity: 0.38, blur: 2, parallaxRange: [0, -20] },
};

const GRADIENTS = [
  "linear-gradient(135deg, rgba(75,110,245,0.45) 0%, rgba(255,255,255,0.7) 22%, rgba(155,77,235,0.4) 44%, rgba(255,255,255,0.65) 66%, rgba(240,24,122,0.35) 88%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,24,122,0.4) 25%, rgba(255,255,255,0.65) 45%, rgba(244,98,26,0.35) 65%, rgba(255,255,255,0.6) 85%, rgba(75,110,245,0.4) 100%)",
  "linear-gradient(135deg, rgba(155,77,235,0.4) 0%, rgba(255,255,255,0.7) 20%, rgba(244,98,26,0.35) 40%, rgba(255,255,255,0.65) 60%, rgba(75,110,245,0.4) 80%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(75,110,245,0.4) 22%, rgba(255,255,255,0.7) 44%, rgba(155,77,235,0.35) 66%, rgba(255,255,255,0.6) 82%, rgba(240,24,122,0.4) 100%)",
];

const CAPSULE_SHADOW =
  "inset 0 2px 10px rgba(255,255,255,0.5), inset 0 -4px 14px rgba(0,0,0,0.08), 0 8px 32px rgba(75, 110, 245, 0.12)";

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

    // Dramatic size variation: tiny (24px) to large (200px)
    const sizeVariants = [0.15, 0.25, 0.4, 0.6, 0.8, 1.0, 0.3, 0.5, 0.7, 0.2, 0.9, 0.35, 0.55, 0.45, 0.65, 0.85, 0.18, 0.75];
    const sizeT = sizeVariants[i % sizeVariants.length];
    const width = Math.round(24 + sizeT * 176); // 24-200px
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
      shimmerDuration: 7 + p2 * 4,
      gradientVariant: Math.floor(p3 * GRADIENTS.length),
      hasAnnotation,
      annotationLabel: hasAnnotation
        ? annotationLabels[annotationIndices.indexOf(i)]
        : undefined,
      annotationIndex: hasAnnotation ? annotationIndices.indexOf(i) : undefined,
    });
  }

  return capsules;
}

/** Generate SVG path data for flowing strand lines connecting capsules */
function generateStrandPaths(capsules: CapsuleConfig[]): { path: string; strand: number }[] {
  const strands: CapsuleConfig[][] = [[], []];
  capsules.forEach((c) => strands[c.strand].push(c));

  // Sort each strand by Y position
  strands.forEach((s) => s.sort((a, b) => a.y - b.y));

  return strands
    .filter((s) => s.length >= 2)
    .map((strandCapsules, strandIdx) => {
      // Build a smooth cubic bezier path through capsule centers
      const points = strandCapsules.map((c) => ({
        x: c.x,
        y: c.y,
      }));

      let d = `M ${points[0].x} ${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const midY = (curr.y + next.y) / 2;
        // Control points create a smooth curve
        const cp1x = curr.x;
        const cp1y = midY;
        const cp2x = next.x;
        const cp2y = midY;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
      }

      return { path: d, strand: strandIdx };
    });
}

const WaveformSVG = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" style={{ opacity: 0.6 }}>
    {[4, 10, 16, 22, 28, 34, 40].map((cx, i) => {
      const heights = [10, 18, 24, 14, 22, 12, 16];
      const h = heights[i];
      return (
        <rect key={i} x={cx - 1.5} y={16 - h / 2} width="3" rx="1.5" height={h} fill="white" />
      );
    })}
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
  } = config;
  const { opacity, blur, parallaxRange } = layerProps[layer];

  const translateY = useTransform(scrollProgress, [0, 1], parallaxRange);
  const rotateOffset = useTransform(scrollProgress, [0, 1], [-4, 4]);

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
          className="relative"
          style={{
            width,
            height,
            borderRadius: "40%",
            background: GRADIENTS[gradientVariant],
            backgroundSize: "200% 200%",
            border: "1.5px solid rgba(155, 77, 235, 0.3)",
            boxShadow: `${CAPSULE_SHADOW}, 0 0 10px rgba(75, 110, 245, 0.1)`,
            opacity,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            animation: `floatDrift ${floatDuration}s ease-in-out infinite, capsuleShimmer ${shimmerDuration}s ease-in-out infinite`,
          }}
        >
          {hasAnnotation && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ borderRadius: "40%" }}>
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
                  borderRadius: "40%",
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
