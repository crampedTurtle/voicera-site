/**
 * Vite plugin & standalone script to generate sitemap.xml from the route registry.
 * Runs automatically at build time.
 */

import { siteRoutes, SITE_URL } from "../src/lib/routes";
import * as fs from "fs";
import * as path from "path";

function generateSitemapXml(): string {
  const urls = siteRoutes
    .map(
      (route) => `  <url>
    <loc>${SITE_URL}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${route.lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

// Write to public/ so it's served at /sitemap.xml
const outPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outPath, generateSitemapXml(), "utf-8");
console.log(`✅ sitemap.xml generated with ${siteRoutes.length} routes`);
