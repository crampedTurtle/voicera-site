import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import StickyNavbar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";

// ─── ANIMATED WIREFRAME MESH (Canvas-based 3D) ─────────────────────────────
const WireframeMesh = ({ darkMode = true, density = 30 }: { darkMode?: boolean; density?: number }) => {
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
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = density;
      rows = Math.ceil((h / w) * density) + 4;
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

      const mx = (mouse.current.x - 0.5) * 30;
      const my = (mouse.current.y - 0.5) * 20;

      const points: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacing;
          const baseY = r * spacing - spacing * 2;
          const wave = Math.sin(c * 0.18 + t * 0.7) * Math.cos(r * 0.15 + t * 0.5) * 22;
          const wave2 = Math.sin((c + r) * 0.1 + t * 0.3) * 12;
          const px = baseX + mx * (r / rows) * 0.15;
          const py = baseY + wave + wave2 + my * (c / cols) * 0.1;
          row.push({ x: px, y: py });
        }
        points.push(row);
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          const distFromCenter = Math.sqrt(
            Math.pow((p.x / w - 0.5) * 2, 2) + Math.pow((p.y / h - 0.5) * 2, 2)
          );
          const alpha = Math.max(0, 0.18 - distFromCenter * 0.09);

          if (c < cols - 1) {
            const next = points[r][c + 1];
            const grad = ctx.createLinearGradient(p.x, p.y, next.x, next.y);
            if (darkMode) {
              grad.addColorStop(0, `rgba(37,99,235,${alpha})`);
              grad.addColorStop(1, `rgba(124,58,237,${alpha})`);
            } else {
              grad.addColorStop(0, `rgba(37,99,235,${alpha * 0.5})`);
              grad.addColorStop(1, `rgba(124,58,237,${alpha * 0.5})`);
            }
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
          if (r < rows - 1) {
            const below = points[r + 1][c];
            const grad = ctx.createLinearGradient(p.x, p.y, below.x, below.y);
            if (darkMode) {
              grad.addColorStop(0, `rgba(37,99,235,${alpha})`);
              grad.addColorStop(1, `rgba(124,58,237,${alpha})`);
            } else {
              grad.addColorStop(0, `rgba(37,99,235,${alpha * 0.5})`);
              grad.addColorStop(1, `rgba(124,58,237,${alpha * 0.5})`);
            }
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(below.x, below.y);
            ctx.stroke();
          }

          if (alpha > 0.06) {
            ctx.fillStyle = darkMode
              ? `rgba(147,197,253,${alpha * 1.8})`
              : `rgba(37,99,235,${alpha * 1.2})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [darkMode, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

// ─── FLOATING PARTICLES ─────────────────────────────────────────────────────
const Particles = ({ count = 50, color = "rgba(147,197,253,0.35)" }: { count?: number; color?: string }) => {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 25 + Math.random() * 40,
      delay: Math.random() * -40,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: p.opacity,
            animation: `labsFloatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ─── SCROLL REVEAL HOOK ─────────────────────────────────────────────────────
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
};

const Reveal = ({ children, delay = 0, direction = "up", style: extraStyle }: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  style?: CSSProperties;
}) => {
  const [ref, visible] = useReveal(0.12);
  const transforms: Record<string, string> = {
    up: "translateY(48px)",
    down: "translateY(-48px)",
    left: "translateX(48px)",
    right: "translateX(-48px)",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : transforms[direction],
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
};

// ─── PILL BADGE ─────────────────────────────────────────────────────────────
const LabsBadge = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <span
    className="inline-block rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
    style={{
      padding: "5px 16px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: dark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.08)",
      color: "#2563EB",
      border: dark ? "1px solid rgba(37,99,235,0.25)" : "1px solid rgba(37,99,235,0.12)",
    }}
  >
    {children}
  </span>
);

