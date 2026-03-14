import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

type DepthLayer = "foreground" | "midground" | "background";

interface CrystalConfig {
  id: number;
  width: number;
  height: number;
  rotation: number;
  x: number;
  y: number;
  layer: DepthLayer;
  floatDuration: number;
  shimmerDuration: number;
  rotateDriftDuration: number;
  clipPath: string;
  facetLines: { x1: string; y1: string; x2: string; y2: string }[];
  isSpike: boolean;
  isIndependent: boolean;
  colorVariant: number; // 0=lavender, 1=peach, 2=white-frosted
}

interface ClusterConfig {
  crystals: CrystalConfig[];
  originX: number;
  originY: number;
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number]; useBackdrop: boolean }> = {
  foreground: { opacity: 0.85, blur: 0, parallaxRange: [0, -120], useBackdrop: true },
  midground: { opacity: 0.55, blur: 0, parallaxRange: [0, -60], useBackdrop: false },
  background: { opacity: 0.3, blur: 1.5, parallaxRange: [0, -20], useBackdrop: false },
};

// Soft, frosted gradients matching the reference — mostly white with subtle color hints
const CRYSTAL_GRADIENTS = [
  // Lavender/purple frosted
  "linear-gradient(135deg, rgba(200,180,240,0.5) 0%, rgba(255,255,255,0.7) 30%, rgba(180,160,220,0.35) 55%, rgba(255,255,255,0.65) 80%, rgba(190,170,235,0.4) 100%)",
  // Warm peach/coral frosted
  "linear-gradient(135deg, rgba(255,200,170,0.45) 0%, rgba(255,255,255,0.7) 25%, rgba(245,160,130,0.35) 50%, rgba(255,255,255,0.65) 75%, rgba(240,180,150,0.4) 100%)",
  // Pure white frosted glass
  "linear-gradient(135deg, rgba(220,210,245,0.3) 0%, rgba(255,255,255,0.8) 30%, rgba(240,235,250,0.4) 55%, rgba(255,255,255,0.75) 80%, rgba(210,200,240,0.25) 100%)",
  // Lavender-to-peach blend
  "linear-gradient(135deg, rgba(190,170,235,0.4) 0%, rgba(255,255,255,0.7) 25%, rgba(255,190,160,0.3) 50%, rgba(255,255,255,0.7) 75%, rgba(200,180,240,0.35) 100%)",
];

function prand(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) * 233280) % 1 + 1) % 1;
}

