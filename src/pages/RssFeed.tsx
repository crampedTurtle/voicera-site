import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/routes";

interface FeedPost {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRssXml(posts: FeedPost[]): string {
  const now = new Date().toUTCString();
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/media/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/media/${escapeXml(post.slug)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.image ? `<enclosure url="${escapeXml(post.image)}" type="image/jpeg" />` : ""}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Voicera Blog</title>
    <link>${SITE_URL}/media</link>
    <description>Latest posts from Voicera — AI-powered communication intelligence</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

const RssFeed = () => {
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const generate = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, author, date, category, image")
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(50);

      if (data) {
        const xml = generateRssXml(data as FeedPost[]);
        const blob = new Blob([xml], { type: "application/rss+xml; charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        // Trigger download / display
        window.location.href = url;
      }
      setGenerated(true);
    };
    generate();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
      {generated ? "RSS feed generated. If download didn't start, your browser may not support RSS." : "Generating RSS feed…"}
    </div>
  );
};

export default RssFeed;
