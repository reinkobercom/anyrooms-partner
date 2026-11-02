/**
 * Bewertungs-Widgets (Trustindex).
 * Aktuell gibt es keine Widgets auf der Seite (alle ausgeschaltet).
 *
 * So aktivieren Sie ein Widget:
 *  1. In Trustindex das Widget anlegen und die Widget-ID kopieren
 *     (steht im Einbettungscode: https://cdn.trustindex.io/loader.js?<WIDGET-ID>).
 *  2. Unten bei der passenden Position `widgetId` eintragen und `enabled: true` setzen.
 *  3. Committen – Vercel deployt automatisch.
 * Das Script lädt erst, wenn das Widget in Sichtweite kommt.
 */
export type TrustindexPosition = 'afterHero' | 'afterWhyAnyrooms' | 'beforeClosing';

export type TrustindexWidget = {
  position: TrustindexPosition;
  widgetId: string;
  enabled: boolean;
  /** Reservierte Mindesthöhe in px gegen Layout-Springen. */
  minHeight: number;
};

export const trustindexWidgets: TrustindexWidget[] = [
  { position: 'afterHero', widgetId: '', enabled: false, minHeight: 220 },
];

export function widgetsAt(position: TrustindexPosition): TrustindexWidget[] {
  return trustindexWidgets.filter((w) => w.position === position && w.enabled && w.widgetId);
}
