import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import HeroSection from "@/components/HeroSection";
import JsonLd from "@/components/JsonLd";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Lazy load below-fold sections
const SocialProof = lazy(() => import("@/components/SocialProof"));
const ScrollStorytelling = lazy(() => import("@/components/ScrollStorytelling"));
const SolutionsSection = lazy(() => import("@/components/SolutionsSection"));
const FeatureTabs = lazy(() => import("@/components/FeatureTabs"));

const ApiStreamBar = lazy(() => import("@/components/ApiStreamBar"));
const CaseStudies = lazy(() => import("@/components/CaseStudies"));
const InvestorsSection = lazy(() => import("@/components/InvestorsSection"));

const CTABanner = lazy(() => import("@/components/CTABanner"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => (
  <div className="min-h-[200px]" />
);

const homeFaqItems = [
  { q: "What is Sincerity™ by Voicera?", a: "Sincerity™ is a multimodal AI credibility intelligence platform. It analyzes audio, video, or composite signals to produce a sincerity score and is delivered as a native data layer that host platforms embed via API." },
  { q: "Who is Voicera built for?", a: "Voicera is built for platform builders — Product Managers and CTOs at software companies who embed credibility intelligence into their own products. Voicera does not sell directly to end users." },
  { q: "How does Sincerity™ integrate with a host platform?", a: "Sincerity™ integrates as a native data layer through Voicera's API. Host platforms embed the API to power sincerity scoring inside their own product experiences." },
  { q: "What industries use Voicera?", a: "Voicera powers platforms in sales tech, revenue intelligence, HR tech, law enforcement tech, dating, and legal tech." },
  { q: "How is Voicera priced?", a: "Three paths: per-minute or per-hour API pricing with volume tiers, Platform Web App plans, and Custom Deployment for enterprise builders." },
];

const Index = () => {
  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Voicera — The Intelligence Layer for Human Credibility"
        description="Voicera builds Sincerity™, multimodal AI credibility intelligence that software builders embed into their own platforms. Power your product with audio, video, and composite sincerity analysis via native API."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      <StickyNavbar />
      <Navbar />

      {/* AEO: Semantic direct-answer block for retrieval systems */}
      <section aria-label="What is Sincerity" className="sr-only">
        <p>
          Sincerity™ is a multimodal AI credibility intelligence platform built by Voicera. It analyzes audio, video, and composite signals to produce a calibrated sincerity score, delivered as a native data layer that software builders embed into their own platforms via API.
        </p>
      </section>

      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <SocialProof />
        <ScrollStorytelling />
        <SolutionsSection />
        <FeatureTabs />
        
        <ApiStreamBar />
        <CaseStudies />
        <InvestorsSection />

        {/* ═══ FAQ ═══ */}
        <section style={{ background: "#F7F9FC", padding: "100px 32px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, background: "rgba(37,99,235,0.08)", color: "#2563EB" }}>FAQ</span>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "16px 0 0", letterSpacing: "-0.025em" }}>
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {homeFaqItems.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-[#e2e8f0] rounded-xl px-6 overflow-hidden" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <AccordionTrigger className="text-left text-[15px] font-semibold text-[#0f172a] hover:no-underline py-5">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[14px] text-[#64748b] leading-[1.7] pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        <CTABanner />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