// ─── CTA BUTTON ─────────────────────────────────────────────────────────────
const CTAButton = ({ children, href = "#", variant = "blue" }: { children: ReactNode; href?: string; variant?: "blue" | "pink" | "white" }) => {
  const [hovered, setHovered] = useState(false);
  const styles = {
    blue: {
      background: hovered ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#2563EB,#3b82f6)",
      color: "#fff",
      shadow: hovered ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)",
    },
    pink: {
      background: hovered ? "linear-gradient(135deg,#1e40af,#3b82f6)" : "linear-gradient(135deg,#2563EB,#60a5fa)",
      color: "#fff",
      shadow: hovered ? "0 8px 32px rgba(37,99,235,0.4)" : "0 4px 16px rgba(37,99,235,0.25)",
    },
    white: {
      background: hovered ? "#f1f5f9" : "#ffffff",
      color: "#0f172a",
      shadow: hovered ? "0 8px 32px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.1)",
    },
  };
  const s = styles[variant];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 rounded-xl text-[15px] font-bold cursor-pointer no-underline border-none"
      style={{
        padding: "14px 32px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: s.background,
        color: s.color,
        boxShadow: s.shadow,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
      <span className="text-lg" style={{ transition: "transform 0.3s", transform: hovered ? "translateX(3px)" : "none" }}>→</span>
    </a>
  );
};

