import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StartBuildingModal from "./StartBuildingModal";
import PricingCapsules from "./PricingCapsules";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const INK = "#0B1020";
const INK_SOFT = "#475569";
const INK_MUTED = "#94A3B8";
const BLUE = "#2563EB";
const BLUE_SOFT = "#EEF2FF";
const BLUE_BORDER = "#DBEAFE";
const CARD_BG = "#FFFFFF";
const BG_TINT = "#F7F9FC";
const DIVIDER = "#E5E7EB";

const fontStack = "'DM Sans', system-ui, -apple-system, sans-serif";

// ─── ICONS (inline SVG) ─────────────────────────────────────────────
const I = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IconAudio = () => <I d="M3 18v-6a9 9 0 0 1 18 0v6 M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />;
const IconVideo = () => <I d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />;
const IconLayers = () => <I d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const IconServer = () => <I d="M2 4h20v6H2zM2 14h20v6H2zM6 8h.01M6 18h.01" />;
const IconCheck = () => <I d="M20 6L9 17l-5-5" size={14} />;
const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ marginLeft: 6 }}>
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

// ─── DATA ───────────────────────────────────────────────────────────
const API_TIERS = [
  { name: "Tier 1 — Self-Serve", range: "0 – 1,000 hrs / month", price: "$1.80", unit: "/ hr", perMin: "$0.03" },
  { name: "Tier 2 — Growth", range: "1,000 – 7,000 hrs / month", price: "$1.50", unit: "/ hr", perMin: "$0.025" },
  { name: "Tier 3 — Enterprise", range: "7,000+ hrs / month", price: "Talk to Sales", unit: "", perMin: "Talk to Sales" },
];

const PLATFORM_PLANS = [
  {
    name: "Pro", price: "$29", cadence: "/ month",
    tagline: "For individuals and small teams.",
    hours: "10 hours / month", videos: "Unlimited videos",
    features: [
      { label: "Unified Upload", included: true },
      { label: "Aggregate Sincerity Score (ASS)", included: true },
      { label: "Transcript + Sincerity Sync", included: true },
      { label: "Key Moments (Hot Spots)", included: true },
      { label: "Automated Topic Tagging", included: true },
      { label: "Profile & Workspace Management", included: false },
      { label: "Trend Reporting", included: false },
      { label: "One-Click Insight Sharing", included: false },
    ],
    highlight: false, ctaLabel: "Start with Pro",
  },
  {
    name: "Business", price: "$79", cadence: "/ month",
    tagline: "For teams that need reporting and sharing.",
    hours: "30 hours / month", videos: "Unlimited videos",
    features: [
      { label: "Unified Upload", included: true },
      { label: "Aggregate Sincerity Score (ASS)", included: true },
      { label: "Transcript + Sincerity Sync", included: true },
      { label: "Key Moments (Hot Spots)", included: true },
      { label: "Automated Topic Tagging", included: true },
      { label: "Profile & Workspace Management", included: true },
      { label: "Trend Reporting", included: true },
      { label: "One-Click Insight Sharing", included: true },
    ],
    highlight: true, ctaLabel: "Start with Business",
  },
];

const CUSTOM_COMPONENTS = [
  { component: "Implementation Fee", price: "Inquire", cadence: "One-time", desc: "Covers container deployment support, InfoSec audits, and initial configuration." },
  { component: "Annual Platform License", price: "Custom", cadence: "Billed annually", desc: "Access to the core engine, model updates, and a dedicated account manager." },
  { component: "Metered Usage", price: "Unlimited", cadence: "Billed monthly in arrears", desc: "Telemetry-based usage billing tied to actual analysis hours." },
  { component: "Capacity License (alt.)", price: "Inquire", cadence: "Billed annually per node", desc: "Alternative to metered usage for clients that cannot share telemetry. Flat fee per server/node running the container." },
];

// ─── SHARED STYLES ──────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "12px 22px", background: INK, color: "#fff",
  fontFamily: fontStack, fontSize: 14, fontWeight: 600,
  border: "none", borderRadius: 10, cursor: "pointer",
  textDecoration: "none", transition: "transform .15s ease, background .15s ease",
};

const cardStyle: React.CSSProperties = {
  background: CARD_BG, borderRadius: 18,
  padding: "32px 32px 28px",
  boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06)",
  border: `1px solid ${DIVIDER}`,
};

// ─── SMALL COMPONENTS ───────────────────────────────────────────────
const Row = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: INK_SOFT }}>
      {icon}
      <span style={{ fontFamily: fontStack, fontSize: 14, color: INK }}>{label}</span>
    </div>
    <span style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: accent || INK_SOFT }}>{value}</span>
  </div>
);

