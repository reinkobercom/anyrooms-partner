import { mail, mailFields } from '../data/forms';

export type LeadData = Record<string, string>;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Thema für den Betreff: "Objektart in Ort" – fällt nie leer aus. */
export function buildTopic(data: LeadData, formName: string): string {
  const art = (data.objektart || '').trim();
  const ort = (data.standort || '').trim();
  if (art && ort) return `${art} in ${ort}`;
  return art || ort || formName;
}

export function buildSubject(data: LeadData, formName: string): string {
  // Zeilenumbrüche aus Nutzereingaben entfernen (Header-Sicherheit)
  const topic = buildTopic(data, formName).replace(/[\r\n]+/g, ' ').slice(0, 140);
  return mail.subject.replace('{thema}', topic);
}

function berlinTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(date);
}

export function buildMail(data: LeadData, meta: { formName: string; page: string; date: Date }) {
  const rows = mailFields.map(({ key, label }) => ({ label, value: (data[key] ?? '').trim() || '–' }));
  rows.push({ label: 'Absende-Seite', value: meta.page || '–' });
  rows.push({ label: 'Zeitstempel', value: berlinTimestamp(meta.date) });

  const htmlRows = rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e3e8ef;font-weight:600;vertical-align:top;white-space:nowrap;color:#103a5d">${escapeHtml(r.label)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e3e8ef;color:#0e1c2b;white-space:pre-wrap">${escapeHtml(r.value)}</td></tr>`,
    )
    .join('');

  const html =
    `<!doctype html><html lang="de"><body style="margin:0;padding:24px;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;font-size:15px">` +
    `<div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e3e8ef">` +
    `<div style="background:#103a5d;color:#fff;padding:18px 20px;font-size:18px;font-weight:700">Neue Anfrage: ${escapeHtml(meta.formName)}</div>` +
    `<table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table>` +
    `<p style="padding:14px 20px;margin:0;color:#5a6b7d;font-size:13px">„Antworten“ geht direkt an den Absender des Formulars.</p>` +
    `</div></body></html>`;

  const text = [`Neue Anfrage: ${meta.formName}`, '', ...rows.map((r) => `${r.label}: ${r.value}`)].join('\n');

  return { html, text };
}