// ─── MEDIA PLACEHOLDER ──────────────────────────────────────────────────────
const MediaPlaceholder = ({ type = "video", label, badgeText = "Live Demo" }: { type?: "video" | "image" | "chat"; label?: string; badgeText?: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
      style={{
        aspectRatio: type === "chat" ? "4/5" : "16/10",
        background: type === "chat"
          ? "linear-gradient(160deg,#f8fafc,#e2e8f0)"
          : "linear-gradient(160deg,#0f172a,#1e293b)",
        boxShadow: hovered
          ? "0 24px 64px rgba(37,99,235,0.2), 0 0 0 1px rgba(37,99,235,0.1)"
          : "0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        transform: hovered ? "scale(1.015)" : "scale(1)",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="absolute top-4 right-4 py-[5px] px-[14px] rounded-full text-[10px] font-bold tracking-[0.08em] uppercase z-[2]"
        style={{ background: "rgba(37,99,235,0.9)", color: "#fff" }}>
        {badgeText}
      </div>

      <div className="absolute inset-0 z-[1]"
        style={{
          background: type === "chat" ? "none" : "radial-gradient(ellipse at 30% 40%, rgba(37,99,235,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-[2]">
        {type === "video" && (
          <>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(37,99,235,0.15)", border: "2px solid rgba(37,99,235,0.3)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M8 5.14v13.72a1 1 0 001.5.86l11.24-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="#2563EB" />
              </svg>
            </div>
            <span className="text-[#94a3b8] text-[13px] font-semibold tracking-[0.03em]">{label}</span>
          </>
        )}
        {type === "image" && (
          <>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))", border: "2px solid rgba(37,99,235,0.2)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
            </div>
            <span className="text-[#94a3b8] text-[13px] font-semibold">{label}</span>
          </>
        )}
        {type === "chat" && (
          <div className="p-6 w-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex flex-col gap-3">
              {[
                { align: "flex-end" as const, bg: "#2563EB", color: "#fff", text: "What are our top customer issues this week?" },
                { align: "flex-start" as const, bg: "#fff", color: "#0f172a", text: "Based on 847 support tickets, the top 3 issues are: integration sync failures (23%), billing discrepancies (18%), and onboarding friction (14%)." },
                { align: "flex-end" as const, bg: "#2563EB", color: "#fff", text: "Which integrations are failing most?" },
              ].map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.align }}>
                  <div className="max-w-[80%] rounded-[14px] text-[13px] leading-[1.55]"
                    style={{ padding: "12px 16px", background: msg.bg, color: msg.color, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1.5 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" style={{ animation: "labsPulse 1.5s ease-in-out infinite" }} />
                <span className="text-xs text-[#94a3b8]">Voicera is analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <svg className="absolute top-0 left-0 w-[60px] h-[60px] opacity-15 z-[1]" viewBox="0 0 60 60">
        <path d="M0 0 L60 0 L0 60 Z" fill={type === "chat" ? "#2563EB" : "#3b82f6"} />
      </svg>
    </div>
  );
};

// ─── STEP LIST ──────────────────────────────────────────────────────────────
const StepList = ({ steps }: { steps: string[] }) => (
  <div className="flex flex-col gap-4">
    {steps.map((step, i) => (
      <div key={i} className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[13px] font-extrabold text-[#2563EB] flex-shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.08))", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {i + 1}
        </div>
        <p className="text-[15px] text-[#475569] leading-[1.65] m-0 pt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {step}
        </p>
      </div>
    ))}
  </div>
);

// ─── FEATURE BULLET ─────────────────────────────────────────────────────────
const FeatureBullet = ({ text }: { text: string }) => (
  <div className="flex gap-3.5 items-start mb-4">
    <div className="w-[22px] h-[22px] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <p className="text-[15px] text-[#475569] leading-[1.65] m-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{text}</p>
  </div>
);

// ─── DEMO SECTION ───────────────────────────────────────────────────────────
interface DemoSectionProps {
  badge: string;
  title: string;
  about: ReactNode;
  bullets?: string[];
  extraContent?: ReactNode;
  instructions: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant?: "blue" | "pink" | "white";
  mediaType: "video" | "image" | "chat";
  mediaLabel?: string;
  mediaBadge?: string;
  reversed?: boolean;
  bgColor?: string;
}

const DemoSection = ({ badge, title, about, bullets, extraContent, instructions, ctaLabel, ctaHref, ctaVariant = "blue", mediaType, mediaLabel, mediaBadge, reversed, bgColor = "#fff" }: DemoSectionProps) => (
  <section style={{ background: bgColor, padding: "100px 0", position: "relative" }}>
    <div
      className={`max-w-[1200px] mx-auto px-8 flex ${reversed ? "flex-row-reverse" : "flex-row"} gap-16 items-center flex-wrap`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex-[1_1_480px] min-w-[320px]">
        <Reveal delay={0}>
          <LabsBadge>{badge}</LabsBadge>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-[38px] font-extrabold text-[#0f172a] mt-5 mb-3 tracking-[-0.025em] leading-[1.15]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mb-5">
            ABOUT THIS DEMO
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="text-[15px] text-[#475569] leading-[1.75] mb-6">
            {about}
          </div>
        </Reveal>
        {bullets && (
          <Reveal delay={0.25}>
            <div className="mb-6">
              {bullets.map((b, i) => (
                <FeatureBullet key={i} text={b} />
              ))}
            </div>
          </Reveal>
        )}
        {extraContent && (
          <Reveal delay={0.3}>
            <div className="text-[15px] text-[#475569] leading-[1.75] mb-7">
              {extraContent}
            </div>
          </Reveal>
        )}
        <Reveal delay={0.35}>
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mt-8 mb-4">
            INSTRUCTIONS
          </p>
          <StepList steps={instructions} />
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-8">
            <CTAButton href={ctaHref} variant={ctaVariant}>
              {ctaLabel}
            </CTAButton>
          </div>
        </Reveal>
      </div>

      <div className="flex-[1_1_420px] min-w-[300px]">
        <Reveal delay={0.2} direction={reversed ? "right" : "left"}>
          <MediaPlaceholder type={mediaType} label={mediaLabel} badgeText={mediaBadge} />
        </Reveal>
      </div>
    </div>
  </section>
);

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function VoiceraLabs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <>
      <Helmet>
        <title>Voicera Labs – Explore AI Innovations | Voicera</title>
        <meta name="description" content="Explore Voicera's latest AI models and capabilities in interactive demos. Try Sincerity AI, Emotion Coach, and Voicera Insights." />
      </Helmet>

      <style>{`
        @keyframes labsFloatParticle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(12px, -18px); }
          50% { transform: translate(-8px, -32px); }
          75% { transform: translate(16px, -14px); }
        }
        @keyframes labsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes labsHeroGlow {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.55; }
        }
        @media (max-width: 768px) {
          .labs-hero-heading { font-size: 36px !important; }
        }
      `}</style>

      <StickyNavbar />

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0f172a", overflowX: "hidden" }}>

        {/* ══════ HERO SECTION ══════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#070b14" }}>
          <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.25}px)` }}>
            <WireframeMesh darkMode density={32} />
          </div>
          <Particles count={60} color="rgba(147,197,253,0.3)" />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "80vw", height: "80vw", maxWidth: 900, maxHeight: 900,
              background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              animation: "labsHeroGlow 6s ease-in-out infinite",
            }}
          />
          <div className="relative z-10 text-center max-w-[760px] px-8">
            <Reveal delay={0.1}>
              <LabsBadge dark>Voicera Labs</LabsBadge>
            </Reveal>
            <Reveal delay={0.25}>
              <h1
                className="labs-hero-heading font-extrabold text-[#f1f5f9] tracking-[-0.035em] leading-[1.1] mt-7 mb-6"
                style={{ fontSize: 58 }}
              >
                Explore our innovations
                <br />
                <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  in AI
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-lg text-[#94a3b8] leading-[1.7] max-w-[600px] mx-auto">
                Welcome to our lab, where we showcase our latest AI models and capabilities in easy-to-use demos. Each of these AI models is an integral part of Voicera's technology platform.
              </p>
            </Reveal>
            <Reveal delay={0.55}>
              <div className="mt-10 flex justify-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ animation: "labsFloatParticle 3s ease-in-out infinite", opacity: 0.5 }}>
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Reveal>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none" style={{ background: "linear-gradient(to top, #ffffff, transparent)" }} />
        </section>

        {/* ══════ SINCERITY AI ══════ */}
        <DemoSection
          badge="Sincerity AI"
          title="Voicera Sincerity AI"
          about={
            <>
              <p className="mb-4">
                Voicera's Sincerity AI demonstrates the power of Voicera's technology to detect truth, trust, and sincerity or untruthfulness, in digital interactions.
              </p>
              <p>
                Sincerity AI processes video and audio data using a multi-model approach for granular and comprehensive analysis through cutting-edge AI:
              </p>
            </>
          }
          bullets={[
            "Audio & Acoustic Centric's speech — voice and linguistic cues, analyzing tones and inflections.",
            "Visual Analysis: Examines facial expressions and physical cues from video frames, ensuring detailed visual assessment.",
            "Integrated Assessment: Combines insights from both modalities to provide a robust analysis of each interaction segment.",
          ]}
          extraContent="Voicera's Sincerity AI categorizes analysis results into three truthfulness categories: Likely True, Partially True, and Likely False, classified in real-time with high probability thresholds. The model's predictions are based on the current patterns from the training data and are probabilistic in nature."
          instructions={[
            "Create an account with your email address.",
            "Upload the video of your choice for analysis.",
            "Allow 10–30 minutes for video processing to occur; you will receive an email when processing is complete.",
            "Review the results of your video analysis.",
          ]}
          ctaLabel="Try Voicera Sincerity"
          ctaHref="https://sincerity.voicera.io"
          ctaVariant="pink"
          mediaType="video"
          mediaLabel="Sincerity AI Demo Video"
          mediaBadge="Live Demo"
          reversed={false}
          bgColor="#ffffff"
        />

        {/* ══════ EMOTION COACH ══════ */}
        <DemoSection
          badge="Emotion Coach"
          title="Voicera Emotion Coach"
          about={
            <>
              <p className="mb-4">
                Voicera Emotion Coach leverages real-time video analysis to evaluate a wide range of emotions, including happiness, sadness, anger, surprise, fear, neutrality, and disgust.
              </p>
              <p className="mb-4">
                As users interact with the system, the Emotion Coach AI continuously assesses facial expressions and emotional cues, providing both instant feedback and summary statistics for each session. Suitable for a range of uses, from public speaking to emotional readiness, coaching in therapeutic settings, Emotion Coach helps individuals measure their emotional responsiveness and interpersonal connections.
              </p>
              <p>
                Emotion Coach AI was designed from the core to be privacy-first in its coding and simple to use.
              </p>
            </>
          }
          bullets={[
            "Data privacy: Facial expressions are analyzed locally within your browser. Your face and image are not stored or sent to the cloud.",
            "Demographic diversity: The Emotion Coach AI model is trained on diverse datasets, ensuring accuracy across various demographics.",
            "User-friendly: Requires only an internet connection and camera access to function.",
          ]}
          instructions={[
            "Click 'Start' to begin the demo.",
            "Grant permission for the demo to access the camera on your local device.",
            "Look directly at the camera and deliver your presentation.",
            "Review the results of your video analysis.",
          ]}
          ctaLabel="Try Voicera Emotion Coach"
          ctaHref="https://emotioncoach.voicera.io"
          ctaVariant="pink"
          mediaType="image"
          mediaLabel="Emotion Coach Demo"
          mediaBadge="Live Demo"
          reversed={true}
          bgColor="#f8fafc"
        />

        {/* ══════ INSIGHTS ══════ */}
        <section style={{ background: "#fff", padding: "100px 0", position: "relative" }}>
          <div className="max-w-[1200px] mx-auto px-8 flex gap-16 items-center flex-wrap" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div className="flex-[1_1_480px] min-w-[320px]">
              <Reveal><LabsBadge>Insights</LabsBadge></Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-[38px] font-extrabold text-[#0f172a] mt-5 mb-3 tracking-[-0.025em] leading-[1.15]">
                  Voicera Insights
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mb-5">
                  ABOUT THIS DEMO
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="text-[15px] text-[#475569] leading-[1.75] mb-6">
                  <p className="mb-4">Voicera AI delivers prioritized issues and requests by installing a miniature data at-a-lens to facilitate effective prioritization and observation.</p>
                  <p className="mb-4">This demo is trained on data from a fictional company, PMCo. PMCo makes project management software.</p>
                  <p className="mb-4">Voicera AI delivers insights from PMCo's unstructured data like emails, chat transcripts, call transcripts and more.</p>
                  <p>Like the Voicera experience? Request to be a beta tester now by joining the waitlist for Voicera Visions. We are going to try the product and have access to new releases before everyone else.</p>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mt-8 mb-4">
                  INSTRUCTIONS
                </p>
                <StepList
                  steps={[
                    "Create a login with your email address.",
                    "Ask questions to better understand customer profiles and issues in the data set.",
                  ]}
                />
                <div className="mt-5 p-5 rounded-xl" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <p className="text-[13px] font-bold text-[#64748b] mb-3 tracking-[0.03em]">Suggested questions include:</p>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                    {[
                      "What are users' favorite features, and how can we improve those features to further improve user experience?",
                      "What specific integrations are missing? Which integrations would significantly improve customer workflow?",
                      "What are the most common reasons for our customers to consider a switch to other project management tools?",
                    ].map((q, i) => (
                      <li key={i} className="text-sm text-[#475569] leading-[1.6] pl-5 relative">
                        <span className="absolute left-0 text-[#2563EB] font-bold">•</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="mt-8">
                  <CTAButton href="#" variant="blue">Join the beta</CTAButton>
                </div>
              </Reveal>
            </div>
            <div className="flex-[1_1_420px] min-w-[300px]">
              <Reveal delay={0.2} direction="left">
                <MediaPlaceholder type="chat" label="Voicera Insights" badgeText="Beta" />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════ BOTTOM CTA ══════ */}
        <section className="relative overflow-hidden text-center" style={{ padding: "120px 32px", background: "#070b14" }}>
          <div className="absolute inset-0">
            <WireframeMesh darkMode density={24} />
          </div>
          <Particles count={35} color="rgba(147,197,253,0.25)" />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "60vw", height: "60vw", maxWidth: 700, maxHeight: 700,
              background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 60%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            }}
          />
          <div className="relative z-10 max-w-[700px] mx-auto">
            <Reveal>
              <h2 className="text-[36px] font-extrabold text-[#f1f5f9] leading-[1.2] tracking-[-0.025em] mb-8">
                Interested in using multimodal AI with emotional intelligence for your business?{" "}
                <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Get in touch.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <CTAButton href="/contact" variant="white">Contact Us</CTAButton>
            </Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
