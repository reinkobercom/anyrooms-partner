/**
 * Formular-Endpunkt „Unterkunft eintragen“.
 * Läuft als einzige Route on demand (Vercel Function), alles andere ist statisch.
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { landlordForm as f, mail, rateLimit } from '../../data/forms';
import { buildMail, buildSubject, type LeadData } from '../../lib/lead-mail';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 2000;

const ALLOWED: Record<string, readonly string[]> = {
  objektart: f.step1.options,
  kapazitaet: f.step3.options,
  weitereObjekte: f.step4.options.map((o) => o.label),
};

// Einfaches Rate-Limit je Funktionsinstanz (Best Effort, kein globaler Speicher).
const hits = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = rateLimit.windowMinutes * 60_000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > rateLimit.max;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function str(value: unknown): string {
  if (typeof value === 'string') return value.trim().slice(0, MAX_LEN);
  if (typeof value === 'number') return String(value);
  return '';
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let raw: Record<string, unknown>;
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      raw = (await request.json()) as Record<string, unknown>;
    } else {
      raw = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  // Honeypot: Bots füllen das versteckte Feld aus → stillschweigend „Erfolg“ melden.
  if (str(raw.website)) {
    return json({ ok: true });
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || clientAddress || 'unknown';
  if (isRateLimited(ip)) {
    return json({ ok: false, error: 'rate_limited', message: f.messages.errorRateLimit }, 429);
  }

  const consent = raw.einwilligung === true || raw.einwilligung === 'true' || raw.einwilligung === 'ja' || raw.einwilligung === 'on';

  const data: LeadData = {
    objektart: str(raw.objektart),
    standort: str(raw.standort),
    kapazitaet: str(raw.kapazitaet),
    weitereObjekte: str(raw.weitereObjekte),
    weitereDetails: str(raw.weitereDetails),
    name: str(raw.name),
    firma: str(raw.firma),
    telefon: str(raw.telefon),
    email: str(raw.email),
    einwilligung: consent ? 'Ja' : 'Nein',
    quelle: str(raw.quelle),
  };
  const page = str(raw.seite) || request.headers.get('referer') || '';

  // Serverseitige Prüfung
  const m = f.messages;
  const errors: Record<string, string> = {};
  for (const key of ['objektart', 'standort', 'kapazitaet', 'weitereObjekte', 'name', 'telefon', 'email'] as const) {
    if (!data[key]) errors[key] = m.errorRequired;
  }
  for (const [key, options] of Object.entries(ALLOWED)) {
    if (data[key] && !options.includes(data[key])) errors[key] = m.errorRequired;
  }
  if (data.email && !EMAIL_PATTERN.test(data.email)) errors.email = m.errorEmail;
  if (!consent) errors.einwilligung = m.errorConsent;
  if (Object.keys(errors).length) {
    return json({ ok: false, errors }, 400);
  }

  // Zur Laufzeit aus Vercel lesen (nicht beim Build einbacken).
  const apiKey = process.env.RESEND_API_KEY;
  const date = new Date();
  const subject = buildSubject(data, f.name);
  const { html, text } = buildMail(data, { formName: f.name, page, date });

  if (!apiKey) {
    // Anfrage vollständig protokollieren, damit sie nicht verloren geht.
    console.error('[vermieter-anfrage] RESEND_API_KEY fehlt – Anfrage NICHT versendet:', JSON.stringify({ subject, data, page, date }));
    return json({ ok: false, error: 'mail_not_configured', message: m.errorSubmit }, 500);
  }

  try {
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: mail.from,
      to: mail.to,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error('[vermieter-anfrage] Resend-Fehler:', JSON.stringify(error), '– Anfrage:', JSON.stringify({ subject, data, page, date }));
      return json({ ok: false, error: 'mail_failed', message: m.errorSubmit }, 502);
    }
    console.log('[vermieter-anfrage] versendet', sent?.id);
    return json({ ok: true });
  } catch (err) {
    console.error('[vermieter-anfrage] Ausnahme beim Versand:', err, '– Anfrage:', JSON.stringify({ subject, data, page, date }));
    return json({ ok: false, error: 'mail_failed', message: m.errorSubmit }, 502);
  }
};

export const GET: APIRoute = () => json({ ok: false, error: 'method_not_allowed' }, 405);
