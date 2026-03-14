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
  facetLine: { x1: string; y1: string; x2: string; y2: string };
  isSpike: boolean;
}

interface ClusterConfig {
  crystals: CrystalConfig[];
  originX: number;
  originY: number;
}

const layerProps: Record<DepthLayer, { opacity: number; blur: number; parallaxRange: [number, number]; useBackdrop: boolean }> = {
  foreground: { opacity: 0.7, blur: 0, parallaxRange: [0, -120], useBackdrop: true },
  midground: { opacity: 0.45, blur: 0, parallaxRange: [0, -60], useBackdrop: false },
  background: { opacity: 0.2, blur: 2, parallaxRange: [0, -20], useBackdrop: false },
};

const CRYSTAL_GRADIENT =
  "linear-gradient(135deg, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.5) 25%, rgba(249,115,22,0.45) 50%, rgba(99,102,241,0.5) 75%, rgba(168,85,247,0.6) 100%)";

function prand(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) * 233280) % 1 + 1) % 1;
}

/** Generate an irregular polygon clip-path with 5-8 points */
function generateCrystalClipPath(seed: number): string {
  const sides = 5 + Math.floor(prand(seed) * 4); // 5-8 sides
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const radiusX = 35 + prand(seed + i * 7) * 18; // 35-53% from center
    const radiusY = 35 + prand(seed + i * 13) * 18;
    const px = 50 + Math.cos(angle) * radiusX;
    const py = 50 + Math.sin(angle) * radiusY;
    points.push(`${Math.round(px)}% ${Math.round(py)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

/** Generate a spike/prism clip-path */
function generateSpikeClipPath(seed: number): string {
  const baseWidth = 12 + prand(seed) * 16; // 12-28% base
  return `polygon(50% 0%, ${50 + baseWidth / 2}% 100%, ${50 - baseWidth / 2}% 100%)`;
}

/** Generate a facet line across the crystal */
function generateFacetLine(seed: number): { x1: string; y1: string; x2: string; y2: string } {
  const p1 = prand(seed + 500);
  const p2 = prand(seed + 600);
  return {
    x1: `${15 + p1 * 30}%`,
    y1: `${10 + p2 * 20}%`,
    x2: `${55 + p1 * 30}%`,
    y2: `${70 + p2 * 20}%`,
  };
}

function generateClusters(variant: "hero" | "storytelling" | "cta"): ClusterConfig[] {
  const clusters: ClusterConfig[] = [];
  const seed = variant === "hero" ? 1 : variant === "storytelling" ? 200 : 400;

  // Cluster positions per variant
  const clusterPositions: { x: number; y: number }[] =
    variant === "hero"
      ? [
          { x: 78, y: 15 }, // upper-right
          { x: 12, y: 70 }, // lower-left
          { x: 90, y: 65 }, // right-mid
        ]
      : variant === "storytelling"
        ? [
            { x: 85, y: 12 }, // upper-right
            { x: 8, y: 80 },  // lower-left
            { x: 75, y: 55 }, // right-center
            { x: 15, y: 25 }, // left-upper
          ]
        : [
            { x: 10, y: 15 },  // upper-left
            { x: 88, y: 20 },  // upper-right
            { x: 6, y: 70 },   // lower-left
            { x: 85, y: 75 },  // lower-right
            { x: 50, y: 10 },  // top-center
          ];

  clusterPositions.forEach((pos, ci) => {
    const clusterSeed = seed + ci * 50;
    const shardCount = 3 + Math.floor(prand(clusterSeed) * 3); // 3-5 shards per cluster
    const crystals: CrystalConfig[] = [];

    for (let si = 0; si < shardCount; si++) {
      const s = clusterSeed + si * 10;
      const isAnchor = si === 0;
      const isSpike = !isAnchor && si >= shardCount - 1 && prand(s + 99) > 0.4;

      // Size: anchor is largest, then medium, then small splinters
      const baseSize = isAnchor ? 160 + prand(s) * 80 : isSpike ? 60 + prand(s) * 40 : 80 + prand(s) * 80;
      const width = Math.round(baseSize);
      const aspectRatio = isSpike ? 0.3 + prand(s + 1) * 0.2 : 0.5 + prand(s + 1) * 0.5;
      const height = Math.round(width * aspectRatio);

      // Position relative to cluster origin — radiate outward
      const spreadAngle = (si / shardCount) * Math.PI * 2 + prand(s + 2) * 0.8;
      const spreadDist = isAnchor ? 0 : 30 + prand(s + 3) * 60;
      const offsetX = Math.cos(spreadAngle) * spreadDist * 0.6;
      const offsetY = Math.sin(spreadAngle) * spreadDist * 0.4;

      const x = Math.max(2, Math.min(96, pos.x + offsetX));
      const y = Math.max(2, Math.min(96, pos.y + offsetY));

      // Depth: anchor foreground, splinters vary
      const layer: DepthLayer = isAnchor
        ? "foreground"
        : si <= 2
          ? "midground"
          : "background";

      const rotation = isSpike
        ? 20 + prand(s + 4) * 50
        : (prand(s + 4) - 0.5) * 60;

      crystals.push({
        id: s,
        width,
        height,
        rotation: Math.round(rotation),
        x,
        y,
        layer,
        floatDuration: 7 + prand(s + 5) * 5,
        shimmerDuration: 6 + prand(s + 6) * 4,
        rotateDriftDuration: 8 + prand(s + 7) * 6,
        clipPath: isSpike ? generateSpikeClipPath(s) : generateCrystalClipPath(s),
        facetLine: generateFacetLine(s),
        isSpike,
      });
    }

    clusters.push({ crystals, originX: pos.x, originY: pos.y });
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
      {clusters.map((cluster, ci) =>
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
    layer,
    width,
    height,
    rotation,
    x,
    y,
    floatDuration,
    shimmerDuration,
    rotateDriftDuration,
    clipPath,
    facetLine,
    isSpike,
  } = config;
  const { opacity, blur, parallaxRange, useBackdrop } = layerProps[layer];

  const translateY = useTransform(scrollProgress, [0, 1], parallaxRange);

  const elRef = useRef<HTMLDivElement>(null);
  const inView = useInView(elRef, { once: true, margin: "-10% 0px" });

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
        {/* Crystal body */}
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            background: CRYSTAL_GRADIENT,
            backgroundSize: "200% 200%",
            opacity,
            animation: `capsuleShimmer ${shimmerDuration}s ease-in-out infinite`,
            border: "1px solid rgba(255, 255, 255, 0.5)",
            filter: `drop-shadow(0 4px 24px rgba(168, 85, 247, 0.25)) drop-shadow(0 1px 2px rgba(255,255,255,0.4))${blur > 0 ? ` blur(${blur}px)` : ""}`,
            ...(useBackdrop
              ? { backdropFilter: "blur(4px) saturate(1.4)", WebkitBackdropFilter: "blur(4px) saturate(1.4)" }
              : {}),
            // Specular flash on enter
            ...(inView && layer === "foreground"
              ? { animation: `capsuleShimmer ${shimmerDuration}s ease-in-out infinite, crystalSpecular 0.6s ease-out` }
              : {}),
          }}
        />

        {/* Edge border overlay — clip-path doesn't support border, so we use an outline trick */}
        <div
          className="absolute inset-0"
          style={{
            clipPath,
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
            opacity: opacity * 0.8,
          }}
        />

        {/* Internal facet line */}
        {!isSpike && (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ clipPath, opacity: opacity * 0.7 }}
          >
            <line
              x1={facetLine.x1}
              y1={facetLine.y1}
              x2={facetLine.x2}
              y2={facetLine.y2}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

export default CrystalFormations;
