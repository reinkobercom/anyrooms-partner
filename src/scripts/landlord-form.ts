/**
 * Mehrstufiges Vermieter-Formular „Unterkunft eintragen“.
 * Verhalten 1:1 wie auf der bisherigen Onepage-Seite:
 *  - Auswahl-Schritte springen nach 200 ms automatisch weiter (Schritt 1 und 3)
 *  - Schritt 4 blendet bei „Ja …“ ein Detailfeld ein
 *  - Pflichtfelder werden je Schritt geprüft
 *  - nach erfolgreichem Versand: Weiterleitung auf die Dankeseite
 */

type Messages = {
  errorRequired: string;
  errorEmail: string;
  errorConsent: string;
  errorSubmit: string;
  errorRateLimit: string;
};

type Config = {
  endpoint: string;
  thankYouPath: string;
  autoAdvance: boolean;
  total: number;
  messages: Messages;
  phoneDisplay: string;
  phoneHref: string;
  step4Options: { label: string; showDetail: boolean }[];
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** In welchem Schritt liegt welches Feld (für Server-Fehler). */
const FIELD_STEP: Record<string, number> = {
  objektart: 0,
  standort: 1,
  kapazitaet: 2,
  weitereObjekte: 3,
  weitereDetails: 3,
  name: 4,
  firma: 4,
  telefon: 4,
  email: 4,
  einwilligung: 4,
};

export function initLandlordForm(): void {
  const form = document.getElementById('vermieter-form') as HTMLFormElement | null;
  const configEl = document.getElementById('vermieter-form-config');
  if (!form || !configEl) return;

  const cfg = JSON.parse(configEl.textContent || '{}') as Config;
  const msg = cfg.messages;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  const cells = Array.from(form.querySelectorAll<HTMLElement>('[data-cell]'));
  const stepCurrent = form.querySelector<HTMLElement>('[data-step-current]');
  const backBtn = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const nextBtn = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const sendError = form.querySelector<HTMLElement>('[data-send-error]')!;
  const detailWrap = form.querySelector<HTMLElement>('[data-detail]')!;
  const consent = form.querySelector<HTMLInputElement>('#vm-consent')!;

  let step = 0;
  let animating = false;
  let sending = false;

  const input = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  const val = (name: string) => (input(name)?.value ?? '').trim();

  function setError(field: string, text: string): void {
    const el = form!.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
    if (el) el.textContent = text;
    const control = field === 'einwilligung' ? consent : (form!.querySelector<HTMLElement>(`#vm-${field}`) as HTMLElement | null);
    if (control) {
      if (text) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  }

  function clearErrors(): void {
    form!.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form!.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  }

  function validate(index: number): boolean {
    const errors: Record<string, string> = {};
    if (index === 0 && !val('objektart')) errors.objektart = msg.errorRequired;
    if (index === 1 && !val('standort')) errors.standort = msg.errorRequired;
    if (index === 2 && !val('kapazitaet')) errors.kapazitaet = msg.errorRequired;
    if (index === 3 && !val('weitereObjekte')) errors.weitereObjekte = msg.errorRequired;
    if (index === 4) {
      if (!val('name')) errors.name = msg.errorRequired;
      if (!val('telefon')) errors.telefon = msg.errorRequired;
      if (!val('email')) errors.email = msg.errorRequired;
      else if (!EMAIL_PATTERN.test(val('email'))) errors.email = msg.errorEmail;
      if (!consent.checked) errors.einwilligung = msg.errorConsent;
    }
    clearErrors();
    Object.entries(errors).forEach(([field, text]) => setError(field, text));
    const first = Object.keys(errors)[0];
    if (first) {
      const control = first === 'einwilligung' ? consent : form!.querySelector<HTMLElement>(`#vm-${first}`);
      control?.focus({ preventScroll: false });
    }
    return !first;
  }

  function updateChrome(): void {
    cells.forEach((cell, i) => cell.classList.toggle('pCellOn', i <= step));
    if (stepCurrent) stepCurrent.textContent = String(step + 1);
    backBtn.hidden = step === 0;
    const last = step === cfg.total - 1;
    nextBtn.hidden = last;
    submitBtn.hidden = !last;
  }

  function goTo(target: number, focusTitle = true): void {
    const next = Math.max(0, Math.min(target, cfg.total - 1));
    if (next === step || animating) return;
    const from = steps[step];
    const to = steps[next];

    const show = () => {
      from.hidden = true;
      from.removeAttribute('data-anim');
      to.hidden = false;
      if (!reducedMotion) to.setAttribute('data-anim', 'in');
      step = next;
      updateChrome();
      if (focusTitle) to.querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
      animating = false;
    };

    if (reducedMotion) {
      show();
      return;
    }
    animating = true;
    from.setAttribute('data-anim', 'out');
    window.setTimeout(show, 220);
  }

  // Antwort-Kacheln
  form.querySelectorAll<HTMLButtonElement>('[data-field][data-value]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.field!;
      const value = btn.dataset.value!;
      const hidden = input(field);
      if (hidden) hidden.value = value;
      form!.querySelectorAll<HTMLButtonElement>(`[data-field="${field}"]`).forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      setError(field, '');

      if (field === 'weitereObjekte') {
        const option = cfg.step4Options.find((o) => o.label === value);
        detailWrap.hidden = !(option && option.showDetail);
      }

      if (btn.hasAttribute('data-advance') && cfg.autoAdvance) {
        window.setTimeout(() => goTo(step + 1), 200);
      }
    });
  });

  // Fehler beim Tippen zurücksetzen (wie bisher)
  ['standort', 'name', 'telefon', 'email'].forEach((name) => {
    input(name)?.addEventListener('input', () => setError(name, ''));
  });
  consent.addEventListener('change', () => setError('einwilligung', ''));

  backBtn.addEventListener('click', () => {
    sendError.textContent = '';
    goTo(step - 1);
  });

  function showSendError(text: string): void {
    sendError.textContent = '';
    sendError.append(`${text} `);
    const link = document.createElement('a');
    link.href = cfg.phoneHref;
    link.textContent = `Telefon: ${cfg.phoneDisplay}`;
    sendError.append(link);
  }

  async function submit(): Promise<void> {
    if (sending || !validate(4)) return;
    sending = true;
    submitBtn.disabled = true;
    sendError.textContent = '';

    const quelleInput = input('quelle');
    if (quelleInput) quelleInput.value = [window.location.href, document.referrer].filter(Boolean).join(' | ');

    const data: Record<string, string | boolean> = {};
    new FormData(form!).forEach((value, key) => {
      data[key] = typeof value === 'string' ? value : '';
    });
    data.einwilligung = consent.checked;
    data.seite = window.location.href;

    try {
      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok && body.ok) {
        window.location.assign(cfg.thankYouPath);
        return;
      }

      if (res.status === 400 && body.errors) {
        const fields = Object.keys(body.errors);
        const target = Math.min(...fields.map((f) => FIELD_STEP[f] ?? 4));
        if (target !== step) {
          step = target;
          steps.forEach((s, i) => {
            s.hidden = i !== target;
            s.removeAttribute('data-anim');
          });
          updateChrome();
        }
        clearErrors();
        fields.forEach((f) => setError(f, body.errors[f]));
      } else if (res.status === 429) {
        showSendError(msg.errorRateLimit);
      } else {
        showSendError(msg.errorSubmit);
      }
    } catch {
      showSendError(msg.errorSubmit);
    } finally {
      sending = false;
      submitBtn.disabled = false;
    }
  }

  // Enter / Weiter / Absenden
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (step === cfg.total - 1) {
      void submit();
    } else if (validate(step)) {
      goTo(step + 1);
    }
  });

  updateChrome();
}
