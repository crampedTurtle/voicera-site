import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import YouTubeCase from "@/components/YouTubeCase";

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
      const mx = (mouse.current.x - 0.5) * 20, my = (mouse.current.y - 0.5) * 14;
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) { const row: { x: number; y: number }[] = []; for (let c = 0; c < cols; c++) { const bx = c * sp, by = r * sp - sp * 2; const wv = Math.sin(c * 0.18 + t * 0.45) * Math.cos(r * 0.13 + t * 0.3) * 16 + Math.sin((c + r) * 0.1 + t * 0.18) * 8; row.push({ x: bx + mx * (r / rows) * 0.09, y: by + wv + my * (c / cols) * 0.06 }); } pts.push(row); }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const p = pts[r][c]; const d = Math.sqrt(Math.pow((p.x / w - 0.5) * 2, 2) + Math.pow((p.y / h - 0.5) * 2, 2));
        const a = Math.max(0, 0.15 - d * 0.065);
        const c1 = `rgba(15,23,42,${a * 0.6})`, c2 = `rgba(37,99,235,${a})`;
        if (c < cols - 1) { const n = pts[r][c + 1]; const g = ctx.createLinearGradient(p.x, p.y, n.x, n.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke(); }
        if (r < rows - 1) { const b = pts[r + 1][c]; const g = ctx.createLinearGradient(p.x, p.y, b.x, b.y); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.strokeStyle = g; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        if (a > 0.04) { ctx.fillStyle = `rgba(148,163,184,${a * 1.6})`; ctx.beginPath(); ctx.arc(p.x, p.y, 0.9, 0, Math.PI * 2); ctx.fill(); }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", hm); };
  }, [density]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

// ─── PARTICLES ──────────────────────────────────────────────────────────────
const Particles = ({ count = 35, color = "rgba(148,163,184,0.2)" }: { count?: number; color?: string }) => {
  const p = useRef(Array.from({ length: count }, () => ({ x: Math.random() * 100, y: Math.random() * 100, sz: 1 + Math.random() * 1.8, dur: 30 + Math.random() * 40, del: Math.random() * -30, op: 0.08 + Math.random() * 0.2 }))).current;
  return (<div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>{p.map((d, i) => (<div key={i} style={{ position: "absolute", left: `${d.x}%`, top: `${d.y}%`, width: d.sz, height: d.sz, borderRadius: "50%", background: color, opacity: d.op, animation: `fp ${d.dur}s ease-in-out ${d.del}s infinite` }} />))}</div>);
};

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const useReveal = (t = 0.12): [React.RefObject<HTMLDivElement>, boolean] => { const ref = useRef<HTMLDivElement>(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: t }); obs.observe(el); return () => obs.disconnect(); }, [t]); return [ref, v]; };
const Reveal = ({ children, delay = 0, dir = "up", style: s }: { children: React.ReactNode; delay?: number; dir?: string; style?: React.CSSProperties }) => { const [ref, v] = useReveal(); const t: Record<string, string> = { up: "translateY(44px)", down: "translateY(-44px)", left: "translateX(44px)", right: "translateX(-44px)" }; return (<div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translate(0)" : t[dir], transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...s }}>{children}</div>); };

// ─── BADGE ──────────────────────────────────────────────────────────────────
const Badge = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <span style={{
    display: "inline-block", padding: "6px 18px", borderRadius: 100,
    fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
    fontFamily: "'Poppins',sans-serif",
    background: dark ? "#0f172a" : "#e0e7ff",
    color: dark ? "#e0f2fe" : "#1e3a5f",
    border: dark ? "1px solid rgba(59,130,246,0.25)" : "1px solid #c7d2fe",
  }}>{children}</span>
);

// ─── CTA ────────────────────────────────────────────────────────────────────
const CTA = ({ children, href = "#", variant = "blue", size = "md" }: { children: React.ReactNode; href?: string; variant?: string; size?: string }) => {
  const [h, setH] = useState(false);
  const pad = size === "lg" ? "16px 36px" : "13px 28px";
  const styles: Record<string, any> = {
    blue: { bg: h ? "linear-gradient(135deg,#1e3a5f,#1d4ed8)" : "linear-gradient(135deg,#1e40af,#2563EB)", color: "#fff", shadow: h ? "0 8px 32px rgba(30,64,175,0.45)" : "0 4px 16px rgba(30,64,175,0.3)", border: "none" },
    white: { bg: h ? "#f1f5f9" : "#fff", color: "#0f172a", shadow: h ? "0 8px 24px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.08)", border: "none" },
    outline: { bg: "transparent", color: h ? "#93c5fd" : "#bfdbfe", shadow: "none", border: "2px solid #60a5fa" },
  };
  const st = styles[variant];
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: pad, borderRadius: 12, fontSize: size === "lg" ? 16 : 14, fontWeight: 700, fontFamily: "'Poppins',sans-serif", textDecoration: "none", background: st.bg, color: st.color, boxShadow: st.shadow, border: st.border, transform: h ? "translateY(-2px)" : "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer" }}
    >{children}<span style={{ fontSize: 16, transform: h ? "translateX(3px)" : "none", transition: "transform 0.3s" }}>→</span></a>
  );
};

