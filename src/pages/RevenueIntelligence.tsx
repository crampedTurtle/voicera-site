import { useState, useEffect, useRef, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import YouTubeCase from "@/components/YouTubeCase";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/routes";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ─── ANIMATED WIREFRAME MESH ────────────────────────────────────────────────
const WireframeMesh = ({ darkMode = true, density = 28 }: { darkMode?: boolean; density?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w: number, h: number, cols: number, rows: number, spacing: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = density; rows = Math.ceil((h / w) * density) + 4;
      spacing = w / (cols - 1);
    };
    resize();
    window.addEventListener("resize", resize);
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      const mx = (mouse.current.x - 0.5) * 25;
      const my = (mouse.current.y - 0.5) * 18;
      const points: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c < cols; c++) {
          const bx = c * spacing, by = r * spacing - spacing * 2;
          const wave = Math.sin(c * 0.2 + t * 0.6) * Math.cos(r * 0.15 + t * 0.4) * 20;
          const wave2 = Math.sin((c + r) * 0.12 + t * 0.25) * 10;
          row.push({ x: bx + mx * (r / rows) * 0.12, y: by + wave + wave2 + my * (c / cols) * 0.08 });
        }
        points.push(row);
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          const dist = Math.sqrt(Math.pow((p.x / w - 0.5) * 2, 2) + Math.pow((p.y / h - 0.5) * 2, 2));
          const alpha = Math.max(0, (darkMode ? 0.18 : 0.1) - dist * 0.08);
          const c1 = darkMode ? `rgba(37,99,235,${alpha})` : `rgba(37,99,235,${alpha * 0.6})`;
          const c2 = darkMode ? `rgba(124,58,237,${alpha})` : `rgba(124,58,237,${alpha * 0.6})`;
          if (c < cols - 1) {
            const n = points[r][c + 1];
            const g = ctx.createLinearGradient(p.x, p.y, n.x, n.y);
            g.addColorStop(0, c1); g.addColorStop(1, c2);
            ctx.strokeStyle = g; ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
          if (r < rows - 1) {
            const b = points[r + 1][c];
            const g = ctx.createLinearGradient(p.x, p.y, b.x, b.y);
            g.addColorStop(0, c1); g.addColorStop(1, c2);
            ctx.strokeStyle = g; ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
          if (alpha > 0.05) {
            ctx.fillStyle = darkMode ? `rgba(147,197,253,${alpha * 2})` : `rgba(37,99,235,${alpha * 1.5})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouse); };
  }, [darkMode, density]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

// ─── PARTICLES ──────────────────────────────────────────────────────────────
const Particles = ({ count = 45, color = "rgba(147,197,253,0.3)" }: { count?: number; color?: string }) => {
  const p = useRef(Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 1.5 + Math.random() * 2, dur: 25 + Math.random() * 35,
    delay: Math.random() * -30, opacity: 0.12 + Math.random() * 0.3,
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {p.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size, borderRadius: "50%", background: color,
          opacity: d.opacity, animation: `riFp ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const useReveal = (t = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return [ref, v] as const;
};

const Reveal = ({ children, delay = 0, dir = "up", style: s }: { children: ReactNode; delay?: number; dir?: "up" | "down" | "left" | "right"; style?: React.CSSProperties }) => {
  const [ref, v] = useReveal();
  const t = { up: "translateY(44px)", down: "translateY(-44px)", left: "translateX(44px)", right: "translateX(-44px)" };
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0, transform: v ? "translate(0)" : t[dir],
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...s,
    }}>{children}</div>
  );
};

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
const Counter = ({ value, suffix = "%", duration = 1800 }: { value: string; suffix?: string; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  const [ref, visible] = useReveal(0.3);
  const num = parseInt(value);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(ease * num));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, num, duration]);
  return <span ref={ref}>{display}{suffix}</span>;
};

// ─── BADGE ──────────────────────────────────────────────────────────────────
const Badge = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <span style={{
    display: "inline-block", padding: "6px 18px", borderRadius: 100,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const,
    fontFamily: "Poppins,sans-serif",
    background: dark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.08)",
    color: dark ? "rgba(255,255,255,0.9)" : "#2563EB",
    border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(37,99,235,0.12)",
    backdropFilter: dark ? "blur(12px)" : "none",
  }}>{children}</span>
);

