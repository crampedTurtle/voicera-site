import { useState, useEffect, useRef, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

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
  const clr = { blue: "#fff", white: "#0f172a", outline: "#2563EB" };
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

  return (
    <div style={{ fontFamily: "Poppins,sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      <JsonLd
        title="Sincerity™ for Sales — Voicera"
        description="Close bigger sales, faster. Land your pitch, understand customer intentions, and build trust with AI-powered credibility intelligence."
        path="/solutions/sales"
      />
      <style>{`
        @keyframes sfsFp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes sfsGlow{0%,100%{opacity:0.3}50%{opacity:0.5}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <Navbar />

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
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800 }}>
          <Reveal delay={0.1}><Badge dark>Sales & Customer Service Training</Badge></Reveal>
          <Reveal delay={0.2}>
            <h1 style={{
              fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 800, color: "#f1f5f9",
              letterSpacing: "-0.035em", lineHeight: 1.08, margin: "28px 0 20px",
            }}>
              Improve Sales Outcomes{" "}
              <span style={{
                background: "linear-gradient(135deg,#60a5fa,#93c5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>with Sincerity™</span>
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
               Close bigger sales, faster. Land your pitch, understand customer intentions, and build trust with AI-powered credibility intelligence. 💼
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue" size="lg">Start Free</CTA>
              <CTA href="https://voicera.io/contact-us/" variant="outline" size="lg">Talk to Sales</CTA>
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
              <Badge>The Problem</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>
                Why Sales Teams Need Sincerity™
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
                Trust is the currency of modern sales. Most teams are flying blind.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
              <StatCard value="73" label="of buyers say sales interactions feel transactional vs authentic" icon="🤝" />
              <StatCard value="57" label="of sales calls contain negative emotions and uncertainty" icon="📉" />
              <StatCard value="59" label="say sales reps fail at taking the time to understand them" icon="🎯" />
              <StatCard value="89" label="of consumers switch to competitors after poor experiences" icon="🚪" />
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
            <Reveal><Badge>AI-Powered Training</Badge></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
                 Close Bigger Sales, Faster 📈
              </h2>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2563EB", margin: "0 0 24px" }}>
                Sincerity™: AI-Powered Sales Pitch Training
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 24, fontWeight: 600 }}>
                Land your pitch, close deals faster, and understand customer intentions more accurately with Sincerity™ by:
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Bullet sub={[]}>
                Analyzing your verbal & non-verbal inconsistencies when delivering a pitch or customer inquiry, with <strong>30%</strong> greater accuracy than human capability
              </Bullet>
              <Bullet sub={[
                'Only 32% describe the sales interactions as "trustworthy"',
                "73% of buyers say sales interactions feel transactional vs authentic",
              ]}>
                Building trust with buyers and clients during virtual calls— the preferred method of communication for over <strong>70%</strong> of buyers because:
              </Bullet>
              <Bullet sub={[
                "57% of sales calls contain negative emotions and uncertainty",
                "59% say sales reps fail at taking the time to understand them",
              ]}>
                Avoiding costly miscommunication and boosting empathetic communication. Test multiple pitches or customer interactions to improve your <strong>sincerity score</strong> and avoid negative consequences:
              </Bullet>
              <Bullet sub={[
                "Improving customer experiences boosts revenue by 15%",
                "89% of consumers switch to competitors after poor customer experiences",
                "42% of customers are willing to pay more for a friendly customer experience",
              ]}>
                Increasing revenue by reliably training sales reps and customer service agents because:
              </Bullet>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <SalesMediaPlaceholder type="image" label="Sales Team Using Sincerity™" aspect="4/3" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE DEMO ═══ */}
      <section style={{ background: "#fff", padding: "100px 32px", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>Interactive Demo</Badge>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
              See It in Action — Live Sales Call Intelligence
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 40px" }}>
              Experience how Sincerity™ analyzes a sales conversation in real time. Watch the AI evaluate tone, micro-expressions, and speech patterns to surface trust signals your team would otherwise miss.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{
              borderRadius: 20, overflow: "hidden",
              boxShadow: "0 24px 80px rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.06)",
              marginBottom: 24,
            }}>
              <SalesMediaPlaceholder type="video" label="Sales Call Intelligence Demo" aspect="16/9" />
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 32px" }}>
              This is the same AI your team will use to rehearse pitches, coach reps, and decode buyer intent on every call. Imagine this running on your team's actual conversations.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue">
                Ready to Use Sincerity™ With Your Team? Start Free
              </CTA>
            </div>
            <p style={{ marginTop: 16 }}>
              <a href="https://voicera.io/contact-us/" style={{ fontSize: 14, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>
                Or talk to our team about enterprise pricing →
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
              <Badge>How It Works</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>
                Smarter Pitches and Customer Service in 3 Steps
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Reveal delay={0.1} style={{ flex: "1 1 280px" }}>
              <StepCard num="1" title="Upload Videos to Sincerity™"
                desc="Sales professionals, customer service agents, and anyone who wants to improve their business pitch delivery can upload their videos or audio files to the Sincerity™ platform." />
            </Reveal>
            <Reveal delay={0.2} style={{ flex: "1 1 280px" }}>
              <StepCard num="2" title="Analyze with Sincerity™"
                desc="Voicera's multimodal AI evaluates each person's voice tone, facial expressions, & body language to estimate how sincere or insincere a statement seems to a listener." />
            </Reveal>
            <Reveal delay={0.3} style={{ flex: "1 1 280px" }}>
              <StepCard num="3" title="Enjoy More Confidence in Pitch Outcomes"
                desc="Leverage insights from AI analysis results to better detect verbal and non-verbal inconsistencies to improve how sales and/or customer service professionals communicate with buyers and build trust." />
            </Reveal>
          </div>
          <Reveal delay={0.35}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Test Sincerity™ for Free</CTA>
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
              <Badge>Case Study</Badge>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const,
                color: "#94a3b8", margin: "20px 0 16px",
              }}>SMARTER PITCHES AND CUSTOMER SERVICE IN 3 STEPS</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.75 }}>
                <p style={{ marginBottom: 16 }}>
                  <strong>1) Upload Videos to Sincerity™</strong> – Sales professionals, customer service agents, and anyone who wants to improve their business pitch delivery can upload their videos or audio files to the Sincerity™ platform.
                </p>
                <p style={{ marginBottom: 16 }}>
                  <strong>2) Analyze with Sincerity™</strong> – Voicera's multimodal AI evaluates each person's voice tone, facial expressions, & body language to estimate how sincere or insincere a statement seems to a listener.
                </p>
                <p style={{ marginBottom: 24 }}>
                  <strong>3) Enjoy More Confidence in Pitch Outcomes & Customer Interactions</strong> – Leverage insights from AI analysis results to better detect verbal and non verbal inconsistencies to improve how sales and/or customer service professionals communicate with buyers and build trust.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Test Sincerity™ for Free</CTA>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <div style={{ marginBottom: 16 }}>
                <SalesMediaPlaceholder type="video" label="Elizabeth Holmes Case Analysis" aspect="16/9" />
              </div>
              <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6 }}>
                See Sincerity™ in action by watching our analysis of the Elizabeth Holmes case.
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
                1 in 10 people can't identify emotions correctly and almost 50% of people can't understand emotions behind facial expressions.
              </p>
            </Reveal>
          </div>
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
              Start Closing Sales & Understanding Your Customers Better Today
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <CTA href="https://sincerity.voicera.io/auth/login" variant="blue" size="lg">Try Sincerity™ for Sales</CTA>
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
              Interested in learning more about how Voicera AI can help sales and customer service professionals better prepare for pitches and customer interactions?
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <CTA href="https://voicera.io/contact-us/" variant="white" size="lg">Contact Us</CTA>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
