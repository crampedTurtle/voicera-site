import { useState, useEffect, useRef, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import YouTubeCase from "@/components/YouTubeCase";
import salesVerticalImg from "@/assets/sales-vertical.png";
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
          opacity: d.opacity, animation: `sfsFp ${d.dur}s ease-in-out ${d.delay}s infinite`,
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
  const clr = { blue: "#fff", white: "#0f172a", outline: "#fff" };
  const sh = {
    blue: h ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)",
    white: h ? "0 8px 24px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)",
    outline: "none",
  };
  const pad = size === "lg" ? "16px 36px" : "13px 28px";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: pad, borderRadius: 12, fontSize: size === "lg" ? 16 : 14, fontWeight: 700,
        fontFamily: "Poppins,sans-serif", textDecoration: "none",
        background: bg[variant], color: clr[variant], boxShadow: sh[variant],
        border: variant === "outline" ? "2px solid #fff" : "none",
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

// ─── STEP CARD ──────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, emoji }: { num: string; title: string; desc: string; emoji: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: "32px 28px",
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
        fontSize: 16, fontWeight: 800, color: "#2563EB",
        fontFamily: "Poppins,sans-serif", marginBottom: 16,
      }}><span style={{ fontSize: 18 }}>{emoji}</span></div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ─── MEDIA PLACEHOLDER ──────────────────────────────────────────────────────
const SalesMediaPlaceholder = ({ type = "video", label, aspect = "16/10" }: { type?: "video" | "image"; label: string; aspect?: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        position: "relative", width: "100%", aspectRatio: aspect, borderRadius: 16, overflow: "hidden",
        background: type === "image"
          ? "linear-gradient(160deg,#f0f4ff,#e0e7ff)"
          : "linear-gradient(160deg,#0f172a,#1e293b)",
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
      }}>
        {type === "video" ? "Interactive Demo" : "Placeholder Image"}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        {type === "video" ? (
          <>
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
          </>
        ) : (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: 16,
              background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.05))",
              border: "1px solid rgba(37,99,235,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        )}
      </div>
      <svg style={{ position: "absolute", bottom: 0, right: 0, width: 80, height: 80, opacity: 0.08, zIndex: 1 }} viewBox="0 0 80 80">
        <path d="M80 80L0 80L80 0Z" fill="#3b82f6" />
      </svg>
    </div>
  );
};

