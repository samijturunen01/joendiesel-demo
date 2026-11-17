import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { AlertTriangle, ArrowRight, Info, Loader2 } from 'lucide-react';
import { company, primaryPhone } from '@/data/company';
import { prefillFromParams } from '@/lib/inquiry/prefill';
import { getTransport } from '@/lib/inquiry/transport';
import {
  componentOptions,
  emptyInquiry,
  makerOptions,
  maxLengths,
  topicOptions,
  type InquiryErrors,
  type InquiryRequest,
} from '@/lib/inquiry/types';
import { fieldOrder, validateInquiry } from '@/lib/inquiry/validation';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'demo-done'; sent: InquiryRequest } | { kind: 'delivered' } | { kind: 'error'; message: string };

const hintsByTopic: Record<string, { message: string; vehicle: string }> = {
  vianetsinta: { message: 'Mitä oireita autossa tai koneessa on? Milloin vika ilmenee?', vehicle: 'esim. Toyota Hilux 2.5 D-4D, 2008' },
  varaosat: { message: 'Mitä osaa tai tarviketta tarvitset? Montako kappaletta?', vehicle: 'Auto tai kone, jota varten osa on' },
  default: { message: 'Kerro laitteesta ja siitä, mitä sille pitäisi tehdä.', vehicle: 'esim. Ford Transit 2.4 TDCi, 2007 tai traktorin malli' },
};

