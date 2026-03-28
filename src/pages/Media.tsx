import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { type BlogPost, getCategoryLabel } from "@/lib/blog-data";

const CATEGORIES = [
  "All posts",
  "Sales Intelligence",
  "Sales Enablement",
  "Platform",
  "Trust & Credibility",
  "HR & Hiring",
  "Press",
] as const;
type FilterCategory = (typeof CATEGORIES)[number];

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "Sales Intelligence": "sales-intelligence",
  "Sales Enablement": "sales-enablement",
  "Platform": "platform",
  "Trust & Credibility": "trust-credibility",
  "HR & Hiring": "hr-hiring",
  "Press": "press",
};

/* ── Grid tile ── */
const GridTile = ({ post }: { post: BlogPost }) => {
  const isPress = post.category === "press";

  return (
    <article className="group">
      <Link to={`/media/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-3">
          <img
            src={post.image}
            alt={post.title}
            width={400}
            height={533}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <span className="absolute top-3 left-3 gradient-pill capitalize">{getCategoryLabel(post.category)}</span>
          {isPress && post.source && (
            <span className="absolute top-3 right-3 text-xs font-medium text-primary-foreground/80 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {post.source}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-base font-semibold text-primary-foreground leading-tight line-clamp-2 mb-1">
              {post.title}
            </h3>
            <p className="text-primary-foreground/70 text-xs line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-2 text-primary-foreground/60 text-xs">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </time>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime} min
              </span>
              {hasExternal && <ArrowUpRight className="w-3.5 h-3.5 ml-auto" />}
            </div>
          </div>
        </div>
      </Link>
    </article>
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
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All posts");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data || []).map((row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: row.date,
        author: row.author,
        category: row.category,
        image: row.image,
        readTime: row.read_time,
        externalUrl: row.external_url ?? undefined,
        source: row.source ?? undefined,
      })) as BlogPost[];
    },
  });

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All posts") return posts;
    const slug = CATEGORY_SLUG_MAP[activeFilter];
    return posts.filter((p) => p.category === slug);
  }, [activeFilter, posts]);

  const { collectionPage, blogPostingSchemas } = useMemo(() => buildBlogSchemas(posts), [posts]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        title="Media & Press — Voicera"
        description="Latest news, product updates, engineering deep-dives, and press coverage from Voicera."
        path="/media"
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(collectionPage)}</script>
        {blogPostingSchemas.map((schema, i) => (
          <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:type" content="blog" />
        <meta property="og:image" content={posts[0]?.image} />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Page header */}
          <header className="mb-14 mt-4 border-l-2 border-border pl-6">
            <h1 className="type-display mb-4">
              Media & <span className="gradient-text">Press</span>
            </h1>
            <p className="type-body max-w-2xl">
              The latest from Voicera — product launches, press coverage, engineering insights, and company news.
            </p>
          </header>

          {/* Filter capsules */}
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Post grid */}
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl aspect-[3/4] bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPosts.map((post) => (
                <GridTile key={post.slug} post={post} />
              ))}
            </div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No posts in this category yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Media;