// ─── BULLET POINT WITH SUB-BULLETS ──────────────────────────────────────────
const Bullet = ({ children, sub }: { children: ReactNode; sub?: string[] }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "linear-gradient(135deg,#2563EB,#3b82f6)",
        flexShrink: 0, marginTop: 7,
      }} />
      <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
    {sub && sub.length > 0 && (
      <div style={{ marginLeft: 20, marginTop: 8 }}>
        {sub.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ color: "#2563EB", fontWeight: 700, flexShrink: 0, marginTop: 1, fontSize: 13 }}>+</span>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{s}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── FAQ DATA ───────────────────────────────────────────────────────────────
const salesFaqItems = [
  { q: "How do sales tech platforms embed Sincerity™?", a: "Via Voicera's REST API. Submit recorded calls, receive calibrated credibility scores and per-segment signals. The data layer integrates natively into your platform's existing pipeline and CRM sync." },
  { q: "What sales workflows does Sincerity™ power?", a: "Deal qualification, buyer-intent scoring, rep coaching, and pipeline risk flagging. Host platforms surface these signals inside their own UX — Sincerity™ operates as invisible infrastructure." },
  { q: "Is Sincerity™ a replacement for sales rep judgment?", a: "No. Sincerity™ is infrastructure that powers the host platform's features. Human judgment remains with the platform's users — reps and managers make the final call." },
  { q: "How accurate is Sincerity™ for sales use cases?", a: "Sincerity™ returns calibrated confidence scores. Accuracy depends on audio/video quality, and the platform surfaces quality flags so host platforms can set appropriate thresholds." },
  { q: "How is Sincerity™ priced for sales tech platforms?", a: "Three options — per-minute or per-hour API pricing with volume tiers, Platform Web App plans, and Custom Deployment for enterprise builders. See the Pricing section." },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function SincerityForSales() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const salesFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: salesFaqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div style={{ fontFamily: "Poppins,sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      <JsonLd
        title="Sincerity™ for Sales Tech Platforms — Voicera"
        description="Embed AI-powered credibility intelligence into your sales enablement platform. Help your users close bigger deals, faster — with trust signals built in."
        path="/solutions/sales"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(salesFaqSchema)}</script>
      </Helmet>
      <style>{`
        @keyframes sfsFp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes sfsGlow{0%,100%{opacity:0.3}50%{opacity:0.5}}
        @keyframes sfsFloat{0%,100%{transform:translate(0) rotate(0deg)}25%{transform:translate(8px,-14px) rotate(5deg)}50%{transform:translate(-4px,-24px) rotate(-3deg)}75%{transform:translate(12px,-10px) rotate(4deg)}}
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
          animation: "sfsGlow 6s ease-in-out infinite", pointerEvents: "none",
        }} />
        {/* Decorative floating emojis */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {["💼", "📊", "🎯", "📈", "🤝", "💼", "📊", "🎯"].map((e, i) => (
            <div key={i} style={{ position: "absolute", left: `${12 + i * 11}%`, top: `${15 + (i % 3) * 25}%`, fontSize: 12 + (i % 3) * 4, opacity: 0.04 + (i % 3) * 0.015, animation: `sfsFloat ${22 + i * 4}s ease-in-out ${-i * 3}s infinite` }}>{e}</div>
          ))}
        </div>
        {/* Watermark */}
        <div style={{ position: "absolute", bottom: "15%", right: "8%", opacity: 0.025, fontSize: 200, pointerEvents: "none", lineHeight: 1 }}>💼</div>
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800 }}>
          <Reveal delay={0.1}><Badge dark>Powering Sales Enablement Platforms</Badge></Reveal>
          <Reveal delay={0.2}>
            <h1 style={{
              fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 800, color: "#f1f5f9",
              letterSpacing: "-0.035em", lineHeight: 1.08, margin: "28px 0 20px",
            }}>
              Embed Credibility Intelligence{" "}
              <span style={{
                background: "linear-gradient(135deg,#60a5fa,#93c5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>into Your Platform</span>
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
              Help your users close bigger deals, faster. Power your platform with AI-driven trust signals that decode buyer intent, coach reps, and surface credibility insights — natively.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue" size="lg">Get API Access</CTA>
              <CTA href="https://voicera.io/contact-us/" variant="outline" size="lg">Talk to Partnerships</CTA>
            </div>
          </Reveal>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
          background: "linear-gradient(to top,#fff,transparent)", pointerEvents: "none",
        }} />
      </section>

      {/* ═══ SOCIAL PROOF STATS ═══ */}
      <section style={{ background: "#fff", padding: "80px 32px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>The Gap in Sales Tech</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>
                Why Sales Platforms Need a Credibility Layer
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
                Your users' buyers demand trust. Without credibility intelligence, your platform is leaving revenue on the table.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
              <StatCard value="73" label="of buyers say sales interactions feel transactional — your users need tools to fix that" icon="🤝" />
              <StatCard value="57" label="of sales calls contain negative emotions — invisible to platforms without sincerity data" icon="📉" />
              <StatCard value="59" label="say reps fail to understand them — equip your users to close that gap" icon="🎯" />
              <StatCard value="89" label="of consumers switch after poor experiences — help your users retain more customers" icon="🚪" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ VALUE PROP ═══ */}
      <section style={{ background: "#f8fafc", padding: "100px 32px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "flex", gap: 64,
          alignItems: "center", flexWrap: "wrap",
        }}>
          <div style={{ flex: "1 1 500px", minWidth: 320 }}>
            <Reveal><Badge>Embedded Intelligence</Badge></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
                 Power Smarter Sales Workflows 📈
              </h2>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2563EB", margin: "0 0 24px" }}>
                Sincerity™: A Data Layer for Sales Enablement
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 24, fontWeight: 600 }}>
                Integrate Sincerity™ into your host platform to deliver credibility intelligence that equips your users to sell with confidence:
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Bullet sub={[]}>
                Surface verbal & non-verbal inconsistencies for your users during pitch delivery or customer inquiries, with <strong>30%</strong> greater accuracy than human capability
              </Bullet>
              <Bullet sub={[
                'Only 32% of buyers describe sales interactions as "trustworthy"',
                "73% of buyers say sales interactions feel transactional vs authentic",
              ]}>
                Help your users build trust with buyers during virtual calls — the preferred channel for over <strong>70%</strong> of buyers — by exposing signals they'd otherwise miss:
              </Bullet>
              <Bullet sub={[
                "57% of sales calls contain negative emotions and uncertainty",
                "59% say sales reps fail at taking the time to understand them",
              ]}>
                Embed empathetic communication coaching natively. Let your users test pitches and interactions to improve their <strong>sincerity score</strong> and avoid negative consequences:
              </Bullet>
              <Bullet sub={[
                "Improving customer experiences boosts revenue by 15%",
                "89% of consumers switch to competitors after poor customer experiences",
                "42% of customers are willing to pay more for a friendly customer experience",
              ]}>
                Drive measurable revenue lift for your customers by enhancing your product with reliable rep coaching and credibility insights:
              </Bullet>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <img
                src={salesVerticalImg}
                alt="Sincerity™ Embedded in Your Platform"
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 16, display: "block" }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE DEMO ═══ */}
      <section style={{ background: "#fff", padding: "100px 32px", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>See the Data Layer</Badge>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
               See It in Action — Live Sales Call Intelligence 🎯
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 40px" }}>
              Experience how Sincerity™ analyzes a sales conversation in real time. Watch the AI evaluate tone, micro-expressions, and speech patterns — the same intelligence your platform can surface natively to its users.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <iframe
                src="https://demo.voicera.io/"
                width="720"
                height="900"
                style={{ border: "none", borderRadius: 20, maxWidth: "100%" }}
                loading="lazy"
                title="Sales Call Intelligence Demo"
                allow="camera; microphone"
              />
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 32px" }}>
              This is the same AI your platform can embed to power pitch rehearsal, rep coaching, and buyer intent decoding on every call. Imagine this running inside your product.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue">
                Explore the API — Start Free
              </CTA>
            </div>
            <p style={{ marginTop: 16 }}>
              <a href="https://voicera.io/contact-us/" style={{ fontSize: 14, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
                Or talk to our partnerships team about integration →
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ 3 STEPS ═══ */}
      <section style={{ background: "#f8fafc", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>Native Integration</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>
                Embed Credibility Intelligence in 3 Steps
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Reveal delay={0.1} style={{ flex: "1 1 280px" }}>
              <StepCard num="1" emoji="🔗" title="Connect via API"
                 desc="Integrate the Sincerity™ API into your platform's existing call recording or video pipeline. Your users upload media as usual — our data layer processes it in the background." />
             </Reveal>
             <Reveal delay={0.2} style={{ flex: "1 1 280px" }}>
               <StepCard num="2" emoji="🔍" title="Analyze with Multimodal AI"
                 desc="Voicera's AI evaluates voice tone, facial expressions, and body language to produce a queryable Sincerity™ Score — delivered back to your platform in real time." />
             </Reveal>
             <Reveal delay={0.3} style={{ flex: "1 1 280px" }}>
               <StepCard num="3" emoji="📊" title="Surface Insights to Your Users"
                 desc="Deliver credibility scores, trust signals, and coaching prompts natively within your product. Your users get smarter — and your platform gets stickier." />
            </Reveal>
          </div>
          <Reveal delay={0.35}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Explore the API</CTA>
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
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Explore the API</CTA>
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
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
                1 in 10 people can't identify emotions correctly and almost 50% can't read facial expressions — that's why platforms need AI.
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
              {salesFaqItems.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-[#e2e8f0] rounded-xl px-6 overflow-hidden" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <AccordionTrigger className="text-left text-[15px] font-semibold text-[#0f172a] hover:no-underline py-5">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[14px] text-[#64748b] leading-[1.7] pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSE CTA ═══ */}
      <section style={{ background: "#f8fafc", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{
              fontSize: 34, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2,
              background: "linear-gradient(135deg,#2563EB,#3b82f6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 24,
            }}>
              Enhance Your Sales Platform with Credibility Intelligence
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <CTA href="https://sincerity.voicera.io/auth/login" variant="blue" size="lg">Get API Access</CTA>
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
        <div style={{ position: "absolute", bottom: "10%", left: "5%", opacity: 0.02, fontSize: 180, pointerEvents: "none", lineHeight: 1 }}>📊</div>
        <div style={{
          position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 60%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.25, letterSpacing: "-0.02em", marginBottom: 28 }}>
              Ready to embed credibility intelligence into your sales enablement platform? Let's talk integration.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <CTA href="https://voicera.io/contact-us/" variant="white" size="lg">Talk to Partnerships</CTA>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
