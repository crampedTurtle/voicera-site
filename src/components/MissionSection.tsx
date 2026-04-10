import { motion } from "framer-motion";

const crystalPositions = [
  { x: "12%", y: "20%", size: 28, delay: 0, rotate: 15 },
  { x: "85%", y: "30%", size: 22, delay: 0.8, rotate: -20 },
  { x: "25%", y: "75%", size: 18, delay: 1.4, rotate: 30 },
  { x: "75%", y: "70%", size: 24, delay: 0.4, rotate: -10 },
  { x: "50%", y: "15%", size: 16, delay: 1.0, rotate: 25 },
  { x: "90%", y: "80%", size: 14, delay: 1.8, rotate: -35 },
];

const Crystal = ({ x, y, size, delay, rotate }: typeof crystalPositions[0]) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0.6 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 1.2, ease: "easeOut" }}
  >
    <motion.svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 30 48"
      fill="none"
      animate={{ rotate: [rotate, rotate + 3, rotate - 3, rotate], y: [0, -6, 0] }}
      transition={{ duration: 8 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <polygon
        points="15,0 28,14 22,48 8,48 2,14"
        fill="url(#crystalFill)"
        stroke="url(#crystalStroke)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="crystalFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(225, 80%, 60%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(210, 90%, 70%)" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="crystalStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(225, 80%, 65%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(210, 90%, 75%)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </motion.svg>
    {/* Glow */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size * 1.8,
        height: size * 1.8,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, hsla(225, 80%, 60%, 0.12) 0%, transparent 70%)",
      }}
    />
  </motion.div>
);

const FlowingLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1000 400"
    preserveAspectRatio="none"
    fill="none"
  >
    <motion.path
      d="M120,80 C250,60 350,200 500,60 C650,200 750,120 880,280"
      stroke="url(#lineGrad1)"
      strokeWidth="1"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.path
      d="M250,300 C400,250 500,100 750,280 C850,200 900,320 950,260"
      stroke="url(#lineGrad2)"
      strokeWidth="0.8"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2.8, ease: "easeInOut", delay: 0.8 }}
    />
    <defs>
      <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(225, 80%, 65%)" stopOpacity="0" />
        <stop offset="30%" stopColor="hsl(225, 80%, 65%)" stopOpacity="0.2" />
        <stop offset="70%" stopColor="hsl(210, 90%, 75%)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="hsl(210, 90%, 75%)" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="hsl(210, 90%, 70%)" stopOpacity="0" />
        <stop offset="40%" stopColor="hsl(225, 80%, 60%)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="hsl(225, 80%, 60%)" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const MissionSection = () => (
  <section
    className="relative py-24 px-6 overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg, hsl(270 40% 96%) 0%, hsl(225 30% 95%) 50%, hsl(210 20% 97%) 100%)",
    }}
  >
    {/* Crystals */}
    {crystalPositions.map((c, i) => (
      <Crystal key={i} {...c} />
    ))}

    {/* Flowing lines */}
    <FlowingLines />

    <div className="relative z-10 max-w-[750px] mx-auto">
      <div className="flex justify-center mb-8">
        <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
          OUR MISSION
        </span>
      </div>
      <motion.div
        className="border-2 border-dashed border-border/60 rounded-2xl bg-background/70 backdrop-blur-sm p-10 sm:p-14 text-center shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="font-display text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
          To provide sincerity insights to organizations that enhances their
          confidence in the truth.
        </p>
      </motion.div>
    </div>
  </section>
);

export default MissionSection;
