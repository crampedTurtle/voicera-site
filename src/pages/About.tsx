import Navbar from "@/components/Navbar";
import StickyNavbar from "@/components/StickyNavbar";
import TeamSection from "@/components/TeamSection";
import MissionSection from "@/components/MissionSection";
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
      <StickyNavbar />

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

      {/* Our Mission */}
      <section className="py-20 px-6">
        <div className="max-w-[750px] mx-auto">
          <div className="flex justify-center mb-8">
            <span className="type-tag border border-border rounded-full px-4 py-1.5 text-foreground">
              OUR MISSION
            </span>
          </div>
          <div className="border-2 border-dashed border-border/60 rounded-2xl bg-muted/40 p-10 sm:p-14 text-center">
            <p className="font-display text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
              To provide sincerity insights to organizations that enhances their confidence in the truth.
            </p>
          </div>
        </div>
      </section>

      <TeamSection />

      {/* Careers + Media — two side-by-side cards */}
      <section className="py-16 px-6" style={{ background: "hsl(225 80% 52%)" }}>
        <div className="max-w-[950px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Careers */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center flex flex-col items-center justify-center">
            <h2 className="type-display text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style={{ color: '#ffffff' }}>
              Come Build With Us
            </h2>
            <a
              href="https://wellfound.com/recruit/applicants/jobs/3276319"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-lg sm:text-xl underline underline-offset-4 transition-colors"
            >
              Explore open positions →
            </a>
          </div>
          {/* Media */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center flex flex-col items-center justify-center">
            <h2 className="type-display text-3xl sm:text-4xl md:text-5xl leading-tight mb-4" style={{ color: '#ffffff' }}>
              Media
            </h2>
            <a
              href="/voicera-brand-kit.zip"
              download
              className="text-white/80 hover:text-white text-lg sm:text-xl underline underline-offset-4 transition-colors"
            >
              Download our brand kit (zip) →
            </a>
            <button
              type="button"
              onClick={() => {
                const u = ['r','y','a','n'].join('') + String.fromCharCode(64) + ['v','o','i','c','e','r','a'].join('') + '.' + ['i','o'].join('');
                const s = encodeURIComponent('Press Inquiry - Voicera');
                window.location.href = `mailto:${u}?subject=${s}`;
              }}
              className="text-white/80 hover:text-white text-lg sm:text-xl underline underline-offset-4 transition-colors mt-3 cursor-pointer bg-transparent border-none"
            >
              Press Inquiry →
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
