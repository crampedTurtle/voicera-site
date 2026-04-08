import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryLabel } from "@/lib/blog-data";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/media" className="text-primary hover:underline">← Back to Media</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Voicera",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    url: `${SITE_URL}/media/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/media/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd title={(post as any).seo_title || `${post.title} — Voicera`} description={(post as any).seo_description || post.excerpt} path={`/media/${post.slug}`} />
      <Helmet>
        <title>{(post as any).seo_title || `${post.title} — Voicera`}</title>
        <meta name="description" content={(post as any).seo_description || post.excerpt} />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.date} />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Category */}
          <span className="gradient-pill capitalize mb-4 inline-block">
            {getCategoryLabel(post.category)}
          </span>

          {/* Title */}
          <h1 className="type-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {dateFormatted}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.read_time} min read
            </span>
            <span>By {post.author}</span>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:text-foreground
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-img:rounded-xl prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, {
              ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','a','ul','ol','li','strong','em','br','img','blockquote','pre','code','span','div','figure','figcaption','table','thead','tbody','tr','th','td','hr','sub','sup'],
              ALLOWED_ATTR: ['href','src','alt','title','class','id','target','rel','width','height','loading','decoding'],
              ALLOW_DATA_ATTR: false,
              ADD_ATTR: ['rel'],
              FORBID_TAGS: ['script','style','iframe','object','embed','form','input','textarea','select','button'],
              FORBID_ATTR: ['onerror','onload','onclick','onmouseover','onfocus','onblur','style'],
            }) }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
