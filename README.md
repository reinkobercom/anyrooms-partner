# partner.anyrooms.eu – Vermieter-Seite von anyrooms

Landingpage, auf der Vermieter ihre Unterkunft bei anyrooms eintragen.
Umgezogen von Onepage (November 2026), optisch und inhaltlich 1:1.

- **Technik:** Astro 7 (alle Seiten statisch) + eine Vercel Function für das Formular
- **Hosting:** Vercel, Projekt `anyrooms-partner` (Team reinkobercom), Funktionsregion Frankfurt (fra1)
- **Deployment:** Jeder Push auf `main` wird automatisch live gestellt. Andere Branches bekommen eine Vorschau-URL.
- **Mailversand:** Resend
- **Statistik:** Vercel Web Analytics (cookielos, kein Banner nötig)

---

## Wo pflege ich was?

Alle Inhalte stehen in `src/data/`. Datei ändern, committen, pushen – Vercel deployt in ca. 1 Minute.

| Was | Datei |
| --- | --- |
| Telefonnummer, WhatsApp, Kopfzeilen-Button, Kontakt-Buttons, Copyright, Impressum/Datenschutz-Links, Öffnungszeiten | `src/data/site.ts` |
| Alle Texte der Startseite (Hero, Ablauf, Vorteile, FAQ, Abschluss) sowie Meta-Titel und -Beschreibung | `src/data/content.ts` |
| Formular: Fragen, Antworten, Beschriftungen, Fehlermeldungen, Danke-Text, **Empfänger, Absender, Betreff** | `src/data/forms.ts` |
| Sektionen ein-/ausschalten | `src/data/sections.ts` |
| Zeitgesteuerte Hinweise (Leiste ganz oben) | `src/data/announcements.ts` |
| Bilder/Alt-Texte (Logo, OG-Bild, Favicon) | `src/data/images.ts` + Dateien in `public/` |
| Bewertungs-Widgets (Trustindex) | `src/data/trustindex.ts` |

### Telefonnummer ändern
In `src/data/site.ts` oben die Konstanten `PHONE` (z. B. `+4915112334985`) und `WHATSAPP` (ohne `+`) anpassen,
außerdem `phoneDisplay` (lesbare Schreibweise für Fehlermeldungen). Alle Buttons übernehmen die Nummer automatisch.

### Sektion ausblenden
In `src/data/sections.ts` den Wert auf `false` setzen. Der Inhalt bleibt erhalten und lässt sich jederzeit wieder einschalten.

### Hinweis-Leiste (z. B. Betriebsferien)
In `src/data/announcements.ts` einen Eintrag hinzufügen:
```ts
{ text: 'Zwischen den Jahren nur eingeschränkt erreichbar.', visible: true, visibleFrom: '2026-12-20', visibleUntil: '2027-01-02' }
```
Die Seite ist statisch, deshalb wird das Datum beim Build geprüft. Läuft ein Hinweis ab, einmal neu deployen
(Vercel → Deployments → „Redeploy“).

---

## Formular

- Endpunkt: `src/pages/api/vermieter-anfrage.ts` (`/api/vermieter-anfrage/`)
- Ablauf: 5 Schritte. Nach dem Absenden geht es auf die Dankeseite `/danke/`.
- **Empfänger, Absender und Betreff** stehen in `src/data/forms.ts` → `mail`:
  - `to`: `leads@reinkober.agency`
  - `from`: `Anyrooms Partner | Website <leads@reinkober-leadportal.com>` (die Domain ist in Resend verifiziert)
  - `subject`: `{thema}` wird zu „Objektart in Ort“, z. B. „Ganze Wohnung in 44137 Dortmund“
  - „Antworten“ in der Mail geht an die E-Mail-Adresse aus dem Formular (`replyTo`).
- Die Mail enthält alle Felder in Formular-Reihenfolge, dazu Quelle (URL inkl. UTM und Referrer), Absende-Seite und Zeitstempel.
- **Spamschutz:** unsichtbares Honeypot-Feld und Rate-Limit (5 Anfragen pro IP in 10 Minuten, je Funktionsinstanz; einstellbar über `rateLimit` in `forms.ts`).
- **Fehlerfall:** Kann Resend nicht senden, sieht der Nutzer eine Meldung mit der Telefonnummer. Die komplette Anfrage
  steht dann in Vercel → Projekt → Logs (Suche nach `vermieter-anfrage`). So geht keine Anfrage verloren.

---

## Umgebungsvariablen

| Name | Wo | Wofür |
| --- | --- | --- |
| `RESEND_API_KEY` | Vercel → Projekt → Settings → Environment Variables (Production **und** Preview) | Mailversand |

Den Key nie ins Repository schreiben. `.env*` steht in `.gitignore`. Nach dem Ändern eines Keys einmal neu deployen.

---

## Trustindex-Widget einbauen

1. In Trustindex das Widget anlegen und die Widget-ID aus dem Einbettungscode kopieren (`loader.js?<ID>`).
2. In `src/data/trustindex.ts` bei der gewünschten Position (`afterHero`, `afterWhyAnyrooms`, `beforeClosing`) die `widgetId` eintragen und `enabled: true` setzen.
3. Pushen. Das Script lädt erst, wenn das Widget in Sichtweite kommt, und eine feste Mindesthöhe verhindert Layout-Springen.
4. Trustindex in der Datenschutzerklärung ergänzen.

---

## Domain & DNS (Umzug von Onepage)

`partner.anyrooms.eu` ist eine **Subdomain**. Umgestellt wird deshalb nur **ein** Eintrag:

1. In Vercel ist die Domain im Projekt eingetragen (Settings → Domains). Vercel zeigt dort den Zielwert für den CNAME an.
2. Beim DNS-Anbieter von `anyrooms.eu` den bestehenden Eintrag für `partner` (CNAME oder A-Record, der auf Onepage zeigt) **löschen**
   und durch den CNAME `partner` → den von Vercel angezeigten Wert ersetzen.
3. **Nichts anderes anfassen:** Die Einträge für `@`, `www` und `go` sowie alle MX- und TXT-Einträge bleiben unverändert. Sonst
   funktionieren anyrooms.eu oder die E-Mails nicht mehr. Für den Formularversand sind auf `anyrooms.eu` keine Einträge nötig.
4. Warten, bis Vercel die Domain als „Valid Configuration“ anzeigt (meist wenige Minuten). Das SSL-Zertifikat stellt Vercel selbst aus.
5. Erst danach die Seite in Onepage depublizieren und die Domain dort entfernen.

---

## Lokal entwickeln (optional)

```bash
npm ci          # Abhängigkeiten installieren
npm run dev     # Entwicklungsserver auf http://localhost:4321
```
Für den Formularversand lokal eine `.env` mit `RESEND_API_KEY=…` anlegen (wird nicht committet).

## Aufbau

```
src/
  data/          ← Inhalte und Einstellungen (hier wird gepflegt)
  components/
    sections/    ← die 5 Sektionen der Startseite
    ui/          ← Bausteine (Logo, Icons, Badge, Headline …)
  layouts/Base.astro   ← <head>, Schriften, Meta-Daten, Analytics
  pages/         ← index, danke, 404, sitemap.xml, robots.txt, api/vermieter-anfrage
  scripts/landlord-form.ts ← Logik des mehrstufigen Formulars
  styles/global.css        ← Farben, Schriften, Bausteine
public/          ← Favicon, OG-Bild
```
