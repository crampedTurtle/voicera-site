import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Users, Video, ShieldCheck } from "lucide-react";
import FloatingCapsules from "./FloatingCapsules";

const useCases = [
  {
    icon: Users,
    label: "SALES COACHING",
    title: "Turn Subjective Coaching into Data-Driven Science",
    desc: "Analyze every rep's calls automatically. Surface coachable moments, track improvement over time, and replicate top-performer behaviors across your entire team.",
    points: ["Automated call scoring", "Rep performance trends", "Coachable moment detection", "Manager dashboards"],
    graphicType: "timeline" as const,
  },
  {
    icon: Video,
    label: "REMOTE HIRING",
    title: "Remote Hiring Made Transparent",
    desc: "Evaluate candidates objectively with AI-powered credibility and engagement scoring. Remove bias from interviews and make confident hiring decisions.",
    points: ["Interview credibility scores", "Engagement & sentiment analysis", "Structured evaluation reports", "Bias-reduction framework"],
    graphicType: "analyze" as const,
  },
  {
    icon: ShieldCheck,
    label: "CREDIBILITY ASSESSMENT",
    title: "Automate Credibility Assessment for High-Stakes Video",
    desc: "Voicera scores verbal and non-verbal credibility signals so you can make faster, more informed decisions on the people that matter.",
    points: ["Micro-expression analysis", "Verbal consistency scoring", "Confidence & conviction metrics", "Risk flagging alerts"],
    graphicType: "network" as const,
  },
];

/* ── Abstract graphics for each column ── */

const TimelineGraphic = () => (
  <motion.svg
    viewBox="0 0 220 160"
    fill="none"
    className="w-full max-w-[220px] mx-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.4, duration: 0.6 }}
  >
    {/* Stacked capsule bars – like search timeline */}
    {[
      { x: 20, y: 20, w: 90, color: "rgba(155,77,235,0.2)" },
      { x: 50, y: 50, w: 120, color: "rgba(240,24,122,0.18)" },
      { x: 10, y: 80, w: 80, color: "rgba(75,110,245,0.22)" },
      { x: 60, y: 110, w: 100, color: "rgba(244,98,26,0.18)" },
    ].map((bar, i) => (
      <g key={i}>
        <rect x={bar.x} y={bar.y} width={bar.w} height={22} rx={11} fill={bar.color} stroke="rgba(0,0,0,0.08)" strokeWidth={0.8} />
        {/* Colored dot inside */}
        <circle cx={bar.x + 14} cy={bar.y + 11} r={5} fill={bar.color.replace(/0\.\d+\)/, "0.6)")} />
      </g>
    ))}
    {/* Timestamp labels */}
    <text x="115" y="15" fontSize="7" fontFamily="Inter" fill="rgba(0,0,0,0.35)" fontWeight={500}>0:03–1:45</text>
    <text x="175" y="45" fontSize="7" fontFamily="Inter" fill="rgba(0,0,0,0.35)" fontWeight={500}>3:16–4:22</text>
    {/* Connecting lines */}
    <line x1="110" y1="31" x2="130" y2="15" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
    <line x1="170" y1="61" x2="185" y2="45" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
  </motion.svg>
);

const AnalyzeGraphic = () => (
  <motion.svg
    viewBox="0 0 200 160"
    fill="none"
    className="w-full max-w-[200px] mx-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    {/* Central rounded rectangle – like a video frame */}
    <defs>
      <linearGradient id="analyzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(240,24,122,0.25)" />
        <stop offset="50%" stopColor="rgba(244,98,26,0.2)" />
        <stop offset="100%" stopColor="rgba(155,77,235,0.15)" />
      </linearGradient>
    </defs>
    <rect x="55" y="15" width="90" height="65" rx="14" fill="url(#analyzeGrad)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.8} />
    {/* Prompt pill above */}
    <rect x="72" y="4" width="56" height="14" rx="7" fill="white" stroke="rgba(0,0,0,0.12)" strokeWidth={0.6} />
    <text x="86" y="13" fontSize="6" fontFamily="Inter" fill="rgba(0,0,0,0.5)" fontWeight={600} letterSpacing="0.06em">PROMPT</text>
    {/* Arrow down */}
    <line x1="100" y1="80" x2="100" y2="100" stroke="rgba(0,0,0,0.15)" strokeWidth={0.8} />
    <circle cx="100" cy="100" r="6" fill="white" stroke="rgba(0,0,0,0.12)" strokeWidth={0.6} />
    {/* Output cards */}
    <rect x="40" y="115" width="52" height="30" rx="4" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
    <rect x="108" y="115" width="52" height="30" rx="4" fill="white" stroke="rgba(0,0,0,0.1)" strokeWidth={0.6} />
    {/* Lines inside cards */}
    {[0, 1, 2].map((j) => (
      <g key={`l-${j}`}>
        <rect x={47} y={122 + j * 7} width={38} height={2.5} rx={1.2} fill="rgba(0,0,0,0.08)" />
        <rect x={115} y={122 + j * 7} width={38} height={2.5} rx={1.2} fill="rgba(0,0,0,0.08)" />
      </g>
    ))}
  </motion.svg>
);

