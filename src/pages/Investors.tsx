import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import InvestorsSection from "@/components/InvestorsSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const Investors = () => {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Investors — Voicera"
        description="Explore investment opportunities with Voicera — the intelligence layer for human credibility in the trust economy."
        path="/investors"
      />
      <Navbar />
      <StickyNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground inline-block mb-6">
            INVESTOR RELATIONS
          </span>
          <h1 className="type-display mb-6">
            Invest in the Trust Economy
          </h1>
          <p className="type-body text-muted-foreground max-w-2xl mx-auto">
            The demand for credibility verification is accelerating as deepfakes
            and synthetic media reshape every industry. Voicera sits at the
            intersection of AI and human trust — a trillion-dollar opportunity.
          </p>
        </div>
      </section>

      <InvestorsSection />
      <Footer />
    </div>
  );
};

export default Investors;
