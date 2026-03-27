import Navbar from "@/components/Navbar";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="About — Voicera"
        description="Learn about Voicera's mission to bring trust and credibility intelligence to every human interaction, powered by multimodal AI."
        path="/about"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground inline-block mb-6">
            ABOUT VOICERA
          </span>
          <h1 className="type-display mb-6">
            The Intelligence Layer for Human Credibility
          </h1>
          <p className="type-body text-muted-foreground max-w-2xl mx-auto">
            Voicera uses multimodal AI to analyze verbal and non-verbal cues in
            real time — helping organizations across sales, hiring, legal, and
            law enforcement make decisions grounded in the science of sincerity.
            We believe trust should be measurable, not assumed.
          </p>
        </div>
      </section>

      <TeamSection />
      <Footer />
    </div>
  );
};

export default About;
