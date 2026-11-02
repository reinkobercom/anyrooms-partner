/**
 * Formular-Einstellungen: Empfänger, Absender, Betreff und Felder.
 *
 * Versand über Resend. Der API-Key liegt NUR als Umgebungsvariable
 * RESEND_API_KEY in Vercel (Projekt → Settings → Environment Variables).
 */

export const mail = {
  /** Empfänger aller Formular-Anfragen. */
  to: 'leads@reinkober.agency',
  /** Absender (Domain ist in Resend verifiziert). */
  from: 'Anyrooms Partner | Website <leads@reinkober-leadportal.com>',
  /**
   * Betreff-Vorlage. {thema} wird ersetzt durch "Objektart in Ort",
   * z. B. "Ganze Wohnung in 44137 Dortmund". Fehlt beides: Formularname.
   */
  subject:
    'Neue Anfrage | Anyrooms Partner - reinkober.com - Unternehmensberatung für Wachstum, Vertrieb & Recruiting  | {thema}',
};

/** Rate-Limit: höchstens so viele Anfragen pro IP im Zeitfenster. */
export const rateLimit = {
  max: 5,
  windowMinutes: 10,
};

/** Vermieter-Formular „Unterkunft eintragen“ (5 Schritte). */
export const landlordForm = {
  name: 'Unterkunft eintragen',
  endpoint: '/api/vermieter-anfrage/',
  thankYouPath: '/danke/',

  title: 'Unterkunft eintragen',
  subtitle: '5 kurze Fragen, etwa eine Minute.',
  backLabel: 'Zurück',
  nextLabel: 'Weiter',
  submitLabel: 'Unterkunft eintragen',
  sendingLabel: 'Wird gesendet …',
  reassurance: 'Kostenlos & unverbindlich. Keine Weitergabe Ihrer Daten an Dritte.',
  privacyNote: 'Ihre Angaben nutzen wir ausschließlich, um Ihnen passende Anfragen zu vermitteln.',
  progressLabel: 'Schritt',
  progressOfLabel: 'von',
  /** Nach Auswahl einer Antwort automatisch zum nächsten Schritt (wie bisher). */
  autoAdvance: true,

  step1: {
    question: 'Was bieten Sie an?',
    mailLabel: 'Was bieten Sie an?',
    options: ['Einzelne Zimmer', 'Ganze Wohnung', 'Ganzes Haus', 'Mehrere Objekte'],
  },
  step2: {
    question: 'Wo liegt die Unterkunft?',
    label: 'Ort oder PLZ',
    placeholder: 'z. B. 44137 Dortmund',
  },
  step3: {
    question: 'Wie viele Personen können Sie gleichzeitig unterbringen?',
    mailLabel: 'Personen gleichzeitig',
    options: ['1 bis 4 Personen', '5 bis 10 Personen', '11 bis 25 Personen', 'Mehr als 25 Personen'],
  },
  step4: {
    question: 'Haben Sie weitere Unterkünfte?',
    mailLabel: 'Weitere Unterkünfte',
    detailLabel: 'Wie viele weitere Objekte und wo?',
    detailPlaceholder: 'z. B. 3 Wohnungen in Essen, 1 Haus in Bochum',
    options: [
      { label: 'Nein, nur dieses Objekt', showDetail: false },
      { label: 'Ja, weitere Objekte am selben Ort', showDetail: true },
      { label: 'Ja, auch in anderen Städten', showDetail: true },
    ],
  },
  step5: {
    question: 'Wie erreichen wir Sie?',
    nameLabel: 'Name',
    companyLabel: 'Firma (optional)',
    phoneLabel: 'Telefon',
    emailLabel: 'E-Mail',
    consentLabel: 'Ja, Anyrooms darf mich zu meiner Unterkunft kontaktieren.',
  },

  messages: {
    successTitle: 'Eingegangen, vielen Dank.',
    successText:
      'Wir prüfen Ihre Angaben und melden uns in der Regel innerhalb eines Werktages telefonisch bei Ihnen.',
    errorRequired: 'Bitte ausfüllen.',
    errorEmail: 'Bitte eine gültige E-Mail-Adresse eingeben.',
    errorConsent: 'Bitte bestätigen Sie die Kontaktaufnahme.',
    errorSubmit: 'Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an.',
    errorRateLimit: 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut oder rufen Sie uns an.',
  },
};

/** Reihenfolge und Beschriftung der Felder in der Lead-Mail (wie im Formular). */
export const mailFields: { key: string; label: string }[] = [
  { key: 'objektart', label: 'Was bieten Sie an?' },
  { key: 'standort', label: 'Ort oder PLZ' },
  { key: 'kapazitaet', label: 'Personen gleichzeitig' },
  { key: 'weitereObjekte', label: 'Weitere Unterkünfte vorhanden?' },
  { key: 'weitereDetails', label: 'Details zu weiteren Objekten' },
  { key: 'name', label: 'Name' },
  { key: 'firma', label: 'Firma' },
  { key: 'telefon', label: 'Telefon' },
  { key: 'email', label: 'E-Mail' },
  { key: 'einwilligung', label: 'Einwilligung Kontaktaufnahme' },
  { key: 'quelle', label: 'Quelle / Kampagne' },
];