const NetworkGraphic = () => (
  <motion.svg
    viewBox="0 0 220 160"
    fill="none"
    className="w-full max-w-[220px] mx-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.6, duration: 0.6 }}
  >
    {/* Multimodal embedding network */}
    {/* Center cluster of colored spheres */}
    {[
      { cx: 90, cy: 70, r: 18, color: "rgba(155,77,235,0.25)" },
      { cx: 115, cy: 55, r: 14, color: "rgba(75,110,245,0.22)" },
      { cx: 105, cy: 95, r: 16, color: "rgba(240,24,122,0.2)" },
      { cx: 130, cy: 80, r: 12, color: "rgba(244,98,26,0.2)" },
      { cx: 78, cy: 50, r: 10, color: "rgba(75,110,245,0.18)" },
    ].map((s, i) => (
      <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
    ))}
    {/* Surrounding node pills */}
    {[
      { x: 148, y: 25, label: "VERBAL" },
      { x: 155, y: 60, label: "VISUAL" },
      { x: 148, y: 95, label: "AUDIO" },
      { x: 30, y: 40, label: "SIGNALS" },
    ].map((n, i) => (
      <g key={i}>
        <rect x={n.x} y={n.y} width={46} height={14} rx={7} fill="white" stroke="rgba(0,0,0,0.12)" strokeWidth={0.6} />
        <text x={n.x + 23} y={n.y + 10} fontSize="5.5" fontFamily="Inter" fill="rgba(0,0,0,0.5)" fontWeight={600} textAnchor="middle" letterSpacing="0.06em">{n.label}</text>
      </g>
    ))}
    {/* Connection lines from center to pills */}
    {[
      { x1: 115, y1: 55, x2: 148, y2: 32 },
      { x1: 130, y1: 80, x2: 155, y2: 67 },
      { x1: 105, y1: 95, x2: 148, y2: 102 },
      { x1: 78, y1: 50, x2: 76, y2: 47 },
    ].map((l, i) => (
      <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(0,0,0,0.08)" strokeWidth={0.6} strokeDasharray="2 2" />
    ))}
    {/* Small hexagonal nodes */}
    {[
      { cx: 160, cy: 48 },
      { cx: 140, cy: 110 },
      { cx: 60, cy: 105 },
    ].map((h, i) => (
      <circle key={`h-${i}`} cx={h.cx} cy={h.cy} r={4} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.6} />
    ))}
  </motion.svg>
);

const graphicComponents = {
  timeline: TimelineGraphic,
  analyze: AnalyzeGraphic,
  network: NetworkGraphic,
};

/* ── Branching SVG line ── */
const BranchingLine = () => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 900 200"
      fill="none"
      className="w-full max-w-5xl mx-auto"
      style={{ height: 200, marginBottom: -2 }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main vertical trunk */}
      <motion.line
        x1="450" y1="0" x2="450" y2="100"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {/* Horizontal bar */}
      <motion.line
        x1="150" y1="100" x2="750" y2="100"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      />
      {/* Three vertical drops */}
      {[150, 450, 750].map((x, i) => (
        <motion.line
          key={x}
          x1={x} y1="100" x2={x} y2="200"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.9 + i * 0.15, ease: "easeOut" }}
        />
      ))}
      {/* Corner arcs for smooth branching */}
      {/* Left corner */}
      <motion.path
        d="M 450 90 Q 450 100 440 100 L 160 100 Q 150 100 150 110"
        stroke="rgba(0,0,0,0.0)"
        strokeWidth="0"
        fill="none"
      />
      {/* Terminal dots */}
      {[150, 450, 750].map((x, i) => (
        <motion.circle
          key={`dot-${x}`}
          cx={x} cy="200"
          r="3"
          fill="rgba(0,0,0,0.12)"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 1.3 + i * 0.1, duration: 0.3 }}
        />
      ))}
    </motion.svg>
  );
};

/* ── Main Section ── */
const SolutionsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--bg-alt) 0%, hsl(0 0% 100%) 15%)" }}
    >
      {/* Timeline line – center, entering from above into the branching line */}
      <div
        className="absolute left-1/2 top-0 w-px pointer-events-none"
        style={{
          height: "280px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 100%)",
        }}
      />

      {/* Bleeding capsules from section above */}
      <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none overflow-hidden" style={{ opacity: 0.4 }}>
        <FloatingCapsules variant="storytelling" count={8} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28">
        {/* Section header */}
        <div className="text-center mb-4">
          <span className="gradient-pill">USE CASES</span>
          <h2 className="type-display text-body mt-6">
            Solutions for Sales Teams
          </h2>
          <p className="type-body mt-4 max-w-2xl mx-auto">
            Purpose-built AI for revenue teams who need objective, scalable insights from every conversation.
          </p>
        </div>

        {/* Branching line */}
        <div className="mt-12">
          <BranchingLine />
        </div>

        {/* Three product columns */}
        <div className="grid md:grid-cols-3 gap-10 mt-0">
          {useCases.map((uc, i) => {
            const Graphic = graphicComponents[uc.graphicType];
            return (
              <motion.div
                key={uc.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 + i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                {/* Minimalistic icon + pill label */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                    <uc.icon size={16} strokeWidth={1.5} className="text-body-muted" />
                  </div>
                  <span
                    className="type-tag px-3 py-1 rounded-full"
                    style={{
                      border: "1px solid rgba(0,0,0,0.1)",
                      color: "var(--color-muted)",
                      fontSize: "10px",
                    }}
                  >
                    {uc.label}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--color-body-text)", lineHeight: 1.7 }}>
                  {uc.desc}
                </p>

                {/* Abstract graphic */}
                <div className="w-full">
                  <Graphic />
                </div>

                {/* Feature points – subtle beneath graphic */}
                <ul className="mt-8 space-y-2">
                  {uc.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted)" }}>
                      <div className="w-1 h-1 rounded-full gradient-bg flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
