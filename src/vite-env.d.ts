/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "mock" (default, demo) or "apps-script" (production, once authorised). */
  readonly VITE_INQUIRY_TRANSPORT?: 'mock' | 'apps-script';
  /** Google Apps Script web-app URL – production only. */
  readonly VITE_INQUIRY_ENDPOINT?: string;
  /** reCAPTCHA v3 SITE key (public). The secret key lives only in the Apps Script project. */
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@fontsource-variable/*';
declare module '@fontsource/*';