// ─── STEP CARD ──────────────────────────────────────────────────────────────
const StepCard = ({ num, title, desc, emoji }: { num: string; title: string; desc: string; emoji: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 280px", background: "#fff", borderRadius: 16, padding: "32px 28px",
      border: "1px solid #e2e8f0", position: "relative", overflow: "hidden",
      boxShadow: h ? "0 20px 48px rgba(30,64,175,0.1)" : "0 2px 12px rgba(0,0,0,0.03)",
      transform: h ? "translateY(-4px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, fontWeight: 900, color: "rgba(30,64,175,0.04)", lineHeight: 1, fontFamily: "'Poppins',sans-serif" }}>{num}</div>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,rgba(30,64,175,0.1),rgba(37,99,235,0.06))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#1e40af", fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}><span style={{ fontSize: 18 }}>{emoji}</span></div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10, lineHeight: 1.3, fontFamily: "'Poppins',sans-serif" }}>{title}</h3>
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
      background: isDark ? "linear-gradient(160deg,#0a1628,#1e293b)" : "linear-gradient(160deg,#eef2ff,#e0e7ff)",
      boxShadow: h ? "0 24px 64px rgba(30,64,175,0.18), 0 0 0 1px rgba(30,64,175,0.08)" : "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
      transform: h ? "scale(1.01)" : "scale(1)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer",
    }}>
      <div style={{ position: "absolute", top: 14, right: 14, padding: "5px 14px", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: "#1e3a5f", color: "#ffffff", zIndex: 2, fontFamily: "'Poppins',sans-serif" }}>{badge}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        {type === "video" ? (
          <>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(30,64,175,0.15)", border: "2px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, backdropFilter: "blur(12px)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.24-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#3b82f6" /></svg>
            </div>
            <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        ) : (
          <>
            <div style={{ width: 76, height: 76, borderRadius: 16, background: "linear-gradient(135deg,rgba(30,64,175,0.08),rgba(59,130,246,0.05))", border: "1px solid rgba(30,64,175,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
            <span style={{ color: "#475569", fontSize: 13, fontWeight: 600 }}>{label}</span>
          </>
        )}
      </div>
    </div>
  );
};

// ─── BULLET ─────────────────────────────────────────────────────────────────
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#1e40af,#3b82f6)", flexShrink: 0, marginTop: 7 }} />
    <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
);

