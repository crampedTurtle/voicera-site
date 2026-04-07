import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import JsonLd from "@/components/JsonLd";

// ─── WIREFRAME MESH ─────────────────────────────────────────────────────────
const WireframeMesh = ({ density = 28 }: { density?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
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
    resize(); window.addEventListener("resize", resize);
    const hm = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.current.x = (e.clientX - r.left) / r.width; mouse.current.y = (e.clientY - r.top) / r.height; };
    window.addEventListener("mousemove", hm);
    const draw = (time: number) => {
      const t = time * 0.001; ctx.clearRect(0, 0, w, h);
      const mx = (mouse.current.x - 0.5) * 22, my = (mouse.current.y - 0.5) * 16;
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) { const row: { x: number; y: number }[] = []; for (let c = 0; c < cols; c++) { const bx = c * sp, by = r * sp - sp * 2; const wv = Math.sin(c * 0.2 + t * 0.5) * Math.cos(r * 0.14 + t * 0.35) * 18 + Math.sin((c + r) * 0.11 + t * 0.2) * 9; row.push({ x: bx + mx * (r / rows) * 0.1, y: by + wv + my * (c / cols) * 0.07 }); } pts.push(row); }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const p = pts[r][c]; const d = Math.sqrt(Math.pow((p.x / w - 0.5) * 2, 2) + Math.pow((p.y / h - 0.5) * 2, 2));
        const a = Math.max(0, 0.16 - d * 0.07);
        const c1 = `rgba(219,39,119,${a * 0.7})`, c2 = `rgba(59,130,246,${a})`;
        if (c < cols - 1) { const n = pts[r][c + 1]; const g = ctx.createLinearGradient(p.x, p.y, n.x, n.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke(); }
        if (r < rows - 1) { const b = pts[r + 1][c]; const g = ctx.createLinearGradient(p.x, p.y, b.x, b.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        if (a > 0.04) { ctx.fillStyle = `rgba(191,219,254,${a * 1.8})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2); ctx.fill(); }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", hm); };
  }, [density]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

// ─── FLOATING HEARTS ────────────────────────────────────────────────────────
const FloatingHearts = ({ count = 12 }: { count?: number }) => {
  const hearts = useRef(Array.from({ length: count }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: 10 + Math.random() * 14, dur: 20 + Math.random() * 30,
    del: Math.random() * -20, op: 0.04 + Math.random() * 0.06,
    emoji: ["💙", "💜", "🩵"][Math.floor(Math.random() * 3)],
  }))).current;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {hearts.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, fontSize: h.size, opacity: h.op, animation: `fh ${h.dur}s ease-in-out ${h.del}s infinite` }}>{h.emoji}</div>
      ))}
    </div>
  );
};

// ─── PARTICLES ──────────────────────────────────────────────────────────────
const Particles = ({ count = 35, color = "rgba(191,219,254,0.25)" }: { count?: number; color?: string }) => {
  const p = useRef(Array.from({ length: count }, () => ({ x: Math.random() * 100, y: Math.random() * 100, sz: 1.2 + Math.random() * 2, dur: 28 + Math.random() * 38, del: Math.random() * -30, op: 0.1 + Math.random() * 0.22 }))).current;
  return (<div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{p.map((d, i) => (<div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.sz, height: d.sz, borderRadius: "50%", background: color, opacity: d.op, animation: `fp ${d.dur}s ease-in-out ${d.del}s infinite` }} />))}</div>);
};

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const useReveal = (t = 0.12): [React.RefObject<HTMLDivElement>, boolean] => { const ref = useRef<HTMLDivElement>(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t }); obs.observe(el); return () => obs.disconnect(); }, [t]); return [ref, v]; };
const Reveal = ({ children, delay = 0, dir = "up", style: s }: { children: React.ReactNode; delay?: number; dir?: string; style?: React.CSSProperties }) => { const [ref, v] = useReveal(); const t: Record<string, string> = { up: "translateY(44px)", down: "translateY(-44px)", left: "translateX(44px)", right: "translateX(-44px)" }; return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translate(0)" : t[dir], transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...s }}>{children}</div>); };

// ─── COUNTER ────────────────────────────────────────────────────────────────
const Counter = ({ value, prefix = "", suffix = "", duration = 1600 }: { value: string | number; prefix?: string; suffix?: string; duration?: number }) => {
  const [display, setDisplay] = useState(0); const [ref, visible] = useReveal(0.3); const num = parseInt(String(value));
  useEffect(() => { if (!visible) return; let start = 0; const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * num)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }, [visible, num, duration]);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

// ─── BADGE ──────────────────────────────────────────────────────────────────
const Badge = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span role="text" style={{
    display: "inline-block", padding: "6px 18px", borderRadius: 100,
    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const,
    fontFamily: "Poppins,sans-serif",
    background: dark ? "#1e1b4b" : "#dbeafe",
    color: dark ? "#e0f2fe" : "#1e3a5f",
    border: dark ? "1px solid rgba(139,92,246,0.3)" : "1px solid #bfdbfe",
  }}>{children}</span>
);

// ─── CTA ────────────────────────────────────────────────────────────────────
const CTA = ({ children, href = "#", variant = "blue", size = "md" }: { children: React.ReactNode; href?: string; variant?: string; size?: string }) => {
  const [h, setH] = useState(false);
  const pad = size === "lg" ? "16px 36px" : "13px 28px";
  const styles: Record<string, { bg: string; color: string; shadow: string; border: string }> = {
    blue: { bg: h ? "linear-gradient(135deg,#1e40af,#7c3aed)" : "linear-gradient(135deg,#2563EB,#8b5cf6)", color: "#fff", shadow: h ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)", border: "none" },
    rose: { bg: h ? "linear-gradient(135deg,#be185d,#7c3aed)" : "linear-gradient(135deg,#db2777,#8b5cf6)", color: "#fff", shadow: h ? "0 8px 32px rgba(219,39,119,0.4)" : "0 4px 16px rgba(219,39,119,0.25)", border: "none" },
    white: { bg: h ? "#f1f5f9" : "#fff", color: "#0f172a", shadow: h ? "0 8px 24px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)", border: "none" },
    outline: { bg: "transparent", color: h ? "#c4b5fd" : "#ddd6fe", shadow: "none", border: "2px solid rgba(139,92,246,0.6)" },
  };
  const st = styles[variant];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: pad, borderRadius: 12, fontSize: size === "lg" ? 16 : 14, fontWeight: 700, fontFamily: "Poppins,sans-serif", textDecoration: "none", background: st.bg, color: st.color, boxShadow: st.shadow, border: st.border, transform: h ? "translateY(-2px)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer" }}
    >{children}<span style={{ fontSize: 16, transform: h ? "translateX(3px)" : "none", transition: "transform 0.3s" }}>→</span></a>
  );
};

// ─── STAT CARD ──────────────────────────────────────────────────────────────
const StatCard = ({ value, prefix = "", suffix = "", label, emoji }: { value: string | number; prefix?: string; suffix?: string; label: string; emoji: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #ede9fe", textAlign: "center",
      boxShadow: h ? "0 16px 48px rgba(139,92,246,0.1)" : "0 4px 16px rgba(0,0,0,0.03)",
      transform: h ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "Poppins,sans-serif", background: "linear-gradient(135deg,#2563EB,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginTop: 8 }}>{label}</div>
    </div>
  );
};

// ─── STEP CARD ──────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, emoji }: { num: string; title: string; desc: string; emoji: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: "32px 28px",
      border: "1px solid #ede9fe", position: "relative", overflow: "hidden",
      boxShadow: h ? "0 20px 48px rgba(139,92,246,0.1)" : "0 2px 12px rgba(0,0,0,0.03)",
      transform: h ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, fontWeight: 900, color: "rgba(139,92,246,0.04)", lineHeight: 1, fontFamily: "Poppins,sans-serif" }}>{num}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(139,92,246,0.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#2563EB", fontFamily: "Poppins,sans-serif" }}>{num}</div>
        <span style={{ fontSize: 18 }}>{emoji}</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.3, fontFamily: "Poppins,sans-serif" }}>{title}</h3>
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
      background: isDark ? "linear-gradient(160deg,#0f0a2e,#1e1b4b)" : "linear-gradient(160deg,#f5f3ff,#dbeafe)",
      boxShadow: h ? "0 24px 64px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.08)" : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
      transform: h ? "scale(1.01)" : "scale(1)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer",
    }}>
      <div style={{ position: "absolute", top: 14, right: 14, padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, background: "#4c1d95", color: "#ffffff", zIndex: 2, fontFamily: "Poppins,sans-serif" }}>{badge}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        {type === "video" ? (
          <>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(139,92,246,0.15)", border: "2px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, backdropFilter: "blur(12px)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.24-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#8b5cf6" /></svg>
            </div>
            <span style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        ) : (
          <>
            <div style={{ width: 76, height: 76, borderRadius: 16, background: "linear-gradient(135deg,rgba(139,92,246,0.08),rgba(37,99,235,0.06))", border: "1px solid rgba(139,92,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
            <span style={{ color: "#6366f1", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        )}
      </div>
    </div>
  );
};

// ─── BULLET ─────────────────────────────────────────────────────────────────
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#8b5cf6)", flexShrink: 0, marginTop: 7 }} />
    <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
);

// ─── FEATURE CARD ───────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 240px", background: "#fff", borderRadius: 14, padding: "24px 20px", border: "1px solid #ede9fe",
      boxShadow: h ? "0 12px 36px rgba(139,92,246,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
      transform: h ? "translateY(-3px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "Poppins,sans-serif" }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export default function SincerityForDating() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const hf = "Poppins,sans-serif";

  return (
    <div style={{ fontFamily: "Poppins,sans-serif", color: "#0f172a", overflowX: "hidden" }}>
      <Helmet>
        <title>Sincerity™ for Dating Platforms — Voicera</title>
        <meta name="description" content="Embed AI-powered sincerity and emotion analysis into your dating app, matchmaking service, or relationship platform. Protect your users from catfishing and power authentic connections." />
      </Helmet>
      <JsonLd
        title="Sincerity™ for Dating Platforms — Voicera"
        description="Embed AI-powered sincerity analysis into dating platforms."
        path="/solutions/dating"
      />
      <style>{`
        @keyframes fp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes fh{0%,100%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(8px,-20px) rotate(5deg)}50%{transform:translate(-5px,-35px) rotate(-3deg)}75%{transform:translate(12px,-15px) rotate(4deg)}}
        @keyframes glow{0%,100%{opacity:0.3}50%{opacity:0.5}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <Navbar lightText />
      <StickyNavbar />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0520", overflow: "hidden", padding: "120px 32px 100px" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY * 0.2}px)` }}><WireframeMesh density={28} /></div>
        <Particles count={40} color="rgba(167,139,250,0.2)" />
        <FloatingHearts count={10} />
        <div style={{ position: "absolute", width: "70vw", height: "70vw", maxWidth: 800, maxHeight: 800, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,rgba(219,39,119,0.05) 40%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "glow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 820 }}>
          <Reveal delay={0.1}><Badge dark>Powering Authentic Connection</Badge></Reveal>
          <Reveal delay={0.2}>
            <h1 style={{ fontFamily: hf, fontSize: "clamp(32px,5.2vw,56px)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "28px 0 24px" }}>
              Catfishing & Misrepresentation Are Costing{" "}
              <span style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Users</span>
              {" "}<span style={{ fontSize: "0.6em", verticalAlign: "middle" }}>💔</span>
            </h1>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ fontSize: 18, color: "#a5b4fc", lineHeight: 1.7, maxWidth: 640, margin: "0 auto 12px" }}>
              <strong style={{ color: "#e0e7ff" }}>53%</strong> of people admit to misrepresenting themselves on dating profiles, leading to wasted time, churn, and trust & safety incidents on your platform.
            </p>
            <p style={{ fontSize: 17, color: "#c4b5fd", fontWeight: 600 }}>Embed the credibility layer that protects your users and powers authenticity. 💙</p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
              <CTA href="https://sincerity.voicera.io/auth/signup" variant="rose" size="lg">Get API Access</CTA>
              <CTA href="https://voicera.io/contact-us/" variant="outline" size="lg">Talk to Partnerships</CTA>
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
              <Badge>The Problem</Badge>
              <h2 style={{ fontFamily: hf, fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "16px 0 12px", letterSpacing: "-0.025em" }}>Why Online Dating Needs Sincerity™ 💔</h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
              <StatCard value="53" suffix="%" label="of people misrepresent themselves on dating profiles" emoji="💔" />
              <StatCard value="33" suffix="%" label="of online daters have been misled by profile photos or descriptions" emoji="😔" />
              <StatCard value="6" suffix="+" label="hours per week chatting before meeting — often with mismatched expectations" emoji="⏰" />
              <StatCard value="40" suffix="%" label="of users wish they could verify sincerity before meeting" emoji="💙" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SINCERITY POWERS REAL RELATIONSHIPS ════════════════════════ */}
      <section style={{ background: "#faf5ff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 500px", minWidth: 320 }}>
            <Reveal><Badge>Authentic Connections</Badge></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{ fontFamily: hf, fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>Sincerity™ Powers Real Relationships 💙</h2>
              <h3 style={{ fontFamily: hf, fontSize: 17, fontWeight: 700, color: "#7c3aed", margin: "0 0 24px" }}>Sincerity™: AI-Powered Emotion and Sincerity Analysis for Smarter Matching</h3>
            </Reveal>
            <Reveal delay={0.2}>
              <Bullet><strong>1 in 3</strong> online daters have experienced being misled by profile photos or descriptions.</Bullet>
              <Bullet>The average user spends <strong>6+ hours/week</strong> chatting before meeting in person—often with mismatched expectations.</Bullet>
              <Bullet>Over <strong>40%</strong> of users say they wish there was a better way to verify sincerity and emotional compatibility before meeting.</Bullet>
            </Reveal>
            <Reveal delay={0.3}>
              <div style={{ marginTop: 28 }}>
                <CTA href="https://voicera.io/sincerity/" variant="rose">Try Sincerity™ for Dating</CTA>
              </div>
            </Reveal>
          </div>
          <div style={{ flex: "1 1 400px", minWidth: 300 }}>
            <Reveal delay={0.2} dir="left">
              <MediaPlaceholder type="image" label="Dating Profile Verification" badge="Sincerity™" aspect="3/2" />
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
              <h2 style={{ fontFamily: hf, fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>Smarter Matching in 3 Steps</h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Reveal delay={0.1} style={{ flex: "1 1 280px" }}>
              <StepCard num="1" emoji="🎥" title="Users Submit a Video Introduction" desc="Encourage users to upload a short video answering fun or meaningful prompts—optionally analyzed by AI for sincerity and emotional cues." />
            </Reveal>
            <Reveal delay={0.2} style={{ flex: "1 1 280px" }}>
              <StepCard num="2" emoji="🔍" title="Analyze with Sincerity™" desc="Voicera's multimodal AI evaluates voice tone, facial expressions, and body language to help determine sincerity and authentic emotional reactions." />
            </Reveal>
            <Reveal delay={0.3} style={{ flex: "1 1 280px" }}>
              <StepCard num="3" emoji="💙" title="Make Confident Connections" desc="Leverage AI insights to highlight genuine profiles, flag inconsistencies, and help users connect with people who are truly interested and emotionally compatible." />
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
      <section style={{ background: "#faf5ff", padding: "80px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Badge>Case Study</Badge>
            <h2 style={{ fontFamily: hf, fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.02em" }}>See Sincerity™ in Action</h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
              See Sincerity™ in action by watching our analysis of the Elizabeth Holmes case.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(139,92,246,0.12), 0 0 0 1px rgba(139,92,246,0.06)" }}>
              <MediaPlaceholder type="video" label="Elizabeth Holmes Analysis" badge="Video Demo" aspect="16/9" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ EMOTION COACH ══════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Badge>Emotional Intelligence</Badge>
              <h2 style={{ fontFamily: hf, fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>Voicera Emotion Coach 💜</h2>
              <h3 style={{ fontFamily: hf, fontSize: 18, fontWeight: 700, color: "#7c3aed", margin: "0 0 16px" }}>Integrating Emotion Analysis to Foster Better Connection</h3>
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
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Emotional Intelligence is Crucial: 💙</p>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 20 }}>
                  Studies show that couples with high emotional understanding are <strong>2x more likely</strong> to form lasting relationships. Emotionally intelligent interactions can increase user satisfaction and the likelihood of forming genuine connections.
                </p>
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
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: 16, fontFamily: hf }}>HOW TO USE VOICERA'S EMOTION ANALYSIS AI</p>
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
                <MediaPlaceholder type="image" label="Emotion Detection Analysis" badge="AI Analysis" aspect="4/3" />
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 56 }}>
              <FeatureCard icon="🔒" title="Privacy-First" desc="Facial expressions are analyzed locally within your browser. Images are never stored or transmitted to the cloud." />
              <FeatureCard icon="🌍" title="Demographic Diversity" desc="Trained on diverse datasets to ensure accuracy across demographics and cultural expression patterns." />
              <FeatureCard icon="⚡" title="User-Friendly" desc="Requires only an internet connection and camera access. No downloads or installations needed." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CLOSE CTA ══════════════════════════════════════════════════ */}
      <section style={{ background: "#faf5ff", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: hf, fontSize: 34, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, background: "linear-gradient(135deg,#2563EB,#8b5cf6,#db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 24 }}>
              Start Making Safer, More Genuine Connections Today 💙
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <CTA href="https://sincerity.voicera.io/auth/login" variant="rose" size="lg">Try Sincerity™ for Dating</CTA>
          </Reveal>
        </div>
      </section>

      {/* ═══ BOTTOM CTA DARK ════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "110px 32px", background: "#0a0520", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}><WireframeMesh density={22} /></div>
        <Particles count={25} color="rgba(167,139,250,0.18)" />
        <FloatingHearts count={6} />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontFamily: hf, fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 28 }}>
              Interested in learning how Voicera AI can help dating platforms ensure authentic connections? 💜
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
