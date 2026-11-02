/**
 * Zeitgesteuerte Hinweise (z. B. Betriebsferien, Messe-Termine).
 * Auf der bisherigen Seite gab es keine – die Liste ist daher leer.
 *
 * Ein Hinweis erscheint als schmale Leiste über der Kopfzeile, wenn
 *   visible === true UND heute zwischen visibleFrom und visibleUntil liegt.
 * Datumsangaben im Format JJJJ-MM-TT (inklusive). Da die Seite statisch ist,
 * wird beim Build geprüft – nach Ablauf einmal neu deployen.
 */
export type Announcement = {
  text: string;
  /** Optionaler Link, z. B. 'tel:+49…' oder 'https://…' */
  href?: string;
  visible: boolean;
  visibleFrom?: string;
  visibleUntil?: string;
};

export const announcements: Announcement[] = [
  // Beispiel:
  // { text: 'Zwischen den Jahren telefonisch nur eingeschränkt erreichbar.', visible: true, visibleFrom: '2026-12-20', visibleUntil: '2027-01-02' },
];

export function activeAnnouncements(now = new Date()): Announcement[] {
  const today = now.toISOString().slice(0, 10);
  return announcements.filter(
    (a) =>
      a.visible &&
      (!a.visibleFrom || a.visibleFrom <= today) &&
      (!a.visibleUntil || a.visibleUntil >= today),
  );
}
