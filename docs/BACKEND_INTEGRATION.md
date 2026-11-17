# Enquiry form – production integration (NOT active in the demo)

The demo's form validates input and then shows **"Demoversio – viestiä ei lähetetty."** Nothing is sent
or stored. The UI talks only to an `InquiryTransport` (`src/lib/inquiry/transport.ts`), so the
production backend can be enabled without touching components.

## Planned production setup: Google Apps Script + reCAPTCHA v3

1. **Apps Script web app** (owned by the customer's Google account)
   - `doPost(e)`: parse `JSON.parse(e.postData.contents)`.
   - Verify the reCAPTCHA token **server-side**:
     `UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'post', payload: { secret: SECRET, response: body.recaptchaToken } })`
     and require `success === true`, `action === 'inquiry'` and a score threshold (e.g. ≥ 0.5).
   - Store the SECRET key in Script Properties – never in the frontend or the repository.
   - Validate again (required fields, lengths, phone/e-mail format) – client validation is only for UX.
   - Send the e-mail to joendiesel@telemail.fi (or a new address) with `MailApp.sendEmail`, reply-to = visitor e-mail if given.
   - Return `ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)`.
   - Deploy as web app: execute as owner, access "Anyone".
2. **Frontend build variables** (GitHub Actions / hosting):
   ```
   VITE_INQUIRY_TRANSPORT=apps-script
   VITE_INQUIRY_ENDPOINT=https://script.google.com/macros/s/<id>/exec
   VITE_RECAPTCHA_SITE_KEY=<public site key>
   ```
   The request is sent as `text/plain` JSON to avoid a CORS preflight that Apps Script cannot answer.
   reCAPTCHA's script is loaded only when this transport is active.
3. **Privacy**: add a privacy notice (tietosuojaseloste) and link it next to the submit button; mention
   reCAPTCHA (Google) in it. Define retention for e-mails received.

## Fields sent

`topic, maker, component, vehicle, partNumber, message, name, phone, email, recaptchaToken, sentFrom`

## Testing before go-live

- Submit with JavaScript disabled → the form is not submitted (no native action); consider a `mailto:` fallback text.
- Wrong token / missing token → Apps Script returns `{ ok: false }`; UI shows a phone-number fallback.
- Confirm the success message only appears when the backend returns `ok: true` (`delivered: true`).
