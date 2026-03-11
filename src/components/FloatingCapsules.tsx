import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type DepthLayer = "foreground" | "midground" | "background";

interface CapsuleConfig {
  id: number;
  width: number;
  height: number;
  rotation: number;
  x: number; // percent
  y: number; // percent
  layer: DepthLayer;
  floatDuration: number;
  shimmerDuration: number;
  gradientVariant: number; // 0-3 different gradient mixes
  hasAnnotation?: boolean;
  annotationLabel?: string;
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number] }> = {
  foreground: { opacity: 0.9, blur: 0, parallaxRange: [0, -120] },
  midground: { opacity: 0.65, blur: 1, parallaxRange: [0, -60] },
  background: { opacity: 0.38, blur: 2, parallaxRange: [0, -20] },
};

// Muted versions of the brand gradient (#4B6EF5 → #9B4DEB → #F0187A → #F4621A) with white breaks
const GRADIENTS = [
  "linear-gradient(135deg, rgba(75,110,245,0.45) 0%, rgba(255,255,255,0.7) 22%, rgba(155,77,235,0.4) 44%, rgba(255,255,255,0.65) 66%, rgba(240,24,122,0.35) 88%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,24,122,0.4) 25%, rgba(255,255,255,0.65) 45%, rgba(244,98,26,0.35) 65%, rgba(255,255,255,0.6) 85%, rgba(75,110,245,0.4) 100%)",
  "linear-gradient(135deg, rgba(155,77,235,0.4) 0%, rgba(255,255,255,0.7) 20%, rgba(244,98,26,0.35) 40%, rgba(255,255,255,0.65) 60%, rgba(75,110,245,0.4) 80%, rgba(255,255,255,0.6) 100%)",
  "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(75,110,245,0.4) 22%, rgba(255,255,255,0.7) 44%, rgba(155,77,235,0.35) 66%, rgba(255,255,255,0.6) 82%, rgba(240,24,122,0.4) 100%)",
];

const CAPSULE_SHADOW =
  "inset 0 2px 10px rgba(255,255,255,0.5), inset 0 -4px 14px rgba(0,0,0,0.1), 0 8px 32px rgba(168, 85, 247, 0.15)";

// Deterministic pseudo-random
function prand(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) * 233280) % 1 + 1) % 1;
}

/**
 * Generate capsules in a DNA double-helix pattern.
 * Two sinusoidal strands weave along the vertical axis,
 * creating an intertwined chain effect.
 */
function generateHelixCapsules(
  count: number,
  variant: "hero" | "storytelling" | "cta"
): CapsuleConfig[] {
  const capsules: CapsuleConfig[] = [];
  const seed = variant === "hero" ? 1 : variant === "storytelling" ? 100 : 200;

  // Helix parameters
  const helixCenterX = 50; // center of the helix horizontally (%)
  const helixAmplitude = variant === "cta" ? 38 : 35; // horizontal swing (%)
  const strandCount = count;

  for (let i = 0; i < strandCount; i++) {
    const s = seed + i;
    const p1 = prand(s);
    const p2 = prand(s + 1000);
    const p3 = prand(s + 2000);

    // Which strand (0 or 1) — alternating
    const strand = i % 2;

    // Vertical position: evenly spaced along section height
    const t = i / (strandCount - 1 || 1);
    const yPos = 5 + t * 90;

    // Sinusoidal X: two strands are phase-offset by PI
    const phase = strand === 0 ? 0 : Math.PI;
    const frequency = 1.5; // how many full waves across the section
    const xPos = helixCenterX + Math.sin(t * Math.PI * 2 * frequency + phase) * helixAmplitude;

    // Depth layer based on position in sine wave (crossing points = midground)
    const sinVal = Math.abs(Math.sin(t * Math.PI * 2 * frequency + phase));
    const layer: DepthLayer = sinVal > 0.7 ? "foreground" : sinVal > 0.3 ? "midground" : "background";

    // Size based on layer
    const sizeScale = layer === "foreground" ? 1.0 : layer === "midground" ? 0.7 : 0.5;
    const baseWidth = 120 + p1 * 80; // 120-200
    const width = Math.round(baseWidth * sizeScale);
    const height = Math.round(width * 0.48); // slightly more rectangular

    // Rotation follows the helix tangent direction
    const tangentAngle = Math.cos(t * Math.PI * 2 * frequency + phase) * 30;
    const rotation = Math.round(tangentAngle + (p3 - 0.5) * 10);

    const annotationIndices = [3, 7, 11];
    const hasAnnotation = variant === "storytelling" && annotationIndices.includes(i);
    const annotationLabels = ["0:12–0:28 | Speaker 1", "0:34–0:51 | Speaker 2", "1:02–1:18 | Speaker 1"];

    capsules.push({
      id: s,
      width,
      height,
      rotation,
      x: Math.max(0, Math.min(95, xPos + (p2 - 0.5) * 6)),
      y: yPos,
      layer,
      floatDuration: 5 + p1 * 4,
      shimmerDuration: 7 + p2 * 4,
      gradientVariant: Math.floor(p3 * GRADIENTS.length),
      hasAnnotation,
      annotationLabel: hasAnnotation
        ? annotationLabels[annotationIndices.indexOf(i)]
        : undefined,
    });
  }

  return capsules;
}

// Mini waveform SVG
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
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
            border: "1.5px solid rgba(74, 222, 128, 0.55)",
            boxShadow: `${CAPSULE_SHADOW}, 0 0 12px rgba(74, 222, 128, 0.15)`,
            opacity,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            animation: `floatDrift ${floatDuration}s ease-in-out infinite, capsuleShimmer ${shimmerDuration}s ease-in-out infinite`,
          }}
        >
          {/* Waveform inset for annotated capsules */}
          {hasAnnotation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 64,
                  height: 48,
                  borderRadius: 8,
                  border: "2px solid rgba(255,255,255,0.5)",
                  background: "rgba(0,0,0,0.1)",
                  transform: `rotate(${-rotation}deg)`,
                }}
              >
                <WaveformSVG />
              </div>
            </div>
          )}
        </div>

        {/* Annotation label */}
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
