/**
 * Centralized route registry — single source of truth for all pages.
 * Add new routes here and they'll auto-appear in the sitemap, JSON-LD, and Sitemap page.
 */

export interface SiteRoute {
  path: string;
  title: string;
  description: string;
  /** Priority for sitemap.xml (0.0 – 1.0) */
  priority: number;
  /** Change frequency hint for crawlers */
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** ISO date string of last modification */
  lastmod?: string;
  /** Whether to include in the visual sitemap page */
  showInSitemap?: boolean;
  /** Grouping category for the visual sitemap page */
  category?: string;
}

export const SITE_URL = "https://voicera.ai";

export const siteRoutes: SiteRoute[] = [
  {
    path: "/",
    title: "Voicera — The Intelligence Layer for Human Credibility",
    description:
      "Voicera uses multimodal AI to analyze verbal and non-verbal cues in real time — helping sales teams coach reps, qualify prospects faster, and close deals with data-backed confidence.",
    priority: 1.0,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Main",
  },
  {
    path: "/solutions/sales",
    title: "Sincerity™ for Sales — Voicera",
    description: "Close deals with credibility intelligence. Analyze verbal and non-verbal cues in real time to qualify prospects and coach reps.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Solutions",
  },
  {
    path: "/solutions/hr",
    title: "Sincerity™ for HR — Voicera",
    description: "Hire with confidence using multimodal AI interview analysis that reduces bias and improves quality-of-hire.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Solutions",
  },
  {
    path: "/solutions/law-enforcement",
    title: "Sincerity™ for Law Enforcement — Voicera",
    description: "AI-powered credibility assessment for investigations — analyze verbal and non-verbal behaviour with scientific objectivity.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Solutions",
  },
  {
    path: "/solutions/dating",
    title: "Sincerity™ for Dating — Voicera",
    description: "Bring trust to online dating with AI-verified sincerity signals that help users find genuine connections.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Solutions",
  },
  {
    path: "/solutions/legal",
    title: "Sincerity™ for Legal — Voicera",
    description: "Credibility analysis for depositions and witness prep — AI insights that strengthen case strategy.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Solutions",
  },
  {
    path: "/media",
    title: "Media & Press — Voicera",
    description:
      "Latest news, product updates, engineering deep-dives, and press coverage from Voicera — the intelligence layer for human credibility.",
    priority: 0.8,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Main",
  },
  {
    path: "/about",
    title: "About — Voicera",
    description: "Learn about Voicera's mission, team, and the science of credibility intelligence.",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Company",
  },
  {
    path: "/investors",
    title: "Investors — Voicera",
    description: "Explore investment opportunities with Voicera — the intelligence layer for human credibility.",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Company",
  },
  {
    path: "/partners",
    title: "Become a Partner — Voicera",
    description: "Join the Voicera Partner Program. Integrate our APIs, access co-marketing resources, and earn recurring revenue.",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Company",
  },
  {
    path: "/sitemap",
    title: "Sitemap — Voicera",
    description: "Complete sitemap of all pages on the Voicera website.",
    priority: 0.3,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    showInSitemap: true,
    category: "Company",
  },
];

/**
 * Helper to add a new route at runtime or during development.
 * In production the Vite plugin reads this file to generate sitemap.xml.
 */
export function getRoutes(): SiteRoute[] {
  return siteRoutes;
}
