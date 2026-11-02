/**
 * Bilder der Seite mit Alt-Texten.
 * Die Seite nutzt keine Fotos – das Logo ist ein SVG (src/components/ui/Logo.astro).
 * Dateien liegen in /public.
 */
export const images = {
  logo: {
    alt: 'anyrooms – Monteurunterkünfte für Bau- und Montagefirmen',
  },
  og: {
    src: '/og-anyrooms-partner.jpg',
    width: 1200,
    height: 630,
    alt: 'anyrooms Logo auf weißem Hintergrund',
  },
  favicon: {
    svg: '/favicon.svg',
    png32: '/favicon-32.png',
    ico: '/favicon.ico',
    appleTouch: '/apple-touch-icon.png',
  },
};
