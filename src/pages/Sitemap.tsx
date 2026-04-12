import { Link } from "react-router-dom";
import { getRoutes, SITE_URL } from "@/lib/routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { ExternalLink } from "lucide-react";

const Sitemap = () => {
  const routes = getRoutes().filter((r) => r.showInSitemap);
  const categories = [...new Set(routes.map((r) => r.category || "Other"))];

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Sitemap — Voicera"
        description="Complete sitemap of all pages on the Voicera website."
        path="/sitemap"
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <h1 className="type-display mb-4">Sitemap</h1>
        <p className="type-body mb-12 max-w-2xl">
          A complete index of all pages on voicera.io. This sitemap is
          automatically kept in sync as new pages and content are added.
        </p>

        <div className="mb-8">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 type-tag text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View XML Sitemap
          </a>
        </div>

        {categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="type-subheading mb-4 text-foreground">
              {category}
            </h2>
            <ul className="space-y-3">
              {routes
                .filter((r) => (r.category || "Other") === category)
                .map((route) => (
                  <li
                    key={route.path}
                    className="card-surface px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <Link
                        to={route.path}
                        className="type-card-title text-foreground hover:text-primary transition-colors"
                      >
                        {route.title.split("—")[0].trim()}
                      </Link>
                      <p className="type-footer mt-1">{route.description}</p>
                    </div>
                    <span className="type-tag text-muted-foreground shrink-0">
                      {SITE_URL}{route.path === "/" ? "" : route.path}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
