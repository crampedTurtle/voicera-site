/**
 * Vite plugin that regenerates sitemap.xml from the route registry
 * on every dev server start and production build.
 */

import type { Plugin } from "vite";
import { siteRoutes, SITE_URL } from "../src/lib/routes";
import * as fs from "fs";
import * as path from "path";

function buildSitemapXml(): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = siteRoutes
    .filter((r) => r.path !== "/sitemap")
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

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    buildStart() {
      const outPath = path.resolve(import.meta.dirname, "../public/sitemap.xml");
      fs.writeFileSync(outPath, buildSitemapXml(), "utf-8");
      console.log(`✅ sitemap.xml auto-generated with ${siteRoutes.length} routes`);
    },
  };
}
