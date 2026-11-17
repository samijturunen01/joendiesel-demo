import { useId, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { logoGeometry as g } from '@/brand/logoGeometry';
import { gsap, isLightweight, motionOk, useGSAP } from '@/lib/gsap';
import { MonogramLetters, WordmarkStacked } from './Logo';

/*
 * "Avautumispaine" – the homepage signature.
 *
 * Joen Diesel's craft is fuel injection, and the defining moment of an injector test is
 * the opening pressure: pressure builds, the nozzle "pops" and atomised fuel fans out.
 * Here an injector (an abstract line illustration, not a technical drawing) sits above
 * the authentic logo. Pressure runs down its axis, the nozzle pops, the spray mist reveals
 * the JD monogram, the double frame is scribed from the top centre outwards and the
 * wordmark is stamped in letter by letter.
 *
 * - Plays in full once per browser session (decided before first paint in index.html),
 *   otherwise settles in quickly. The rest of the page is usable throughout.
 * - prefers-reduced-motion / no JS: the final composition is rendered statically.
 * - Mobile: fewer particles, no turbulence filter.
 */

const o = g.frameOuter;
const inr = g.frameInner;
const CX = +(o.x + o.w / 2).toFixed(2);
const TIP_Y = 214;
const VIEW = { x: 81, y: -172, w: 993, h: 1371 };
/** Final mist radius: the solid core (62 %) must clear the farthest monogram corner (~700 units from the tip). */
const MIST_R = 1250;

/**
 * Whether the one-off intro is pending is decided once per page load (the pre-paint script sets
 * html.intro-pending). Read it once, so a second (hidden, other-breakpoint) instance or a later
 * client-side visit to the homepage cannot replay the full sequence.
 */
let introPending: boolean | null = null;
function consumeIntroPending(): boolean {
  if (introPending === null) introPending = document.documentElement.classList.contains('intro-pending');
  const pending = introPending;
  introPending = false;
  return pending;
}

/** Rectangle split into two halves that start at the top centre – drawn in opposite directions. */
function halves(r: { x: number; y: number; w: number; h: number }) {
  const x0 = r.x, y0 = r.y, x1 = r.x + r.w, y1 = r.y + r.h, cx = r.x + r.w / 2;
  return [`M${cx} ${y0}H${x0}V${y1}H${cx}`, `M${cx} ${y0}H${x1}V${y1}H${cx}`];
}

/** Deterministic pseudo-random particles (same markup on the server and the client). */
const PARTICLES = Array.from({ length: 30 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const r1 = a - Math.floor(a);
  const r2 = b - Math.floor(b);
  const y = 330 + r1 * 560;
  const spread = (y - TIP_Y) * 0.23;
  return { x: +(CX + (r2 * 2 - 1) * spread).toFixed(1), y: +y.toFixed(1), r: +(1.4 + r2 * 2.6).toFixed(2) };
});

function Injector() {
  const c = CX;
  return (
    <g className="jd-injector" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
      {/* high-pressure line, leaving the frame upwards */}
      <path pathLength={1} d={`M${c + 71} ${11}H${c + 92}Q${c + 108} ${11} ${c + 108} ${-5}V${-172}`} />
      <path pathLength={1} d={`M${c + 71} ${21}H${c + 92}Q${c + 118} ${21} ${c + 118} ${-5}V${-172}`} />
      {/* inlet fitting nut + stub */}
      <path pathLength={1} d={`M${c + 49} ${2}h22v28h-22z`} />
      <path pathLength={1} d={`M${c + 56} ${2}v28M${c + 64} ${2}v28`} strokeWidth={1.2} />
      <path pathLength={1} d={`M${c + 15} ${9}h34v14h-34`} />
      {/* return fitting + solenoid head + connector */}
      <path pathLength={1} d={`M${c - 8} ${-104}v-18h16v18`} />
      <path pathLength={1} d={`M${c - 24} ${-98}q0-6 6-6h36q6 0 6 6v56q0 6-6 6h-36q-6 0-6-6z`} />
      <path pathLength={1} d={`M${c - 24} ${-50}h48M${c - 24} ${-56}h48`} strokeWidth={1.2} />
      <path pathLength={1} d={`M${c - 24} ${-90}h-22q-4 0-4 4v22q0 4 4 4h22`} />
      <path pathLength={1} d={`M${c - 42} ${-82}v10M${c - 35} ${-82}v10`} strokeWidth={1.2} />
      {/* body */}
      <path pathLength={1} d={`M${c - 15} ${-36}V${84}M${c + 15} ${-36}V${84}`} />
      <path pathLength={1} d={`M${c - 15} ${44}h30M${c - 15} ${50}h30`} strokeWidth={1.2} />
      {/* collar, retaining nut (tapered hex), nozzle body, tip */}
      <path pathLength={1} d={`M${c - 19} ${84}h38v8h-38z`} />
      <path pathLength={1} d={`M${c - 22} ${92}V${128}L${c - 17} ${150}H${c + 17}L${c + 22} ${128}V${92}`} />
      <path pathLength={1} d={`M${c - 8} ${92}V${130}M${c + 8} ${92}V${130}`} strokeWidth={1.2} />
      <path pathLength={1} d={`M${c - 11} ${150}V${196}M${c + 11} ${150}V${196}`} />
      <path pathLength={1} d={`M${c - 11} ${196}L${c - 4} ${207}Q${c} ${TIP_Y - 1} ${c + 4} ${207}L${c + 11} ${196}`} />
    </g>
  );
}

export function LogoIntro({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const resetRef = useRef<(() => void) | null>(null);
  // unique SVG ids per instance (the homepage renders one per breakpoint)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = { spray: `${uid}-spray`, mist: `${uid}-mist`, glow: `${uid}-glow`, blur: `${uid}-blur`, noise: `${uid}-noise`, mask: `${uid}-mask` };

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionOk()) return;
      // the instance for the other breakpoint is display:none – leave it static
      if (el.getClientRects().length === 0) return;
      const d = document.documentElement;
      const full = consumeIntroPending();
      const light = isLightweight();
      const q = gsap.utils.selector(el);

      const injector = q('.jd-injector path');
      const injectorWrap = q('.jd-injector-wrap');
      const fuel = q('.jd-fuel');
      const spray = q('.jd-spray');
      const mist = q('.jd-mist-circle');
      const particles = q('.jd-particle');
      const frame = q('.jd-frame-half');
      const letters = q('.jd-letter');
      const glow = q('.jd-glow');
      const replay = q('.jd-replay');

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      // Starting states (applied synchronously, before the pending class is removed → no flash)
      const reset = () => {
        gsap.set(injector, { strokeDasharray: '1 2', strokeDashoffset: 1.01 });
        gsap.set(injectorWrap, { opacity: 1 });
        gsap.set(fuel, { strokeDasharray: '0.22 2', strokeDashoffset: 0.22, opacity: 0 });
        gsap.set(spray, { opacity: 0, scaleX: 0.25, scaleY: 0, svgOrigin: `${CX} ${TIP_Y}` });
        gsap.set(mist, { attr: { r: 0 } });
        gsap.set(particles, { opacity: 0, x: 0, y: 0 });
        gsap.set(frame, { strokeDasharray: '1 2', strokeDashoffset: 1.01 });
        gsap.set(letters, { opacity: 0, y: 14, scaleY: 1.12, transformOrigin: '50% 100%' });
        gsap.set(glow, { opacity: 0 });
      };

      const speed = light ? 0.85 : 1;
      // apply the start state now, so every tween records it as its starting point
      reset();
      resetRef.current = reset;
      tl
        // 1. the injector is drawn
        .to(injector, { strokeDashoffset: 0, duration: 0.9, stagger: 0.025, ease: 'power2.inOut' }, 0)
        // 2. pressure builds down the axis (slow-in, the tension before the pop)
        .to(fuel, { opacity: 1, duration: 0.1 }, 0.55)
        .to(fuel, { strokeDashoffset: -1, duration: 0.5, ease: 'power2.in' }, 0.55)
        // 3. pop: the spray fans out
        .to(spray, { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.22, ease: 'expo.out' }, 1.02)
        .to(particles, {
          opacity: 1,
          duration: 0.12,
          stagger: { each: 0.006, from: 'random' },
        }, 1.02)
        .fromTo(
          particles,
          { attr: { cx: CX, cy: TIP_Y } },
          {
            attr: { cx: (i: number) => PARTICLES[i]?.x ?? CX, cy: (i: number) => PARTICLES[i]?.y ?? TIP_Y },
            duration: 0.9,
            ease: 'power2.out',
            stagger: { each: 0.008, from: 'random' },
          },
          1.02,
        )
        .to(particles, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 1.45)
        // 4. the mist condenses into the monogram
        .to(mist, { attr: { r: MIST_R }, duration: 1.2, ease: 'power2.out' }, 1.06)
        .to(spray, { opacity: 0.0, duration: 1.1, ease: 'power2.inOut' }, 1.5)
        .to(glow, { opacity: 1, duration: 1.2 }, 1.3)
        // 5. the double frame is scribed from the top centre outwards
        .to(frame, { strokeDashoffset: 0, duration: 0.85, stagger: 0.12, ease: 'power3.inOut' }, 1.3)
        // 6. the wordmark is stamped in
        .to(letters, { opacity: 1, y: 0, scaleY: 1, duration: 0.42, stagger: 0.035, ease: 'power3.out' }, 1.85)
        // 7. settle: the illustration steps back
        .to(injectorWrap, { opacity: 0.42, duration: 0.8, ease: 'power1.inOut' }, 2.5)
        .set(fuel, { strokeDasharray: '1 2', strokeDashoffset: 1.01, opacity: 0.7 }, 2.45)
        .to(fuel, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 2.5)
        .fromTo(replay, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2.7);
      tl.timeScale(speed);

      if (!light) {
        // keep a filter on the mist only on capable devices
        q('.jd-mist-group').forEach((n) => n.setAttribute('filter', `url(#${ids.noise})`));
      }

      tlRef.current = tl;
      d.classList.remove('intro-pending');
      if (full) {
        tl.play(0);
        try {
          sessionStorage.setItem('jd-intro', '1');
        } catch {
          /* private mode – the intro simply plays again next time */
        }
      } else {
        // Seen already this session: a short settle instead of the full sequence.
        tl.timeScale(2.4).play(0.9);
      }
    },
    { scope: root },
  );

  const replayIntro = contextSafe(() => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.pause(0);
    resetRef.current?.();
    tl.timeScale(isLightweight() ? 0.85 : 1).play(0);
  });

  const [left, right] = halves(o);
  const [ileft, iright] = halves(inr);

  return (
    <div ref={root} className={`relative ${className ?? ''}`}>
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Joen Diesel Oy:n logo. Taustalla suuttimen viivapiirros."
        focusable="false"
      >
        <defs>
          <linearGradient id={ids.spray} x1="0" y1={TIP_Y} x2="0" y2="980" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--color-amber-300)" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="var(--color-amber-400)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--color-amber-500)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={ids.mist}>
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.glow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--color-amber-400)" stopOpacity="0.17" />
            <stop offset="0.55" stopColor="var(--color-amber-400)" stopOpacity="0.06" />
            <stop offset="1" stopColor="var(--color-amber-400)" stopOpacity="0" />
          </radialGradient>
          <filter id={ids.blur} x="-50%" y="-10%" width="200%" height="130%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={ids.noise} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id={ids.mask} maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
            {/* Final state is fully revealed; GSAP shrinks the circle to 0 before the intro plays. */}
            <g className="jd-mist-group">
              <circle className="jd-mist-circle" cx={CX} cy={TIP_Y} r={MIST_R} fill={`url(#${ids.mist})`} />
            </g>
          </mask>
        </defs>

        {/* warm work-light behind the plate */}
        <rect className="jd-glow intro-hide" x={o.x - 260} y={o.y - 200} width={o.w + 520} height={o.h + 400} fill={`url(#${ids.glow})`} />

        {/* injector illustration (decorative) */}
        <g className="text-steel-300 intro-hide">
          <g style={{ opacity: 0.42 }} className="jd-injector-wrap">
            <Injector />
          </g>
        </g>
        <polyline
          className="jd-fuel intro-hide"
          pathLength={1}
          points={`${CX + 118},-172 ${CX + 118},-5 ${CX + 92},16 ${CX},16 ${CX},${TIP_Y - 4}`}
          fill="none"
          stroke="var(--color-amber-400)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.7 }}
        />

        {/* spray cone + droplets */}
        <g className="jd-spray" style={{ opacity: 0 }}>
          <path d={`M${CX} ${TIP_Y}L${CX - 330} 990L${CX + 330} 990Z`} fill={`url(#${ids.spray})`} opacity="0.28" filter={`url(#${ids.blur})`} />
          <path d={`M${CX} ${TIP_Y}L${CX - 150} 980L${CX + 150} 980Z`} fill={`url(#${ids.spray})`} filter={`url(#${ids.blur})`} />
        </g>
        <g fill="var(--color-amber-300)">
          {PARTICLES.map((p, i) => (
            <circle key={i} className="jd-particle" cx={p.x} cy={p.y} r={p.r} style={{ opacity: 0 }} />
          ))}
        </g>

        {/* the authentic logo */}
        <g className="text-bone-100">
          <g fill="none" stroke="currentColor" className="intro-hide">
            <path className="jd-frame-half" pathLength={1} d={left} strokeWidth={o.stroke} />
            <path className="jd-frame-half" pathLength={1} d={right} strokeWidth={o.stroke} />
            <path className="jd-frame-half" pathLength={1} d={ileft} strokeWidth={inr.stroke} />
            <path className="jd-frame-half" pathLength={1} d={iright} strokeWidth={inr.stroke} />
          </g>
          <g mask={`url(#${ids.mask})`} className="intro-hide">
            <MonogramLetters />
          </g>
          <g className="intro-hide">
            <WordmarkStacked letterClassName="jd-letter" />
          </g>
        </g>
      </svg>

      <button
        type="button"
        onClick={replayIntro}
        className="jd-replay label absolute top-0 right-0 hidden min-h-11 items-center gap-2 pl-3 text-steel-300 transition-colors hover:text-amber-400 [.motion-ok_&]:inline-flex"
      >
        <RotateCcw aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
        <span className="sr-only lg:not-sr-only">Toista ruiskutus</span>
      </button>
    </div>
  );
}
