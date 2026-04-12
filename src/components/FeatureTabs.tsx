import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import awsBadge from "@/assets/powered-by-aws.webp";

/* ── Brand palette (aligned with design-system tokens) ── */
const BLUE = "#3D52F4";
const BLUE_DEEP = "#2B3DE8";
const BLUE_LIGHT = "#6B7FFF";
const BLUE_SOFT = "#EEF0FE";
const INDIGO = "#7C8FF5";
const WHITE = "#FFFFFF";
const NEAR_WHITE = "#F4F5FA";
const CODE_BG = "#F0F1F8";
const DARK_TEXT = "#0F1235";
const MID_TEXT = "#4A5080";
const LIGHT_TEXT = "#8B90B8";
const BORDER = "#E2E4F0";
const GREEN = "#4CAF82";
const AMBER = "#F5A623";
const RED = "#E05252";

/* ══════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════ */

function MeshBG() {
  return (
    <svg
      className="absolute bottom-0 left-0 pointer-events-none"
      style={{ width: "45%", height: "70%", opacity: 0.15 }}
      viewBox="0 0 400 350"
      fill="none"
    >
      {([
        [20, 300, 180, 200], [20, 300, 80, 150], [20, 300, 130, 310],
        [180, 200, 80, 150], [180, 200, 300, 180], [180, 200, 220, 90],
        [80, 150, 220, 90], [80, 150, 40, 60],
        [300, 180, 380, 250], [300, 180, 350, 80], [300, 180, 220, 90],
        [220, 90, 350, 80], [220, 90, 160, 20],
        [40, 60, 160, 20], [40, 60, 0, 100],
        [130, 310, 250, 340], [130, 310, 300, 180],
        [250, 340, 380, 250],
      ] as number[][]).map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeWidth="0.8" />
      ))}
      {([
        [20, 300], [180, 200], [80, 150], [300, 180], [220, 90],
        [40, 60], [350, 80], [160, 20], [130, 310], [250, 340], [380, 250],
      ] as number[][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={BLUE} opacity="0.5" />
      ))}
    </svg>
  );
}

