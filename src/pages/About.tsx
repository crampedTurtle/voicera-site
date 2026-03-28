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
      <section className="pt-44 pb-20 px-6">
        <div className="max-w-[950px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <h1 className="type-display text-foreground leading-[1.1]">
            Seeing isn't believing.
          </h1>
          <div className="border-l border-border pl-8">
            <p className="type-body text-muted-foreground text-base sm:text-lg leading-relaxed">
              We're pioneering the first behavioral-science-native AI that
              determines whether what you're observing is true (not just what's
              happening) setting a new standard for trust in every high-stakes
              interaction.
            </p>
          </div>
        </div>
      </section>

      {/* Sphere graphic */}
      <section className="py-16 px-6 flex justify-center">
        <HeroSphere />
      </section>

      {/* What We Believe */}
      <section className="py-20 px-6 bg-muted">
        <div className="max-w-[950px] mx-auto text-center">
          <div className="flex justify-center mb-8">
            <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
              WHAT WE BELIEVE
            </span>
          </div>
          <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
            AI should make humans more accurate, not more passive. Trust should be measurable, not assumed. And in a world where the most important conversations happen on screen, the organizations that can read people clearly will always make better decisions than those who can't. That's why we built Voicera.
          </p>
        </div>
      </section>

      <TeamSection />

      {/* Careers CTA — investor-style blue band */}
      <section className="py-16 px-6" style={{ background: "hsl(225 80% 52%)" }}>
        <div className="max-w-[950px] mx-auto text-center">
          <h2 className="type-display text-4xl sm:text-5xl md:text-7xl leading-tight mb-4" style={{ color: '#ffffff' }}>
            Come Build With Us
          </h2>
          <a
            href="https://www.linkedin.com/company/voicera-ai/jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-lg sm:text-xl underline underline-offset-4 transition-colors"
          >
            Explore open positions →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
