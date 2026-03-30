/**
 * Generates sitemap.xml from the centralized route registry.
 * Called by the Vite plugin on every build/dev start so it's always up-to-date.
 * Can also be run standalone: npx tsx scripts/generate-sitemap.ts
 */

import { siteRoutes, SITE_URL } from "../src/lib/routes";
import * as fs from "fs";
import * as path from "path";

export function generateSitemapXml(): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = siteRoutes
    .filter((r) => r.path !== "/sitemap") // sitemap page itself is optional
    .map(
      (route) => `  <url>
    <loc>${SITE_URL}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

// Run standalone
const outPath = path.resolve(import.meta.dirname, "../public/sitemap.xml");
fs.writeFileSync(outPath, generateSitemapXml(), "utf-8");
console.log(`✅ sitemap.xml generated with ${siteRoutes.length} routes`);