// ─── FEATURE CARD ───────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: "1 1 240px", background: "#fff", borderRadius: 14, padding: "24px 20px", border: "1px solid #e2e8f0",
      boxShadow: h ? "0 12px 36px rgba(30,64,175,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
      transform: h ? "translateY(-3px)" : "none", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "'Poppins',sans-serif" }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export default function SincerityForLegal() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const hf = "'Poppins',sans-serif";

  return (
    <>
      <style>{`
        @keyframes fp{0%,100%{transform:translate(0)}25%{transform:translate(10px,-16px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(14px,-12px)}}
        @keyframes glow{0%,100%{opacity:0.25}50%{opacity:0.4}}
        @keyframes legalFloat{0%,100%{transform:translate(0) rotate(0deg)}25%{transform:translate(8px,-14px) rotate(5deg)}50%{transform:translate(-4px,-24px) rotate(-3deg)}75%{transform:translate(12px,-10px) rotate(4deg)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans','Poppins',sans-serif", color: "#0f172a", overflowX: "hidden" }}>
        <Navbar lightText />
        <StickyNavbar />

        {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060c1a", overflow: "hidden", padding: "120px 32px 100px" }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY * 0.18}px)` }}><WireframeMesh density={30} /></div>
          <Particles count={40} color="rgba(148,163,184,0.22)" />
          <div style={{ position: "absolute", width: "65vw", height: "65vw", maxWidth: 750, maxHeight: 750, borderRadius: "50%", background: "radial-gradient(circle,rgba(30,64,175,0.1) 0%,rgba(15,23,42,0.05) 40%,transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "glow 7s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "8%", opacity: 0.025, fontSize: 220, pointerEvents: "none", lineHeight: 1 }}>⚖️</div>
          {/* Floating emojis */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {["⚖️", "📜", "🏛️", "📝", "⚖️", "📜", "🏛️", "📝"].map((e, i) => (
              <div key={i} style={{ position: "absolute", left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%`, fontSize: 12 + (i % 3) * 4, opacity: 0.04 + (i % 3) * 0.015, animation: `legalFloat ${22 + i * 4}s ease-in-out ${-i * 3}s infinite` }}>{e}</div>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 820 }}>
            <Reveal delay={0.1}><Badge dark>Powering Litigation Intelligence</Badge></Reveal>
            <Reveal delay={0.2}>
              <h1 style={{ fontFamily: hf, fontSize: "clamp(34px,5.5vw,60px)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1.1, margin: "28px 0 24px" }}>
                Embed Credibility Analysis{" "}
                <span style={{ background: "linear-gradient(135deg,#60a5fa,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>into Your Platform</span>
              </h1>
            </Reveal>
            <Reveal delay={0.35}>
              <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, maxWidth: 650, margin: "0 auto 36px" }}>
                Power your legal tech product with AI-driven behavioral analysis — helping your users prepare witnesses, coach attorneys, and improve litigation outcomes with data-backed credibility intelligence. ⚖️
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <CTA href="https://sincerity.voicera.io/auth/signup" variant="blue" size="lg">Get API Access</CTA>
                <CTA href="https://voicera.io/contact-us/" variant="outline" size="lg">Talk to Partnerships</CTA>
              </div>
            </Reveal>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, background: "linear-gradient(to top,#fff,transparent)", pointerEvents: "none" }} />
        </section>

        {/* ═══ SINCERITY OPTIMIZES LITIGATION ═════════════════════════════ */}
        <section style={{ background: "#fff", padding: "100px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 64, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 500px", minWidth: 320 }}>
              <Reveal><Badge>Embedded Intelligence</Badge></Reveal>
              <Reveal delay={0.1}>
                <h2 style={{ fontFamily: hf, fontSize: 34, fontWeight: 800, color: "#0f172a", margin: "20px 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>
                  Power Trial Prep & Deposition Analysis Natively 📜
                </h2>
                <h3 style={{ fontFamily: hf, fontSize: 17, fontWeight: 700, color: "#1e40af", margin: "0 0 24px" }}>
                  Sincerity™: A Data Layer for Legal Tech Platforms
                </h3>
              </Reveal>
              <Reveal delay={0.15}>
                <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 24 }}>
                  Litigation and deposition prep is time-consuming and costly for your customers. Embed Sincerity™ into your platform to equip legal teams with AI-powered credibility analysis — without building the models yourself:
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Bullet>Surface verbal & non-verbal inconsistencies for your users, with 30% greater accuracy than human capability.</Bullet>
                <Bullet>Help your customers accelerate witness and litigation preparation with AI-powered feedback delivered natively in your product.</Bullet>
                <Bullet>Reduce costly mistakes by embedding AI-supported storytelling training — your users test videos and improve their sincerity scores within your platform.</Bullet>
                <Bullet>Equip law schools and training platforms to more reliably coach students on verbal and non-verbal communication before mock trials.</Bullet>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ marginTop: 28 }}>
                  <CTA href="https://voicera.io/sincerity/" variant="blue">Explore the API</CTA>
                </div>
              </Reveal>
            </div>
            <div style={{ flex: "1 1 400px", minWidth: 300 }}>
              <Reveal delay={0.2} dir="left">
                <MediaPlaceholder type="image" label="Sincerity™ Embedded in Your Platform" badge="Native Integration" aspect="3/2" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ 3 STEPS ═══════════════════════════════════════════════════ */}
        <section style={{ background: "#f8fafc", padding: "100px 32px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <Badge>Native Integration</Badge>
                <h2 style={{ fontFamily: hf, fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>
                  Embed Credibility Analysis in 3 Steps
                </h2>
              </div>
            </Reveal>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <Reveal delay={0.1} style={{ flex: "1 1 280px" }}>
                <StepCard num="1" emoji="🔗" title="Connect via API"
                  desc="Integrate the Sincerity™ API into your platform's existing upload or recording pipeline. Your users submit video or audio as usual — our data layer processes it in the background." />
              </Reveal>
              <Reveal delay={0.2} style={{ flex: "1 1 280px" }}>
                <StepCard num="2" emoji="🔍" title="Analyze with Multimodal AI"
                  desc="Voicera's AI evaluates voice tone, facial expressions, and body language to produce a queryable Sincerity™ Score — delivered back to your platform in real time." />
              </Reveal>
              <Reveal delay={0.3} style={{ flex: "1 1 280px" }}>
                <StepCard num="3" emoji="⚖️" title="Surface Insights to Your Users"
                  desc="Deliver credibility scores, inconsistency flags, and coaching feedback natively within your product. Help your users improve trial outcomes and support neurodivergent attorneys or witnesses who may need additional preparation guidance." />
              </Reveal>
            </div>
            <Reveal delay={0.35}>
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <CTA href="https://sincerity.voicera.io/auth/login" variant="blue">Explore the API</CTA>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ ELIZABETH HOLMES CASE ═══════════════════════════════════════ */}
        <section style={{ background: "#fff", padding: "80px 32px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <Badge>Proof of Capability</Badge>
              <h2 style={{ fontFamily: hf, fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "16px 0 16px", letterSpacing: "-0.02em" }}>See Sincerity™ in Action</h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 32px" }}>
                Watch our analysis of the Elizabeth Holmes case — the same credibility intelligence your platform can surface natively to its users.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(30,64,175,0.12), 0 0 0 1px rgba(30,64,175,0.06)" }}>
                <YouTubeCase />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ EMOTION COACH ══════════════════════════════════════════════ */}
        <section style={{ background: "#f8fafc", padding: "100px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <Badge>Emotional Intelligence</Badge>
                <h2 style={{ fontFamily: hf, fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "16px 0 8px", letterSpacing: "-0.025em" }}>Voicera Emotion Coach 🧠</h2>
                <h3 style={{ fontFamily: hf, fontSize: 18, fontWeight: 700, color: "#1e40af", margin: "0 0 16px" }}>Embed Emotion Analysis to Power Litigation Prep</h3>
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
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Equip your platform's users to:</p>
                  <Bullet>Train attorneys to better read and interpret witness emotions — natively within your product</Bullet>
                  <Bullet>Deliver emotion-recognition coaching for witnesses, especially neurodivergent individuals who may need additional support in preparing for testimony.</Bullet>
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
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 16, fontFamily: hf }}>HOW EMOTION COACH WORKS IN YOUR PLATFORM</p>
                  <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, marginBottom: 16 }}>Click 'Start' to begin the demo.</p>
                  <Bullet>Grant permission for the demo to access the camera on your local device</Bullet>
                  <Bullet>Look directly at the camera and deliver your presentation</Bullet>
                  <Bullet>Review the results of your video analysis</Bullet>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "24px 0 16px" }}>Emotion Coach is privacy-friendly, accurate, and built for native integration:</p>
                  <Bullet>Data privacy: Facial expressions are analyzed locally, within the browser. No face or image data is stored or sent to the cloud</Bullet>
                  <Bullet>Demographic diversity: The Emotion Coach AI model is trained on diverse datasets, ensuring accuracy across various demographics</Bullet>
                  <Bullet>Developer-friendly: Requires only an internet connection and camera access — no SDK or downloads needed</Bullet>
                </Reveal>
                <Reveal delay={0.25}>
                  <div style={{ marginTop: 28 }}>
                    <CTA href="https://voicera.io/emotion-coachme/" variant="blue">Try Emotion Coach Demo</CTA>
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
                <FeatureCard icon="🌍" title="Demographic Diversity" desc="Trained on diverse datasets to ensure accuracy across demographics, ethnicities, and cultural expression patterns." />
                <FeatureCard icon="⚡" title="Developer-Friendly" desc="Requires only an internet connection and camera access. No SDK, downloads, or installations needed." />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ CLOSE CTA ══════════════════════════════════════════════════ */}
        <section style={{ background: "#fff", padding: "80px 32px", textAlign: "center" }}>
          <div style={{ maxWidth: 650, margin: "0 auto" }}>
            <Reveal>
              <h2 style={{
                fontFamily: hf, fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2,
                background: "linear-gradient(135deg,#1e40af,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: 24,
              }}>
                Enhance Your Legal Tech Platform with Credibility Intelligence ⚖️
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <CTA href="https://sincerity.voicera.io/auth/login" variant="blue" size="lg">Get API Access</CTA>
            </Reveal>
          </div>
        </section>

        {/* ═══ BOTTOM CTA DARK ════════════════════════════════════════════ */}
        <section style={{ position: "relative", padding: "110px 32px", background: "#060c1a", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0 }}><WireframeMesh density={22} /></div>
          <Particles count={28} color="rgba(148,163,184,0.16)" />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", opacity: 0.02, fontSize: 180, pointerEvents: "none", lineHeight: 1 }}>⚖️</div>
          <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(30,64,175,0.08) 0%,transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto" }}>
            <Reveal>
              <h2 style={{ fontFamily: hf, fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 28 }}>
                Ready to embed credibility intelligence into your legal tech platform? Let's talk integration. 📜
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <CTA href="https://voicera.io/contact-us/" variant="white" size="lg">Talk to Partnerships</CTA>
            </Reveal>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
