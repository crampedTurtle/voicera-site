import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import JsonLd from "@/components/JsonLd";

// Lazy load below-fold sections
const SocialProof = lazy(() => import("@/components/SocialProof"));
const ScrollStorytelling = lazy(() => import("@/components/ScrollStorytelling"));
const SolutionsSection = lazy(() => import("@/components/SolutionsSection"));
const FeatureTabs = lazy(() => import("@/components/FeatureTabs"));
const DarkSection = lazy(() => import("@/components/DarkSection"));
const ApiStreamBar = lazy(() => import("@/components/ApiStreamBar"));
const CaseStudies = lazy(() => import("@/components/CaseStudies"));
const InvestorsSection = lazy(() => import("@/components/InvestorsSection"));
const TeamSection = lazy(() => import("@/components/TeamSection"));
const CTABanner = lazy(() => import("@/components/CTABanner"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionFallback = () => (
  <div className="min-h-[200px]" />
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Voicera — The Intelligence Layer for Human Credibility"
        description="Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — helping sales teams coach reps, qualify prospects faster, and close deals with data-backed confidence."
        path="/"
      />
      <Navbar />
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <SocialProof />
        <ScrollStorytelling />
        <SolutionsSection />
        <FeatureTabs />
        <DarkSection />
        <ApiStreamBar />
        <Testimonial />
        <InvestorsSection />
        <TeamSection />
        <CTABanner />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
