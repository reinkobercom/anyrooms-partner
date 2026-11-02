/**
 * Zentrale Stammdaten der Partner-Seite.
 * Telefonnummer, Links und Fußzeile werden NUR hier gepflegt.
 */

/** Telefonnummer im internationalen Format ohne Leerzeichen, z. B. "+4915112334985". */
const PHONE = '+4915112334985';
/** WhatsApp-Nummer ohne "+" (Format für wa.me). */
const WHATSAPP = '4915112334985';

export const site = {
  /** Live-Domain ohne Schrägstrich am Ende. */
  url: 'https://partner.anyrooms.eu',
  /** Marke (Logo-Alt-Text). */
  brandName: 'anyrooms',
  /** Zusatz neben dem Logo (Desktop). */
  brandTagline: 'Für Vermieter',
  /** Firmenname für Schema.org und Copyright. */
  company: 'Anyroom UG',
  /** Hauptseite für Monteure / Firmen. */
  mainSite: 'https://anyrooms.eu/de/',
  language: 'de',

  phone: PHONE,
  /** Lesbare Schreibweise, z. B. in Fehlermeldungen. */
  phoneDisplay: '+49 151 12334985',
  phoneHref: `tel:${PHONE}`,
  whatsappHref: `https://wa.me/${WHATSAPP}`,

  /** Kopfzeilen-Button oben rechts. Icon: 'phone' | 'whatsapp' | 'none'. */
  headerContact: {
    label: 'Lieber anrufen?',
    href: `tel:${PHONE}`,
    icon: 'phone' as const,
  },

  /** Kontakt-Buttons in der Abschluss-Sektion. Icon: 'phone' | 'whatsapp' | 'mail' | 'none'. */
  contacts: [
    { label: 'Anrufen', href: `tel:${PHONE}`, icon: 'phone' as const },
    { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP}`, icon: 'whatsapp' as const },
  ],

  copyright: '© 2026 Anyroom UG',
  footerLinks: [
    { label: 'Impressum', href: 'https://anyrooms.eu/de/impressum' },
    { label: 'Datenschutz', href: 'https://anyrooms.eu/de/datenschutz' },
  ],

  /**
   * Öffnungszeiten – auf der bisherigen Seite nicht angegeben.
   * Bei Bedarf hier eintragen (z. B. { days: 'Mo–Fr', hours: '08:00–18:00' }).
   */
  openingHours: [] as { days: string; hours: string }[],

  /** Social-Profile (bisher keine auf der Seite). */
  social: [] as { label: string; href: string }[],
};

export type ContactIcon = 'phone' | 'whatsapp' | 'mail' | 'none';
