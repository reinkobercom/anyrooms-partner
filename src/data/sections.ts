/**
 * Sektionen ein- und ausschalten.
 * true = sichtbar, false = ausgeblendet (Inhalt bleibt im Code erhalten).
 * Reihenfolge auf der Seite: so wie hier aufgelistet.
 */
export const sections = {
  home: {
    /** Logo-Leiste, Headline, Belegpunkte und Formular „Unterkunft eintragen“. */
    hero: true,
    /** „So läuft die Zusammenarbeit“ – drei nummerierte Schritte. */
    howItWorks: true,
    /** „Warum über Anyrooms vermieten“ – drei Karten + Button. */
    whyAnyrooms: true,
    /** „Häufige Fragen“ – Akkordeon mit 8 Fragen. */
    faq: true,
    /** „Letzter Schritt“ – Abschluss, Kontakt-Buttons und Fußzeile. */
    closing: true,
  },
};
