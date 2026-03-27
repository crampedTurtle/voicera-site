/**
 * Blog post types and utilities. Data is fetched from the database.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  author: string;
  category: string;
  /** Poster image URL */
  image: string;
  /** Reading time in minutes */
  readTime: number;
  /** External link for press/original articles */
  externalUrl?: string;
  /** Source publication for press */
  source?: string;
}

/** Map raw DB category slugs to display labels */
export const CATEGORY_LABELS: Record<string, string> = {
  "sales-intelligence": "Sales Intelligence",
  "sales-enablement": "Sales Enablement",
  "platform": "Platform",
  "trust-credibility": "Trust & Credibility",
  "hr-hiring": "HR & Hiring",
  "press": "Press",
};

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] || cat;
}
