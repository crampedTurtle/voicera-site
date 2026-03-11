import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BarChart3, Search } from "lucide-react";

const tabs = [
  {
    id: "transcribe",
    label: "TRANSCRIBE API",
    icon: FileText,
    title: "Convert speech to text with unmatched precision",
    desc: "Production-grade transcription with speaker diarization, punctuation restoration, and custom vocabulary support. Process hours of audio in minutes.",
    features: ["99%+ accuracy", "50+ languages", "Speaker diarization", "Real-time streaming"],
  },
  {
    id: "analyze",
    label: "ANALYZE API",
    icon: BarChart3,
    title: "Extract intelligence from every conversation",
    desc: "Go beyond words. Understand sentiment, detect emotions, identify key topics, and generate summaries automatically from any audio source.",
    features: ["Sentiment analysis", "Emotion detection", "Topic extraction", "Auto-summarization"],
  },
  {
    id: "search",
    label: "VOICE SEARCH API",
    icon: Search,
    title: "Find any moment using natural language",
    desc: "Semantic search across your entire audio library. Ask questions in plain English and find the exact moment you're looking for.",
    features: ["Natural language queries", "Semantic understanding", "Cross-file search", "Timestamp precision"],
  },
];

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState("transcribe");
  const activeData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="gradient-pill">PLATFORM</span>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-body" style={{ letterSpacing: "-0.02em" }}>
            Multimodal AI that{" "}
            <br className="hidden md:block" />
            understands time and space.
          </h2>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-secondary rounded-full p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] rounded-full transition-colors duration-200"
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
              <h3 className="text-3xl font-semibold text-body mb-4">{activeData.title}</h3>
              <p className="text-body-muted text-lg mb-8" style={{ lineHeight: 1.7 }}>{activeData.desc}</p>
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
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-body-muted">{activeData.label}</span>
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
