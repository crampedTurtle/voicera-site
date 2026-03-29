import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/Navbar";
import HeroSphere from "@/components/HeroSphere";

const Footer = lazy(() => import("@/components/Footer"));

/* ── Partner-specific palette (inline, not in design tokens, per spec) ── */
const C = {
  blue: "#3D52F4",
  blueDeep: "#2B3DE8",
  blueLight: "#6B7FFF",
  blueSoft: "#EEF0FE",
  indigo: "#7C8FF5",
  nearWhite: "#F4F5FA",
  dark: "#0F1235",
  mid: "#4A5080",
  light: "#8B90B8",
  border: "#E2E4F0",
  green: "#4CAF82",
  amber: "#F5A623",
};

/* ════════════════════════════════════════════ helpers */

function MeshBG({ opacity = 0.12, right = false }: { opacity?: number; right?: boolean }) {
  return (
    <svg
      className="absolute bottom-0 pointer-events-none"
      style={{
        [right ? "right" : "left"]: 0,
        width: "42%",
        height: "70%",
        opacity,
        transform: right ? "scaleX(-1)" : "none",
      }}
      viewBox="0 0 400 350"
      fill="none"
    >
      {[
        [20,300,180,200],[20,300,80,150],[20,300,130,310],[180,200,80,150],
        [180,200,300,180],[180,200,220,90],[80,150,220,90],[80,150,40,60],
        [300,180,380,250],[300,180,350,80],[220,90,350,80],[220,90,160,20],
        [40,60,160,20],[130,310,250,340],[130,310,300,180],[250,340,380,250],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.blue} strokeWidth="0.8" />
      ))}
      {[
        [20,300],[180,200],[80,150],[300,180],[220,90],[40,60],
        [350,80],[160,20],[130,310],[250,340],[380,250],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={C.blue} opacity="0.45" />
      ))}
    </svg>
  );
}