type ProductTab = "api" | "platform" | "custom";

const ProductTabs = ({ value, onChange }: { value: ProductTab; onChange: (v: ProductTab) => void }) => {
  const tabs: { id: ProductTab; label: string; icon: React.ReactNode }[] = [
    { id: "api", label: "API", icon: <IconLayers /> },
    { id: "platform", label: "Platform (Web App)", icon: <IconVideo /> },
    { id: "custom", label: "Custom Deployment", icon: <IconServer /> },
  ];
  return (
    <div style={{
      display: "inline-flex", padding: 6, borderRadius: 14,
      background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(15,23,42,.12)",
      margin: "0 auto 36px", position: "relative", zIndex: 2,
      gap: 4, flexWrap: "wrap", justifyContent: "center",
    }}>
      {tabs.map(t => {
        const active = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 10, border: "none",
            background: active ? INK : "transparent",
            color: active ? "#fff" : INK_SOFT,
            fontFamily: fontStack, fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all .15s ease",
          }}>
            {t.icon}{t.label}
          </button>
        );
      })}
    </div>
  );
};

// ─── FREE CARD ──────────────────────────────────────────────────────
const FreeCard = ({ onStartBuilding }: { onStartBuilding: () => void }) => (
  <div style={cardStyle}>
    <h3 style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 700, color: INK, margin: 0 }}>Free</h3>
    <p style={{ fontFamily: fontStack, fontSize: 14, color: INK_MUTED, margin: "6px 0 22px" }}>Up to 2 hours of analysis</p>
    <button onClick={onStartBuilding} style={btnPrimary}>Start Building <IconArrow /></button>

    <div style={{ margin: "28px 0 16px", textAlign: "center" }}>
      <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: INK_SOFT }}>
        Sincerity<sup style={{ fontSize: 9 }}>™</sup>
      </div>
    </div>
    <div style={{ borderTop: `1px solid ${DIVIDER}`, paddingTop: 20 }}>
      <div style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT, fontWeight: 500, marginBottom: 12 }}>Analysis (per job)</div>
      {[
        { icon: <IconAudio />, label: "Audio analysis" },
        { icon: <IconVideo />, label: "Video analysis" },
        { icon: <IconLayers />, label: "Composite analysis" },
      ].map(r => (
        <Row key={r.label} icon={r.icon} label={r.label} value="Free" />
      ))}
      <div style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT, fontWeight: 500, margin: "20px 0 12px" }}>Infrastructure (Monthly)</div>
      <Row icon={<IconServer />} label="Platform hosting" value="Free" />
    </div>
    <div style={{ textAlign: "center", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${DIVIDER}` }}>
      <div style={{ fontFamily: fontStack, fontSize: 12, color: INK_MUTED }}>Free tier includes up to 2 hours of total analysis time.</div>
    </div>
  </div>
);

// ─── API VIEW ───────────────────────────────────────────────────────
const ApiView = ({ onStartBuilding, onTalkToSales }: { onStartBuilding: () => void; onTalkToSales: () => void }) => {
  const [unit, setUnit] = useState<"minute" | "hour">("minute");
  const tier1 = API_TIERS[0];
  const price = unit === "minute" ? tier1.perMin : tier1.price;
  const per = unit === "minute" ? "/ minute" : "/ hour";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 920, margin: "0 auto" }}>
      <FreeCard onStartBuilding={onStartBuilding} />

      <div style={{ ...cardStyle, borderColor: BLUE_BORDER, background: `linear-gradient(180deg, ${CARD_BG} 0%, ${BLUE_SOFT} 100%)` }}>
        <h3 style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 700, color: INK, margin: 0 }}>Pro</h3>
        <p style={{ fontFamily: fontStack, fontSize: 14, color: INK_MUTED, margin: "6px 0 22px" }}>Pay as you go</p>
        <button onClick={onTalkToSales} style={btnPrimary}>Talk to Sales <IconArrow /></button>

        <div style={{ margin: "28px 0 14px", textAlign: "center" }}>
          <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: INK_SOFT, marginBottom: 12 }}>
            Sincerity<sup style={{ fontSize: 9 }}>™</sup>
          </div>
          <div style={{ display: "inline-flex", padding: 4, borderRadius: 999, background: "#fff", border: `1px solid ${DIVIDER}` }}>
            {(["minute", "hour"] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)} style={{
                padding: "6px 16px", borderRadius: 999, border: "none",
                background: unit === u ? INK : "transparent",
                color: unit === u ? "#fff" : INK_SOFT,
                fontFamily: fontStack, fontSize: 12, fontWeight: 600,
                cursor: "pointer", textTransform: "capitalize",
              }}>Per {u}</button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${DIVIDER}`, paddingTop: 20 }}>
          <div style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT, fontWeight: 500, marginBottom: 12 }}>Analysis (per job) — Tier 1</div>
          {[
            { icon: <IconAudio />, label: "Audio analysis" },
            { icon: <IconVideo />, label: "Video analysis" },
            { icon: <IconLayers />, label: "Composite analysis" },
          ].map(r => (
            <Row key={r.label} icon={r.icon} label={r.label} value={`${price} ${per}`} accent={INK} />
          ))}
        </div>

        {/* Volume tiers */}
        <div style={{ marginTop: 24, padding: 16, background: "#fff", borderRadius: 12, border: `1px solid ${BLUE_BORDER}` }}>
          <div style={{ fontFamily: fontStack, fontSize: 12, fontWeight: 700, color: INK_SOFT, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Volume tiers</div>
          {API_TIERS.map((t, i) => (
            <div key={t.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "8px 0", borderTop: i === 0 ? "none" : `1px solid ${DIVIDER}`,
            }}>
              <div>
                <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 600, color: INK }}>{t.name}</div>
                <div style={{ fontFamily: fontStack, fontSize: 11, color: INK_MUTED }}>{t.range}</div>
              </div>
              <div style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 700, color: BLUE, textAlign: "right" }}>
                {t.price}{t.unit && <span style={{ fontWeight: 500, color: INK_SOFT }}> {t.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontFamily: fontStack, fontSize: 11, color: INK_MUTED, lineHeight: 1.5 }}>
          Composite = audio + video (parallel) + fusion Lambda.<br />
          Volume discounts apply automatically based on monthly usage.
        </div>
      </div>
    </div>
  );
};

