import { motion } from "framer-motion";
import { Users, Video, ShieldCheck } from "lucide-react";

const useCases = [
  {
    icon: Users,
    label: "SALES COACHING",
    title: "Turn Subjective Coaching into Data-Driven Science",
    desc: "Analyze every rep's calls automatically. Surface coachable moments, track improvement over time, and replicate top-performer behaviors across your entire team.",
    points: ["Automated call scoring", "Rep performance trends", "Coachable moment detection", "Manager dashboards"],
  },
  {
    icon: Video,
    label: "REMOTE HIRING",
    title: "Remote Hiring Made Transparent",
    desc: "Evaluate candidates objectively with AI-powered credibility and engagement scoring. Remove bias from interviews and make confident hiring decisions — no matter the timezone.",
    points: ["Interview credibility scores", "Engagement & sentiment analysis", "Structured evaluation reports", "Bias-reduction framework"],
  },
  {
    icon: ShieldCheck,
    label: "CREDIBILITY ASSESSMENT",
    title: "Automate Credibility Assessment for High-Stakes Video",
    desc: "From investor pitches to compliance reviews, Voicera scores verbal and non-verbal credibility signals so you can make faster, more informed decisions on the people that matter.",
    points: ["Micro-expression analysis", "Verbal consistency scoring", "Confidence & conviction metrics", "Risk flagging alerts"],
  },
];

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.2, ease: "easeOut" } },
};

const SolutionsSection = () => (
  <section className="section-padding bg-alt">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="gradient-pill">USE CASES</span>
        <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-body" style={{ letterSpacing: "-0.02em" }}>
          Solutions for Sales Teams
        </h2>
        <p className="text-body-muted text-lg mt-4 max-w-2xl mx-auto">
          Purpose-built AI for revenue teams who need objective, scalable insights from every conversation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {useCases.map((uc, i) => (
          <motion.div
            key={uc.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            variants={cardVariants}
            whileHover="hover"
            className="group card-surface p-8 flex flex-col relative overflow-hidden cursor-default"
          >
            {/* Gradient border on hover */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                padding: "1.5px",
                background: "linear-gradient(135deg, #4B6EF5 0%, #9B4DEB 30%, #F0187A 65%, #F4621A 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                borderRadius: "1rem",
              }}
            />

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 gradient-bg opacity-90">
              <uc.icon size={22} strokeWidth={1.5} className="text-white" />
            </div>

            {/* Label */}
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-body-muted mb-3">{uc.label}</span>

            {/* Title */}
            <h3 className="text-xl font-semibold text-body mb-3" style={{ lineHeight: 1.3 }}>
              {uc.title}
            </h3>

            {/* Description */}
            <p className="text-body-muted text-sm mb-6 flex-1" style={{ lineHeight: 1.7 }}>
              {uc.desc}
            </p>

            {/* Feature points */}
            <ul className="space-y-2">
              {uc.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-body-muted">
                  <div className="w-1.5 h-1.5 rounded-full gradient-bg flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionsSection;
