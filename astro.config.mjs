// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Alle Seiten werden statisch erzeugt. Nur /api/vermieter-anfrage/ läuft
// on demand (siehe `export const prerender = false` in der Route).
export default defineConfig({
  site: 'https://partner.anyrooms.eu',
  output: 'static',
  adapter: vercel(),
  // URLs wie bisher: Startseite "/", alle weiteren mit Schrägstrich am Ende.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS ist klein (~5 KB gzip) → direkt ins HTML, keine render-blockierende Anfrage.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
