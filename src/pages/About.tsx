import Navbar from "@/components/Navbar";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import HeroSphere from "@/components/HeroSphere";
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <h1 className="type-display text-foreground leading-[1.1]">
            Words are only half the story.
          </h1>
          <div className="border-l border-border pl-8">
            <p className="type-body text-muted-foreground text-base sm:text-lg leading-relaxed">
              We're pioneering the first multimodal credibility intelligence
              platform that measures what humans actually mean — not just what
              they say — setting a new standard for trust in every high-stakes
              interaction.
            </p>
          </div>
        </div>
      </section>

      <TeamSection />
      <Footer />
    </div>
  );
};

export default About;
