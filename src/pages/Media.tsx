import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/routes";
import { blogPosts, getPressPosts, getNonPressPosts, type BlogPost } from "@/lib/blog-data";

/* ── Press card (horizontal, compact) ── */
const PressCard = ({ post }: { post: BlogPost }) => (
  <a
    href={post.externalUrl || "#"}
    target={post.externalUrl ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300"
  >
    <img
      src={post.image}
      alt={post.title}
      width={240}
      height={135}
      loading="lazy"
      decoding="async"
      className="w-full sm:w-60 h-36 object-cover rounded-xl flex-shrink-0"
    />
    <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
      <div>
        {post.source && (
          <span className="type-tag gradient-text mb-2 block">{post.source}</span>
        )}
        <h3 className="type-card-title text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="type-body text-muted-foreground mt-1 line-clamp-2 text-sm">{post.excerpt}</p>
      </div>
      <div className="flex items-center gap-3 mt-3 text-muted-foreground text-xs">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
        <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  </a>
);

/* ── Netflix-style blog poster tile ── */
const BlogTile = ({ post }: { post: BlogPost }) => (
  <article className="group flex-shrink-0 w-[280px] sm:w-[300px] snap-start">
    <Link to={`/media/${post.slug}`} className="block">
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
        <img
          src={post.image}
          alt={post.title}
          width={300}
          height={400}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        {/* Category pill */}
        <span className="absolute top-3 left-3 gradient-pill">{post.category}</span>
        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-base font-semibold text-primary-foreground leading-tight line-clamp-2 mb-1">
            {post.title}
          </h3>
          <p className="text-primary-foreground/70 text-xs line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-2 mt-2 text-primary-foreground/60 text-xs">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  </article>
);

/* ── Category row (Netflix-like horizontal scroll) ── */
const CategoryRow = ({ title, posts }: { title: string; posts: BlogPost[] }) => {
  if (posts.length === 0) return null;
  return (
    <section className="mb-16">
      <h2 className="type-subheading mb-6 px-1">{title}</h2>
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {posts.map((post) => (
          <BlogTile key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

/* ── JSON-LD schemas ── */
function buildBlogSchemas(posts: BlogPost[]) {
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Voicera Media & Press",
    description: "Latest news, product updates, and press coverage from Voicera.",
    url: `${SITE_URL}/media`,
    isPartOf: { "@type": "WebSite", name: "Voicera", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/media/${post.slug}`,
        name: post.title,
      })),
    },
  };

  const blogPostingSchemas = posts.map((post) => ({
    "@context": "https://schema.org",
    "@type": post.category === "press" ? "NewsArticle" : "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Voicera" },
    publisher: {
      "@type": "Organization",
      name: "Voicera",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    url: post.externalUrl || `${SITE_URL}/media/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/media/${post.slug}`,
  }));

  return { collectionPage, blogPostingSchemas };
}

const Media = () => {
  const pressPosts = useMemo(() => getPressPosts(), []);
  const nonPressPosts = useMemo(() => getNonPressPosts(), []);

  const productPosts = useMemo(() => nonPressPosts.filter((p) => p.category === "product"), [nonPressPosts]);
  const engineeringPosts = useMemo(() => nonPressPosts.filter((p) => p.category === "engineering"), [nonPressPosts]);
  const companyPosts = useMemo(() => nonPressPosts.filter((p) => p.category === "company"), [nonPressPosts]);

  const { collectionPage, blogPostingSchemas } = useMemo(() => buildBlogSchemas(blogPosts), []);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Media & Press — Voicera"
        description="Latest news, product updates, engineering deep-dives, and press coverage from Voicera."
        path="/media"
      />

      {/* Extra structured data for AEO/AGO */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(collectionPage)}</script>
        {blogPostingSchemas.map((schema, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="blog" />
        <meta property="og:image" content={blogPosts[0]?.image} />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Page header */}
          <header className="mb-16">
            <Link to="/" className="inline-flex items-center gap-1.5 type-nav text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="type-display mb-4">
              Media & <span className="gradient-text">Press</span>
            </h1>
            <p className="type-body max-w-2xl">
              The latest from Voicera — product launches, press coverage, engineering insights, and company news.
            </p>
          </header>

          {/* Press row */}
          {pressPosts.length > 0 && (
            <section className="mb-20" aria-label="Press Coverage">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="type-subheading">Press Coverage</h2>
                <span className="gradient-pill">Featured</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pressPosts.map((post) => (
                  <PressCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Netflix-style category rows */}
          <CategoryRow title="Product Updates" posts={productPosts} />
          <CategoryRow title="Engineering" posts={engineeringPosts} />
          <CategoryRow title="Company News" posts={companyPosts} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Media;
