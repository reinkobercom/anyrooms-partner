import type { APIRoute } from 'astro';
import { site } from '../data/site';

/** Indexierbare Seiten. Die Dankeseite gehört bewusst nicht in die Sitemap. */
const pages = ['/'];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((p) => `  <url>\n    <loc>${new URL(p, site.url).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