// ─── CTA BUTTON ─────────────────────────────────────────────────────────────
const CTA = ({ children, href = "#", variant = "blue", size = "md" }: { children: ReactNode; href?: string; variant?: "blue" | "white" | "outline"; size?: "md" | "lg" }) => {
  const [h, setH] = useState(false);
  const bg = {
    blue: h ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#2563EB,#3b82f6)",
    white: h ? "#f1f5f9" : "#fff",
    outline: "transparent",
  };
  const clr = { blue: "#fff", white: "#0f172a", outline: "#2563EB" };
  const sh = {
    blue: h ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)",
    white: h ? "0 8px 24px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)",
    outline: "none",
  };
  const pad = size === "lg" ? "16px 36px" : "13px 28px";
  const isExternal = href.startsWith("http");
  return (
    <a href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: pad, borderRadius: 12, fontSize: size === "lg" ? 16 : 14, fontWeight: 700,
        fontFamily: "Poppins,sans-serif", textDecoration: "none",
        background: bg[variant], color: clr[variant], boxShadow: sh[variant],
        border: variant === "outline" ? "2px solid #2563EB" : "none",
        transform: h ? "translateY(-2px)" : "none",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer",
      }}
    >
      {children}
      <span style={{ fontSize: 16, transform: h ? "translateX(3px)" : "none", transition: "transform 0.3s" }}>→</span>
    </a>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ value, suffix = "%", label, icon }: { value: string; suffix?: string; label: string; icon: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, padding: "28px 24px",
        border: "1px solid #e2e8f0", textAlign: "center",
        boxShadow: h ? "0 16px 48px rgba(37,99,235,0.12)" : "0 4px 16px rgba(0,0,0,0.04)",
        transform: h ? "translateY(-4px)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", cursor: "default",
      }}
    >
      <div style={{ fontSize: 14, marginBottom: 12 }}>{icon}</div>
      <div style={{
        fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em",
        background: "linear-gradient(135deg,#2563EB,#3b82f6)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        <Counter value={value} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginTop: 8 }}>{label}</div>
    </div>
  );
};