function TickerTape() {
  const content =
    '{ "stream_id": "call_8x92" } → Analyzing Audio (400Hz–2kHz) → Analyzing Micro-Expressions (FACS) → Fusion Layer → { "credibility_score": 0.98, "sincerity_flag": true } → { "stream_id": "call_7f14" } → Analyzing Visual Cues → Linguistic Patterns → ';
  return (
    <div style={{ background: DARK_TEXT, padding: "8px 0", overflow: "hidden", borderBottom: "1px solid #1A1D45" }}>
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "ticker 24s linear infinite",
          fontFamily: "'Courier New',monospace",
          fontSize: 10,
          letterSpacing: 0.3,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{ paddingRight: 60 }}>
            {content.split("→").map((part, j, arr) => (
              <span key={j}>
                <span style={{ color: part.includes("{") ? "#A78BFA" : BLUE_LIGHT }}>{part}</span>
                {j < arr.length - 1 && (
                  <span style={{ color: INDIGO, margin: "0 6px" }}>→</span>
                )}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function Waveform({
  color,
  amplitude,
  speed,
  label,
  width = 260,
}: {
  color: string;
  amplitude: number;
  speed: number;
  label: string;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const draw = () => {
      tickRef.current += speed;
      const t = tickRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      for (let x = 0; x < W; x++) {
        const r = x / W;
        const y =
          H / 2 + amplitude * Math.sin(r * Math.PI * 4 + t) * (0.5 + 0.5 * Math.sin(r * 9 + t * 0.4));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [color, amplitude, speed]);

  return (
    <div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: LIGHT_TEXT, letterSpacing: 2, marginBottom: 3 }}>
        {label}
      </div>
      <canvas ref={canvasRef} width={width} height={32} style={{ width: "100%", height: 32, display: "block" }} />
    </div>
  );
}

interface CodeLine {
  text: string;
  color: string;
  indent?: number;
}

function AnimatedJSON({ lines, active }: { lines: CodeLine[]; active: boolean }) {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    setVisible([]);
    if (!active) return;
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisible((p) => [...p, i]), 300 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, [active, lines]);

  return (
    <div style={{ background: CODE_BG, borderRadius: 12, padding: "14px 18px", marginTop: 12, minHeight: 72 }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 12,
            lineHeight: 1.85,
            color: line.color || MID_TEXT,
            paddingLeft: (line.indent || 0) * 16,
            opacity: visible.includes(i) ? 1 : 0,
            transform: visible.includes(i) ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ active }: { active: boolean }) {
  const [w, setW] = useState(0);

  useEffect(() => {
    setW(0);
    if (!active) return;
    const t = setTimeout(() => setW(80), 200);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ height: 6, background: BORDER, borderRadius: 3, overflow: "hidden", marginTop: 16 }}>
      <div
        style={{
          height: "100%",
          width: `${w}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg,${BLUE},${BLUE_LIGHT})`,
          transition: "width 1.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

function CredibilityGauge() {
  const [score, setScore] = useState(0.91);
  const rafRef = useRef<number>(0);
  const fRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      fRef.current++;
      const t = fRef.current / 90;
      setScore(
        Math.max(0.5, Math.min(1, 0.87 + 0.08 * Math.sin(t * 1.8) + 0.03 * Math.sin(t * 4.2)))
      );
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pct = Math.round(score * 100);
  const arc = score * Math.PI;
  const isVerified = score > 0.82;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="105" viewBox="0 0 180 105" style={{ display: "block", margin: "0 auto" }}>
        <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke={BORDER} strokeWidth="9" strokeLinecap="round" />
        <path
          d={`M 15 90 A 75 75 0 0 1 ${90 + 75 * Math.cos(Math.PI - arc)} ${90 - 75 * Math.sin(Math.PI - arc)}`}
          fill="none"
          stroke={isVerified ? BLUE : AMBER}
          strokeWidth="9"
          strokeLinecap="round"
          style={{ transition: "stroke 0.5s", filter: `drop-shadow(0 0 8px ${BLUE}66)` }}
        />
        <text x="90" y="84" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="800" fontSize="32" fill={DARK_TEXT}>
          {pct}
        </text>
        <text x="90" y="100" textAnchor="middle" fontFamily="Courier New,monospace" fontSize="7.5" fill={LIGHT_TEXT} letterSpacing="2">
          CREDIBILITY SCORE
        </text>
      </svg>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          marginTop: 6,
          background: isVerified ? `${GREEN}18` : `${AMBER}18`,
          border: `1.5px solid ${isVerified ? GREEN : AMBER}`,
          borderRadius: 20,
          padding: "5px 14px",
          transition: "all 0.5s",
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: isVerified ? GREEN : AMBER,
            boxShadow: `0 0 6px ${isVerified ? GREEN : AMBER}`,
            animation: "featurePulse 1.2s infinite",
          }}
        />
        <span style={{ fontFamily: "system-ui,sans-serif", fontWeight: 700, fontSize: 12, color: isVerified ? GREEN : AMBER }}>
          {isVerified ? "SINCERE" : "UNCERTAIN"}
        </span>
      </div>
    </div>
  );
}

function APIFlowDiagram() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setPhase(0);
      setTimeout(() => setPhase(1), 400);
      setTimeout(() => setPhase(2), 1300);
      setTimeout(() => setPhase(3), 2500);
    };
    cycle();
    const id = setInterval(cycle, 5500);
    return () => clearInterval(id);
  }, []);

  const nodes = [
    {
      label: "INPUT",
      sub: "Video or audio\nstream",
      icon: (a: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="4" width="15" height="15" rx="2.5" stroke={a ? BLUE : LIGHT_TEXT} strokeWidth="1.4" fill="none" />
          <path d="M16 9l7-3v12l-7-3V9z" stroke={a ? BLUE : LIGHT_TEXT} strokeWidth="1.4" fill="none" />
        </svg>
      ),
      active: phase >= 1,
      isCenter: false,
    },
    {
      label: "VOICERA API",
      sub: "Behavioral fusion\nengine",
      isCenter: true,
      icon: (a: boolean) => (
        <div
          style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 9,
            color: a ? WHITE : LIGHT_TEXT,
            textAlign: "center" as const,
            lineHeight: 1.3,
            fontWeight: "bold",
          }}
        >
          <div style={{ fontSize: 7, letterSpacing: 1, marginBottom: 1, color: a ? `${WHITE}CC` : LIGHT_TEXT }}>VOICERA</div>
          <div style={{ fontSize: 18 }}>V</div>
        </div>
      ),
      active: phase >= 2,
    },
    {
      label: "OUTPUT",
      sub: "Structured JSON\ncredibility score",
      icon: (a: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="1" width="22" height="22" rx="3.5" stroke={a ? GREEN : LIGHT_TEXT} strokeWidth="1.4" fill="none" />
          <path d="M5 7h5M5 12h9M5 17h6" stroke={a ? GREEN : LIGHT_TEXT} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="19" cy="17" r="3.5" fill={a ? GREEN : BORDER} style={{ transition: "fill 0.5s" }} />
        </svg>
      ),
      active: phase >= 3,
      isCenter: false,
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
      {nodes.map((node, i) => (
        <div key={i} style={{ display: "contents" }}>
          <div style={{ flex: node.isCenter ? 1.3 : 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: node.isCenter ? 68 : 58,
                height: node.isCenter ? 68 : 58,
                borderRadius: node.isCenter ? "50%" : 12,
                background: node.isCenter
                  ? node.active
                    ? `linear-gradient(135deg,${BLUE},${BLUE_DEEP})`
                    : NEAR_WHITE
                  : node.active
                  ? BLUE_SOFT
                  : NEAR_WHITE,
                border: `2px solid ${node.active ? (node.isCenter ? BLUE : BLUE_LIGHT) : BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.5s",
                boxShadow: node.active ? `0 4px 18px ${BLUE}33` : "none",
                animation: node.isCenter && node.active ? "featureSpinSlow 8s linear infinite" : "none",
                position: "relative" as const,
              }}
            >
              {node.icon(node.active)}
              {node.isCenter && node.active && (
                <div
                  style={{
                    position: "absolute",
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: GREEN,
                    top: 2,
                    right: 2,
                    boxShadow: `0 0 8px ${GREEN}`,
                    animation: "featurePulse 1.2s infinite",
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontFamily: "'Courier New',monospace",
                fontSize: 7.5,
                color: node.active ? BLUE : LIGHT_TEXT,
                letterSpacing: 1.5,
                transition: "color 0.5s",
                textAlign: "center" as const,
              }}
            >
              {node.label}
            </div>
            <div
              style={{
                fontFamily: "system-ui,sans-serif",
                fontSize: 10,
                color: MID_TEXT,
                textAlign: "center" as const,
                lineHeight: 1.5,
                whiteSpace: "pre-line" as const,
              }}
            >
              {node.sub}
            </div>
          </div>
          {i < nodes.length - 1 && (
            <div style={{ flex: 0.5, height: 2, position: "relative" as const, margin: "0 2px", marginBottom: 36 }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: phase >= i + 2 ? `linear-gradient(90deg,${BLUE},${BLUE_LIGHT})` : BORDER,
                  transition: "background 0.6s",
                }}
              />
              {phase >= i + 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: BLUE_LIGHT,
                    animation: "featureSlideRight 1.2s linear infinite",
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Tab definitions
   ══════════════════════════════════════════════ */

const TABS = [
  {
    id: "credibility",
    label: "SINCERITY™ API",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    headline: "One API call. One additional field. Complete credibility intelligence.",
    body: "Voicera sits inside your existing video pipeline as a structured output layer — no rearchitecting, no separate workflow. Pass the stream, receive the signal.",
    bullets: ["Real-time credibility scoring", "Multimodal signal fusion", "Dissonance index output", "Millisecond response time"],
    visual: "flow" as const,
    code: [
      { text: "POST /api/v1/analyze HTTP/1.1", color: DARK_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "Host: api.example.com", color: BLUE },
      { text: "X-API-Key: sk_live_••••••••••••••••", color: BLUE },
      { text: "Content-Type: multipart/form-data; boundary=----7MA4YWxkTrZu0gW", color: BLUE },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW", color: LIGHT_TEXT },
      { text: 'Content-Disposition: form-data; name="media_type"', color: BLUE, indent: 0 },
      { text: "", color: DARK_TEXT },
      { text: "composite", color: DARK_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW", color: LIGHT_TEXT },
      { text: 'Content-Disposition: form-data; name="file"; filename="customer-call.mp4"', color: BLUE },
      { text: "Content-Type: video/mp4", color: BLUE },
      { text: "", color: DARK_TEXT },
      { text: "(binary body omitted)", color: LIGHT_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW--", color: LIGHT_TEXT },
    ],
    output: [
      { text: "// Response", color: LIGHT_TEXT },
      { text: "{", color: DARK_TEXT },
      { text: '  "job_id": "29f7a912-7c8e-40b5-8cd4-41d96d41898a",', color: BLUE, indent: 1 },
      { text: '  "status": "completed",', color: BLUE, indent: 1 },
      { text: '  "media_type": "composite",', color: BLUE, indent: 1 },
      { text: '  "result": {', color: DARK_TEXT, indent: 1 },
      { text: '    "job_id": "29f7a912-7c8e-40b5-8cd4-41d96d41898a",', color: BLUE, indent: 2 },
      { text: '    "media_type": "composite",', color: BLUE, indent: 2 },
      { text: '    "overall_sincerity": 0.6831,', color: BLUE, indent: 2 },
      { text: '    "prediction": "sincere",', color: BLUE, indent: 2 },
      { text: '    "confidence": 0.7204,', color: BLUE, indent: 2 },
      { text: '    "review_recommended": false,', color: BLUE, indent: 2 },
      { text: '    "truthfulness_bands": {', color: DARK_TEXT, indent: 2 },
      { text: '      "likely_sincere_pct": 68.4,', color: MID_TEXT, indent: 3 },
      { text: '      "neutral_pct": 14.2,', color: MID_TEXT, indent: 3 },
      { text: '      "likely_insincere_pct": 17.4', color: MID_TEXT, indent: 3 },
      { text: "    },", color: DARK_TEXT, indent: 2 },
    ],
  },
  {
    id: "analyze",
    label: "AUDIO ANALYSIS",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 11l3.5-3.5 2.5 2.5 5-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    headline: "The gap between what someone says and what they mean. That's where we live.",
    body: "Go beyond the score. The Analyze API returns a full breakdown of micro-expression patterns, vocal frequency shifts, and linguistic dissonance — the raw behavioral signal.",
    bullets: ["Micro-expression detection", "Vocal frequency analysis", "Linguistic pattern scoring", "Per-channel confidence values"],
    visual: "waveform" as const,
    code: [
      { text: "POST /api/v1/analyze HTTP/1.1", color: DARK_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "Host: api.example.com", color: BLUE },
      { text: "X-API-Key: sk_live_••••••••••••••••", color: BLUE },
      { text: "Content-Type: multipart/form-data; boundary=----7MA4YWxkTrZu0gW", color: BLUE },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW", color: LIGHT_TEXT },
      { text: 'Content-Disposition: form-data; name="media_type"', color: BLUE },
      { text: "", color: DARK_TEXT },
      { text: "audio", color: DARK_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW", color: LIGHT_TEXT },
      { text: 'Content-Disposition: form-data; name="file"; filename="sales-call.wav"', color: BLUE },
      { text: "Content-Type: audio/wav", color: BLUE },
      { text: "", color: DARK_TEXT },
      { text: "(binary body omitted)", color: LIGHT_TEXT },
      { text: "", color: DARK_TEXT },
      { text: "------7MA4YWxkTrZu0gW--", color: LIGHT_TEXT },
    ],
    output: [
      { text: "// Response", color: LIGHT_TEXT },
      { text: "{ voice_score: 0.88,", color: DARK_TEXT },
      { text: "  vision_score: 0.93,", color: BLUE, indent: 1 },
      { text: "  language_score: 0.91 }", color: MID_TEXT, indent: 1 },
    ],
  },
  {
    id: "stream",
    label: "VIDEO ANALYSIS",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" fill="currentColor" />
        <path d="M4 4a4.95 4.95 0 0 0 0 7M11 4a4.95 4.95 0 0 1 0 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    headline: "Live credibility scoring. Frame by frame. Signal by signal.",
    body: "The Stream API delivers a continuous credibility signal as the conversation unfolds — sub-200ms latency, built for enterprise applications where every second counts.",
    bullets: ["WebSocket streaming", "Sub-200ms latency", "Continuous score updates", "Anomaly event triggers"],
    visual: "gauge" as const,
    code: [
      { text: "const stream = voicera.stream({", color: DARK_TEXT },
      { text: '  websocket_url: "wss://...",', color: BLUE, indent: 1 },
      { text: "  callback: onScoreUpdate,", color: DARK_TEXT, indent: 1 },
      { text: "  interval_ms: 150,", color: BLUE, indent: 1 },
      { text: "});", color: DARK_TEXT },
    ],
    output: [
      { text: "// Stream event", color: LIGHT_TEXT },
      { text: "{ ts: 1042, score: 0.87,", color: DARK_TEXT },
      { text: "  delta: -0.04,", color: RED, indent: 1 },
      { text: "  anomaly: false }", color: MID_TEXT, indent: 1 },
    ],
  },
];

/* ══════════════════════════════════════════════
   Main Section
   ══════════════════════════════════════════════ */

const FeatureTabs = () => {
  const [active, setActive] = useState(0);
  const [outputActive, setOutputActive] = useState(false);

  useEffect(() => {
    setOutputActive(false);
    const t = setTimeout(() => setOutputActive(true), 1000);
    return () => clearTimeout(t);
  }, [active]);

  const tab = TABS[active];

  return (
    <section
      id="product"
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 60% 0%, #DDE0F8 0%, #ECEEF8 40%, #F4F5FA 100%)`,
        fontFamily: "system-ui,-apple-system,sans-serif",
      }}
    >
      <MeshBG />
      <TickerTape />

      <div className="relative z-10 max-w-[1040px] mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-11"
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(30px, 5vw, 56px)",
              color: DARK_TEXT,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
            }}
          >
            Seeing isn't believing.
          </h2>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(30px, 5vw, 56px)",
              color: DARK_TEXT,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
            }}
          >
            We tell you <span style={{ color: BLUE }}>which is which.</span>
          </h2>
        </motion.div>

        {/* Pill tab switcher */}
        <div className="flex justify-center mb-8 md:mb-14 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div
            className="inline-flex rounded-full p-[5px] gap-[2px]"
            style={{ background: NEAR_WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 2px 14px ${BLUE}12` }}
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className="flex items-center gap-1 md:gap-[7px] rounded-full border-none cursor-pointer transition-all duration-200 whitespace-nowrap"
                style={{
                  padding: "8px 12px",
                  background: active === i ? `linear-gradient(135deg,${BLUE},${BLUE_DEEP})` : "transparent",
                  color: active === i ? WHITE : LIGHT_TEXT,
                  fontFamily: "'Courier New',monospace",
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: 0.8,
                  boxShadow: active === i ? `0 4px 16px ${BLUE}44` : "none",
                }}
              >
                <span className="hidden md:inline" style={{ opacity: active === i ? 1 : 0.6 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col md:flex-row gap-8 md:gap-11 items-start"
          >
            {/* LEFT */}
            <div className="w-full md:flex-1 md:min-w-[260px]" style={{ flexBasis: 320 }}>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: 26,
                  color: DARK_TEXT,
                  margin: "0 0 12px",
                  lineHeight: 1.25,
                  letterSpacing: "-0.5px",
                }}
              >
                {tab.headline}
              </h3>
              <p style={{ fontSize: 14, color: MID_TEXT, lineHeight: 1.7, margin: "0 0 26px", maxWidth: 400 }}>
                {tab.body}
              </p>
              <div className="grid grid-cols-2 gap-x-7 gap-y-[10px]">
                {tab.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: MID_TEXT }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Waveform preview */}
              {tab.visual === "waveform" && (
                <div
                  className="mt-7 rounded-[14px] p-4"
                  style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 2px 12px ${BLUE}0D` }}
                >
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: LIGHT_TEXT, letterSpacing: 2, marginBottom: 10 }}>
                    LIVE SIGNAL FEED
                  </div>
                  <div className="flex flex-col gap-2">
                    <Waveform color={BLUE} amplitude={11} speed={0.07} label="VOICE — tonal frequency" />
                    <Waveform color={INDIGO} amplitude={8} speed={0.04} label="VISION — micro-expressions" />
                    <Waveform color={AMBER} amplitude={6} speed={0.09} label="LANGUAGE — paralinguistic" />
                  </div>
                </div>
              )}

              {/* Gauge preview */}
              {tab.visual === "gauge" && (
                <div
                  className="mt-7 rounded-[14px] p-5"
                  style={{ background: WHITE, border: `1px solid ${BORDER}`, boxShadow: `0 2px 12px ${BLUE}0D` }}
                >
                  <div
                    style={{
                      fontFamily: "'Courier New',monospace",
                      fontSize: 8,
                      color: LIGHT_TEXT,
                      letterSpacing: 2,
                      marginBottom: 12,
                      textAlign: "center" as const,
                    }}
                  >
                    LIVE STREAM SCORE
                  </div>
                  <CredibilityGauge />
                  <div className="flex justify-center mt-3">
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: LIGHT_TEXT, letterSpacing: 1.5 }}>
                      UPDATING EVERY 150ms
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — API card */}
            <div className="w-full md:flex-1 md:min-w-[320px]" style={{ flexBasis: 400 }}>
              <div
                className="rounded-[20px] relative"
                style={{
                  background: WHITE,
                  padding: "28px 28px 22px",
                  boxShadow: `0 8px 48px ${BLUE}18, 0 2px 12px rgba(0,0,0,0.06)`,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {/* Powered by AWS badge */}
                <div className="absolute top-3 right-3 z-10">
                  <img src={awsBadge} alt="Powered by AWS" className="h-[45px] w-auto" />
                </div>
                {/* Card header */}
                <div className="flex items-center gap-[10px] mb-[18px]">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: BLUE_SOFT,
                      color: BLUE,
                    }}
                  >
                    {tab.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Courier New',monospace",
                      fontSize: 10.5,
                      color: LIGHT_TEXT,
                      letterSpacing: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {tab.label}
                  </span>
                </div>

                {/* Flow diagram */}
                {tab.visual === "flow" && <APIFlowDiagram />}

                {/* Request code */}
                <div style={{ background: CODE_BG, borderRadius: 12, padding: "14px 18px" }}>
                  {tab.code.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: "'Courier New',monospace",
                        fontSize: 12,
                        lineHeight: 1.85,
                        color: line.color,
                        paddingLeft: (line.indent || 0) * 14,
                      }}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>

                {/* Animated output */}
                <AnimatedJSON lines={tab.output} active={outputActive} />

                {/* Progress */}
                <ProgressBar active={outputActive} />

                {/* Status */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-[6px]">
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: outputActive ? GREEN : BLUE_LIGHT,
                        boxShadow: outputActive ? `0 0 8px ${GREEN}` : "none",
                        transition: "all 0.5s",
                        animation: outputActive ? "none" : "featurePulse 1.2s infinite",
                      }}
                    />
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9.5, color: LIGHT_TEXT, letterSpacing: 1 }}>
                      {outputActive ? "RESPONSE RECEIVED" : "PROCESSING..."}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9.5, color: BLUE_LIGHT }}>&lt;200ms</span>
                </div>
              </div>

              {/* Chips */}
              <div className="flex gap-[10px] mt-[14px] justify-end flex-wrap">
                {["3 modalities fused", "JSON / REST / WebSocket"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: WHITE,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 20,
                      padding: "5px 14px",
                      fontSize: 11,
                      color: MID_TEXT,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scoped keyframes */}
      <style>{`
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-33.33%)}}
        @keyframes featureSpinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes featurePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}
        @keyframes featureSlideRight{0%{left:0;opacity:0}20%{opacity:1}80%{opacity:1}100%{left:calc(100% - 8px);opacity:0}}
      `}</style>
    </section>
  );
};

export default FeatureTabs;
