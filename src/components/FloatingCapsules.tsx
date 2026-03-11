import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type DepthLayer = "foreground" | "midground" | "background";

interface CapsuleConfig {
  id: number;
  width: number;
  height: number;
  rotation: number;
  x: string;
  y: string;
  layer: DepthLayer;
  floatDuration: number;
  shimmerDuration: number;
  hasAnnotation?: boolean;
  annotationLabel?: string;
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number] }> = {
  foreground: { opacity: 0.92, blur: 0, parallaxRange: [0, -120] },
  midground: { opacity: 0.7, blur: 0.8, parallaxRange: [0, -60] },
  background: { opacity: 0.4, blur: 1.5, parallaxRange: [0, -20] },
};

const CAPSULE_GRADIENT =
  "linear-gradient(135deg, #A855F7 0%, #EC4899 25%, #F97316 50%, #A855F7 75%, #6366F1 100%)";

const CAPSULE_SHADOW =
  "inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -4px 12px rgba(0,0,0,0.15), 0 8px 32px rgba(168, 85, 247, 0.2)";

function generateCapsules(count: number, variant: "hero" | "storytelling" | "cta"): CapsuleConfig[] {
  const capsules: CapsuleConfig[] = [];
  const seed = variant === "hero" ? 1 : variant === "storytelling" ? 100 : 200;

  for (let i = 0; i < count; i++) {
    const s = seed + i;
    const layerIdx = i % 3;
    const layer: DepthLayer = layerIdx === 0 ? "foreground" : layerIdx === 1 ? "midground" : "background";

    const widthRanges: Record<DepthLayer, [number, number]> = {
      foreground: [160, 220],
      midground: [100, 140],
      background: [60, 90],
    };
    const [minW, maxW] = widthRanges[layer];
    const pseudo = ((Math.sin(s * 9301 + 49297) * 233280) % 1 + 1) % 1;
    const pseudo2 = ((Math.sin(s * 7919 + 12347) * 181081) % 1 + 1) % 1;
    const pseudo3 = ((Math.sin(s * 3571 + 77711) * 104729) % 1 + 1) % 1;

    const width = Math.round(minW + pseudo * (maxW - minW));
    const height = Math.round(width * (0.45 + pseudo2 * 0.1));
    const rotation = Math.round(-35 + pseudo3 * 70);

    // Diagonal distribution: bottom-left to top-right
    const diagT = i / (count - 1 || 1);
    let xBase: number, yBase: number;

    if (variant === "hero") {
      xBase = 5 + diagT * 85 + (pseudo - 0.5) * 20;
      yBase = 80 - diagT * 70 + (pseudo2 - 0.5) * 25;
    } else if (variant === "storytelling") {
      // Scatter on both sides
      xBase = i % 2 === 0 ? 2 + pseudo * 18 : 80 + pseudo * 18;
      yBase = 10 + pseudo2 * 80;
    } else {
      xBase = 10 + pseudo * 80;
      yBase = 10 + pseudo2 * 80;
    }

    const hasAnnotation = variant === "storytelling" && (i === 2 || i === 5 || i === 8 || i === 11);

    capsules.push({
      id: s,
      width,
      height,
      rotation,
      x: `${Math.max(2, Math.min(92, xBase))}%`,
      y: `${Math.max(5, Math.min(90, yBase))}%`,
      layer,
      floatDuration: 4 + pseudo * 4,
      shimmerDuration: 6 + pseudo2 * 4,
      hasAnnotation,
      annotationLabel: hasAnnotation
        ? [`0:12–0:28 | Speaker 1`, `0:34–0:51 | Speaker 2`, `1:02–1:18 | Speaker 1`, `0:45–1:01 | Speaker 2`][
            [2, 5, 8, 11].indexOf(i)
          ]
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
  const defaultCount = variant === "cta" ? 16 : variant === "hero" ? 14 : 12;
  const capsules = useMemo(() => generateCapsules(count ?? defaultCount, variant), [count, defaultCount, variant]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
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
  const { layer, width, height, rotation, x, y, floatDuration, shimmerDuration, hasAnnotation, annotationLabel } =
    config;
  const { opacity, blur, parallaxRange } = layerProps[layer];

  const translateY = useTransform(scrollProgress, [0, 1], parallaxRange);
  const rotateOffset = useTransform(scrollProgress, [0, 1], [-5, 5]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        translateY,
        zIndex: layer === "foreground" ? 3 : layer === "midground" ? 2 : 1,
      }}
    >
      <motion.div
        style={{ rotate: rotation, rotateZ: rotateOffset }}
      >
        <div
          className="relative"
          style={{
            width,
            height,
            borderRadius: 999,
            background: CAPSULE_GRADIENT,
            backgroundSize: "200% 200%",
            boxShadow: CAPSULE_SHADOW,
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
                  background: "rgba(0,0,0,0.15)",
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
            <div style={{ width: 2, height: 16, background: "rgba(255,255,255,0.4)" }} />
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "rgba(168, 85, 247, 0.8)",
                background: "rgba(255,255,255,0.9)",
                borderRadius: 4,
                padding: "2px 6px",
                marginTop: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
