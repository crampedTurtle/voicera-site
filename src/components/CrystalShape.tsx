/**
 * Crystal / quartz prism SVG shapes.
 * 6 variants: tall prism, medium hex, stubby shard, thin needle, cluster pair, faceted gem.
 * Each has an outer stroke, internal facet lines, and accepts a gradient fill id.
 */

interface CrystalShapeProps {
  width: number;
  height: number;
  gradientId: string;
  variant: number; // 0-5
  /** If true, render stroke-only (ghost) with no fill */
  ghost?: boolean;
}

const CrystalShape = ({ width, height, gradientId, variant, ghost = false }: CrystalShapeProps) => {
  const fill = ghost ? "none" : `url(#${gradientId})`;
  const outerStroke = "rgba(255,255,255,0.5)";
  const facetStroke = "rgba(255,255,255,0.3)";
  const outerWidth = 1;
  const facetWidth = 0.8;

  const v = ((variant % 6) + 6) % 6;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 200"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {v === 0 && (
        /* Tall single quartz prism – pointed termination */
        <g>
          {/* Main body */}
          <polygon
            points="50,4 78,30 78,160 62,192 38,192 22,160 22,30"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          {/* Tip facet – front face */}
          <polygon
            points="50,4 78,30 50,38 22,30"
            fill={ghost ? "none" : "rgba(255,255,255,0.08)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          {/* Internal facet: center ridge line tip to base */}
          <line x1="50" y1="4" x2="50" y2="192" stroke={facetStroke} strokeWidth={facetWidth} />
          {/* Diagonal facets near tip */}
          <line x1="50" y1="38" x2="22" y2="30" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="38" x2="78" y2="30" stroke={facetStroke} strokeWidth={facetWidth} />
          {/* Bottom termination lines */}
          <line x1="50" y1="192" x2="22" y2="160" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="192" x2="78" y2="160" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}

      {v === 1 && (
        /* Medium hexagonal crystal */
        <g>
          <polygon
            points="50,8 80,28 80,150 65,190 35,190 20,150 20,28"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="50,8 80,28 50,40 20,28"
            fill={ghost ? "none" : "rgba(255,255,255,0.1)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="50" y1="8" x2="50" y2="190" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="40" x2="20" y2="28" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="40" x2="80" y2="28" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="35" y1="190" x2="50" y2="190" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}

      {v === 2 && (
        /* Short stubby shard */
        <g>
          <polygon
            points="50,12 82,45 82,140 60,188 40,188 18,140 18,45"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="50,12 82,45 50,55 18,45"
            fill={ghost ? "none" : "rgba(255,255,255,0.07)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="50" y1="12" x2="50" y2="188" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="36" y1="30" x2="50" y2="55" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="64" y1="30" x2="50" y2="55" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}

      {v === 3 && (
        /* Thin needle crystal */
        <g>
          <polygon
            points="50,2 68,22 68,165 58,196 42,196 32,165 32,22"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="50,2 68,22 50,28 32,22"
            fill={ghost ? "none" : "rgba(255,255,255,0.09)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="50" y1="2" x2="50" y2="196" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="28" x2="32" y2="22" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="28" x2="68" y2="22" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}

      {v === 4 && (
        /* Asymmetric faceted gem */
        <g>
          <polygon
            points="45,6 75,24 80,55 75,155 58,192 34,192 20,155 18,55 25,24"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="45,6 75,24 50,38 25,24"
            fill={ghost ? "none" : "rgba(255,255,255,0.08)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="45" y1="6" x2="46" y2="192" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="38" x2="25" y2="24" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="38" x2="75" y2="24" stroke={facetStroke} strokeWidth={facetWidth} />
          <line x1="50" y1="38" x2="80" y2="55" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}

      {v === 5 && (
        /* Double crystal cluster */
        <g>
          {/* Main tall crystal */}
          <polygon
            points="40,4 60,20 60,130 52,170 36,170 28,130 28,20"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="40,4 60,20 40,26 28,20"
            fill={ghost ? "none" : "rgba(255,255,255,0.08)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="40" y1="4" x2="44" y2="170" stroke={facetStroke} strokeWidth={facetWidth} />

          {/* Smaller side crystal */}
          <polygon
            points="70,50 84,62 84,145 78,185 66,185 60,145 60,62"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <polygon
            points="70,50 84,62 70,67 60,62"
            fill={ghost ? "none" : "rgba(255,255,255,0.06)"}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="70" y1="50" x2="72" y2="185" stroke={facetStroke} strokeWidth={facetWidth} />

          {/* Tiny base shard */}
          <polygon
            points="22,110 30,118 30,160 26,180 18,180 14,160 14,118"
            fill={fill}
            stroke={outerStroke}
            strokeWidth={outerWidth}
            strokeLinejoin="round"
          />
          <line x1="22" y1="110" x2="22" y2="180" stroke={facetStroke} strokeWidth={facetWidth} />
        </g>
      )}
    </svg>
  );
};

export default CrystalShape;