export function InquiryForm() {
  const [params] = useSearchParams();
  const transport = useMemo(() => getTransport(), []);
  const [values, setValues] = useState<InquiryRequest>(emptyInquiry);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;

  // Pre-selection from the URL after hydration (the prerendered HTML has no query string).
  const query = params.toString();
  useEffect(() => {
    const pre = prefillFromParams(new URLSearchParams(query));
    if (pre.topic || pre.maker || pre.component) setValues((v) => ({ ...v, topic: pre.topic || v.topic, maker: pre.maker || v.maker, component: pre.component || v.component }));
  }, [query]);

  useEffect(() => {
    if (status.kind === 'demo-done' || status.kind === 'delivered') resultRef.current?.focus();
  }, [status.kind]);

  const set = (field: keyof InquiryRequest) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field] || ((field === 'phone' || field === 'email') && errors.contact)) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        if (field === 'phone' || field === 'email') delete next.contact;
        return next;
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(values);
    setErrors(found);
    const firstKey = fieldOrder.find((k) => found[k]);
    if (firstKey) {
      summaryRef.current?.focus();
      return;
    }
    setStatus({ kind: 'sending' });
    const result = await transport.send(values);
    if (!result.ok) setStatus({ kind: 'error', message: result.error });
    else if (result.delivered) setStatus({ kind: 'delivered' });
    else setStatus({ kind: 'demo-done', sent: values });
  };

  const reset = () => {
    setValues(emptyInquiry);
    setErrors({});
    setStatus({ kind: 'idle' });
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('select, input')?.focus());
  };

  const hints = hintsByTopic[values.topic] ?? hintsByTopic.default!;
  const errorList = fieldOrder.filter((k) => errors[k]);

  if (status.kind === 'demo-done') {
    const s = status.sent;
    const rows: [string, string][] = [
      ['Aihe', topicOptions.find((t) => t.id === s.topic)?.label ?? '—'],
      ['Valmistaja', makerOptions.find((m) => m.id === s.maker)?.label ?? '—'],
      ['Laite', componentOptions.find((c) => c.id === s.component)?.label ?? '—'],
      ['Auto / kone', s.vehicle || '—'],
      ['Osanumero', s.partNumber || '—'],
      ['Nimi', s.name],
      ['Yhteystieto', [s.phone, s.email].filter(Boolean).join(' · ')],
    ];
    return (
      <div ref={resultRef} tabIndex={-1} className="frame p-7 text-ink-900 outline-none sm:p-10" role="status">
        <div className="frame-content">
          <p className="label flex items-center gap-2 text-amber-700">
            <Info aria-hidden="true" className="size-4" /> Konseptidemo
          </p>
          <h3 className="display-m mt-4">Demoversio – viestiä ei lähetetty.</h3>
          <p className="mt-4 max-w-2xl text-ink-700">
            Tämä sivusto on konseptidemo, joten lomake ei lähettänyt eikä tallentanut tietojasi. Valmiilla sivustolla alla oleva pyyntö menisi suoraan Joen
            Dieselille. Asioi sillä välin puhelimitse:{' '}
            <a className="link font-[650] tabular" href={`tel:${primaryPhone.e164}`}>
              {primaryPhone.display}
            </a>
            .
          </p>
          <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-ink-900/15 pt-6 sm:grid-cols-[10rem_1fr]">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="label pt-1 text-ink-600">{k}</dt>
                <dd className="break-words">{v}</dd>
              </div>
            ))}
            <dt className="label pt-1 text-ink-600">Viesti</dt>
            <dd className="whitespace-pre-line break-words">{s.message}</dd>
          </dl>
          <button type="button" onClick={reset} className="btn btn-ghost mt-8">
            Tyhjennä ja kokeile uudelleen
          </button>
        </div>
      </div>
    );
  }

  if (status.kind === 'delivered') {
    return (
      <div ref={resultRef} tabIndex={-1} className="frame p-8 text-ink-900 outline-none" role="status">
        <div className="frame-content">
          <h3 className="display-m">Kiitos – viesti on vastaanotettu.</h3>
          <p className="mt-3 text-ink-700">Palaamme asiaan aukioloaikoina. Kiireellisissä asioissa soita {primaryPhone.display}.</p>
        </div>
      </div>
    );
  }

  const sending = status.kind === 'sending';

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={id('req')} className="text-ink-900">
      {!transport.delivers ? (
        <p className="mb-8 flex items-start gap-3 border-l-4 border-amber-500 bg-bone-50 px-4 py-3 text-[0.95rem]">
          <Info aria-hidden="true" className="mt-0.5 size-4.5 shrink-0 text-amber-700" />
          <span>
            <strong className="font-[650]">Demolomake.</strong> Lomake toimii, mutta lähetys on poistettu käytöstä: tietoja ei lähetetä eikä tallenneta.
          </span>
        </p>
      ) : null}

      <div ref={summaryRef} tabIndex={-1} className="outline-none" aria-live="assertive">
        {errorList.length ? (
          <div className="mb-8 border-[1.5px] border-signal bg-bone-50 p-5" role="alert">
            <p className="flex items-center gap-2 font-[650]">
              <AlertTriangle aria-hidden="true" className="size-5 text-signal" />
              Tarkista {errorList.length === 1 ? 'yksi kohta' : `${errorList.length} kohtaa`}:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {errorList.map((k) => (
                <li key={k}>
                  <a className="link" href={`#${id(k === 'contact' ? 'phone' : k)}`}>
                    {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <p id={id('req')} className="label mb-6 text-ink-600">
        <span aria-hidden="true">* </span>Pakollinen tieto
      </p>

      <fieldset className="grid gap-6 border-t border-ink-900/15 pt-6 md:grid-cols-2">
        <legend className="display-s float-left mb-2 w-full md:col-span-2">Mitä asia koskee?</legend>
        <Field id={id('topic')} label="Aihe" required error={errors.topic} className="md:col-span-2">
          <select id={id('topic')} className="input" value={values.topic} onChange={set('topic')} required aria-required="true" {...invalid(errors.topic, id('topic'))}>
            <option value="">Valitse…</option>
            {topicOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id('maker')} label="Laitteen valmistaja" optional>
          <select id={id('maker')} className="input" value={values.maker} onChange={set('maker')}>
            <option value="">Valitse…</option>
            {makerOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id('component')} label="Laite" optional>
          <select id={id('component')} className="input" value={values.component} onChange={set('component')}>
            <option value="">Valitse…</option>
            {componentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id('vehicle')} label="Auto tai kone" optional hint={hints.vehicle} error={errors.vehicle}>
          <input id={id('vehicle')} className="input" value={values.vehicle} onChange={set('vehicle')} maxLength={maxLengths.vehicle} autoComplete="off" {...invalid(errors.vehicle, id('vehicle'), id('vehicle-hint'))} />
        </Field>
        <Field id={id('partNumber')} label="Osanumero" optional hint="Laitteen kyljestä, esim. 0 445 110 …" error={errors.partNumber}>
          <input id={id('partNumber')} className="input font-mono text-[0.92rem]" value={values.partNumber} onChange={set('partNumber')} maxLength={maxLengths.partNumber} autoComplete="off" spellCheck={false} {...invalid(errors.partNumber, id('partNumber'), id('partNumber-hint'))} />
        </Field>
        <Field id={id('message')} label="Viesti" required hint={hints.message} error={errors.message} className="md:col-span-2">
          <textarea id={id('message')} className="input" value={values.message} onChange={set('message')} required aria-required="true" maxLength={maxLengths.message} rows={5} {...invalid(errors.message, id('message'), id('message-hint'))} />
        </Field>
      </fieldset>

      <fieldset className="mt-10 grid gap-6 border-t border-ink-900/15 pt-6 md:grid-cols-2">
        <legend className="display-s float-left mb-2 w-full md:col-span-2">Yhteystietosi</legend>
        <Field id={id('name')} label="Nimi" required error={errors.name} className="md:col-span-2">
          <input id={id('name')} className="input" value={values.name} onChange={set('name')} required aria-required="true" autoComplete="name" maxLength={maxLengths.name} {...invalid(errors.name, id('name'))} />
        </Field>
        <p id={id('contact')} className={`-mb-2 text-[0.95rem] md:col-span-2 ${errors.contact ? 'font-[600] text-signal' : 'text-ink-700'}`}>
          {errors.contact ?? 'Anna puhelinnumero, sähköposti tai molemmat. *'}
        </p>
        <Field id={id('phone')} label="Puhelinnumero" error={errors.phone}>
          <input id={id('phone')} className="input tabular" type="tel" inputMode="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" maxLength={maxLengths.phone} aria-describedby={`${id('contact')}${errors.phone ? ` ${id('phone')}-error` : ''}`} aria-invalid={errors.phone || errors.contact ? true : undefined} />
        </Field>
        <Field id={id('email')} label="Sähköposti" error={errors.email}>
          <input id={id('email')} className="input" type="email" inputMode="email" value={values.email} onChange={set('email')} autoComplete="email" maxLength={maxLengths.email} aria-describedby={`${id('contact')}${errors.email ? ` ${id('email')}-error` : ''}`} aria-invalid={errors.email || errors.contact ? true : undefined} />
        </Field>
      </fieldset>

      {status.kind === 'error' ? (
        <p className="mt-8 border-l-4 border-signal bg-bone-50 px-4 py-3" role="alert">
          {status.message}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm text-ink-600">
          {transport.delivers
            ? `Tietoja käytetään vain yhteydenottoosi vastaamiseen. ${company.name}.`
            : 'Demossa mitään ei lähetetä. Tuotantoversiossa lomake suojataan roskapostilta (reCAPTCHA) ja tietosuojaseloste lisätään tähän.'}
        </p>
        <button type="submit" className="btn btn-dark min-w-[15rem] justify-between" disabled={sending} aria-busy={sending}>
          {sending ? (
            <>
              Käsitellään…
              <Loader2 aria-hidden="true" className="size-4.5 animate-spin" />
            </>
          ) : (
            <>
              {transport.delivers ? 'Lähetä tarjouspyyntö' : 'Kokeile lähetystä (demo)'}
              <ArrowRight aria-hidden="true" className="btn-arrow size-4.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function invalid(error: string | undefined, fieldId: string, hintId?: string) {
  const describedBy = [hintId, error ? `${fieldId}-error` : null].filter(Boolean).join(' ');
  return {
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy || undefined,
  };
}

function Field({
  id,
  label,
  required,
  optional,
  hint,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field-label flex items-baseline gap-2">
        {label}
        {required ? <span aria-hidden="true" className="text-signal">*</span> : null}
        {optional ? <span className="normal-case tracking-normal text-ink-600">(valinnainen)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-[600] text-signal">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
