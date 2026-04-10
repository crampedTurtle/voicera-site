import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export interface SolutionPageData {
  slug: string;
  name: string;
  headline: string;
  description: string;
  features: { title: string; text: string }[];
}

export const solutions: SolutionPageData[] = [
  {
    slug: "sales",
    name: "Sincerity™ for Sales",
    headline: "Close Deals with Credibility Intelligence",
    description:
      "Analyze verbal and non-verbal cues in real time to qualify prospects faster, coach reps with precision, and boost close rates with data-backed confidence.",
    features: [
      { title: "Real-Time Scoring", text: "Get live credibility scores during discovery calls so reps know when prospects are engaged — or bluffing." },
      { title: "Rep Coaching", text: "AI-generated post-call insights highlight coaching moments, tone shifts, and missed buying signals." },
      { title: "Pipeline Confidence", text: "Replace gut-feel forecasts with multimodal data that predicts deal outcomes." },
    ],
  },
  {
    slug: "revenue-intelligence",
    name: "Revenue Intelligence",
    headline: "Revenue Intelligence & Forecast Accuracy",
    description:
      "Embed AI-powered deal credibility scoring into your RevOps platform. Sincerity™ decodes buyer commitment, flags churn risk, and improves forecast accuracy to within 5%.",
    features: [
      { title: "Commitment Detection", text: "Separate verbal yes from contractual intent with per-segment sincerity scoring." },
      { title: "Pre-Churn Signals", text: "Catch resignation before the renewal conversation with early-warning credibility signals." },
      { title: "Forecast Confidence", text: "Replace gut-feel with an auditable credibility score embedded in your forecasting engine." },
    ],
  },
  {
    slug: "hr",
    name: "Sincerity™ for HR",
    headline: "Hire with Confidence, Not Guesswork",
    description:
      "Evaluate candidate sincerity and cultural fit through multimodal analysis of interviews — reducing bias and improving quality-of-hire.",
    features: [
      { title: "Interview Intelligence", text: "Detect hesitation, confidence, and consistency across verbal and non-verbal channels during live interviews." },
      { title: "Bias Reduction", text: "Standardize candidate evaluation with objective, data-driven credibility metrics." },
      { title: "Structured Feedback", text: "Generate detailed interview scorecards automatically for hiring panels." },
    ],
  },
  {
    slug: "law-enforcement",
    name: "Sincerity™ for Law Enforcement",
    headline: "Truth Detection Backed by Science",
    description:
      "Assist investigations with AI-powered analysis of verbal and non-verbal behaviour, providing officers with objective credibility assessments.",
    features: [
      { title: "Statement Analysis", text: "Multimodal AI evaluates consistency between verbal claims and micro-expressions in real time." },
      { title: "Interview Assist", text: "Provide investigators with live cues and follow-up prompts based on detected anomalies." },
      { title: "Audit-Ready Reports", text: "Generate evidence-grade reports with timestamped credibility data for case files." },
    ],
  },
  {
    slug: "dating",
    name: "Sincerity™ for Dating",
    headline: "Know Who's Real Before You Swipe",
    description:
      "Bring trust back to online dating with AI-verified sincerity signals — helping users spot genuine connections and avoid deception.",
    features: [
      { title: "Profile Verification", text: "Video-based sincerity checks add a trust layer that static photos can't provide." },
      { title: "Conversation Insights", text: "Real-time cues help users understand when a match is genuinely engaged." },
      { title: "Safety Signals", text: "Flag inconsistencies between profile claims and live interactions for safer connections." },
    ],
  },
  {
    slug: "legal",
    name: "Sincerity™ for Legal",
    headline: "Credibility Analysis for the Courtroom",
    description:
      "Equip legal teams with AI-powered witness and deposition analysis — surfacing credibility insights that strengthen case strategy.",
    features: [
      { title: "Deposition Review", text: "Analyze recorded depositions for verbal inconsistencies and non-verbal stress indicators." },
      { title: "Witness Prep", text: "Coach witnesses with objective feedback on how their delivery impacts perceived credibility." },
      { title: "Jury Insights", text: "Model how testimony credibility may be perceived using multimodal behavioural benchmarks." },
    ],
  },
];

export function getSolutionBySlug(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

const SolutionPage = ({ solution }: { solution: SolutionPageData }) => (
  <div className="min-h-screen bg-background">
    <JsonLd
      title={`${solution.name} — Voicera`}
      description={solution.description}
      path={`/solutions/${solution.slug}`}
    />
    <Navbar />
    <main className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <span className="gradient-pill mb-4 inline-block">{solution.name}</span>
        <h1 className="type-display mb-4">{solution.headline}</h1>
        <p className="type-body max-w-2xl mb-16">{solution.description}</p>

        <div className="grid gap-6 md:grid-cols-3">
          {solution.features.map((f) => (
            <div
              key={f.title}
              className="card-surface p-6 border border-border gradient-card-border"
            >
              <h3 className="type-card-title text-foreground mb-2">{f.title}</h3>
              <p className="type-body text-sm">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <button className="gradient-bg px-6 py-3 type-button text-white rounded-xl hover:scale-[1.03] transition-transform hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)] inline-flex items-center gap-1.5">
            Book a Demo <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="https://sincerity.voicera.io/auth/login"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border-rect px-6 py-3 type-button rounded-xl inline-flex items-center gap-1.5"
          >
            <span className="btn-label inline-flex items-center gap-1.5">
              Try It Now <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SolutionPage;
