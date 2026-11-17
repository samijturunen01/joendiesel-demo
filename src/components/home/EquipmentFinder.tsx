import { useId, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { primaryPhone } from '@/data/company';
import { capabilityLabels, components, manufacturers, type ComponentId, type Manufacturer } from '@/data/equipment';
import { inquiryHref, pages } from '@/data/site';

/*
 * Laitehaku – "Do you service my equipment?"
 *
 * Choose a manufacturer and seven graduated measuring glasses (the way delivery quantities are
 * compared on an injection test bench) fill with test-oil amber for every component type the
 * workshop's own service list covers. All filled glasses settle on the same calibration line.
 * Selecting a glass shows what exactly is done and links to a pre-filled quote request.
 * Combinations that are not on the list say "ask" – never "no".
 */

const FILL_LEVEL = 74; // % – the shared calibration line

const aihe = (c: ComponentId) => (c === 'cr-pumput' || c === 'cr-suuttimet' || c === 'vp' ? 'common-rail' : 'suuttimet-ja-pumput');

export function EquipmentFinder({ initial = 'bosch' }: { initial?: Manufacturer['id'] }) {
  const [makerId, setMakerId] = useState<Manufacturer['id']>(initial);
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const groupName = useId();
  const maker = manufacturers.find((m) => m.id === makerId) ?? manufacturers[0]!;
  const servicedCount = components.filter((c) => maker.services[c.id]).length;
  const selectedComponent = selected ? components.find((c) => c.id === selected) : null;
  const selectedCaps = selected ? maker.services[selected] : undefined;

  const choose = (id: Manufacturer['id']) => {
    setMakerId(id);
    setSelected((cur) => (cur && manufacturers.find((m) => m.id === id)?.services[cur] ? cur : null));
  };

  return (
    <div className="finder">
      <fieldset>
        <legend className="label mb-4 text-ink-700">1 · Valitse valmistaja</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {manufacturers.map((m, i) => {
            const checked = m.id === makerId;
            return (
              <label
                key={m.id}
                className={`group relative flex min-h-[4.5rem] cursor-pointer flex-col justify-between border-[1.5px] px-4 py-3 transition-colors duration-300 ${
                  checked ? 'border-ink-900 bg-ink-900 text-bone-100' : 'border-ink-900/25 bg-bone-50/60 hover:border-ink-900'
                } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-ink-900`}
              >
                <input
                  type="radio"
                  name={groupName}
                  value={m.id}
                  checked={checked}
                  onChange={() => choose(m.id)}
                  className="sr-only"
                />
                <span className={`label ${checked ? 'text-amber-400' : 'text-ink-600'}`}>0{i + 1}</span>
                <span className="text-xl leading-none font-[760] [font-stretch:76%] uppercase">{m.name}</span>
                {m.aka ? <span className={`mt-1 text-xs leading-tight ${checked ? 'text-steel-300' : 'text-ink-600'}`}>{m.aka}</span> : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="label mb-5 text-ink-700" id={`${groupName}-glasses`}>
            2 · Valitse laite – {servicedCount}/{components.length} laitetyyppiä palvelulistalla
          </p>
          <ul aria-labelledby={`${groupName}-glasses`} className="finder-glasses">
            {components.map((c, i) => {
              const caps = maker.services[c.id];
              const on = Boolean(caps);
              const isSel = selected === c.id;
              const body = (
                <>
                  <span className="finder-glass" aria-hidden="true">
                    <span className="finder-ticks" />
                    <span className="finder-cal" />
                    <span
                      className="finder-fluid"
                      style={
                        {
                          height: on ? `${FILL_LEVEL}%` : '0%',
                          '--w': on ? `${FILL_LEVEL}%` : '0%',
                          transitionDelay: `${i * 55}ms`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="finder-text">
                    <span className="finder-name">{c.short}</span>
                    <span className="finder-caps">{on ? caps!.map((k) => capabilityLabels[k]).join(' · ') : 'Ei listalla – kysy'}</span>
                  </span>
                  <span className="sr-only">
                    {c.name}: {on ? caps!.map((k) => capabilityLabels[k]).join(', ') : 'ei mainittu palvelulistassa, kysy puhelimitse'}
                  </span>
                </>
              );
              return (
                <li key={c.id} className={`finder-item ${on ? 'is-on' : 'is-off'} ${isSel ? 'is-selected' : ''}`}>
                  {on ? (
                    <button type="button" aria-pressed={isSel} onClick={() => setSelected(isSel ? null : c.id)} className="finder-hit">
                      {body}
                    </button>
                  ) : (
                    <div className="finder-hit">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-4" aria-live="polite">
          <div className="frame h-full p-7 text-ink-900 lg:p-8">
            <div className="frame-content flex h-full flex-col">
              <p className="label text-amber-700">Tulos</p>
              {selectedComponent && selectedCaps ? (
                <>
                  <h3 className="display-s mt-3">
                    {maker.name} – {selectedComponent.name.charAt(0).toLowerCase() + selectedComponent.name.slice(1)}
                  </h3>
                  <ul className="mt-5 space-y-2">
                    {selectedCaps.map((k) => (
                      <li key={k} className="flex items-center gap-3">
                        <span aria-hidden="true" className="size-2.5 shrink-0 bg-amber-500" />
                        {capabilityLabels[k]}
                      </li>
                    ))}
                  </ul>
                  {maker.note && (selected === 'cr-pumput' || selected === 'cr-suuttimet') ? (
                    <p className="mt-5 text-[0.95rem] text-ink-700">{maker.note}</p>
                  ) : null}
                  <div className="mt-auto flex flex-col gap-3 pt-8">
                    <Link
                      className="btn btn-dark w-full justify-between"
                      to={inquiryHref({ aihe: aihe(selectedComponent.id), valmistaja: maker.id, laite: selectedComponent.id })}
                    >
                      Pyydä tarjous tästä
                      <ArrowRight aria-hidden="true" className="btn-arrow size-4.5" />
                    </Link>
                    <Link
                      className="link self-start text-[0.95rem] font-[560]"
                      to={selectedComponent.page === 'common-rail' ? pages.commonRail.path : pages.injection.path}
                    >
                      Lue lisää: {selectedComponent.page === 'common-rail' ? 'Common rail' : 'Suuttimet ja pumput'}
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="display-s mt-3">
                    {maker.name}
                    {maker.aka ? <span className="block text-base font-[500] text-ink-600 [font-stretch:100%]">{maker.aka}</span> : null}
                  </h3>
                  <p className="mt-4 text-ink-700">
                    {servicedCount} laitetyyppiä seitsemästä on palvelulistallamme. Valitse täytetty mittalasi nähdäksesi, mitä laitteelle tehdään.
                  </p>
                  {maker.note ? <p className="mt-3 text-[0.95rem] text-ink-700">{maker.note}</p> : null}
                  <div className="mt-auto pt-8">
                    <p className="text-[0.95rem] text-ink-700">Laitetta ei löydy listalta? Kysy silti:</p>
                    <a className="link mt-1 inline-block text-lg font-[650] tabular" href={`tel:${primaryPhone.e164}`}>
                      {primaryPhone.display}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-3xl text-sm text-ink-600">
        Lista perustuu Joen Dieselin omaan palvelulistaan. Täyttämätön mittalasi ei tarkoita, ettei laitetta voisi korjata – se ei vain ole listalla.
      </p>
    </div>
  );
}
