import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import JsonLd from "@/components/JsonLd";

// ─── WIREFRAME MESH ─────────────────────────────────────────────────────────
const WireframeMesh = ({ darkMode = true, density = 28 }: { darkMode?: boolean; density?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w: number, h: number, cols: number, rows: number, sp: number;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = density; rows = Math.ceil((h / w) * density) + 4; sp = w / (cols - 1);
    };
    resize();
    window.addEventListener("resize", resize);
    const hm = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.current.x = (e.clientX - r.left) / r.width; mouse.current.y = (e.clientY - r.top) / r.height; };
    window.addEventListener("mousemove", hm);
    const draw = (time: number) => {
      const t = time * 0.001; ctx.clearRect(0, 0, w, h);
      const mx = (mouse.current.x - 0.5) * 25, my = (mouse.current.y - 0.5) * 18;
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) { const row: { x: number; y: number }[] = []; for (let c = 0; c < cols; c++) { const bx = c * sp, by = r * sp - sp * 2; const wv = Math.sin(c * 0.2 + t * 0.6) * Math.cos(r * 0.15 + t * 0.4) * 20 + Math.sin((c + r) * 0.12 + t * 0.25) * 10; row.push({ x: bx + mx * (r / rows) * 0.12, y: by + wv + my * (c / cols) * 0.08 }); } pts.push(row); }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const p = pts[r][c]; const d = Math.sqrt(Math.pow((p.x / w - 0.5) * 2, 2) + Math.pow((p.y / h - 0.5) * 2, 2));
        const a = Math.max(0, (darkMode ? 0.18 : 0.1) - d * 0.08);
        const c1 = darkMode ? `rgba(37,99,235,${a})` : `rgba(37,99,235,${a * 0.6})`; const c2 = darkMode ? `rgba(124,58,237,${a})` : `rgba(124,58,237,${a * 0.6})`;
        if (c < cols - 1) { const n = pts[r][c + 1]; const g = ctx.createLinearGradient(p.x, p.y, n.x, n.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke(); }
        if (r < rows - 1) { const b = pts[r + 1][c]; const g = ctx.createLinearGradient(p.x, p.y, b.x, b.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        if (a > 0.05) { ctx.fillStyle = darkMode ? `rgba(147,197,253,${a * 2})` : `rgba(37,99,235,${a * 1.5})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill(); }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", hm); };
  }, [darkMode, density]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

// ─── PARTICLES ──────────────────────────────────────────────────────────────
const Particles = ({ count = 45, color = "rgba(147,197,253,0.3)" }: { count?: number; color?: string }) => {
  const p = useRef(Array.from({ length: count }, () => ({ x: Math.random() * 100, y: Math.random() * 100, sz: 1.5 + Math.random() * 2, dur: 25 + Math.random() * 35, del: Math.random() * -30, op: 0.12 + Math.random() * 0.3 }))).current;
  return (<div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{p.map((d, i) => (<div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.sz, height: d.sz, borderRadius: "50%", background: color, opacity: d.op, animation: `fp ${d.dur}s ease-in-out ${d.del}s infinite` }} />))}</div>);
};

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const useReveal = (t = 0.12): [React.RefObject<HTMLDivElement>, boolean] => { const ref = useRef<HTMLDivElement>(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t }); obs.observe(el); return () => obs.disconnect(); }, [t]); return [ref, v]; };
const Reveal = ({ children, delay = 0, dir = "up", style: s }: { children: React.ReactNode; delay?: number; dir?: string; style?: React.CSSProperties }) => { const [ref, v] = useReveal(); const t: Record<string, string> = { up: "translateY(44px)", down: "translateY(-44px)", left: "translateX(44px)", right: "translateX(-44px)" }; return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translate(0)" : t[dir], transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...s }}>{children}</div>); };

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
const Counter = ({ value, prefix = "", suffix = "", duration = 1600 }: { value: string | number; prefix?: string; suffix?: string; duration?: number }) => {
  const [display, setDisplay] = useState(0);
  const [ref, visible] = useReveal(0.3);
  const num = parseInt(String(value));
  useEffect(() => {
    if (!visible) return; let start = 0;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * num)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [visible, num, duration]);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

// ─── BADGE ──────────────────────────────────────────────────────────────────
const Badge = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span role="text" style={{
    display: "inline-block", padding: "6px 18px", borderRadius: 100,
    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
    fontFamily: "Poppins,sans-serif",
    background: dark ? "#1e3a5f" : "#dbeafe",
    color: dark ? "#e0f2fe" : "#1e40af",
    border: dark ? "1px solid rgba(96,165,250,0.3)" : "1px solid #bfdbfe",
  }}>{children}</span>
);

// ─── CTA BUTTON ─────────────────────────────────────────────────────────────
const CTA = ({ children, href = "#", variant = "blue", size = "md" }: { children: React.ReactNode; href?: string; variant?: string; size?: string }) => {
  const [h, setH] = useState(false);
  const pad = size === "lg" ? "16px 36px" : "13px 28px";
  const bg: Record<string, string> = { blue: h ? "linear-gradient(135deg,#1d4ed8,#6d28d9)" : "linear-gradient(135deg,#2563EB,#7C3AED)", white: h ? "#f1f5f9" : "#fff", outline: "transparent" };
  const clr: Record<string, string> = { blue: "#fff", white: "#0f172a", outline: h ? "#1d4ed8" : "#2563EB" };
  const sh: Record<string, string> = { blue: h ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)", white: h ? "0 8px 24px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)", outline: "none" };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: pad, borderRadius: 12, fontSize: size === "lg" ? 16 : 14, fontWeight: 700, fontFamily: "Poppins,sans-serif", textDecoration: "none", background: bg[variant], color: clr[variant], boxShadow: sh[variant], border: variant === "outline" ? "2px solid #2563EB" : "none", transform: h ? "translateY(-2px)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer" }}
    >{children}<span style={{ fontSize: 16, transform: h ? "translateX(3px)" : "none", transition: "transform 0.3s" }}>→</span></a>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ value, prefix = "", suffix = "", label, icon }: { value: string | number; prefix?: string; suffix?: string; label: string; icon: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #e2e8f0", textAlign: "center",
      boxShadow: h ? "0 16px 48px rgba(37,99,235,0.12)" : "0 4px 16px rgba(0,0,0,0.04)",
      transform: h ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 14, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginTop: 8 }}>{label}</div>
    </div>
  );
};

// ─── STEP CARD ──────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc }: { num: string; title: string; desc: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: "32px 28px",
      border: "1px solid #e2e8f0", position: "relative", overflow: "hidden",
      boxShadow: h ? "0 20px 48px rgba(37,99,235,0.1)" : "0 2px 12px rgba(0,0,0,0.03)",
      transform: h ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, fontWeight: 900, color: "rgba(37,99,235,0.04)", lineHeight: 1 }}>{num}</div>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(124,58,237,0.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#2563EB", marginBottom: 16 }}>{num}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ─── MEDIA PLACEHOLDER ──────────────────────────────────────────────────────
const MediaPlaceholder = ({ type = "image", label, badge = "Placeholder", aspect = "16/10" }: { type?: string; label: string; badge?: string; aspect?: string }) => {
  const [h, setH] = useState(false);
  const isDark = type === "video";
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      position: "relative", width: "100%", aspectRatio: aspect, borderRadius: 16, overflow: "hidden",
      background: isDark ? "linear-gradient(160deg,#0f172a,#1e293b)" : "linear-gradient(160deg,#f0f4ff,#e0e7ff)",
      boxShadow: h ? "0 24px 64px rgba(37,99,235,0.18), 0 0 0 1px rgba(37,99,235,0.08)" : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
      transform: h ? "scale(1.01)" : "scale(1)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer",
    }}>
      <div style={{ position: "absolute", top: 14, right: 14, padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, background: "#1d4ed8", color: "#ffffff", zIndex: 2 }}>{badge}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        {type === "video" ? (
          <>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(37,99,235,0.15)", border: "2px solid rgba(37,99,235,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, backdropFilter: "blur(12px)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.24-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#2563EB" /></svg>
            </div>
            <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        ) : (
          <>
            <div style={{ width: 76, height: 76, borderRadius: 16, background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(124,58,237,0.08))", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        )}
      </div>
    </div>
  );
};

// ─── BULLET ─────────────────────────────────────────────────────────────────
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#7C3AED)", flexShrink: 0, marginTop: 7 }} />
    <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
);

// ─── FEATURE CARD ───────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 240px", background: "#fff", borderRadius: 14, padding: "24px 20px",
      border: "1px solid #e2e8f0",
      boxShadow: h ? "0 12px 36px rgba(37,99,235,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
      transform: h ? "translateY(-3px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function SincerityForHR() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  return (
    <div style={{ fontFamily: "Poppins,sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      <Helmet>
        <title>Sincerity™ for HR — Voicera</title>
        <meta name="description" content="AI-powered candidate authenticity analysis for HR teams. Reduce bad hires, save time and money with Sincerity™ by Voicera." />
      </Helmet>
      <JsonLd
        title="Sincerity™ for HR — Voicera"
        description="AI-powered candidate authenticity analysis for HR teams."
        path="/solutions/hr"
      />
      <style>{`
        @keyframes fp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes glow{0%,100%{opacity:0.3}50%{opacity:0.5}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <Navbar />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#070b14", overflow: "hidden", padding: "120px 32px 100px" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY * 0.2}px)` }}><WireframeMesh darkMode density={30} /></div>
        <Particles count={50} />
        <div style={{ position: "absolute", width: "70vw", height: "70vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.12) 0%,rgba(124,58,237,0.06) 40%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "glow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800 }}>
          <Reveal delay={0.1}><Badge dark>Sincerity™ for HR</Badge></Reveal>
          <Reveal delay={0.2}>
            <h1 style={{ fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.035em", lineHeight: 1.08, margin: "28px 0 20px", fontFamily: "Poppins,sans-serif" }}>
              Bad Hires Cost{" "}
              <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Time & Money</span>
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 620, margin: "0 auto 16px" }}>
              <strong style={{ color: "#e0f2fe" }}>80%</strong> of candidates admit to misrepresenting their qualifications during interviews, costing companies <strong style={{ color: "#e0f2fe" }}>$15K/year</strong> per bad hire.
            </p>
            <p style={{ fontSize: 17, color: "#cbd5e1", fontWeight: 600 }}>Voicera AI can help HR teams avoid this.</p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue" size="lg">Try Sincerity™ for HR</CTA>
              <CTA href="https://voicera.io/contact-us/" variant="outline" size="lg">Contact Sales</CTA>
            </div>
          </Reveal>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top,#fff,transparent)", pointerEvents: "none" }} />
      </section>

      {/* ═══ SOCIAL PROOF STATS ═════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 32px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>The Cost of Bad Hires</Badge>
              <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>Why HR Teams Need Sincerity™</h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
              <StatCard value="80" suffix="%" label="of candidates misrepresent qualifications during interviews" icon="🎭" />
              <StatCard value="15" prefix="$" suffix="K" label="average annual cost per bad hire to companies" icon="💸" />
              <StatCard value="40" suffix="+" label="average days HR spends trying to fill a position" icon="📅" />
              <StatCard value="25" prefix="$" suffix="K" label="upper range cost per open position to fill" icon="📊" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SINCERITY OPTIMIZES RECRUITING ═════════════════════════════ */}
      <section style={{ background: "#f8fafc", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 500px", minWidth: 320 }}>
            <Reveal><Badge>AI-Powered Recruiting</Badge></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>Sincerity™ Optimizes Recruiting</h2>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2563EB", margin: "0 0 24px" }}>Sincerity™: AI-Powered Candidate Authenticity Analysis</h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 24 }}>
                HR spends an average of <strong>40+ days</strong> and <strong>$5K–$25K</strong> trying to fill a position. Sincerity™ can help your team save time, money, & labor inefficiencies by:
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Bullet>Analyzing verbal and non-verbal inconsistencies that HR might miss</Bullet>
              <Bullet>Providing an alternative to lengthy skills validation assessments</Bullet>
              <Bullet>Accelerating candidate screening by reducing time spent on live interview analysis</Bullet>
              <Bullet>Avoiding costly hiring mistakes by identifying unfit candidates quicker, with 30% greater accuracy than human capability</Bullet>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={{ marginTop: 24 }}>
                <CTA href="https://voicera.io/sincerity/" variant="blue">Try Sincerity™ for HR</CTA>
              </div>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <MediaPlaceholder type="image" label="HR Team Using Sincerity™" badge="Sincerity™ for HR" aspect="3/2" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 3 STEPS ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Badge>How It Works</Badge>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>Smarter Recruiting in 3 Steps</h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Reveal delay={0.1} style={{ flex: "1 1 280px" }}>
              <StepCard num="1" title="Candidates Submit a Video Response" desc="Ask candidates to upload videos answering pre-set interview questions for (optional) AI analysis during initial screening or 2nd round." />
            </Reveal>
            <Reveal delay={0.2} style={{ flex: "1 1 280px" }}>
              <StepCard num="2" title="Analyze with Sincerity™" desc="Voicera's multimodal AI evaluates each candidate's voice tone, facial expressions, & body language to determine sincerity levels when responding to different prompts." />
            </Reveal>
            <Reveal delay={0.3} style={{ flex: "1 1 280px" }}>
              <StepCard num="3" title="Make Confident Hiring Decisions" desc="Leverage insights from AI analysis results to better detect inconsistencies for further inquiry, or to mitigate bias against candidates who may score low in other criteria, but high in sincerity." />
            </Reveal>
          </div>
          <Reveal delay={0.35}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Test Sincerity™ for Free</CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ELIZABETH HOLMES CASE ═══════════════════════════════════════ */}
      <section style={{ background: "#f8fafc", padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>Case Study</Badge>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.025em" }}>See Sincerity™ in Action</h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
              See Sincerity™ in action by watching our analysis of the Elizabeth Holmes case.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.06)" }}>
              <MediaPlaceholder type="video" label="Elizabeth Holmes Case Analysis" badge="Video Demo" aspect="16/9" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ EMOTION COACH SECTION ══════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge>Emotion Intelligence</Badge>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>Voicera Emotion Coach</h2>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2563EB", margin: "0 0 16px" }}>Integrating Emotion Analysis Into HR Training</h3>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
                <strong style={{ color: "#0f172a" }}>1 in 10</strong> people can't identify emotions correctly and almost <strong style={{ color: "#0f172a" }}>50%</strong> of people can't understand emotions behind facial expressions.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <div style={{ flex: "1 1 480px", minWidth: 320 }}>
              <Reveal delay={0.1}>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 24 }}>
                  Voicera's Emotion Coach leverages real-time video analysis to evaluate a wide range of emotions, including happiness, sadness, anger, surprise, fear, neutrality, and disgust.
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>HR teams can use Voicera's Emotion Coach to:</p>
                <Bullet>Train leadership on how to better read and interpret employee's emotions</Bullet>
                <Bullet>Provide skills training workshops on empathetic communications and public speaking</Bullet>
                <Bullet>Better assist neurodivergent hires in their training and onboarding processes</Bullet>
              </Reveal>
            </div>
            <div style={{ flex: "1 1 400px", minWidth: 300 }}>
              <Reveal delay={0.2} dir="left">
                <MediaPlaceholder type="video" label="Emotion Coach Demo" badge="Interactive" aspect="16/10" />
              </Reveal>
            </div>
          </div>

          <div style={{ display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap", flexDirection: "row-reverse" }}>
            <div style={{ flex: "1 1 480px", minWidth: 320 }}>
              <Reveal delay={0.1}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: 16 }}>HOW TO USE VOICERA'S EMOTION COACH AI</p>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 16 }}>Click 'Start' to begin the demo.</p>
                <Bullet>Grant permission for the demo to access the camera on your local device</Bullet>
                <Bullet>Look directly at the camera and deliver your presentation</Bullet>
                <Bullet>Review the results of your video analysis</Bullet>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "24px 0 16px" }}>Emotion Coach AI is privacy-friendly, accurate, and easy to use:</p>
                <Bullet>Data privacy: Facial expressions are analyzed locally, within your browser. Your face and image are not stored or sent to the cloud</Bullet>
                <Bullet>Demographic diversity: The Emotion Coach AI model is trained on diverse datasets, ensuring accuracy across various demographics</Bullet>
                <Bullet>User-friendly: Requires only an internet connection and camera access to function</Bullet>
              </Reveal>
              <Reveal delay={0.25}>
                <div style={{ marginTop: 28 }}>
                  <CTA href="https://voicera.io/emotion-coachme/" variant="blue">Try Emotion Coach for Free</CTA>
                </div>
              </Reveal>
            </div>
            <div style={{ flex: "1 1 400px", minWidth: 300 }}>
              <Reveal delay={0.15} dir="right">
                <MediaPlaceholder type="image" label="Emotion Coach Detection" badge="AI Analysis" aspect="4/3" />
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 56 }}>
              <FeatureCard icon="🔒" title="Privacy-First" desc="Facial expressions are analyzed locally within your browser. Your face and image are never stored or sent to the cloud." />
              <FeatureCard icon="🌍" title="Demographic Diversity" desc="Trained on diverse datasets ensuring accuracy across various demographics and cultural expressions." />
              <FeatureCard icon="⚡" title="User-Friendly" desc="Requires only an internet connection and camera access to function. No downloads or installations needed." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSE CTA ══════════════════════════════════════════════════ */}
      <section style={{ background: "#f8fafc", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 24 }}>
              Start Hiring Smarter Today
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <CTA href="https://sincerity.voicera.io/auth/login" variant="blue" size="lg">Try Sincerity™ for HR</CTA>
          </Reveal>
        </div>
      </section>

      {/* ═══ BOTTOM CTA DARK ════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "110px 32px", background: "#070b14", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}><WireframeMesh darkMode density={22} /></div>
        <Particles count={30} color="rgba(147,197,253,0.2)" />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 28 }}>
              Interested in learning more about how Voicera AI can help HR professionals optimize recruiting?
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
