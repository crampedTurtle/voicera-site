import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, BarChart3, Search } from "lucide-react";
import CrystalCaveBackground from "@/components/CrystalCaveBackground";


const tabs = [
  {
    id: "transcribe",
    label: "TRANSCRIBE API",
    icon: Mic,
    title: "Not just speech. The full picture.",
    desc: "Voicera goes beyond transcription. Our multimodal engine captures tone, pace, micro-expressions, and verbal patterns — giving sales teams the complete context behind every conversation.",
    features: ["Real-time transcription", "Speaker diarization", "Tone & pace analysis", "Multi-language support"],
  },
  {
    id: "analyze",
    label: "ANALYZE API",
    icon: BarChart3,
    title: "API-first architecture for any workflow",
    desc: "Integrate credibility scoring, sentiment analysis, and behavioral insights directly into your CRM, coaching platform, or sales enablement stack with our RESTful APIs.",
    features: ["Credibility scoring", "Sentiment tracking", "Objection detection", "Deal risk signals"],
  },
  {
    id: "search",
    label: "VOICE SEARCH API",
    icon: Search,
    title: "Search across every sales conversation",
    desc: "Find the exact moment a prospect raised a concern, showed buying intent, or disengaged. Semantic search across your entire call library using natural language.",
    features: ["Natural language queries", "Cross-call search", "Moment-level precision", "Behavioral tagging"],
  },
];

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState("transcribe");
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="solutions" className="section-padding relative overflow-visible">
      {/* Crystal cave background */}
      <CrystalCaveBackground />
      {/* White fade overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, hsla(0,0%,100%,0.45) 0%, hsla(0,0%,100%,0.82) 25%, hsla(0,0%,100%,0.82) 75%, hsla(0,0%,100%,0.45) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">PLATFORM</span>
          <h2 className="type-display text-body mt-6">
            Not just speech.{" "}
            <br className="hidden md:block" />
            The full picture.
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-secondary rounded-full p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-6 py-2.5 type-tag rounded-full transition-colors duration-200"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 gradient-bg rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === tab.id ? "text-white" : "text-body-muted"}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h3 className="type-subheading text-body mb-4">{activeData.title}</h3>
              <p className="type-body mb-8">{activeData.desc}</p>
              <div className="grid grid-cols-2 gap-3">
                {activeData.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-body-muted">
                    <div className="w-1.5 h-1.5 rounded-full gradient-bg flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock UI card */}
            <div className="card-surface p-8 gradient-card-border">
              <div className="bg-alt rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <activeData.icon size={20} strokeWidth={1.5} className="text-body-muted" />
                  <span className="type-tag text-body-muted">{activeData.label}</span>
                </div>
                {/* Simulated code block */}
                <div className="bg-foreground/5 rounded-lg p-4 font-mono text-xs text-body-muted space-y-1">
                  <div><span className="text-primary">const</span> result = <span className="text-primary">await</span> voicera.{activeData.id}(&#123;</div>
                  <div className="pl-4">audio_url: <span className="text-accent">"https://..."</span>,</div>
                  <div className="pl-4">language: <span className="text-accent">"en"</span>,</div>
                  <div>&#125;);</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-2 rounded-full gradient-bg w-3/4" />
                  <div className="h-2 rounded-full bg-foreground/10 w-1/4" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeatureTabs;
