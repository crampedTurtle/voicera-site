import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollStorytelling from "@/components/ScrollStorytelling";
import FeatureTabs from "@/components/FeatureTabs";
import SolutionsSection from "@/components/SolutionsSection";
import SocialProof from "@/components/SocialProof";
import Testimonial from "@/components/Testimonial";
import DarkSection from "@/components/DarkSection";
import InvestorsSection from "@/components/InvestorsSection";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ScrollStorytelling />
      <FeatureTabs />
      <DarkSection />
      <Testimonial />
      <SolutionsSection />
      <InvestorsSection />
      <SocialProof />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