// ─── PLATFORM VIEW ──────────────────────────────────────────────────
const PlatformView = ({ onTalkToSales }: { onTalkToSales: () => void }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, maxWidth: 920, margin: "0 auto" }}>
    {PLATFORM_PLANS.map(plan => (
      <div key={plan.name} style={{
        ...cardStyle,
        borderColor: plan.highlight ? BLUE : DIVIDER,
        background: plan.highlight ? `linear-gradient(180deg, ${CARD_BG} 0%, ${BLUE_SOFT} 100%)` : CARD_BG,
        position: "relative",
      }}>
        {plan.highlight && (
          <div style={{
            position: "absolute", top: -12, right: 24,
            background: BLUE, color: "#fff",
            padding: "4px 12px", borderRadius: 999,
            fontFamily: fontStack, fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Most Popular</div>
        )}

        <h3 style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 700, color: INK, margin: 0 }}>{plan.name}</h3>
        <p style={{ fontFamily: fontStack, fontSize: 14, color: INK_MUTED, margin: "6px 0 18px" }}>{plan.tagline}</p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
          <span style={{ fontFamily: fontStack, fontSize: 44, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>{plan.price}</span>
          <span style={{ fontFamily: fontStack, fontSize: 15, color: INK_MUTED }}>{plan.cadence}</span>
        </div>

        <button onClick={onTalkToSales} style={{ ...btnPrimary, width: "100%", boxSizing: "border-box" as const }}>
          {plan.ctaLabel} <IconArrow />
        </button>

        <div style={{ margin: "24px 0 16px", padding: "14px 16px", background: "#fff", borderRadius: 10, border: `1px solid ${DIVIDER}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT }}>Hours / month</span>
            <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 700, color: INK }}>{plan.hours.replace(" / month", "")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT }}>Videos</span>
            <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: 700, color: INK }}>Unlimited</span>
          </div>
        </div>

        <div style={{ fontFamily: fontStack, fontSize: 12, color: INK_SOFT, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>What's included</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {plan.features.map(f => (
            <li key={f.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 0", fontFamily: fontStack, fontSize: 13,
              color: f.included ? INK : INK_MUTED,
              textDecoration: f.included ? "none" : "line-through",
              opacity: f.included ? 1 : 0.6,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: 999,
                background: f.included ? BLUE : "transparent",
                color: "#fff",
                border: f.included ? "none" : `1px solid ${DIVIDER}`,
              }}>
                {f.included && <IconCheck />}
              </span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

// ─── CUSTOM DEPLOYMENT VIEW ─────────────────────────────────────────
const CustomView = ({ onTalkToSales }: { onTalkToSales: () => void }) => (
  <div style={{ maxWidth: 920, margin: "0 auto" }}>
    <div style={{ ...cardStyle, padding: 40 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
        <div style={{ flex: "1 1 320px" }}>
          <h3 style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 700, color: INK, margin: "0 0 8px" }}>Custom Deployment</h3>
          <p style={{ fontFamily: fontStack, fontSize: 15, color: INK_SOFT, margin: 0, lineHeight: 1.55 }}>
            Run Sincerity<sup style={{ fontSize: 9 }}>™</sup> inside your own infrastructure. Containerized, on-premises, and configured to your security posture.
          </p>
        </div>
        <button onClick={onTalkToSales} style={btnPrimary}>Talk to Sales <IconArrow /></button>
      </div>

      {/* Component table — responsive */}
      <div style={{ border: `1px solid ${DIVIDER}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Header — hidden on mobile */}
        <div className="hidden md:grid" style={{
          gridTemplateColumns: "1.1fr 1fr 2fr",
          padding: "14px 20px", background: BG_TINT,
          fontFamily: fontStack, fontSize: 11, fontWeight: 700,
          color: INK_SOFT, textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          <div>Component</div>
          <div>Price / Availability</div>
          <div>Description</div>
        </div>
        {CUSTOM_COMPONENTS.map((row, i) => (
          <div key={row.component} className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_2fr]" style={{
            padding: "18px 20px", alignItems: "start",
            borderTop: `1px solid ${DIVIDER}`,
            background: i % 2 === 0 ? "#fff" : BG_TINT,
            gap: 4,
          }}>
            <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 600, color: INK }}>{row.component}</div>
            <div>
              <div style={{ fontFamily: fontStack, fontSize: 14, fontWeight: 700, color: BLUE }}>{row.price}</div>
              <div style={{ fontFamily: fontStack, fontSize: 11, color: INK_MUTED, marginTop: 2 }}>{row.cadence}</div>
            </div>
            <div style={{ fontFamily: fontStack, fontSize: 13, color: INK_SOFT, lineHeight: 1.55 }}>{row.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 28 }}>
        {[
          { label: "Deployment model", value: "Containerized, on-prem or private cloud" },
          { label: "InfoSec review", value: "Included in implementation" },
          { label: "Account management", value: "Dedicated AM + SLA" },
        ].map(c => (
          <div key={c.label} style={{ padding: 16, background: BG_TINT, borderRadius: 10 }}>
            <div style={{ fontFamily: fontStack, fontSize: 11, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: fontStack, fontSize: 13, color: INK, fontWeight: 500 }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN SECTION ───────────────────────────────────────────────────
const SolutionsSection = () => {
  const [product, setProduct] = useState<ProductTab>("api");
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  // Auto-open Start Building modal when anchored
  const autoOpenFree = location.hash === "#pricing-sandbox";
  useState(() => {
    if (autoOpenFree) {
      setTimeout(() => setModalOpen(true), 600);
    }
  });

  const handleStartBuilding = () => setModalOpen(true);
  const handleTalkToSales = () => {
    (window as any).Calendly?.initPopupWidget({ url: "https://calendly.com/kevins-voicera-calendar/30min" });
  };

  return (
    <section id="pricing-sandbox" className="relative overflow-hidden bg-[#0B1120]">
      {/* Background video — PRESERVED */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/pricing-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/[0.09]" style={{ zIndex: 1 }} />
      <PricingCapsules />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-11 pb-20" style={{ fontFamily: fontStack }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 2 }}>
          <span className="gradient-pill">PRICING</span>
          <h2 style={{
            fontFamily: fontStack, fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 700, color: "#fff", margin: "18px 0 12px",
            letterSpacing: "-0.02em", lineHeight: 1.05,
          }}>
            Try it, trust it, scale it.
          </h2>
          <p style={{
            fontFamily: fontStack, fontSize: 17, color: "rgba(255,255,255,.82)",
            margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto",
          }}>
            Pay only for what you analyze. No seat fees, no minimums.
          </p>
        </div>

        {/* Product tabs */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ProductTabs value={product} onChange={setProduct} />
        </div>

        {/* Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {product === "api" && <ApiView onStartBuilding={handleStartBuilding} onTalkToSales={handleTalkToSales} />}
            {product === "platform" && <PlatformView onTalkToSales={handleTalkToSales} />}
            {product === "custom" && <CustomView onTalkToSales={handleTalkToSales} />}
          </motion.div>
        </AnimatePresence>

        <div style={{
          textAlign: "center", marginTop: 40,
          fontFamily: fontStack, fontSize: 12, color: "rgba(255,255,255,.6)",
        }}>
          All plans include Sincerity<sup style={{ fontSize: 8 }}>™</sup> multimodal analysis. Prices in USD.
        </div>
      </div>

      <StartBuildingModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default SolutionsSection;
