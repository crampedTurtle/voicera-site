import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ApiStreamBar from "@/components/ApiStreamBar";
import ScrollStorytelling from "@/components/ScrollStorytelling";
import FeatureTabs from "@/components/FeatureTabs";
import SolutionsSection from "@/components/SolutionsSection";
import SocialProof from "@/components/SocialProof";
import Testimonial from "@/components/Testimonial";
import DarkSection from "@/components/DarkSection";
import InvestorsSection from "@/components/InvestorsSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

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
      <ApiStreamBar />
      <SocialProof />
      <ScrollStorytelling />
      <SolutionsSection />
      <FeatureTabs />
      <DarkSection />
      <Testimonial />
      <InvestorsSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
