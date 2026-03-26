/**
 * Static blog/media data. Replace with CMS or API fetch when ready.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  author: string;
  category: "press" | "product" | "engineering" | "company";
  /** Poster image URL or import path */
  image: string;
  /** Reading time in minutes */
  readTime: number;
  /** External link for press articles */
  externalUrl?: string;
  /** Source publication for press */
  source?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "voicera-launches-sincerity-engine",
    title: "Voicera Launches Sincerity™ Engine for Real-Time Credibility Analysis",
    excerpt: "Our multimodal AI now scores verbal and non-verbal cues in under 200ms, giving sales teams an unprecedented edge in qualifying prospects.",
    date: "2026-03-20",
    author: "Voicera Team",
    category: "press",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    readTime: 4,
    source: "TechCrunch",
    externalUrl: "#",
  },
  {
    slug: "series-a-funding-announcement",
    title: "Voicera Raises $12M Series A to Scale AI-Powered Sales Intelligence",
    excerpt: "Led by top-tier investors, this round will accelerate product development and global expansion of our credibility analysis platform.",
    date: "2026-03-15",
    author: "Voicera Team",
    category: "press",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    readTime: 3,
    source: "Forbes",
    externalUrl: "#",
  },
  {
    slug: "ai-sales-coaching-future",
    title: "The Future of AI Sales Coaching: Beyond Call Recording",
    excerpt: "Why analyzing what people say is only half the picture — and how multimodal AI changes the game for revenue teams.",
    date: "2026-03-10",
    author: "Voicera Team",
    category: "product",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    readTime: 6,
  },
  {
    slug: "nonverbal-cues-in-sales",
    title: "Decoding Non-Verbal Cues: What Your Prospects Aren't Telling You",
    excerpt: "Research shows 55% of communication is non-verbal. Here's how Voicera captures the signals that close deals.",
    date: "2026-03-05",
    author: "Voicera Team",
    category: "product",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    readTime: 5,
  },
  {
    slug: "voicera-partner-program-launch",
    title: "Introducing the Voicera Partner Program for System Integrators",
    excerpt: "We're opening our API and SDK to partners who want to embed credibility intelligence into their own platforms.",
    date: "2026-02-28",
    author: "Voicera Team",
    category: "company",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    readTime: 4,
  },
  {
    slug: "real-time-sentiment-api",
    title: "Building with the Real-Time Sentiment API: A Developer Guide",
    excerpt: "A technical deep-dive into Voicera's WebSocket-based sentiment streaming API and how to integrate it in under 30 minutes.",
    date: "2026-02-20",
    author: "Voicera Team",
    category: "engineering",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    readTime: 8,
  },
  {
    slug: "voicera-featured-gartner-report",
    title: "Voicera Named in Gartner's Emerging Tech Report for Conversation Intelligence",
    excerpt: "Recognized for our unique multimodal approach combining voice, facial, and linguistic analysis in enterprise sales workflows.",
    date: "2026-02-15",
    author: "Voicera Team",
    category: "press",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    readTime: 3,
    source: "Gartner",
    externalUrl: "#",
  },
  {
    slug: "enterprise-security-compliance",
    title: "SOC 2 Type II Certified: Our Commitment to Enterprise Security",
    excerpt: "Voicera achieves SOC 2 Type II certification, ensuring the highest standards of data protection for our enterprise customers.",
    date: "2026-02-10",
    author: "Voicera Team",
    category: "company",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&q=80",
    readTime: 4,
  },
];

export function getPressPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.category === "press");
}

export function getNonPressPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.category !== "press");
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
