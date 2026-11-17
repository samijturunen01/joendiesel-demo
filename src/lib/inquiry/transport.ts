import type { InquiryRequest } from './types';

/**
 * Submission seam. The form UI only talks to an InquiryTransport, so the production backend
 * can be switched on without touching any component:
 *
 *   VITE_INQUIRY_TRANSPORT=mock          (default – the demo: nothing is sent or stored)
 *   VITE_INQUIRY_TRANSPORT=apps-script   (production, once the customer has approved it)
 *   VITE_INQUIRY_ENDPOINT=https://script.google.com/macros/s/…/exec
 *   VITE_RECAPTCHA_SITE_KEY=…            (public site key; the SECRET key lives only in Apps Script)
 *
 * See docs/BACKEND_INTEGRATION.md.
 */
export type SubmitResult =
  | { ok: true; /** true only when a real backend confirmed delivery */ delivered: boolean }
  | { ok: false; error: string };

export interface InquiryTransport {
  readonly kind: 'mock' | 'apps-script';
  /** Whether this transport can deliver anything at all. The demo's mock never does. */
  readonly delivers: boolean;
  send(request: InquiryRequest): Promise<SubmitResult>;
}

/** Demo transport: waits briefly, sends nothing, stores nothing. */
export const mockTransport: InquiryTransport = {
  kind: 'mock',
  delivers: false,
  async send() {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return { ok: true, delivered: false };
  },
};

/**
 * Production transport (prepared, NOT active in the demo).
 * Posts JSON as text/plain (a "simple" request, so the browser sends no CORS preflight that
 * Apps Script could not answer). The Apps Script must verify the reCAPTCHA token server-side
 * with the secret key before it sends any email.
 */
export function appsScriptTransport(endpoint: string, getToken: () => Promise<string | null>): InquiryTransport {
  return {
    kind: 'apps-script',
    delivers: true,
    async send(request) {
      try {
        const recaptchaToken = await getToken();
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...request, recaptchaToken, sentFrom: window.location.href }),
        });
        const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
        if (res.ok && data?.ok) return { ok: true, delivered: true };
        return { ok: false, error: 'Viestin lähetys ei onnistunut. Yritä uudelleen tai soita meille.' };
      } catch {
        return { ok: false, error: 'Yhteys katkesi. Tarkista verkkoyhteys ja yritä uudelleen, tai soita meille.' };
      }
    },
  };
}

/** reCAPTCHA v3 – loaded only when the production transport is configured. */
function recaptchaTokenGetter(siteKey: string | undefined): () => Promise<string | null> {
  if (!siteKey) return async () => null;
  let loading: Promise<void> | null = null;
  const load = () =>
    (loading ??= new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('reCAPTCHA failed to load'));
      document.head.appendChild(s);
    }));
  return async () => {
    await load();
    const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (k: string, o: { action: string }) => Promise<string> } }).grecaptcha;
    if (!g) return null;
    await new Promise<void>((r) => g.ready(r));
    return g.execute(siteKey, { action: 'inquiry' });
  };
}

export function getTransport(): InquiryTransport {
  const kind = import.meta.env.VITE_INQUIRY_TRANSPORT ?? 'mock';
  const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;
  if (kind === 'apps-script' && endpoint) {
    return appsScriptTransport(endpoint, recaptchaTokenGetter(import.meta.env.VITE_RECAPTCHA_SITE_KEY));
  }
  return mockTransport;
}