// ─── CAPABILITY CARD ────────────────────────────────────────────────────────
const CapabilityCard = ({ num, emoji, title, subtitle, desc, signals }: {
  num: string; emoji: string; title: string; subtitle: string; desc: string;
  signals: { label: string; text: string }[];
}) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "#fff", borderRadius: 16, padding: "36px 32px",
        border: "1px solid #e2e8f0", position: "relative", overflow: "hidden",
        boxShadow: h ? "0 20px 48px rgba(37,99,235,0.1)" : "0 2px 12px rgba(0,0,0,0.03)",
        transform: h ? "translateY(-4px)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -10, fontSize: 100, fontWeight: 900,
        color: "rgba(37,99,235,0.04)", lineHeight: 1, fontFamily: "Poppins,sans-serif",
      }}>{num}</div>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.05))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, marginBottom: 16,
      }}>{emoji}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#2563EB", marginBottom: 14 }}>{subtitle}</p>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {signals.map((s) => (
          <div key={s.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "#2563EB", fontWeight: 700, flexShrink: 0, marginTop: 1, fontSize: 13 }}>+</span>
            <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>
              <strong>{s.label}:</strong> {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MEDIA PLACEHOLDER ──────────────────────────────────────────────────────
const DemoPlaceholder = ({ label }: { label: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden",
        background: "linear-gradient(160deg,#0f172a,#1e293b)",
        boxShadow: h
          ? "0 24px 64px rgba(37,99,235,0.18), 0 0 0 1px rgba(37,99,235,0.08)"
          : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
        transform: h ? "scale(1.01)" : "scale(1)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer",
      }}
    >
      <div style={{
        position: "absolute", top: 14, right: 14, padding: "4px 12px", borderRadius: 100,
        fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
        background: "rgba(37,99,235,0.9)", color: "#fff", backdropFilter: "blur(8px)", zIndex: 2,
      }}>Interactive Demo</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(37,99,235,0.15)", border: "2px solid rgba(37,99,235,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          backdropFilter: "blur(12px)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M8 5.14v13.72a1 1 0 001.5.86l11.24-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#2563EB" />
          </svg>
        </div>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
};

// ─── FAQ DATA ───────────────────────────────────────────────────────────────
const faqItems = [
  {
    q: "What does the Revenue Intelligence API do?",
    a: "It returns a credibility score for any recorded sales or customer conversation, plus per-segment signals on pricing, commitment, and churn risk — designed to embed directly into forecasting and RevOps platforms.",
  },
  {
    q: "How is this different from conversation intelligence tools like Gong or Chorus?",
    a: "Conversation intelligence tools are end-user applications. Sincerity™ is an embeddable API — a data layer platforms integrate into their own forecasting, deal-health, and CS products.",
  },
  {
    q: "What modalities does the API support?",
    a: "Audio, video, and composite (confidence-weighted fusion of both). Composite analysis delivers the highest accuracy on late-stage deal and renewal calls.",
  },
  {
    q: "How accurate is the forecast lift?",
    a: "Partners embedding Sincerity™ signals report up to 30% improvement in late-stage deal prediction accuracy and 15% improvement in renewal retention versus text-only baselines.",
  },
  {
    q: "How do I integrate Sincerity™?",
    a: "Through a standard REST API. Submit media, poll for results, and surface the returned credibility score inside your platform. See the API documentation for the full reference.",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function RevenueIntelligence() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div style={{ fontFamily: "Poppins,sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      <JsonLd
        title="Revenue Intelligence API | Forecast Accuracy with Sincerity™ | Voicera"
        description="Embed AI-powered deal credibility scoring into your RevOps platform. Sincerity™ decodes buyer commitment, flags churn risk, and improves forecast accuracy to within 5%."
        path="/solutions/revenue-intelligence"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <style>{`
        @keyframes riFp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes riGlow{0%,100%{opacity:0.3}50%{opacity:0.5}}
        @keyframes riFloat{0%,100%{transform:translate(0) rotate(0deg)}25%{transform:translate(8px,-14px) rotate(5deg)}50%{transform:translate(-4px,-24px) rotate(-3deg)}75%{transform:translate(12px,-10px) rotate(4deg)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <Navbar lightText />
      <StickyNavbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        position: "relative", minHeight: "80vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#070b14", overflow: "hidden", padding: "120px 32px 100px",
      }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY * 0.2}px)` }}>
          <WireframeMesh darkMode density={30} />
        </div>
        <Particles count={50} />
        <div style={{
          position: "absolute", width: "70vw", height: "70vw", maxWidth: 800, maxHeight: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(37,99,235,0.12) 0%,rgba(37,99,235,0.04) 40%,transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          animation: "riGlow 6s ease-in-out infinite", pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {["📊", "📈", "🎯", "💰", "🔮", "📊", "📈", "🎯"].map((e, i) => (
            <div key={i} style={{ position: "absolute", left: `${12 + i * 11}%`, top: `${15 + (i % 3) * 25}%`, fontSize: 12 + (i % 3) * 4, opacity: 0.04 + (i % 3) * 0.015, animation: `riFloat ${22 + i * 4}s ease-in-out ${-i * 3}s infinite` }}>{e}</div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: "15%", right: "8%", opacity: 0.025, fontSize: 200, pointerEvents: "none", lineHeight: 1 }}>📈</div>
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800 }}>
          <Reveal delay={0.1}><Badge dark>For RevOps Ops & Forecasting Platforms</Badge></Reveal>
          <Reveal delay={0.2}>
            <h1 style={{
              fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 800, color: "#f1f5f9",
              letterSpacing: "-0.035em", lineHeight: 1.08, margin: "28px 0 20px",
            }}>
              Embed Revenue Certainty{" "}
              <span style={{
                background: "linear-gradient(135deg,#60a5fa,#93c5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>into Your Platform</span>
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
              Power your forecasting engine with Sincerity™ — the multimodal AI credibility layer that decodes true buyer commitment and surfaces hidden churn risk, natively inside your product.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="/contact?type=api" variant="blue" size="lg">Get API Access</CTA>
              <CTA href="/contact?type=partnerships" variant="outline" size="lg">Talk to Partnerships</CTA>
            </div>
          </Reveal>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
          background: "linear-gradient(to top,#fff,transparent)", pointerEvents: "none",
        }} />
      </section>

      {/* ═══ AEO ANSWER BLOCK ═══ */}
      <section style={{ background: "#fff", padding: "60px 32px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{
              background: "#F7F9FC", borderRadius: 16, padding: "32px 28px",
              border: "1px solid #e2e8f0",
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", marginBottom: 8 }}>What is revenue intelligence?</p>
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 20 }}>
                Revenue intelligence is the practice of using AI to analyze buyer and customer interactions — calls, meetings, renewals — to predict deal outcomes and forecast revenue with measurable accuracy. Unlike traditional CRM reporting, which relies on rep-entered data, revenue intelligence extracts objective signals directly from the conversations themselves.
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", marginBottom: 8 }}>How does Sincerity™ improve forecast accuracy?</p>
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                Sincerity™ adds a credibility layer on top of transcription and sentiment. It measures whether a buyer's verbal commitment matches their vocal and visual sincerity — the gap that causes 93% of forecast misses. Platforms embedding the Sincerity™ API surface this signal inside their own deal-health and forecasting views.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ THE FORECASTING GAP — STATS ═══ */}
      <section style={{ background: "#fff", padding: "80px 32px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>The Forecasting Gap</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>
                Why Forecasting Platforms Need a Credibility Layer
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", maxWidth: 620, margin: "0 auto", lineHeight: 1.65 }}>
                Transcription tells you <em>what was said</em>. Sentiment tells you <em>how it sounded</em>. Neither tells you whether the buyer meant it. To deliver forecast accuracy your users can trust, your platform needs a data layer that distinguishes <em>polite interest</em> from <em>contractual intent</em>.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
              <StatCard value="93" label="of sales leaders miss forecast by more than 10% — the accuracy gap your platform can close" icon="📉" />
              <StatCard value="70" label="of churned accounts sent quiet, pre-cancellation signals months in advance — signals invisible to text-only analysis" icon="🔇" />
              <StatCard value="2.1" suffix="M" label={'average annual revenue leak per company from misread deal health and "happy ears"'} icon="💸" />
              <StatCard value="23" label="of RevOps leaders trust the data in their own CRM — rebuild that trust with objective signal" icon="📊" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CORE CAPABILITIES ═══ */}
      <section style={{ background: "#F7F9FC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>Embedded Intelligence</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>
                The Data Layer for Deal Health and Churn Risk
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", maxWidth: 620, margin: "0 auto", lineHeight: 1.65 }}>
                Sincerity™ delivers three embeddable signal types your platform can surface inside forecasting, deal-health, and customer-success workflows.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
            <Reveal delay={0.1}>
              <CapabilityCard
                num="1" emoji="🎯"
                title="Commitment vs. Happy Ears Detection"
                subtitle="Separate verbal yes from contractual intent"
                desc="Equip your users to see past the transcript. Sincerity™ identifies micro-patterns of hesitation during pricing, timeline, and stakeholder discussions — the moments where a buyer's &quot;yes&quot; lacks the credibility needed to close."
                signals={[
                  { label: "Signal", text: "Per-segment sincerity scoring on pricing, timeline, and decision-maker discussions" },
                  { label: "Benefit", text: "30% higher predictive power than text-only sentiment on late-stage deals" },
                  { label: "Surface in", text: "Deal health dashboards, forecast confidence views, pipeline reviews" },
                ]}
              />
            </Reveal>
            <Reveal delay={0.2}>
              <CapabilityCard
                num="2" emoji="⚠️"
                title="Pre-Churn Signal Detection"
                subtitle="Catch resignation before the renewal conversation"
                desc="Power your customer success modules with early-warning credibility signals. Automatically flag accounts where the customer's vocal tone contradicts their CSAT score or QBR language."
                signals={[
                  { label: "Signal", text: "Detects frustration, resignation, and disengagement patterns in renewal and QBR calls" },
                  { label: "Benefit", text: "15% retention lift through proactive intervention windows" },
                  { label: "Surface in", text: "Health scores, renewal risk alerts, CS playbook triggers" },
                ]}
              />
            </Reveal>
            <Reveal delay={0.3}>
              <CapabilityCard
                num="3" emoji="📊"
                title="Objective Forecast Confidence Scoring"
                subtitle="Replace gut-feel with an auditable credibility score"
                desc="Embed the Sincerity™ Score directly into your forecasting engine. Weight every stakeholder interaction by measured credibility rather than rep-reported confidence, and give RevOps leaders an immutable audit trail of buyer intent across the deal lifecycle."
                signals={[
                  { label: "Signal", text: "Account- and deal-level sincerity aggregates with confidence intervals" },
                  { label: "Benefit", text: "Replaces subjective rep input with an objective, auditable data layer" },
                  { label: "Surface in", text: "Forecast category logic, deal-scoring models, board reporting" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>Why It's Different</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>
                Traditional Conversation Intelligence vs. Sincerity™ API
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%", borderCollapse: "collapse", fontSize: 14,
                borderRadius: 16, overflow: "hidden",
              }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#2563EB,#3b82f6)" }}>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontWeight: 700, fontSize: 13 }}></th>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontWeight: 700, fontSize: 13 }}>Traditional Conversation Intelligence</th>
                    <th style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontWeight: 700, fontSize: 13 }}>Sincerity™ API</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Input", "Transcript text only", "Multimodal audio + video"],
                    ["Output", "Keywords, sentiment, talk ratio", "Calibrated credibility score"],
                    ["Integration", "Standalone app", "Embeddable data layer"],
                    ["Forecast signal", "Inferred from activity", "Measured from buyer sincerity"],
                  ].map(([label, trad, sinc], i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#F7F9FC" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a" }}>{label}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b" }}>{trad}</td>
                      <td style={{ padding: "14px 20px", color: "#2563EB", fontWeight: 600 }}>{sinc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ INTERACTIVE DEMO ═══ */}
      <section style={{ background: "#F7F9FC", padding: "100px 32px", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>See the Data Layer</Badge>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              See Deal Risk Intelligence in Action
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 40px" }}>
              Watch Sincerity™ analyze a late-stage negotiation in real time. See the exact moment the AI separates a buyer who is <em>browsing</em> from a buyer who is <em>buying</em> — the same signal your platform can surface natively to deliver measurable forecast clarity.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{
              borderRadius: 20, overflow: "hidden",
              boxShadow: "0 24px 80px rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.06)",
              marginBottom: 24,
            }}>
              <DemoPlaceholder label="Deal Review Intelligence Demo" />
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 32px" }}>
              This is the same API powering deal scoring, churn alerts, and pipeline health inside partner platforms today.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="/api-docs" variant="blue">Explore the API — Start Free</CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CASE STUDY ═══ */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "flex", gap: 64,
          alignItems: "center", flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            <Reveal>
              <Badge>Integration Blueprint</Badge>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                color: "#94a3b8", margin: "20px 0 16px",
              }}>HOW PLATFORMS EMBED SINCERITY™</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.75 }}>
                <p style={{ marginBottom: 16 }}>
                  <strong>1) Connect via API</strong> – Integrate the Sincerity™ API into your platform's existing call recording or video pipeline. Your users upload media as usual — our data layer processes it in the background.
                </p>
                <p style={{ marginBottom: 16 }}>
                  <strong>2) Analyze with Multimodal AI</strong> – Voicera's AI evaluates voice tone, facial expressions, and body language to produce a queryable Sincerity™ Score — delivered back to your platform in real time.
                </p>
                <p style={{ marginBottom: 24 }}>
                  <strong>3) Surface Insights to Your Users</strong> – Deliver credibility scores, trust signals, and coaching prompts natively within your product. Your users get smarter — and your platform gets stickier.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <CTA href="/api-docs" variant="blue">Explore the API</CTA>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <div style={{ marginBottom: 16 }}>
                <YouTubeCase />
              </div>
              <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6 }}>
                See Sincerity™ in action — our analysis of the Elizabeth Holmes case demonstrates the depth of credibility signals your platform could surface.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ background: "#F7F9FC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>FAQ</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 0", letterSpacing: "-0.025em" }}>
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-6 overflow-hidden"
                  style={{ borderBottom: "1px solid #e2e8f0" }}
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold text-[#0f172a] hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[14px] text-[#64748b] leading-[1.7] pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSE CTA ═══ */}
      <section style={{ background: "#fff", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{
              fontSize: 34, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2,
              background: "linear-gradient(135deg,#2563EB,#3b82f6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 24,
            }}>
              Embed Revenue Certainty into Your Platform
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="/api-docs" variant="blue" size="lg">Explore the API — Start Free</CTA>
              <CTA href="/contact?type=partnerships" variant="outline" size="lg">Talk to Partnerships About Integration</CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BOTTOM CTA DARK ═══ */}
      <section style={{
        position: "relative", padding: "110px 32px", background: "#070b14",
        overflow: "hidden", textAlign: "center",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <WireframeMesh darkMode density={22} />
        </div>
        <Particles count={30} color="rgba(147,197,253,0.2)" />
        <div style={{
          position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 60%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 28 }}>
              Ready to embed revenue certainty into your forecasting platform? Let's talk integration.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <CTA href="/contact?type=partnerships" variant="white" size="lg">Talk to Partnerships</CTA>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