function generateQuartzClipPath(seed: number): string {
  const style = Math.floor(prand(seed) * 4);

  if (style === 0) {
    const w1 = 15 + prand(seed + 1) * 10;
    const w2 = 20 + prand(seed + 2) * 15;
    return `polygon(${50 - w1}% 0%, ${50 + w1}% 0%, ${50 + w2}% 35%, ${50 + w1}% 100%, ${50 - w1}% 100%, ${50 - w2}% 35%)`;
  }
  if (style === 1) {
    const baseW = 18 + prand(seed + 3) * 14;
    const midW = 15 + prand(seed + 4) * 12;
    return `polygon(50% 0%, ${50 + midW}% 25%, ${50 + baseW}% 60%, ${50 + baseW - 3}% 100%, ${50 - baseW + 3}% 100%, ${50 - baseW}% 60%, ${50 - midW}% 25%)`;
  }
  if (style === 2) {
    const tl = 8 + prand(seed + 5) * 12;
    const tr = 65 + prand(seed + 6) * 25;
    const br = 70 + prand(seed + 7) * 20;
    const bl = 5 + prand(seed + 8) * 15;
    return `polygon(${tl}% 5%, ${tr}% 0%, 95% ${30 + prand(seed + 9) * 20}%, ${br}% 95%, ${bl}% 100%, 2% ${50 + prand(seed + 10) * 20}%)`;
  }
  const sides = 6 + Math.floor(prand(seed + 11) * 3);
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const radiusX = 30 + prand(seed + i * 7 + 20) * 22;
    const radiusY = 28 + prand(seed + i * 13 + 20) * 24;
    const px = 50 + Math.cos(angle) * radiusX;
    const py = 50 + Math.sin(angle) * radiusY;
    points.push(`${Math.round(px)}% ${Math.round(py)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

function generateSpikeClipPath(seed: number): string {
  const baseWidth = 10 + prand(seed) * 14;
  const midWidth = baseWidth * (0.6 + prand(seed + 1) * 0.3);
  return `polygon(50% 0%, ${50 + midWidth * 0.7}% 40%, ${50 + baseWidth / 2}% 100%, ${50 - baseWidth / 2}% 100%, ${50 - midWidth * 0.5}% 45%)`;
}

function generateFacetLines(seed: number, isSpike: boolean): { x1: string; y1: string; x2: string; y2: string }[] {
  if (isSpike) return [];
  const count = 1 + Math.floor(prand(seed + 500) * 2);
  const lines: { x1: string; y1: string; x2: string; y2: string }[] = [];
  for (let i = 0; i < count; i++) {
    const p1 = prand(seed + 500 + i * 100);
    const p2 = prand(seed + 600 + i * 100);
    lines.push({
      x1: `${10 + p1 * 35}%`,
      y1: `${5 + p2 * 25}%`,
      x2: `${50 + p1 * 35}%`,
      y2: `${65 + p2 * 25}%`,
    });
  }
  return lines;
}

function generateClusters(variant: "hero" | "storytelling" | "cta"): ClusterConfig[] {
  const clusters: ClusterConfig[] = [];
  const seed = variant === "hero" ? 1 : variant === "storytelling" ? 200 : 400;

  const clusterPositions: { x: number; y: number }[] =
    variant === "hero"
      ? [
          { x: 80, y: 12 },
          { x: 10, y: 72 },
          { x: 92, y: 60 },
        ]
      : variant === "storytelling"
        ? [
            { x: 87, y: 10 },
            { x: 6, y: 78 },
            { x: 78, y: 52 },
            { x: 12, y: 22 },
          ]
        : [
            { x: 8, y: 12 },
            { x: 90, y: 18 },
            { x: 5, y: 72 },
            { x: 87, y: 78 },
            { x: 50, y: 8 },
          ];

  const independentPositions: { x: number; y: number }[] =
    variant === "hero"
      ? [
          { x: 45, y: 8 },
          { x: 65, y: 85 },
          { x: 20, y: 35 },
        ]
      : variant === "storytelling"
        ? [
            { x: 50, y: 45 },
            { x: 92, y: 35 },
            { x: 18, y: 55 },
            { x: 70, y: 85 },
          ]
        : [
            { x: 30, y: 35 },
            { x: 70, y: 45 },
            { x: 15, y: 50 },
            { x: 82, y: 52 },
          ];

  clusterPositions.forEach((pos, ci) => {
    const clusterSeed = seed + ci * 50;
    const shardCount = 3 + Math.floor(prand(clusterSeed) * 3);
    const crystals: CrystalConfig[] = [];

    for (let si = 0; si < shardCount; si++) {
      const s = clusterSeed + si * 10;
      const isAnchor = si === 0;
      const isSpike = !isAnchor && si >= shardCount - 1 && prand(s + 99) > 0.35;

      const baseSize = isAnchor ? 140 + prand(s) * 90 : isSpike ? 50 + prand(s) * 45 : 70 + prand(s) * 80;
      const width = Math.round(baseSize);
      const aspectRatio = isSpike ? 0.25 + prand(s + 1) * 0.2 : 0.45 + prand(s + 1) * 0.55;
      const height = Math.round(width * aspectRatio);

      const spreadAngle = (si / shardCount) * Math.PI * 2 + prand(s + 2) * 0.8;
      const spreadDist = isAnchor ? 0 : 25 + prand(s + 3) * 55;
      const offsetX = Math.cos(spreadAngle) * spreadDist * 0.6;
      const offsetY = Math.sin(spreadAngle) * spreadDist * 0.4;

      const x = Math.max(2, Math.min(96, pos.x + offsetX));
      const y = Math.max(2, Math.min(96, pos.y + offsetY));

      const layer: DepthLayer = isAnchor ? "foreground" : si <= 2 ? "midground" : "background";

      const rotation = isSpike
        ? 15 + prand(s + 4) * 55
        : (prand(s + 4) - 0.5) * 50;

      crystals.push({
        id: s,
        width, height,
        rotation: Math.round(rotation),
        x, y, layer,
        floatDuration: 7 + prand(s + 5) * 5,
        shimmerDuration: 6 + prand(s + 6) * 4,
        rotateDriftDuration: 8 + prand(s + 7) * 6,
        clipPath: isSpike ? generateSpikeClipPath(s) : generateQuartzClipPath(s),
        facetLines: generateFacetLines(s, isSpike),
        isSpike,
        isIndependent: false,
        colorVariant: Math.floor(prand(s + 8) * CRYSTAL_GRADIENTS.length),
      });
    }

    clusters.push({ crystals, originX: pos.x, originY: pos.y });
  });

  independentPositions.forEach((pos, ii) => {
    const s = seed + 900 + ii * 30;
    const isSpike = prand(s + 50) > 0.6;
    const baseSize = 50 + prand(s) * 100;
    const width = Math.round(baseSize);
    const aspectRatio = isSpike ? 0.25 + prand(s + 1) * 0.15 : 0.5 + prand(s + 1) * 0.5;
    const height = Math.round(width * aspectRatio);
    const layer: DepthLayer = prand(s + 2) > 0.5 ? "midground" : "background";

    clusters.push({
      crystals: [{
        id: s,
        width, height,
        rotation: Math.round((prand(s + 3) - 0.5) * 70),
        x: pos.x,
        y: pos.y,
        layer,
        floatDuration: 8 + prand(s + 4) * 5,
        shimmerDuration: 7 + prand(s + 5) * 4,
        rotateDriftDuration: 10 + prand(s + 6) * 6,
        clipPath: isSpike ? generateSpikeClipPath(s) : generateQuartzClipPath(s),
        facetLines: generateFacetLines(s, isSpike),
        isSpike,
        isIndependent: true,
        colorVariant: Math.floor(prand(s + 7) * CRYSTAL_GRADIENTS.length),
      }],
      originX: pos.x,
      originY: pos.y,
    });
  });

  return clusters;
}

interface CrystalFormationsProps {
  variant: "hero" | "storytelling" | "cta";
  count?: number;
  className?: string;
}

const CrystalFormations = ({ variant, className = "" }: CrystalFormationsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clusters = useMemo(() => generateClusters(variant), [variant]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {clusters.map((cluster) =>
        cluster.crystals.map((crystal) => (
          <CrystalElement
            key={crystal.id}
            config={crystal}
            scrollProgress={scrollYProgress}
          />
        ))
      )}
    </div>
  );
};

const CrystalElement = ({
  config,
  scrollProgress,
}: {
  config: CrystalConfig;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const {
    layer, width, height, rotation, x, y,
    floatDuration, shimmerDuration, rotateDriftDuration,
    clipPath, facetLines, isSpike, colorVariant,
  } = config;
  const { opacity, blur, parallaxRange, useBackdrop } = layerProps[layer];

  const translateY = useTransform(scrollProgress, [0, 1], parallaxRange);

  const elRef = useRef<HTMLDivElement>(null);
  const inView = useInView(elRef, { once: true, margin: "-10% 0px" });

  const gradient = CRYSTAL_GRADIENTS[colorVariant % CRYSTAL_GRADIENTS.length];

  // Subtle lavender outline — thin and soft like in the reference
  const borderColor = layer === "foreground"
    ? "rgba(170, 145, 215, 0.7)"
    : layer === "midground"
      ? "rgba(175, 150, 220, 0.55)"
      : "rgba(180, 160, 220, 0.4)";

  return (
    <motion.div
      ref={elRef}
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        translateY,
        zIndex: layer === "foreground" ? 3 : layer === "midground" ? 2 : 1,
      }}
    >
      <div
        className="relative"
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          animation: `crystalFloat ${floatDuration}s ease-in-out infinite, crystalRotateDrift ${rotateDriftDuration}s ease-in-out infinite`,
        }}
      >
        {/* Crystal body — frosted glass fill */}
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            background: gradient,
            backgroundSize: "200% 200%",
            opacity,
            animation: inView && layer === "foreground"
              ? `capsuleShimmer ${shimmerDuration}s ease-in-out infinite, crystalSpecular 0.6s ease-out`
              : `capsuleShimmer ${shimmerDuration}s ease-in-out infinite`,
            filter: `drop-shadow(0 4px 16px rgba(180, 160, 220, 0.2)) drop-shadow(0 1px 3px rgba(255,255,255,0.3))${blur > 0 ? ` blur(${blur}px)` : ""}`,
            ...(useBackdrop
              ? { backdropFilter: "blur(6px) saturate(1.2)", WebkitBackdropFilter: "blur(6px) saturate(1.2)" }
              : {}),
          }}
        />

        {/* Soft lavender outline — the key detail from reference */}
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            boxShadow: `inset 0 0 0 1.5px ${borderColor}`,
            opacity: opacity * 1.1,
          }}
        />

        {/* Subtle inner white edge for glass depth */}
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            boxShadow: "inset 0 0 0 0.5px rgba(255, 255, 255, 0.35)",
            opacity: opacity * 0.5,
          }}
        />

        {/* Internal facet lines — very subtle */}
        {facetLines.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ clipPath, opacity: opacity * 0.4 }}
          >
            {facetLines.map((fl, i) => (
              <line
                key={i}
                x1={fl.x1} y1={fl.y1}
                x2={fl.x2} y2={fl.y2}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        )}
      </div>
    </motion.div>
  );
};

export default CrystalFormations;