function Waveform({ color, amplitude, speed }: { color: string; amplitude: number; speed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tick = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const draw = () => {
      tick.current += speed;
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      for (let x = 0; x < W; x++) {
        const r = x / W;
        const y = H / 2 + amplitude * Math.sin(r * Math.PI * 4 + tick.current) * (0.5 + 0.5 * Math.sin(r * 9 + tick.current * 0.4));
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [color, amplitude, speed]);

  return <canvas ref={ref} width={220} height={28} className="w-full block" style={{ height: 28 }} />;
}

function CountUp({ target, suffix = "", prefix = "", duration = 1600 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="gradient-pill inline-block mb-4">
      {children}
    </span>
  );
}

function scrollToForm() {
  document.getElementById("hubspot-form-container")?.scrollIntoView({ behavior: "smooth" });
}

function CTAButton({ children, className = "", filled = true }: { children: React.ReactNode; className?: string; filled?: boolean }) {
  return (
    <button
      onClick={scrollToForm}
      className={`rounded-[10px] font-semibold text-[13px] cursor-pointer inline-flex items-center gap-2 transition-shadow hover:shadow-lg ${className}`}
      style={
        filled
          ? { background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`, color: "#fff", border: "none", boxShadow: `0 6px 20px ${C.blue}44`, padding: "13px 26px" }
          : { background: "transparent", color: C.blue, border: `1.5px solid ${C.blue}`, padding: "13px 26px" }
      }
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════ SECTION 1 — HERO */
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 65% 0%, #D8DCF6 0%, #E8EBF6 40%, #F2F3FA 100%)",
        padding: "64px clamp(24px, 5vw, 64px) 72px",
      }}
    >
      {/* HeroSphere as opaque background decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18]">
        <div className="w-full max-w-[900px]">
          <HeroSphere />
        </div>
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto flex gap-14 items-start flex-wrap">
        {/* LEFT */}
        <div className="flex-[1_1_360px] min-w-[280px] pt-2">
          <Pill>VOICERA PARTNER PROGRAM</Pill>

          <h1
            className="mb-4"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px, 4vw, 50px)",
              color: C.dark,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
            }}
          >
            The credibility layer<br />is the last signal<br />
            <span style={{ color: C.blue }}>your platform<br />is missing.</span>
          </h1>

          <p className="mb-7 max-w-[460px]" style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.72 }}>
            Every enterprise platform in legal, insurance, sales, and HR can tell their customers what was said. None of them can tell their customers whether to believe it.
            <br /><br />
            Voicera is that capability — and we're building distribution through a small number of platform partners who move first.
          </p>

          {/* Urgency tag */}
          <div
            className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 mb-8"
            style={{ background: "#FFFFFF", border: `1px solid ${C.amber}55` }}
          >
            <span className="text-sm">⚡</span>
            <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: "#96600A", fontWeight: 600, lineHeight: 1.4 }}>
              Limited slots open per vertical<br />
              <span style={{ fontWeight: 400, color: "#B87A20" }}>AI Platforms · Enterprise SaaS · Data Infra</span>
            </span>
          </div>

        </div>

        {/* RIGHT — HubSpot form card */}
        <div className="flex-[1_1_380px] min-w-[320px]">
          <div
            className="rounded-[20px] p-8 pb-7"
            style={{
              background: "#fff",
              boxShadow: `0 12px 56px ${C.blue}1A, 0 2px 16px rgba(0,0,0,0.07)`,
              border: `1px solid ${C.border}`,
            }}
          >
            <h2 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 22, color: C.dark, letterSpacing: "-0.5px", marginBottom: 4 }}>
              Apply to Join the<br />Voicera Partner Program
            </h2>
            <p className="mb-6" style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: C.light, lineHeight: 1.5 }}>
              We read every application and respond to every qualified submission within 5 business days.
            </p>

            {/* HubSpot embed zone */}
            <div
              id="hubspot-form-container"
              className="rounded-xl flex flex-col items-center justify-center gap-3 min-h-[240px] text-center"
              style={{ background: C.nearWhite, border: `2px dashed ${C.border}`, padding: "32px 20px" }}
            >
              <div className="font-mono text-[9px] font-semibold" style={{ color: C.blue, letterSpacing: 2.5 }}>HUBSPOT FORM EMBED</div>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.light, lineHeight: 1.6 }}>
                Paste your HubSpot embed script here.<br />This container is pre-styled to match the page.
              </div>
              <code className="font-mono text-[10px] rounded-md px-3 py-1.5" style={{ color: C.blueLight, background: C.blueSoft }}>
                {'<script charset="utf-8" ... />'}
              </code>
            </div>

            {/* Cosmetic form preview */}
            <div className="mt-5 flex flex-col gap-2.5">
              {[["First Name", "Last Name"], ["Job Title", "Business Email"], ["Company Name", "Company Website URL"]].map((row, i) => (
                <div key={i} className="flex gap-2.5">
                  {row.map(f => (
                    <div key={f} className="flex-1 rounded-lg px-3 py-2.5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: C.light }}>{f}<span style={{ color: "#E05252" }}>*</span></div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="rounded-lg px-3 py-2.5" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: C.light }}>How would you like to partner?<span style={{ color: "#E05252" }}>*</span></div>
              </div>
              <div className="h-[5px] rounded-sm overflow-hidden mt-1" style={{ background: C.border }}>
                <div className="h-full w-1/2 rounded-sm" style={{ background: C.dark }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px]" style={{ color: C.light }}>1 / 2</span>
                <button className="rounded-lg border-none text-xs font-bold cursor-pointer" style={{ padding: "10px 24px", background: C.dark, color: "#fff" }}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════ SECTION 2 — PROOF STRIP */
function ProofStrip() {
  const ref = useFadeIn();
  const stats = [
    { val: 30, suffix: "%", prefix: "+", label: "More accurate than the best human readers", sub: "Validated against real-world outcome data" },
    { val: 3, suffix: "→1", prefix: "", label: "Modalities fused into one credibility signal", sub: "Voice · Vision · Language — simultaneously" },
    { val: 200, suffix: "ms", prefix: "<", label: "Enterprise-grade API response latency", sub: "Structured JSON · Single sprint integration" },
  ];

  return (
    <section ref={ref as any} style={{ background: "#fff", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="flex flex-col md:flex-row max-w-[1100px] mx-auto">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex-1 py-9 px-10 text-center"
            style={{ borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}
          >
            <div style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900, fontSize: 46, color: C.blue, letterSpacing: "-2px", marginBottom: 8, lineHeight: 1 }}>
              <CountUp target={s.val} suffix={s.suffix} prefix={s.prefix} duration={1400} />
            </div>
            <div style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600, fontSize: 13, color: C.dark, marginBottom: 4, lineHeight: 1.4 }}>{s.label}</div>
            <div className="font-mono text-[9.5px]" style={{ color: C.light, letterSpacing: 0.8 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════ SECTION 3 — OPPORTUNITY */
function OpportunitySection() {
  const ref = useFadeIn();
  const verticals = [
    { v: "Legal & Compliance", s: "Deposition & witness credibility", status: "OPEN", c: C.green },
    { v: "Insurance & Claims", s: "Claimant sincerity scoring", status: "OPEN", c: C.green },
    { v: "Sales Intelligence", s: "Buyer intent verification", status: "OPEN", c: C.green },
    { v: "Enterprise HR", s: "Executive assessment scoring", status: "OPEN", c: C.green },
    { v: "Federal & Government", s: "Interview & evidence analysis", status: "WAITLIST", c: C.light },
  ];

  return (
    <section
      ref={ref as any}
      className="relative overflow-hidden"
      style={{ background: C.nearWhite, padding: "80px clamp(24px, 5vw, 64px)" }}
    >
      <MeshBG opacity={0.07} />
      <div className="relative z-10 max-w-[1100px] mx-auto flex gap-16 flex-wrap items-start">
        <div className="flex-[1.3_1_300px] min-w-[280px]">
          <Pill>THE OPPORTUNITY</Pill>
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 38px)", color: C.dark, margin: "0 0 18px", lineHeight: 1.12, letterSpacing: "-1px" }}>
            The window is open.<br /><span style={{ color: C.blue }}>It won't stay open.</span>
          </h2>
          <p className="mb-3.5" style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.75 }}>
            Credibility intelligence is an unclaimed category. The first enterprise platforms to embed a behavioral-science-native sincerity layer will own the trust narrative in their vertical for years.
          </p>
          <p className="mb-3.5" style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.75 }}>
            We are looking for a small number of platform partners who understand that the gap between <strong style={{ color: C.dark }}>what was said</strong> and <strong style={{ color: C.dark }}>whether to believe it</strong> is where their customers lose the most money.
          </p>
          <p className="mb-0" style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: C.dark, fontWeight: 700, lineHeight: 1.6 }}>
            If that's you — this is the most important integration conversation you'll have this year.
          </p>
          <div className="mt-7">
            <CTAButton>Apply for Partner Access ↗</CTAButton>
          </div>
        </div>

        <div className="flex-1 min-w-[260px] flex flex-col gap-2.5">
          <div className="font-mono text-[9px] mb-1" style={{ color: C.light, letterSpacing: 2 }}>OPEN VERTICALS</div>
          {verticals.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl p-3.5 px-[18px] transition-shadow hover:shadow-md cursor-default"
              style={{ background: "#fff", border: `1px solid ${C.border}`, boxShadow: `0 2px 8px ${C.blue}0D` }}
            >
              <div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontWeight: 700, fontSize: 13, color: C.dark, marginBottom: 2 }}>{item.v}</div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: C.mid }}>{item.s}</div>
              </div>
              <div
                className="inline-flex items-center gap-[5px] rounded-[20px] px-2.5 py-1 shrink-0"
                style={{ background: item.status === "OPEN" ? `${C.green}12` : `${C.light}14` }}
              >
                <div
                  className={`w-[5px] h-[5px] rounded-full ${item.status === "OPEN" ? "animate-dot-pulse" : ""}`}
                  style={{ background: item.c }}
                />
                <span className="font-mono text-[8px] font-semibold" style={{ color: item.c, letterSpacing: 1.5 }}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ════════════════════════════════════════════ SECTION 5 — PARTNER TIERS */
function PartnerTiers() {
  const ref = useFadeIn();
  const tiers = [
    {
      tier: "Integration Partner",
      badge: "MOST COMMON", badgeColor: C.blue,
      desc: "Embed Voicera's Credibility Score as a native feature inside your product. Your customers experience it as yours.",
      items: ["Sandbox API access day one", "90-day dedicated integration support", "'Powered by Voicera' badging rights", "Volume-tiered wholesale rate card", "JSON / REST / WebSocket output"],
      best: "Best for platforms processing 1M+ minutes/month of human-subject video.",
      cta: "Apply as Integration Partner →",
      highlight: false,
    },
    {
      tier: "Strategic Reseller Partner",
      badge: "HIGHEST VALUE", badgeColor: C.green,
      desc: "Bundle and resell Voicera as a named premium feature in your enterprise tier with full commercial alignment.",
      items: ["All Integration Partner benefits", "Revenue share on Voicera-differentiated deals", "Dedicated partner BD lead from day one", "Direct roadmap input & pre-release access", "Exclusivity consideration in primary vertical"],
      best: "Best for platforms with existing enterprise sales motion and $100K+ ACV contracts.",
      cta: "Apply as Reseller Partner →",
      highlight: true,
    },
  ];

  return (
    <section ref={ref as any} style={{ background: "#fff", padding: "80px clamp(24px, 5vw, 64px)", borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <Pill>TWO WAYS TO PARTNER</Pill>
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 38px)", color: C.dark, margin: 0, letterSpacing: "-1px" }}>
            Choose your structure.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="rounded-[20px] p-8 relative transition-shadow hover:shadow-lg"
              style={{
                background: C.nearWhite,
                border: `${tier.highlight ? 2 : 1}px solid ${tier.highlight ? C.blue : C.border}`,
                boxShadow: tier.highlight ? `0 8px 40px ${C.blue}18` : "0 2px 12px rgba(0,0,0,0.03)",
              }}
            >
              {tier.highlight && (
                <div className="absolute -top-px left-8 right-8 h-[3px] rounded-b" style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.blueLight})` }} />
              )}
              <div className="mb-3">
                <h3 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 20, color: C.dark, margin: 0, lineHeight: 1.2 }}>{tier.tier}</h3>
              </div>
              <p className="mb-[18px]" style={{ fontFamily: "system-ui, sans-serif", fontSize: 14, color: C.mid, lineHeight: 1.65 }}>{tier.desc}</p>
              <div className="font-mono text-[8.5px] mb-2.5" style={{ color: C.light, letterSpacing: 2 }}>INCLUDES</div>
              <div className="flex flex-col gap-[9px] mb-[18px]">
                {tier.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center" style={{ background: "#fff", border: `1px solid ${C.blue}28` }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </div>
                    <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: C.mid }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg p-2.5 px-3.5 mb-[22px]" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.mid, fontStyle: "italic" }}>{tier.best}</span>
              </div>
              <button
                onClick={scrollToForm}
                className="w-full rounded-[10px] py-[13px] text-[13px] font-bold cursor-pointer transition-shadow hover:shadow-lg"
                style={{
                  border: tier.highlight ? "none" : `1.5px solid ${C.blue}`,
                  background: tier.highlight ? `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})` : "transparent",
                  color: tier.highlight ? "#fff" : C.blue,
                  boxShadow: tier.highlight ? `0 4px 16px ${C.blue}44` : "none",
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center mt-[18px] italic" style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: C.light }}>
          Not sure which fits? Tell us about your platform in the application — we'll recommend the right structure.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════ SECTION 6 — WHAT HAPPENS NEXT */
function NextStepsSection() {
  const ref = useFadeIn();
  const steps = [
    { day: "Day 1–5", n: "1", title: "Application Review", body: "Our partnership team reviews every application personally against vertical fit, volume profile, and integration readiness. Every qualified submission gets a personal response." },
    { day: "Day 5–10", n: "2", title: "Intro Call", body: "If there's a fit, you get a 30-minute call with Voicera's BD lead and a technical architect — prepared with a draft integration scope and preliminary commercial structure." },
    { day: "Day 10–30", n: "3", title: "Sandbox Access", body: "Approved partners receive sandbox API credentials, full documentation, a dedicated partner Slack channel, and 90-day integration support — before a single contract is signed." },
  ];

  return (
    <section ref={ref as any} style={{ background: "#fff", padding: "80px clamp(24px, 5vw, 64px)", borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-[52px]">
          <Pill>WHAT HAPPENS NEXT</Pill>
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 36px)", color: C.dark, margin: 0, letterSpacing: "-1px" }}>
            We move fast with<br /><span style={{ color: C.blue }}>the right partners.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="rounded-2xl p-7 transition-shadow hover:shadow-md" style={{ background: C.nearWhite, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`, boxShadow: `0 4px 12px ${C.blue}44` }}
                >
                  <span className="font-mono text-xs text-white font-bold">{step.n}</span>
                </div>
                <div className="font-mono text-[8.5px]" style={{ color: C.blue, letterSpacing: 2 }}>{step.day}</div>
              </div>
              <h3 style={{ fontFamily: "system-ui, sans-serif", fontWeight: 800, fontSize: 16, color: C.dark, margin: "0 0 10px" }}>{step.title}</h3>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: C.mid, lineHeight: 1.7, margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <CTAButton>Apply for Partner Access ↗</CTAButton>
          <p className="mt-3 italic" style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.light }}>
            Seeing isn't believing. We tell you which is which.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════ PAGE ROOT */
const Partners = () => (
  <div className="min-h-screen" style={{ background: C.nearWhite, fontFamily: "system-ui, -apple-system, sans-serif" }}>
    <JsonLd
      title="Become a Partner — Voicera"
      description="Join the Voicera Partner Program. Integrate our APIs, access co-marketing resources, and earn recurring revenue."
      path="/partners"
    />
    <Navbar />
    <div className="pt-20">
      <HeroSection />
      <ProofStrip />
      <OpportunitySection />
      
      <PartnerTiers />
      <NextStepsSection />
    </div>
    <Suspense fallback={<div className="min-h-[200px]" />}>
      <Footer />
    </Suspense>
  </div>
);

export default Partners;
